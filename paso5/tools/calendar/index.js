import { getCalendarEvents } from './calLoader.js';
import express from "express";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";

const server = new McpServer({ name: "Calendar MCP Server", version: "1.0.0"});

server.tool("load_calendar_events",
  {},
  async () => {
    const calendarEvents = await getCalendarEvents();
    return {
      content: [{ type: "text", text: JSON.stringify(calendarEvents) }]
    };
  }
);

const app = express();

const transports = {};

app.get("/sse", async (_, res) => {
  const transport = new SSEServerTransport('/messages', res);
  transports[transport.sessionId] = transport;
  res.on("close", () => {
    delete transports[transport.sessionId];
  });
  await server.connect(transport);
});

app.post("/messages", async (req, res) => {
  const sessionId = req.query.sessionId;
  const transport = transports[sessionId];
  if (transport) {
    await transport.handlePostMessage(req, res, req.body);
  } else {
    res.status(400).send('No transport found for sessionId');
  }
});

app.listen(8000, () => {
  console.error("MCP Server running http://127.0.0.1:8000/sse");
});
