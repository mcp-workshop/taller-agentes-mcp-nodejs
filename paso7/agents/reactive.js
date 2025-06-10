import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { MultiServerMCPClient } from "@langchain/mcp-adapters";
import { ChatOllama } from "@langchain/ollama";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { CallbackHandler } from "langfuse-langchain";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '.env') });

const langfuseHandler = new CallbackHandler();

const client = new MultiServerMCPClient({
  mcpServers: {
    weather: {
      transport: "stdio",
      command: "node",
      args: [path.join(__dirname, "../tools/weather/index.js")],
    },
    calendar: {
      transport: "stdio",
      command: "node",
      args: [path.join(__dirname, "../tools/calendar/index.js")],
    },
  },
});

const tools = await client.getTools();
const model = new ChatOllama({ model: "qwen2.5" });
const agent = createReactAgent({
  llm: model,
  tools,
});

const now = new Date();
const fecha_actual = now.toLocaleDateString('es-ES', {
  day: 'numeric',
  month: 'long',
  year: 'numeric'
});
const hora_actual = now.toLocaleTimeString('es-ES', {
  hour: '2-digit',
  minute: '2-digit'
});

const messages = [
  {"role": "system", "content": "Eres un agente que responde preguntas. Tienes acceso a herramientas de calendario y meteorología."},
  {"role": "system", "content": "Se lo mas escueto posible, respondiendo unicamente con la pregunta del usuario. NO AÑADAS MAS INFORMACIÓN DE LA SOLICITADA, AUNQUE LA TENGAS."},
  {"role": "system", "content": `Hoy es ${fecha_actual}, son las ${hora_actual}`},
  {"role": "system", "content": "Estas en Las Rozas de Madrid"},
  {"role": "system", "content": "Si no sabes cuando es un evento, busca en la herramienta de calendario."},
  {"role": "user", "content": "¿Durante la proxima Retro que hay planificada, va a llover?"},
];

const stream = await agent.stream({ messages }, { callbacks: [langfuseHandler] });
let agent_response
for await (agent_response of stream) {
  console.log(agent_response);
}

console.log("\nRESPUESTA FINAL:\n")
console.log(agent_response?.agent?.messages?.at(-1)?.content)

await client.close();
