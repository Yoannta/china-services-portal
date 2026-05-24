import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema, } from "@modelcontextprotocol/sdk/types.js";
import { spawn } from "child_process";
const CODEX_COMMAND = process.env.CODEX_COMMAND || "codex";
const CODEX_TIMEOUT_MS = Number.parseInt(process.env.CODEX_TIMEOUT_MS || "120000", 10);
const server = new Server({
    name: "codex-mcp-bridge",
    version: "1.0.0",
}, {
    capabilities: {
        tools: {},
    },
});
server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
        tools: [
            {
                name: "codex_query",
                description: "Envoie une requete a Codex local.",
                inputSchema: {
                    type: "object",
                    properties: {
                        prompt: { type: "string" },
                    },
                    required: ["prompt"],
                },
            },
        ],
    };
});
server.setRequestHandler(CallToolRequestSchema, async (request) => {
    if (request.params.name === "codex_query") {
        const args = (request.params.arguments ?? {});
        if (typeof args.prompt !== "string" || args.prompt.trim().length === 0) {
            return {
                isError: true,
                content: [{ type: "text", text: "Le champ 'prompt' est requis et doit etre une chaine non vide." }],
            };
        }
        const prompt = args.prompt.trim();
        return new Promise((resolve) => {
            const codex = spawn(CODEX_COMMAND, [
                "--dangerously-bypass-approvals-and-sandbox",
                "exec",
                prompt,
                "--ephemeral",
                "--json",
            ], { stdio: ["pipe", "pipe", "pipe"] });
            let result = "";
            let stderr = "";
            const timeout = setTimeout(() => {
                codex.kill();
                resolve({
                    isError: true,
                    content: [{ type: "text", text: `Timeout: aucune reponse apres ${CODEX_TIMEOUT_MS} ms.` }],
                });
            }, CODEX_TIMEOUT_MS);
            codex.stdout.on("data", (d) => {
                const lines = d.toString().split("\n");
                for (const line of lines) {
                    if (!line.trim())
                        continue;
                    try {
                        const ev = JSON.parse(line);
                        if (ev.type === "item.completed" && ev.item?.type === "agent_message") {
                            result = ev.item.text;
                        }
                    }
                    catch (_e) {
                        // Ignore non-JSON lines from codex.
                    }
                }
            });
            codex.stderr.on("data", (d) => {
                stderr += d.toString();
            });
            codex.on("error", (err) => {
                clearTimeout(timeout);
                resolve({
                    isError: true,
                    content: [{ type: "text", text: `Echec du lancement de Codex (${CODEX_COMMAND}): ${err.message}` }],
                });
            });
            codex.on("close", (code) => {
                clearTimeout(timeout);
                if (code !== 0) {
                    resolve({
                        isError: true,
                        content: [{ type: "text", text: `Codex a echoue avec le code ${code}. ${stderr.trim()}`.trim() }],
                    });
                    return;
                }
                resolve({
                    content: [{ type: "text", text: result || "Codex termine sans message de sortie." }],
                });
            });
        });
    }
    throw new Error("Tool not found");
});
async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
}
main().catch(console.error);
