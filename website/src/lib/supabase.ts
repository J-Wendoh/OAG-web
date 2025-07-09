import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

// Check if Supabase is properly configured
export const isSupabaseConfigured = (): boolean => {
  return !!(
    supabaseUrl &&
    supabaseAnonKey &&
    supabaseUrl !== 'your-supabase-project-url' &&
    supabaseAnonKey !== 'your-supabase-anon-key' &&
    supabaseUrl.startsWith('https://') &&
    supabaseUrl.includes('.supabase.co')
  );
};

// Create a comprehensive mock client for development when Supabase is not configured
const createMockClient = () => {
  const mockResponse = { data: null, error: new Error('Supabase not configured - using mock client') };
  const mockSuccessResponse = { data: [], error: null };

  // Mock query builder that chains properly
  const createMockQueryBuilder = () => ({
    select: (columns?: string) => createMockQueryBuilder(),
    insert: (data: any) => createMockQueryBuilder(),
    update: (data: any) => createMockQueryBuilder(),
    delete: () => createMockQueryBuilder(),
    eq: (column: string, value: any) => createMockQueryBuilder(),
    neq: (column: string, value: any) => createMockQueryBuilder(),
    gt: (column: string, value: any) => createMockQueryBuilder(),
    gte: (column: string, value: any) => createMockQueryBuilder(),
    lt: (column: string, value: any) => createMockQueryBuilder(),
    lte: (column: string, value: any) => createMockQueryBuilder(),
    like: (column: string, pattern: string) => createMockQueryBuilder(),
    ilike: (column: string, pattern: string) => createMockQueryBuilder(),
    is: (column: string, value: any) => createMockQueryBuilder(),
    in: (column: string, values: any[]) => createMockQueryBuilder(),
    contains: (column: string, value: any) => createMockQueryBuilder(),
    containedBy: (column: string, value: any) => createMockQueryBuilder(),
    rangeGt: (column: string, value: any) => createMockQueryBuilder(),
    rangeGte: (column: string, value: any) => createMockQueryBuilder(),
    rangeLt: (column: string, value: any) => createMockQueryBuilder(),
    rangeLte: (column: string, value: any) => createMockQueryBuilder(),
    rangeAdjacent: (column: string, value: any) => createMockQueryBuilder(),
    overlaps: (column: string, value: any) => createMockQueryBuilder(),
    textSearch: (column: string, query: string) => createMockQueryBuilder(),
    match: (query: Record<string, any>) => createMockQueryBuilder(),
    not: (column: string, operator: string, value: any) => createMockQueryBuilder(),
    or: (filters: string) => createMockQueryBuilder(),
    filter: (column: string, operator: string, value: any) => createMockQueryBuilder(),
    order: (column: string, options?: { ascending?: boolean }) => createMockQueryBuilder(),
    limit: (count: number) => createMockQueryBuilder(),
    range: (from: number, to: number) => createMockQueryBuilder(),
    single: () => Promise.resolve(mockResponse),
    maybeSingle: () => Promise.resolve(mockResponse),
    csv: () => Promise.resolve(mockResponse),
    then: (onFulfilled?: any, onRejected?: any) => Promise.resolve(mockSuccessResponse).then(onFulfilled, onRejected),
    catch: (onRejected?: any) => Promise.resolve(mockSuccessResponse).catch(onRejected),
    finally: (onFinally?: any) => Promise.resolve(mockSuccessResponse).finally(onFinally)
  });

  return {
    from: (table: string) => createMockQueryBuilder(),
    storage: {
      from: (bucket: string) => ({
        upload: (path: string, file: File) => Promise.resolve(mockResponse),
        download: (path: string) => Promise.resolve(mockResponse),
        remove: (paths: string[]) => Promise.resolve(mockResponse),
        list: (path?: string) => Promise.resolve(mockResponse),
        getPublicUrl: (path: string) => ({ data: { publicUrl: `/mock/${path}` } })
      })
    },
    auth: {
      signInWithPassword: (credentials: any) => Promise.resolve(mockResponse),
      signUp: (credentials: any) => Promise.resolve(mockResponse),
      signOut: () => Promise.resolve(mockResponse),
      getUser: () => Promise.resolve(mockResponse),
      getSession: () => Promise.resolve(mockResponse),
      onAuthStateChange: (callback: any) => ({ data: { subscription: { unsubscribe: () => {} } } })
    },
    channel: (name: string) => ({
      on: (event: string, filter: any, callback: any) => ({
        subscribe: () => Promise.resolve({ status: 'SUBSCRIBED' })
      }),
      subscribe: () => Promise.resolve({ status: 'SUBSCRIBED' }),
      unsubscribe: () => Promise.resolve({ status: 'CLOSED' })
    }),
    removeChannel: (channel: any) => Promise.resolve({ status: 'OK' }),
    removeAllChannels: () => Promise.resolve({ status: 'OK' })
  } as any;
};

// Singleton instance to prevent multiple client creation
let supabaseInstance: SupabaseClient | null = null;

// Initialize Supabase client with proper error handling
export const supabase: SupabaseClient = (() => {
  // Return existing instance if already created
  if (supabaseInstance) {
    return supabaseInstance;
  }

  if (!isSupabaseConfigured()) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('⚠️ Supabase not configured properly. Using mock client for development.');
      console.info('📋 To enable database features:');
      console.info('1. Create a Supabase project at https://supabase.com');
      console.info('2. Copy your project URL and anon key');
      console.info('3. Update your .env file with the real values');
      console.info('4. Restart the development server');
    }

    supabaseInstance = createMockClient();
    return supabaseInstance;
  }

  try {
    supabaseInstance = createClient(supabaseUrl!, supabaseAnonKey!, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true
      }
    });
    return supabaseInstance;
  } catch (error) {
    console.error('Failed to initialize Supabase client:', error);
    supabaseInstance = createMockClient();
    return supabaseInstance;
  }
})();

// Database types
export interface NewsArticle {
  id: string;
  title_en: string;
  title_sw: string;
  excerpt_en: string;
  excerpt_sw: string;
  content_en: string;
  content_sw: string;
  image_url?: string;
  status: 'draft' | 'published' | 'archived';
  author_id: string;
  created_at: string;
  updated_at: string;
}

export interface HeroSection {
  id: string;
  title_en: string;
  title_sw: string;
  description_en: string;
  description_sw: string;
  image_url?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Complaint {
  id: string;
  first_name: string;
  last_name: string;
  id_number: string;
  email: string;
  subject: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'under_review' | 'resolved' | 'closed';
  created_at: string;
  updated_at: string;
}

export interface Appointment {
  id: string;
  first_name: string;
  last_name: string;
  id_number: string;
  email: string;
  date: string;
  time: string;
  message: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  created_at: string;
  updated_at: string;
}

export interface ContactMessage {
  id: string;
  first_name: string;
  last_name: string;
  id_number: string;
  email: string;
  subject: string;
  message: string;
  created_at: string;
}

// Public data helpers
export const getPublishedNews = async () => {
  const { data, error } = await supabase
    .from('news_articles')
    .select('*')
    .eq('status', 'published')
    .order('created_at', { ascending: false });
  return { data, error };
};

export const getActiveHeroSections = async () => {
  const { data, error } = await supabase
    .from('hero_sections')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false });
  return { data, error };
};

// Form submission helpers
export const submitComplaint = async (complaint: Omit<Complaint, 'id' | 'status' | 'created_at' | 'updated_at'>) => {
  const { data, error } = await supabase
    .from('complaints')
    .insert([{
      ...complaint,
      status: 'pending',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }]);
  return { data, error };
};

export const submitAppointment = async (appointment: Omit<Appointment, 'id' | 'status' | 'created_at' | 'updated_at'>) => {
  const { data, error } = await supabase
    .from('appointments')
    .insert([{
      ...appointment,
      status: 'pending',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }]);
  return { data, error };
};

export const submitContactMessage = async (message: Omit<ContactMessage, 'id' | 'created_at'>) => {
  const { data, error } = await supabase
    .from('contact_messages')
    .insert([{
      ...message,
      created_at: new Date().toISOString()
    }]);
  return { data, error };
};

// Utility functions
export const getNewsArticleById = async (id: string) => {
  const { data, error } = await supabase
    .from('news_articles')
    .select('*')
    .eq('id', id)
    .eq('status', 'published')
    .single();
  return { data, error };
};

export const getLatestNews = async (limit: number = 6) => {
  const { data, error } = await supabase
    .from('news_articles')
    .select('*')
    .eq('status', 'published')
    .order('created_at', { ascending: false })
    .limit(limit);
  return { data, error };
}; 