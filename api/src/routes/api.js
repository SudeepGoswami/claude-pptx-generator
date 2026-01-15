import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import {
  createJob,
  getJob,
  updateJobStatus,
  updateJobProgress,
  setJobResult,
  setJobError,
  JobStatus
} from '../services/jobManager.js';
import { fetchContent } from '../services/contentFetcher.js';
import { analyzeContent, engineerNarrative, generateSlides } from '../services/claudeClient.js';
import { saveSlides } from '../services/slideGenerator.js';
import { convertToPptx } from '../services/pptxConverter.js';
import { logger } from '../utils/logger.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUTPUT_DIR = process.env.OUTPUT_DIR || path.join(__dirname, '../../output');
const PROMPTS_DIR = path.join(__dirname, '../../..');

export const apiRouter = express.Router();

// POST /api/generate - Create a new presentation job
apiRouter.post('/generate', async (req, res) => {
  try {
    const { source, sourceType = 'url', brand = 'traefik', options = {} } = req.body;

    if (!source) {
      return res.status(400).json({ error: 'source is required' });
    }

    if (!['url', 'markdown'].includes(sourceType)) {
      return res.status(400).json({ error: 'sourceType must be "url" or "markdown"' });
    }

    // Create job
    const job = createJob({ source, sourceType, brand, options });

    // Start processing asynchronously
    processJob(job.id).catch(error => {
      logger.error(`Job ${job.id} failed`, { error: error.message });
    });

    res.status(202).json({
      jobId: job.id,
      status: job.status,
      statusUrl: `/api/jobs/${job.id}`
    });
  } catch (error) {
    logger.error('Failed to create job', { error: error.message });
    res.status(500).json({ error: 'Failed to create job' });
  }
});

// GET /api/jobs/:id - Get job status
apiRouter.get('/jobs/:id', (req, res) => {
  const job = getJob(req.params.id);

  if (!job) {
    return res.status(404).json({ error: 'Job not found' });
  }

  const response = {
    jobId: job.id,
    status: job.status,
    progress: job.progress,
    createdAt: job.createdAt,
    updatedAt: job.updatedAt
  };

  if (job.status === JobStatus.COMPLETED) {
    response.result = {
      downloadUrl: `/api/jobs/${job.id}/download`,
      ...job.result
    };
  }

  if (job.status === JobStatus.FAILED) {
    response.error = job.error;
  }

  res.json(response);
});

// GET /api/jobs/:id/download - Download the generated PPTX
apiRouter.get('/jobs/:id/download', (req, res) => {
  const job = getJob(req.params.id);

  if (!job) {
    return res.status(404).json({ error: 'Job not found' });
  }

  if (job.status !== JobStatus.COMPLETED) {
    return res.status(400).json({
      error: 'Job not completed',
      status: job.status
    });
  }

  const pptxPath = job.result?.pptxPath;
  if (!pptxPath || !fs.existsSync(pptxPath)) {
    return res.status(404).json({ error: 'PPTX file not found' });
  }

  res.download(pptxPath, 'presentation.pptx');
});

// Process a job through all phases
async function processJob(jobId) {
  const job = getJob(jobId);
  if (!job) return;

  const jobDir = path.join(OUTPUT_DIR, jobId);
  fs.mkdirSync(jobDir, { recursive: true });

  try {
    updateJobStatus(jobId, JobStatus.PROCESSING);

    // Phase 1: Fetch content
    updateJobProgress(jobId, 'content-analysis');
    logger.info(`Job ${jobId}: Fetching content`);
    const content = await fetchContent(job.input.source, job.input.sourceType);

    // Phase 2: Analyze content
    logger.info(`Job ${jobId}: Analyzing content`);
    const analysis = await analyzeContent(content);

    // Phase 3: Engineer narrative
    updateJobProgress(jobId, 'narrative-engineering');
    logger.info(`Job ${jobId}: Engineering narrative`);
    const narrative = await engineerNarrative(analysis);

    // Phase 4: Generate slides
    updateJobProgress(jobId, 'slide-generation');
    logger.info(`Job ${jobId}: Generating slides`);
    const slidesData = await generateSlides(narrative);

    // Save HTML slides
    const htmlFiles = await saveSlides(slidesData, jobDir);

    // Phase 5: Convert to PPTX
    updateJobProgress(jobId, 'pptx-conversion');
    logger.info(`Job ${jobId}: Converting to PPTX`);
    const pptxPath = path.join(jobDir, 'presentation.pptx');
    const logoPath = path.join(PROMPTS_DIR, 'logowhite.png');

    await convertToPptx(htmlFiles, pptxPath, logoPath);

    // Complete
    setJobResult(jobId, {
      pptxPath,
      slideCount: htmlFiles.length,
      title: narrative.title || 'Presentation'
    });

    logger.info(`Job ${jobId} completed successfully`);
  } catch (error) {
    logger.error(`Job ${jobId} failed`, { error: error.message, stack: error.stack });
    setJobError(jobId, error);
  }
}
