import { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Check if Supabase configuration is available
    if (!supabaseUrl || !supabaseKey) {
      return res.status(500).json({
        status: '❌ ERROR',
        database: 'misconfigured',
        message: 'Missing Supabase configuration',
        timestamp: new Date().toISOString()
      });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Test database connection by counting news articles
    const { count, error } = await supabase
      .from('news_articles')
      .select('*', { count: 'exact', head: true });

    if (error) {
      return res.status(500).json({
        status: '❌ ERROR',
        database: 'connection_failed',
        message: error.message,
        timestamp: new Date().toISOString()
      });
    }

    return res.json({
      status: '✅ READY',
      database: 'connected',
      tables: ['news_articles'],
      articleCount: count || 0,
      environment: process.env.NODE_ENV || 'development',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Health check error:', error);
    return res.status(500).json({
      status: '❌ ERROR',
      database: 'error',
      message: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    });
  }
}
