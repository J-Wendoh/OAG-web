import { NextApiRequest, NextApiResponse } from 'next';
import { spawn } from 'child_process';
import path from 'path';

interface ImportStats {
  processed: number;
  imported: number;
  skipped: number;
  errors: number;
  errorDetails: string[];
  status: 'running' | 'completed' | 'failed';
  startTime?: string;
  endTime?: string;
  duration?: number;
}

// Store import status in memory (in production, use Redis or database)
let currentImportStatus: ImportStats | null = null;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    // Return current import status
    return res.status(200).json({
      success: true,
      data: currentImportStatus || { status: 'idle' }
    });
  }

  if (req.method === 'POST') {
    // Start news import process
    try {
      // Check if import is already running
      if (currentImportStatus && currentImportStatus.status === 'running') {
        return res.status(409).json({
          success: false,
          error: 'Import process is already running',
          data: currentImportStatus
        });
      }

      // Initialize import status
      currentImportStatus = {
        processed: 0,
        imported: 0,
        skipped: 0,
        errors: 0,
        errorDetails: [],
        status: 'running',
        startTime: new Date().toISOString()
      };

      // Start the import process
      const importPromise = runNewsImport();
      
      // Don't wait for completion, return immediately
      res.status(202).json({
        success: true,
        message: 'News import started successfully',
        data: currentImportStatus
      });

      // Handle import completion in background
      importPromise
        .then(stats => {
          currentImportStatus = {
            ...stats,
            status: 'completed',
            endTime: new Date().toISOString(),
            duration: Date.now() - new Date(currentImportStatus!.startTime!).getTime()
          };
        })
        .catch(error => {
          currentImportStatus = {
            ...currentImportStatus!,
            status: 'failed',
            endTime: new Date().toISOString(),
            duration: Date.now() - new Date(currentImportStatus!.startTime!).getTime(),
            errors: currentImportStatus!.errors + 1,
            errorDetails: [...currentImportStatus!.errorDetails, error.message]
          };
        });

    } catch (error) {
      console.error('Error starting news import:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to start import process',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    return res.status(405).json({
      success: false,
      error: `Method ${req.method} not allowed`
    });
  }
}

function runNewsImport(): Promise<ImportStats> {
  return new Promise((resolve, reject) => {
    const scriptPath = path.join(process.cwd(), '../scripts/import-news.js');
    
    const child = spawn('node', [scriptPath], {
      stdio: ['pipe', 'pipe', 'pipe'],
      cwd: path.join(process.cwd(), '..')
    });

    let stdout = '';
    let stderr = '';

    child.stdout.on('data', (data) => {
      stdout += data.toString();
      
      // Parse progress from stdout if needed
      const output = data.toString();
      if (output.includes('Processing:')) {
        if (currentImportStatus) {
          currentImportStatus.processed++;
        }
      }
      if (output.includes('Imported successfully')) {
        if (currentImportStatus) {
          currentImportStatus.imported++;
        }
      }
      if (output.includes('Skipping')) {
        if (currentImportStatus) {
          currentImportStatus.skipped++;
        }
      }
      if (output.includes('Error:')) {
        if (currentImportStatus) {
          currentImportStatus.errors++;
        }
      }
    });

    child.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    child.on('close', (code) => {
      if (code === 0) {
        // Parse final statistics from stdout
        const stats = parseImportStats(stdout);
        resolve(stats);
      } else {
        reject(new Error(`Import process failed with code ${code}: ${stderr}`));
      }
    });

    child.on('error', (error) => {
      reject(new Error(`Failed to start import process: ${error.message}`));
    });
  });
}

function parseImportStats(output: string): ImportStats {
  const stats: ImportStats = {
    processed: 0,
    imported: 0,
    skipped: 0,
    errors: 0,
    errorDetails: [],
    status: 'completed'
  };

  // Extract statistics from output
  const processedMatch = output.match(/Processed:\s*(\d+)/);
  const importedMatch = output.match(/Imported:\s*(\d+)/);
  const skippedMatch = output.match(/Skipped:\s*(\d+)/);
  const errorsMatch = output.match(/Errors:\s*(\d+)/);

  if (processedMatch) stats.processed = parseInt(processedMatch[1]);
  if (importedMatch) stats.imported = parseInt(importedMatch[1]);
  if (skippedMatch) stats.skipped = parseInt(skippedMatch[1]);
  if (errorsMatch) stats.errors = parseInt(errorsMatch[1]);

  // Extract error details
  const errorLines = output.split('\n').filter(line => 
    line.includes('❌ Errors encountered:') || line.includes('   • ')
  );
  
  stats.errorDetails = errorLines
    .filter(line => line.includes('   • '))
    .map(line => line.replace('   • ', '').trim());

  return stats;
}
