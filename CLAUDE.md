# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Smart Drawio is a Next.js 16 application that uses AI (LLM) to generate academic-standard diagrams from natural language descriptions, text files, or images. The project focuses on generating draw.io (diagrams.net) diagrams optimized for scientific research papers.

**Current State**: The application uses `DrawioCanvas.jsx` for rendering. LLM generates draw.io mxGraph XML format following academic paper standards (top-tier conference quality).

## Development Commands

```bash
# Install dependencies
pnpm install

# Start development server (requires --webpack flag)
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Run linter
pnpm lint
```

Development server runs on http://localhost:3000

**Important**: Next.js must run with `--webpack` flag for compatibility.

## Architecture

### Core Flow
1. User inputs natural language description in Chat component (supports text + image upload)
2. Request sent to `/api/generate` with LLM config and user input
3. API calls LLM (OpenAI or Anthropic) via Server-Sent Events (SSE) streaming
4. LLM generates draw.io mxGraph XML based on system prompt in `lib/prompts.js`
5. Generated XML is post-processed (removes markdown fences) and validated
6. XML loaded into draw.io iframe via postMessage API
7. Generation saved to history (localStorage)

### Key Files

**API Routes** (`app/api/`):
- `generate/route.js` - Main diagram generation endpoint (SSE streaming)
- `auth/validate/route.js` - Access password validation
- `configs/route.js` - Server-side LLM config endpoint
- `models/route.js` - Available models endpoint

**Components** (`components/`):
- `DrawioCanvas.jsx` - draw.io iframe integration (currently active)
- `ExcalidrawCanvas.jsx` - Excalidraw canvas (legacy, not currently used)
- `Chat.jsx` - User input with text/file/image upload (supports .md, .txt, .json, .csv, .pdf up to 10MB)
- `ImageUpload.jsx` - Image upload with drag-and-drop (supports JPG, PNG, WebP, GIF up to 5MB)
- `CodeEditor.jsx` - Monaco editor for XML viewing/editing
- `ConfigManager.jsx` - LLM provider configuration UI
- `AccessPasswordModal.jsx` - Server-side access password UI
- `HistoryModal.jsx` - Generation history viewer
- `OptimizationPanel.jsx` - Advanced optimization with 16 preset options (layout, style, visual enhancements, academic standards)

**Core Logic** (`lib/`):
- `prompts.js` - System prompt with draw.io XML format specs and academic paper standards
- `llm-client.js` - LLM API client (OpenAI/Anthropic) with streaming
- `optimizeArrows.js` - Arrow optimization algorithm (for Excalidraw, not currently used)
- `config-manager.js` - Client-side LLM config management (localStorage)
- `history-manager.js` - Generation history persistence (localStorage)
- `image-utils.js` - Image processing for multimodal input

### Authentication Modes

Two authentication modes (priority: access password > client-side config):

1. **Client-side API Key**: Users provide their own LLM API key (stored in localStorage)
2. **Server-side Access Password**: Admin configures LLM via environment variables, users access with password

### Environment Variables

Optional server-side LLM configuration:

```bash
ACCESS_PASSWORD=your-secure-password
SERVER_LLM_TYPE=anthropic  # or openai
SERVER_LLM_BASE_URL=https://api.anthropic.com/v1
SERVER_LLM_API_KEY=sk-ant-your-key-here
SERVER_LLM_MODEL=claude-sonnet-4-5-20250929
```

## Critical Implementation Details

### draw.io Integration (`DrawioCanvas.jsx`)

Embeds draw.io using iframe with postMessage communication:

- **iframe URL**: `https://embed.diagrams.net/?embed=1&proto=json&ui=min`
- **Communication**: Listens for `init` event, sends `load` action with XML
- **XML Escaping**: `escapeXml()` function escapes &, <, >, ", '
- **Fallback**: 3-second timeout forces ready state if init event doesn't fire

### draw.io mxGraph XML Format

LLM generates XML in mxGraph format:

```xml
<mxfile>
  <diagram id="id" name="Page-1">
    <mxGraphModel dx="1422" dy="794" grid="1" gridSize="10">
      <root>
        <mxCell id="0"/>
        <mxCell id="1" parent="0"/>
        <mxCell id="2" value="Text" style="rounded=1;whiteSpace=wrap;html=1;" vertex="1" parent="1">
          <mxGeometry x="100" y="100" width="120" height="60" as="geometry"/>
        </mxCell>
      </root>
    </mxGraphModel>
  </diagram>
</mxfile>
```

### System Prompt (`lib/prompts.js`)

Defines academic paper diagram standards:

**Typography**: Arial/Helvetica, 10-16pt, explicit `fontFamily=Arial;` in style
**Colors**: Grayscale-first (#F7F9FC, #2C3E50), color-blind friendly
**Layout**: Grid alignment (10px multiples), 40-60px spacing, 10% margins
**Lines**: strokeWidth 1-2, solid lines (dashed=0), `endArrow=classicBlock`
**Annotations**: (a), (b), (c) numbering, units required (ms, MB, %), legends for complex diagrams

### Streaming Response (`/api/generate`)

Server-Sent Events (SSE) implementation:

- Streams XML chunks as generated
- Client accumulates chunks in `app/page.js`
- Post-processing removes markdown fences (```xml, ```mxgraph)
- Validates `<mxfile>` structure
- Saves to history on success

### Arrow Optimization (`lib/optimizeArrows.js`)

Smart arrow algorithm (for Excalidraw, not currently used with draw.io):

- `determineEdges()`: Calculates optimal edge pairs based on element positions
- `calculateEdgePoint()`: Computes exact connection points on element edges
- Aligns arrows to center of edges for clean connections

## Common Tasks

### Switching Between Excalidraw and draw.io

In `app/page.js`:
- Change import: `DrawioCanvas` ↔ `ExcalidrawCanvas`
- Update component usage in JSX
- Adjust state handling (`generatedXml` for draw.io, `elements` for Excalidraw)

### Modifying LLM Prompt

Edit `SYSTEM_PROMPT` in `lib/prompts.js`:
- XML format specifications
- Academic paper standards
- Chart type specifications
- Color schemes and typography

### Adding LLM Provider

1. Add provider type to `callLLM()` in `lib/llm-client.js`
2. Implement provider-specific function (e.g., `callOpenAI()`, `callAnthropic()`)
3. Handle streaming response format
4. Add to provider options in `ConfigModal.jsx`

## Important Notes

- **Recommended Model**: claude-sonnet-4.5 (best diagram generation quality)
- **Output Format**: Currently draw.io mxGraph XML (transitioning from Excalidraw JSON)
- **Client Storage**: All configs and history stored in localStorage (privacy-focused)
- **No SSR**: Both canvas components use `dynamic` import with `ssr: false`
- **Webpack Required**: Next.js must run with `--webpack` flag
- **Chinese UI**: Primary language is Chinese (Simplified)
- **Multimodal Support**: Chat component supports text + image input for diagram generation
