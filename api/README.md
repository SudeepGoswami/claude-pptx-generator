# PPTX Generator API

A standalone REST API service that generates professional PowerPoint presentations from blog URLs or markdown content using Claude.

## Quick Start

### Prerequisites

- Node.js 20+ (for local development)
- Docker (for containerized deployment)
- Anthropic API key

### 1. Set Your API Key

```bash
# Option 1: Environment variable
export ANTHROPIC_API_KEY=sk-ant-...

# Option 2: Create .env file in project root
echo "ANTHROPIC_API_KEY=sk-ant-..." > ../.env
```

### 2. Start the Service

```bash
# From project root:

# Local development (Node.js)
./start.sh

# Docker (foreground - see logs)
./start.sh docker

# Docker (background)
./start.sh docker-detached

# Stop Docker containers
./start.sh stop
```

Or manually:

```bash
# Local
cd api
npm install
npm start

# Docker
docker-compose up --build
```

### 3. Generate a Presentation

```bash
# Submit a job
curl -X POST http://localhost:3000/api/generate \
  -H "Content-Type: application/json" \
  -d '{
    "source": "https://example.com/blog/article",
    "sourceType": "url"
  }'

# Response:
# {"jobId": "abc-123", "status": "queued", "statusUrl": "/api/jobs/abc-123"}

# Poll for status
curl http://localhost:3000/api/jobs/abc-123

# Download when complete
curl -O http://localhost:3000/api/jobs/abc-123/download
```

## API Reference

### POST /api/generate

Create a new presentation generation job.

**Request Body:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `source` | string | Yes | URL or markdown content |
| `sourceType` | string | Yes | `"url"` or `"markdown"` |
| `brand` | string | No | Brand kit to use (default: `"traefik"`) |
| `options.slideCount` | number | No | Target number of slides |

**Example - From URL:**

```bash
curl -X POST http://localhost:3000/api/generate \
  -H "Content-Type: application/json" \
  -d '{
    "source": "https://traefik.io/blog/some-article",
    "sourceType": "url"
  }'
```

**Example - From Markdown:**

```bash
curl -X POST http://localhost:3000/api/generate \
  -H "Content-Type: application/json" \
  -d '{
    "source": "# My Presentation\n\nThis is the content...",
    "sourceType": "markdown"
  }'
```

**Response:**

```json
{
  "jobId": "550e8400-e29b-41d4-a716-446655440000",
  "status": "queued",
  "statusUrl": "/api/jobs/550e8400-e29b-41d4-a716-446655440000"
}
```

### GET /api/jobs/:id

Get the status of a generation job.

**Response (Processing):**

```json
{
  "jobId": "550e8400-e29b-41d4-a716-446655440000",
  "status": "processing",
  "progress": {
    "phase": "Narrative Engineering",
    "phaseNumber": 2,
    "totalPhases": 4
  },
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:15.000Z"
}
```

**Response (Completed):**

```json
{
  "jobId": "550e8400-e29b-41d4-a716-446655440000",
  "status": "completed",
  "progress": {
    "phase": "PPTX Conversion",
    "phaseNumber": 4,
    "totalPhases": 4
  },
  "result": {
    "downloadUrl": "/api/jobs/550e8400-e29b-41d4-a716-446655440000/download",
    "slideCount": 9,
    "title": "Presentation Title"
  },
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:31:30.000Z"
}
```

**Response (Failed):**

```json
{
  "jobId": "550e8400-e29b-41d4-a716-446655440000",
  "status": "failed",
  "error": "Failed to fetch URL: 404 Not Found",
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:05.000Z"
}
```

### GET /api/jobs/:id/download

Download the generated PPTX file.

```bash
curl -O http://localhost:3000/api/jobs/{jobId}/download
```

Returns the PowerPoint file as `presentation.pptx`.

### GET /health

Health check endpoint.

```bash
curl http://localhost:3000/health
```

```json
{
  "status": "ok",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

## Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `ANTHROPIC_API_KEY` | Claude API key (required) | - |
| `PORT` | Server port | `3000` |
| `OUTPUT_DIR` | Directory for generated files | `./output` |
| `LOG_LEVEL` | Logging level (`debug`, `info`, `warn`, `error`) | `info` |

### .env File

Create a `.env` file in the project root:

```env
ANTHROPIC_API_KEY=sk-ant-api03-...
PORT=3000
OUTPUT_DIR=./output
LOG_LEVEL=info
```

## Processing Phases

The API processes requests through these phases:

| Phase | Description |
|-------|-------------|
| 1. Content Analysis | Fetch and analyze source content |
| 2. Narrative Engineering | Generate assertion-based headlines |
| 3. Slide Generation | Create HTML slides |
| 4. PPTX Conversion | Convert HTML to PowerPoint |

Each phase updates the job progress, which can be monitored via polling.

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      API Service                            │
├─────────────────────────────────────────────────────────────┤
│  POST /api/generate     → Create job, return job_id         │
│  GET  /api/jobs/:id     → Get job status & result           │
│  GET  /api/jobs/:id/download → Download PPTX file           │
├─────────────────────────────────────────────────────────────┤
│                    Job Processor                            │
│  ┌─────────┐   ┌─────────┐   ┌─────────┐   ┌─────────┐     │
│  │ Fetch   │ → │ Claude  │ → │ HTML    │ → │ PPTX    │     │
│  │ Content │   │ API     │   │ Slides  │   │ Convert │     │
│  └─────────┘   └─────────┘   └─────────┘   └─────────┘     │
├─────────────────────────────────────────────────────────────┤
│  Jobs Store (in-memory)  │  Output Files (/output)          │
└─────────────────────────────────────────────────────────────┘
```

## Project Structure

```
api/
├── src/
│   ├── index.js              # Express server entry point
│   ├── routes/
│   │   └── api.js            # API route handlers
│   ├── services/
│   │   ├── jobManager.js     # Job queue & status tracking
│   │   ├── contentFetcher.js # URL → markdown extraction
│   │   ├── claudeClient.js   # Claude API integration
│   │   ├── slideGenerator.js # HTML slide management
│   │   └── pptxConverter.js  # HTML → PPTX conversion
│   ├── prompts/
│   │   └── index.js          # Load prompts from parent dir
│   └── utils/
│       └── logger.js         # Logging utility
├── package.json
├── Dockerfile
└── .env.example
```

## Troubleshooting

### "ANTHROPIC_API_KEY is not set"

Make sure you've set the API key:
```bash
export ANTHROPIC_API_KEY=sk-ant-...
```

### "Failed to fetch URL"

- Check the URL is accessible
- Some sites block automated requests
- Try using `sourceType: "markdown"` with the content directly

### Job stuck in "processing"

- Check logs: `docker-compose logs -f` or terminal output
- Claude API may be slow for large content
- Default timeout is generous, but very large articles may take time

### Docker build fails

- Ensure Docker is running
- Check you have sufficient disk space
- Try: `docker-compose build --no-cache`

## Development

```bash
# Install dependencies
cd api
npm install

# Run with auto-reload
npm run dev

# Run normally
npm start
```
