import { getWeatherData } from './openweather.js';
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const server = new McpServer({ name: "Weather MCP Server", version: "1.0.0"});

server.tool("load_weather_data",
  { latitude: z.string().default("40.477623"), longitude: z.string().default("-3.6373624") },
  async ({ latitude, longitude }) => {
    const weatherData = await getWeatherData(latitude, longitude);
    return {
      content: [{ type: "text", text: JSON.stringify(weatherData) }]
    };
  }
);

const transport = new StdioServerTransport();
await server.connect(transport);
