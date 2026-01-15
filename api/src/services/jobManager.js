import { v4 as uuidv4 } from 'uuid';
import { logger } from '../utils/logger.js';

// In-memory job store
const jobs = new Map();

// Job statuses
export const JobStatus = {
  QUEUED: 'queued',
  PROCESSING: 'processing',
  COMPLETED: 'completed',
  FAILED: 'failed'
};

// Phase definitions
export const Phases = [
  { id: 'content-analysis', name: 'Content Analysis', number: 1 },
  { id: 'narrative-engineering', name: 'Narrative Engineering', number: 2 },
  { id: 'slide-generation', name: 'Slide Generation', number: 3 },
  { id: 'pptx-conversion', name: 'PPTX Conversion', number: 4 }
];

export function createJob(input) {
  const jobId = uuidv4();
  const job = {
    id: jobId,
    status: JobStatus.QUEUED,
    input,
    progress: {
      phase: null,
      phaseNumber: 0,
      totalPhases: Phases.length
    },
    result: null,
    error: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  jobs.set(jobId, job);
  logger.info(`Job created: ${jobId}`);
  return job;
}

export function getJob(jobId) {
  return jobs.get(jobId) || null;
}

export function updateJobStatus(jobId, status) {
  const job = jobs.get(jobId);
  if (!job) return null;

  job.status = status;
  job.updatedAt = new Date().toISOString();
  logger.info(`Job ${jobId} status updated to: ${status}`);
  return job;
}

export function updateJobProgress(jobId, phaseId) {
  const job = jobs.get(jobId);
  if (!job) return null;

  const phase = Phases.find(p => p.id === phaseId);
  if (phase) {
    job.progress = {
      phase: phase.name,
      phaseNumber: phase.number,
      totalPhases: Phases.length
    };
    job.updatedAt = new Date().toISOString();
    logger.info(`Job ${jobId} progress: ${phase.name} (${phase.number}/${Phases.length})`);
  }
  return job;
}

export function setJobResult(jobId, result) {
  const job = jobs.get(jobId);
  if (!job) return null;

  job.status = JobStatus.COMPLETED;
  job.result = result;
  job.updatedAt = new Date().toISOString();
  logger.info(`Job ${jobId} completed`, { slides: result.slideCount });
  return job;
}

export function setJobError(jobId, error) {
  const job = jobs.get(jobId);
  if (!job) return null;

  job.status = JobStatus.FAILED;
  job.error = error.message || String(error);
  job.updatedAt = new Date().toISOString();
  logger.error(`Job ${jobId} failed: ${job.error}`);
  return job;
}

// Clean up old jobs (run periodically)
export function cleanupOldJobs(maxAgeMs = 3600000) {
  const now = Date.now();
  let cleaned = 0;

  for (const [jobId, job] of jobs) {
    const jobAge = now - new Date(job.createdAt).getTime();
    if (jobAge > maxAgeMs && job.status !== JobStatus.PROCESSING) {
      jobs.delete(jobId);
      cleaned++;
    }
  }

  if (cleaned > 0) {
    logger.info(`Cleaned up ${cleaned} old jobs`);
  }
}

// Run cleanup every 30 minutes
setInterval(() => cleanupOldJobs(), 30 * 60 * 1000);
