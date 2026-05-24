"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_js_1 = require("@modelcontextprotocol/sdk/server/index.js");
const stdio_js_1 = require("@modelcontextprotocol/sdk/server/stdio.js");
const types_js_1 = require("@modelcontextprotocol/sdk/types.js");
const axios_1 = __importDefault(require("axios"));
const zod_1 = require("zod");
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const N8N_API_URL = process.env.N8N_API_URL;
const N8N_API_KEY = process.env.N8N_API_KEY;
if (!N8N_API_URL || !N8N_API_KEY) {
    console.error("Missing N8N_API_URL or N8N_API_KEY in environment variables");
    process.exit(1);
}
// Clean up standard URL
const baseURL = N8N_API_URL.endsWith("/") ? N8N_API_URL.slice(0, -1) : N8N_API_URL;
const apiBaseURL = baseURL.endsWith("/api/v1") ? baseURL : `${baseURL}/api/v1`;
const n8nClient = axios_1.default.create({
    baseURL: apiBaseURL,
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
const server = new index_js_1.Server({
    name: "custom-n8n-mcp",
    version: "1.0.0",
}, {
    capabilities: {
        tools: {},
    },
});
// 1. Definition of Tools (Schema)
server.setRequestHandler(types_js_1.ListToolsRequestSchema, async () => {
    return {
        tools: [
            {
                name: "n8n_list_workflows",
                description: "Liste tous les workflows de l'instance avec pagination. Utile pour trouver l'ID d'un workflow.",
                inputSchema: {
                    type: "object",
                    properties: {
                        limit: { type: "number", description: "Nombre max de résultats (défaut 100)" },
                        active: { type: "boolean", description: "Filtrer par statut actif/inactif" },
                    },
                },
            },
            {
                name: "n8n_get_workflow_by_id",
                description: "Récupère la configuration détaillée d'un workflow par son ID.",
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
                description: "Exécute un workflow via l'API n8n (nécessite que le workflow soit appelable par API ou via webhook).",
                inputSchema: {
                    type: "object",
                    properties: {
                        workflowId: { type: "string", description: "L'ID du workflow à appeler" },
                    },
                    required: ["workflowId"],
                },
            },
        ],
    };
});
// 2. Implementation of Tools
server.setRequestHandler(types_js_1.CallToolRequestSchema, async (request) => {
    switch (request.params.name) {
        case "n8n_list_workflows": {
            const args = request.params.arguments || {};
            const limit = typeof args.limit === "number" ? args.limit : 100;
            let params = `?limit=${limit}`;
            if (typeof args.active === "boolean") {
                params += `&active=${args.active}`;
            }
            const result = await handleApiCall(n8nClient.get(`/workflows${params}`));
            if (!result.success) {
                return { isError: true, content: [{ type: "text", text: result.error }] };
            }
            // Formatting: Summarize the workflow list to not overwhelm the LLM context
            const workflows = result.data.data || [];
            const summary = workflows.map((w) => `- **${w.name}** (ID: ${w.id}) | Actif: ${w.active}`).join("\n");
            const textResponse = workflows.length === 0 ? "Aucun workflow trouvé." : summary;
            return {
                content: [{ type: "text", text: textResponse }],
            };
        }
        case "n8n_get_workflow_by_id": {
            const { id } = request.params.arguments;
            if (!id)
                return { isError: true, content: [{ type: "text", text: "L'ID du workflow est requis." }] };
            const result = await handleApiCall(n8nClient.get(`/workflows/${id}`));
            if (!result.success) {
                return { isError: true, content: [{ type: "text", text: result.error }] };
            }
            // Formatting: Filter metadata so LLM understands logic without bloat
            const workflow = result.data;
            const nodesSummary = workflow.nodes.map((n) => `- Nœud: ${n.name} (Type: ${n.type})`).join("\n");
            const summary = `
**Workflow:** ${workflow.name} (ID: ${workflow.id})
**Actif:** ${workflow.active}

**Nœuds principaux:**
${nodesSummary}
      `;
            return {
                content: [{ type: "text", text: summary }],
            };
        }
        case "n8n_execute_workflow": {
            // For standard API execution (requires N8N_ENFORCE_SETTINGS_FILE_PERMISSIONS to be false usually, or using a specific manual trigger endpoint)
            // The NotebookLM guide mentions Webhooks, but standard n8n API allows workflow executions directly.
            const { workflowId } = request.params.arguments;
            if (!workflowId)
                return { isError: true, content: [{ type: "text", text: "L'ID du workflow est requis." }] };
            // Executing workflow via standard API
            const result = await handleApiCall(n8nClient.post(`/executions`, { workflowId }));
            if (!result.success) {
                return { isError: true, content: [{ type: "text", text: result.error }] };
            }
            const executionInfo = result.data;
            const responseText = `Execution lancée avec succès.\nID d'exécution: ${executionInfo.id}\nStatut initial: ${executionInfo.status}`;
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
    const transport = new stdio_js_1.StdioServerTransport();
    await server.connect(transport);
    console.error("n8n MCP Server running via stdio"); // Stderr so it doesn't break Stdio MCP JSON transport
}
main().catch((error) => {
    console.error("Server error:", error);
    process.exit(1);
});
//# sourceMappingURL=index.js.map