import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema, } from "@modelcontextprotocol/sdk/types.js";
import axios from "axios";
import { z } from "zod";
import * as dotenv from "dotenv";
dotenv.config();
const N8N_API_URL = process.env.N8N_API_URL;
const N8N_API_KEY = process.env.N8N_API_KEY;
const N8N_HTTP_TIMEOUT_MS = Number.parseInt(process.env.N8N_HTTP_TIMEOUT_MS || "20000", 10);
if (!N8N_API_URL || !N8N_API_KEY) {
    console.error("Missing N8N_API_URL or N8N_API_KEY in environment variables");
    process.exit(1);
}
const listWorkflowsSchema = z.object({
    limit: z.number().int().min(1).max(250).optional(),
    active: z.boolean().optional(),
});
const getWorkflowByIdSchema = z.object({
    id: z.string().trim().min(1, "L'ID du workflow est requis."),
});
const executeWorkflowSchema = z.object({
    workflowId: z.string().trim().min(1, "L'ID du workflow est requis."),
});
// Clean up standard URL
const baseURL = N8N_API_URL.endsWith("/") ? N8N_API_URL.slice(0, -1) : N8N_API_URL;
const apiBaseURL = baseURL.endsWith("/api/v1") ? baseURL : `${baseURL}/api/v1`;
const n8nClient = axios.create({
    baseURL: apiBaseURL,
    timeout: N8N_HTTP_TIMEOUT_MS,
    headers: { "X-N8N-API-KEY": N8N_API_KEY },
});
// Helper to format API errors cleanly for the LLM
async function handleApiCall(apiCall) {
    try {
        const response = await apiCall;
        return { success: true, data: response.data };
    }
    catch (error) {
        const errorMsg = error.response?.data?.message || error.message;
        return {
            success: false,
            error: `Erreur API n8n : ${errorMsg}`,
        };
    }
}
const server = new Server({
    name: "custom-n8n-mcp",
    version: "1.0.0",
}, {
    capabilities: {
        tools: {},
    },
});
// 1. Definition of Tools (Schema)
server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
        tools: [
            {
                name: "n8n_list_workflows",
                description: "Liste les workflows n8n avec pagination.",
                inputSchema: {
                    type: "object",
                    properties: {
                        limit: { type: "number", description: "Nombre max de resultats (defaut 100, max 250)." },
                        active: { type: "boolean", description: "Filtrer par statut actif/inactif" },
                    },
                },
            },
            {
                name: "n8n_get_workflow_by_id",
                description: "Recupere la configuration detaillee d'un workflow par son ID.",
                inputSchema: {
                    type: "object",
                    properties: {
                        id: { type: "string", description: "L'ID unique du workflow n8n" },
                    },
                    required: ["id"],
                },
            },
            {
                name: "n8n_execute_workflow",
                description: "Execute un workflow via l'API n8n.",
                inputSchema: {
                    type: "object",
                    properties: {
                        workflowId: { type: "string", description: "L'ID du workflow a appeler" },
                    },
                    required: ["workflowId"],
                },
            },
        ],
    };
});
// 2. Implementation of Tools
server.setRequestHandler(CallToolRequestSchema, async (request) => {
    switch (request.params.name) {
        case "n8n_list_workflows": {
            const parsed = listWorkflowsSchema.safeParse(request.params.arguments || {});
            if (!parsed.success) {
                return { isError: true, content: [{ type: "text", text: parsed.error.issues[0]?.message || "Arguments invalides." }] };
            }
            const limit = parsed.data.limit ?? 100;
            let params = `?limit=${limit}`;
            if (typeof parsed.data.active === "boolean") {
                params += `&active=${parsed.data.active}`;
            }
            const result = await handleApiCall(n8nClient.get(`/workflows${params}`));
            if (!result.success) {
                return { isError: true, content: [{ type: "text", text: result.error }] };
            }
            const workflows = result.data.data || [];
            const summary = workflows.map((w) => `- **${w.name}** (ID: ${w.id}) | Actif: ${w.active}`).join("\n");
            const textResponse = workflows.length === 0 ? "Aucun workflow trouve." : summary;
            return {
                content: [{ type: "text", text: textResponse }],
            };
        }
        case "n8n_get_workflow_by_id": {
            const parsed = getWorkflowByIdSchema.safeParse(request.params.arguments || {});
            if (!parsed.success) {
                return { isError: true, content: [{ type: "text", text: parsed.error.issues[0]?.message || "Arguments invalides." }] };
            }
            const result = await handleApiCall(n8nClient.get(`/workflows/${parsed.data.id}`));
            if (!result.success) {
                return { isError: true, content: [{ type: "text", text: result.error }] };
            }
            const workflow = result.data;
            const nodes = Array.isArray(workflow.nodes) ? workflow.nodes : [];
            const nodesSummary = nodes.length === 0
                ? "- Aucun noeud detecte"
                : nodes.map((n) => `- Noeud: ${n.name} (Type: ${n.type})`).join("\n");
            const summary = `
**Workflow:** ${workflow.name} (ID: ${workflow.id})
**Actif:** ${workflow.active}

**Noeuds principaux:**
${nodesSummary}
      `;
            return {
                content: [{ type: "text", text: summary }],
            };
        }
        case "n8n_execute_workflow": {
            const parsed = executeWorkflowSchema.safeParse(request.params.arguments || {});
            if (!parsed.success) {
                return { isError: true, content: [{ type: "text", text: parsed.error.issues[0]?.message || "Arguments invalides." }] };
            }
            const result = await handleApiCall(n8nClient.post(`/executions`, { workflowId: parsed.data.workflowId }));
            if (!result.success) {
                return { isError: true, content: [{ type: "text", text: result.error }] };
            }
            const executionInfo = result.data;
            const responseText = `Execution lancee avec succes.\nID d'execution: ${executionInfo.id}\nStatut initial: ${executionInfo.status}`;
            return {
                content: [{ type: "text", text: responseText }],
            };
        }
        default:
            throw new Error(`Outil inconnu : ${request.params.name}`);
    }
});
// 3. Start Server
async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error("n8n MCP Server running via stdio"); // Stderr so it doesn't break Stdio MCP JSON transport
}
main().catch((error) => {
    console.error("Server error:", error);
    process.exit(1);
});
