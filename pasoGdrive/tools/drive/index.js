import { getTravelTime, getCoordinatesFromAddress, getAddressFromCoordinates } from './google.js';
import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

const server = new McpServer({ name: "Drive MCP Server", version: "1.0.0" });

server.tool(
  "calculate_route",
  {
    origin: z.string().default("real, 2, las rozas").describe("Dirección de origen"),
    destination: z.string().default("via de los poblados 1, madrid").describe("Dirección de destino"),
    travel_mode: z.string().default("driving").describe("Modo de transporte: driving, walking, bicycling, or transit"),
    arrival_time: z.string().optional().describe("Hora de llegada en epoch time (opcional)"),
  },
  async ({ origin, destination, travel_mode, arrival_time = null }) => {
    const result = await getTravelTime(origin, destination, travel_mode, arrival_time);
    return {
      content: [{ type: "text", text: JSON.stringify(result) }]
    };
  }
);

server.tool(
  "get_coordinates",
  {
    address: z.string().describe("Dirección a buscar"),
  },
  async ({ address }) => {
    const coords = await getCoordinatesFromAddress(address);
    return {
      content: [{ type: "text", text: JSON.stringify(coords) }]
    };
  }
);

server.tool(
  "get_address",
  {
    latitude: z.string().default("40.477623").describe("Latitud"),
    longitude: z.string().default("-3.6373624").describe("Longitud"),
  },
  async ({ latitude, longitude }) => {
    const address = await getAddressFromCoordinates(latitude, longitude);
    return {
      content: [{ type: "text", text: address }]
    };
  }
);

const transport = new StdioServerTransport();
await server.connect(transport);



