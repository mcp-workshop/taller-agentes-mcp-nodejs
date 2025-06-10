import { ChatOllama } from "@langchain/ollama";

const model = new ChatOllama({ model: "qwen2.5" });

const response = await model.invoke("¿Como te llamas? ¿Qué tal estás?");
console.log(response.content);
