
# taller de agentes y mcp

Este proyecto usa MCP para crear herramientas y agentes inteligentes, integrando [Model Context Protocol](https://github.com/modelcontextprotocol/typescript-sdk), LangGraph y LangChain.

## Requisitos previos

- Node 20 (https://nodejs.org/en)

## Instalación

Instala las dependencias del proyecto:

```bash
npm i
```

## tools

En la carpeta `tools` están las siguientes herramientas (todas usan el [SDK oficial de Model Context Protocol](https://github.com/modelcontextprotocol/typescript-sdk)):

- **calendar**: herramienta que permite consultar eventos de un calendario en formato iCal.
- **weather**: herramienta que obtiene información meteorológica actual y pronósticos.
- **drive**: herramienta que te prevision de tiempo de viaje con google maps, coordenadas y direcciones.

> **Nota:** La herramienta **calendar** funciona como un servidor SSE (Server-Sent Events), por lo que debe estar en ejecución antes de que los agentes puedan consultarla. Para iniciar el servidor de calendar, ejecuta:

```bash
node pasoX/tools/calendar/index.js
```

Asegúrate de que este proceso esté activo antes de lanzar cualquier agente que dependa de la herramienta de calendario.

## agents

se encuentran los agentes inteligentes implementados. Cada agente está diseñado para interactuar con una o varias herramientas MCP, resolviendo tareas específicas mediante flujos definidos con LangGraph o LangChain. Consulta la documentación de cada agente para detalles sobre su funcionamiento y configuración.

## Ejecución

Para ejecutar un agente, por ejemplo el reactivo:

```bash
node pasoX/agents/reactive.js
```


## Configuración de variables de entorno (.env)

Algunas herramientas requieren configuración adicional mediante variables de entorno. En particular, la herramienta de calendario necesita que definas la URL de tu calendario en un archivo `.env` dentro de `tools/calendar/`:

```env
CALENDAR_URL=https://datos.madrid.es/egob/catalogo/300082-8-calendario_laboral.ics
```
> en el ejemplo esta la url de los festivos de Madrid


Puedes usar el archivo `.env.example` como plantilla. Si no configuras esta variable, la herramienta de calendario no funcionará.

## listado de actividades a las que corresponde cada paso:

🛠️ **Actividad paso0**: Clonar proyecto base y ejecutar un ejemplo simple en cada lenguaje

node test_ollama.js 

🛠️ **Actividad paso1**: Añadir una función que devuelva la respuesta de open meteo completa

node paso1/tools/weather/index.js

🛠️ **Actividad paso2**: Añadir una herramienta que use la función anterior

npx @modelcontextprotocol/inspector (node paso2/tools/weather/index.js)

🛠️ **Actividad paso3**: Creamos un agente react, que es el más sencillo de desarrollar, y que llame a la herramienta anterior.

node paso3/agents/reactive.js

🛠️ **Actividad paso4**: Vamos a hacer una poda a la respuesta de open meteo. ¿Mejoran las respuestas? ¿Y el tiempo de ejecución?

node paso3/agents/reactive.js

🛠️ **Actividad paso5**: Añadir una función que llame a un calendario ICS y devuelva un JSON con tus eventos

cp paso5/tools/calendar/.env.example paso5/tools/calendar/.env
uv run paso5/tools/calendar/main.py
npx @modelcontextprotocol/inspector (http://127.0.0.1:8000/sse)

🛠️ **Actividad paso6**: Haz que tu agente use las dos herramientas en una sola consulta

cp paso6/tools/calendar/.env.example paso6/tools/calendar/.env
node paso6/tools/calendar/index.js
node paso6/agents/reactive.js

🛠️ **Demo paso7**: Uso de LangFuse

docker compose up -d
cp paso7/tools/calendar/.env.example paso7/tools/calendar/.env
cp paso7/agents/.env.example paso7/agents/.env
node paso7/agents/reactive.js

🛠️ **Demo pasoGdrive**: Bonus track + google drive WIP

docker compose up -d
cp pasoGdrive/tools/calendar/.env.example pasoGdrive/tools/calendar/.env
cp pasoGdrive/agents/.env.example pasoGdrive/agents/.env
node pasoGdrive/agents/reactive.js
