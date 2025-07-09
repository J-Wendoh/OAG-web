/**
 * Database connectivity test utility
 * Tests the Supabase connection and basic functionality
 */

import { supabase, isSupabaseConfigured } from '../lib/supabase';

export interface DatabaseTestResult {
  isConfigured: boolean;
  connectionTest: boolean;
  tablesExist: boolean;
  canInsert: boolean;
  canSelect: boolean;
  errors: string[];
}

/**
 * Comprehensive database connectivity test
 */
export async function testDatabaseConnection(): Promise<DatabaseTestResult> {
  const result: DatabaseTestResult = {
    isConfigured: false,
    connectionTest: false,
    tablesExist: false,
    canInsert: false,
    canSelect: false,
    errors: []
  };

  try {
    // Test 1: Check if Supabase is configured
    result.isConfigured = isSupabaseConfigured();
    if (!result.isConfigured) {
      result.errors.push('Supabase is not properly configured');
      return result;
    }

    // Test 2: Basic connection test
    try {
      const { data, error } = await supabase.from('news_articles').select('count', { count: 'exact', head: true });
      if (error) {
        result.errors.push(`Connection test failed: ${error.message}`);
      } else {
        result.connectionTest = true;
      }
    } catch (error) {
      result.errors.push(`Connection test error: ${error}`);
    }

    // Test 3: Check if required tables exist
    try {
      const tables = ['news_articles', 'complaints', 'careers', 'hero_sections'];
      let tablesFound = 0;

      for (const table of tables) {
        try {
          const { error } = await supabase.from(table).select('*').limit(1);
          if (!error) {
            tablesFound++;
          } else {
            result.errors.push(`Table ${table} not accessible: ${error.message}`);
          }
        } catch (error) {
          result.errors.push(`Error checking table ${table}: ${error}`);
        }
      }

      result.tablesExist = tablesFound === tables.length;
    } catch (error) {
      result.errors.push(`Table existence check failed: ${error}`);
    }

    // Test 4: Test SELECT operation
    try {
      const { data, error } = await supabase
        .from('news_articles')
        .select('id, title_en')
        .limit(1);

      if (error) {
        result.errors.push(`SELECT test failed: ${error.message}`);
      } else {
        result.canSelect = true;
      }
    } catch (error) {
      result.errors.push(`SELECT test error: ${error}`);
    }

    // Test 5: Test INSERT operation (with immediate cleanup)
    try {
      const testData = {
        title_en: 'Database Test Article',
        title_sw: 'Makala ya Jaribio la Hifadhidata',
        slug: `test-article-${Date.now()}`,
        content_en: 'This is a test article for database connectivity.',
        content_sw: 'Hii ni makala ya jaribio kwa muunganisho wa hifadhidata.',
        status: 'draft'
      };

      const { data, error } = await supabase
        .from('news_articles')
        .insert(testData)
        .select('id')
        .single();

      if (error) {
        result.errors.push(`INSERT test failed: ${error.message}`);
      } else {
        result.canInsert = true;

        // Clean up test data
        if (data?.id) {
          await supabase.from('news_articles').delete().eq('id', data.id);
        }
      }
    } catch (error) {
      result.errors.push(`INSERT test error: ${error}`);
    }

  } catch (error) {
    result.errors.push(`General database test error: ${error}`);
  }

  return result;
}

/**
 * Test specific functionality areas
 */
export async function testSpecificFunctionality() {
  const tests = {
    complaints: false,
    news: false,
    careers: false,
    heroSections: false
  };

  try {
    // Test complaints functionality
    const { error: complaintsError } = await supabase
      .from('complaints')
      .select('id')
      .limit(1);
    tests.complaints = !complaintsError;

    // Test news functionality
    const { error: newsError } = await supabase
      .from('news_articles')
      .select('id')
      .limit(1);
    tests.news = !newsError;

    // Test careers functionality
    const { error: careersError } = await supabase
      .from('careers')
      .select('id')
      .limit(1);
    tests.careers = !careersError;

    // Test hero sections functionality
    const { error: heroError } = await supabase
      .from('hero_sections')
      .select('id')
      .limit(1);
    tests.heroSections = !heroError;

  } catch (error) {
    console.error('Functionality test error:', error);
  }

  return tests;
}

/**
 * Log database test results to console
 */
export function logDatabaseTestResults(result: DatabaseTestResult) {
  console.group('🔍 Database Connectivity Test Results');
  
  console.log(`✅ Configured: ${result.isConfigured ? 'Yes' : 'No'}`);
  console.log(`🔗 Connection: ${result.connectionTest ? 'Success' : 'Failed'}`);
  console.log(`📋 Tables: ${result.tablesExist ? 'All found' : 'Missing tables'}`);
  console.log(`📖 SELECT: ${result.canSelect ? 'Working' : 'Failed'}`);
  console.log(`📝 INSERT: ${result.canInsert ? 'Working' : 'Failed'}`);
  
  if (result.errors.length > 0) {
    console.group('❌ Errors:');
    result.errors.forEach(error => console.error(error));
    console.groupEnd();
  }
  
  const overallStatus = result.isConfigured && result.connectionTest && result.tablesExist;
  console.log(`\n🎯 Overall Status: ${overallStatus ? '✅ READY' : '❌ NEEDS SETUP'}`);
  
  console.groupEnd();
}

/**
 * Initialize database test on app startup
 */
export async function initializeDatabaseTest() {
  if (process.env.NODE_ENV === 'development') {
    try {
      const result = await testDatabaseConnection();
      logDatabaseTestResults(result);
      
      if (result.isConfigured && result.connectionTest) {
        const functionality = await testSpecificFunctionality();
        console.group('🧪 Functionality Tests');
        console.log('Complaints:', functionality.complaints ? '✅' : '❌');
        console.log('News:', functionality.news ? '✅' : '❌');
        console.log('Careers:', functionality.careers ? '✅' : '❌');
        console.log('Hero Sections:', functionality.heroSections ? '✅' : '❌');
        console.groupEnd();
      }
    } catch (error) {
      console.error('Database test initialization failed:', error);
    }
  }
}
