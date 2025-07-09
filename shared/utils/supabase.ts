import { createClient } from '@supabase/supabase-js'
import type { Database } from '../types/database'

// Environment variables - these should be set in each application
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder-project.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-anon-key'

// Validate environment variables
const isValidConfig = () => {
  return supabaseUrl !== 'https://placeholder-project.supabase.co' && 
         supabaseAnonKey !== 'placeholder-anon-key' &&
         supabaseUrl.includes('supabase.co')
}

// Create the main Supabase client
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

// Check if Supabase is properly configured
export const isSupabaseConfigured = () => isValidConfig()

// Show configuration warning if not properly set up
if (!isValidConfig()) {
  console.warn('⚠️  Supabase not configured properly. Please set up your environment variables.')
  console.warn('📋 Follow these steps:')
  console.warn('1. Create a Supabase project at https://supabase.com')
  console.warn('2. Copy your project URL and anon key')
  console.warn('3. Update your .env file with the real values')
  console.warn('4. Restart the development server')
}

// Admin client with service role (for admin operations)
export const createAdminClient = (serviceRoleKey: string) => {
  return createClient<Database>(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })
}

// Utility functions for common operations
export const handleSupabaseError = (error: any) => {
  // Only log as error if Supabase is properly configured
  if (isValidConfig()) {
    console.error('Supabase error:', error)
  } else {
    console.info('📋 Database operation skipped - not configured')
  }
  
  if (error?.message) {
    return error.message
  }
  
  if (error?.details) {
    return error.details
  }
  
  return 'Database not available'
}

// Real-time subscription helper
export const subscribeToTable = (
  table: keyof Database['public']['Tables'],
  callback: (payload: any) => void,
  filter?: { column: string; value: any }
) => {
  let channel = supabase.channel(`${table}-changes`)
  
  if (filter) {
    channel = channel.on(
      'postgres_changes',
      { 
        event: '*', 
        schema: 'public', 
        table: table as string,
        filter: `${filter.column}=eq.${filter.value}`
      },
      callback
    )
  } else {
    channel = channel.on(
      'postgres_changes',
      { event: '*', schema: 'public', table: table as string },
      callback
    )
  }
  
  return channel.subscribe()
}

// Cleanup subscription
export const unsubscribeFromChannel = (subscription: any) => {
  if (subscription) {
    subscription.unsubscribe()
  }
}

// File upload helper
export const uploadFile = async (
  bucket: string,
  path: string,
  file: File,
  options?: { cacheControl?: string; contentType?: string }
) => {
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, file, {
      cacheControl: options?.cacheControl || '3600',
      contentType: options?.contentType || file.type,
      upsert: true
    })
  
  if (error) {
    throw new Error(handleSupabaseError(error))
  }
  
  return data
}

// Get file URL
export const getFileUrl = (bucket: string, path: string) => {
  const { data } = supabase.storage
    .from(bucket)
    .getPublicUrl(path)
  
  return data.publicUrl
}

// Delete file
export const deleteFile = async (bucket: string, path: string) => {
  const { error } = await supabase.storage
    .from(bucket)
    .remove([path])
  
  if (error) {
    throw new Error(handleSupabaseError(error))
  }
}

// Authentication helpers
export const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser()
  
  if (error) {
    throw new Error(handleSupabaseError(error))
  }
  
  return user
}

export const signInWithEmail = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  })
  
  if (error) {
    throw new Error(handleSupabaseError(error))
  }
  
  return data
}

export const signOut = async () => {
  const { error } = await supabase.auth.signOut()
  
  if (error) {
    throw new Error(handleSupabaseError(error))
  }
}

// Get user profile
export const getUserProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', userId)
    .single()
  
  if (error) {
    throw new Error(handleSupabaseError(error))
  }
  
  return data
}

// Database connection test
export const testDatabaseConnection = async () => {
  try {
    const { data, error } = await supabase
      .from('news')
      .select('count')
      .limit(1)
      .single()
    
    if (error && error.code !== 'PGRST116') {
      throw error
    }
    
    return true
  } catch (error) {
    console.error('Database connection test failed:', error)
    return false
  }
}

// Generate ticket ID for complaints
export const generateTicketId = () => {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const letter = letters[Math.floor(Math.random() * letters.length)]
  const number = Math.floor(Math.random() * 999) + 1
  return `AG${letter}${number.toString().padStart(3, '0')}`
}

// Constants for configuration
export const SUPABASE_CONFIG = {
  BUCKETS: {
    ATTACHMENTS: 'complaint-attachments',
    NEWS_IMAGES: 'news-images',
    DOCUMENTS: 'documents'
  },
  TABLES: {
    NEWS: 'news',
    COMPLAINTS: 'complaints',
    ACTIVITY_LOGS: 'activity_logs',
    USER_PROFILES: 'user_profiles'
  },
  CHANNELS: {
    NEWS: 'news-channel',
    COMPLAINTS: 'complaints-channel',
    ACTIVITY: 'activity-channel'
  }
} as const

export default supabase 