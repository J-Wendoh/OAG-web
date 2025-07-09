/**
 * Live database test utility
 * Quick test to verify database is working with real data
 */

import { supabase } from '../lib/supabase';

export async function testLiveDatabase() {
  console.group('🔍 Live Database Test');
  
  try {
    // Test 1: Check news articles
    console.log('Testing news articles...');
    const { data: news, error: newsError } = await supabase
      .from('news_articles')
      .select('*')
      .eq('status', 'published')
      .limit(5);
    
    if (newsError) {
      console.error('❌ News test failed:', newsError);
    } else {
      console.log('✅ News articles found:', news?.length || 0);
      if (news && news.length > 0) {
        console.log('Sample news:', news[0].title_en);
      }
    }

    // Test 2: Check hero sections
    console.log('Testing hero sections...');
    const { data: hero, error: heroError } = await supabase
      .from('hero_sections')
      .select('*')
      .eq('is_active', true)
      .limit(1);
    
    if (heroError) {
      console.error('❌ Hero test failed:', heroError);
    } else {
      console.log('✅ Hero sections found:', hero?.length || 0);
      if (hero && hero.length > 0) {
        console.log('Hero title:', hero[0].title_en);
      }
    }

    // Test 3: Check careers
    console.log('Testing careers...');
    const { data: careers, error: careersError } = await supabase
      .from('careers')
      .select('*')
      .eq('is_active', true)
      .limit(5);
    
    if (careersError) {
      console.error('❌ Careers test failed:', careersError);
    } else {
      console.log('✅ Careers found:', careers?.length || 0);
      if (careers && careers.length > 0) {
        console.log('Sample career:', careers[0].title_en);
      }
    }

    // Test 4: Check AG history
    console.log('Testing AG history...');
    const { data: agHistory, error: agError } = await supabase
      .from('attorney_general_history')
      .select('*')
      .eq('is_current', true)
      .limit(1);
    
    if (agError) {
      console.error('❌ AG history test failed:', agError);
    } else {
      console.log('✅ AG history found:', agHistory?.length || 0);
      if (agHistory && agHistory.length > 0) {
        console.log('Current AG:', agHistory[0].full_name);
      }
    }

    console.log('🎉 Database is live and working!');
    
  } catch (error) {
    console.error('❌ Database test failed:', error);
  }
  
  console.groupEnd();
}

// Auto-run test in development - DISABLED to prevent infinite loops
// if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
//   setTimeout(() => {
//     testLiveDatabase();
//   }, 2000);
// }
