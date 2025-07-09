import { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase configuration');
}

const supabase = createClient(supabaseUrl!, supabaseKey!);

interface NewsArticle {
  id: string;
  title_en: string;
  title_sw: string;
  excerpt_en: string | null;
  excerpt_sw: string | null;
  content_en: string;
  content_sw: string;
  featured_image_url: string | null;
  status: string;
  is_featured: boolean;
  author_id: string | null;
  tags: string[] | null;
  created_at: string;
  updated_at: string;
  published_at: string | null;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    const { method, query } = req;
    const { action, q, featured } = query;

    switch (method) {
      case 'GET':
        if (action === 'search' && q) {
          // Search news articles
          const searchTerm = `%${q}%`;
          const { data: articles, error } = await supabase
            .from('news_articles')
            .select('*')
            .eq('status', 'published')
            .or(`title_en.ilike.${searchTerm},title_sw.ilike.${searchTerm},content_en.ilike.${searchTerm},content_sw.ilike.${searchTerm},excerpt_en.ilike.${searchTerm},excerpt_sw.ilike.${searchTerm}`)
            .order('published_at', { ascending: false })
            .limit(10);

          if (error) {
            console.error('Error searching news:', error);
            return res.status(500).json({ error: 'Failed to search news' });
          }

          return res.json(articles || []);
        }

        if (action === 'featured') {
          // Get featured news articles
          const { data: articles, error } = await supabase
            .from('news_articles')
            .select('*')
            .eq('status', 'published')
            .eq('is_featured', true)
            .order('published_at', { ascending: false })
            .limit(5);

          if (error) {
            console.error('Error fetching featured news:', error);
            return res.status(500).json({ error: 'Failed to fetch featured news' });
          }

          return res.json(articles || []);
        }

        // Default: Get all published news
        const { data: articles, error } = await supabase
          .from('news_articles')
          .select('*')
          .eq('status', 'published')
          .order('published_at', { ascending: false })
          .limit(20);

        if (error) {
          console.error('Error fetching news:', error);
          return res.status(500).json({ error: 'Failed to fetch news' });
        }

        return res.json(articles || []);

      case 'POST':
        // Create new news article (admin only)
        const { data: newArticle, error: createError } = await supabase
          .from('news_articles')
          .insert(req.body)
          .select()
          .single();

        if (createError) {
          console.error('Error creating news article:', createError);
          return res.status(500).json({ error: 'Failed to create news article' });
        }

        return res.status(201).json(newArticle);

      default:
        res.setHeader('Allow', ['GET', 'POST']);
        return res.status(405).json({ error: `Method ${method} not allowed` });
    }
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
