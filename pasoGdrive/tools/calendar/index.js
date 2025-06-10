import { getCalendarEvents } from './calLoader.js';
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

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

const transport = new StdioServerTransport();
await server.connect(transport);
