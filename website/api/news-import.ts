import { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Initialize Supabase client
const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase configuration for news import');
}

const supabase = createClient(supabaseUrl!, supabaseKey!);

// Sample news data for production deployment
const sampleNewsData = [
  {
    title_en: "Historic Royal Engagement Celebrating Kenya's Legal Excellence",
    title_sw: "Mkutano wa Kihistoria wa Kifalme Kusherehekea Ubora wa Kisheria wa Kenya",
    slug: "historic-royal-engagement-celebrating-kenyas-legal-excellence",
    excerpt_en: "Attorney General Hon. Dorcas Oduor today held consultative meetings with His Majesty King Willem-Alexander and Her Majesty Queen Maxima of the Netherlands at the Supreme Court of Kenya during their state visit to Kenya.",
    excerpt_sw: "Mwanasheria Mkuu Mheshimiwa Dorcas Oduor leo ameshika mikutano ya kushauriana na Mfalme Willem-Alexander na Malkia Maxima wa Uholanzi katika Mahakama Kuu ya Kenya wakati wa ziara yao ya kikazi Kenya.",
    content_en: "In a landmark diplomatic engagement, Attorney General Hon. Dorcas Oduor today hosted Their Majesties King Willem-Alexander and Queen Maxima of the Netherlands at the Supreme Court of Kenya. The historic meeting, part of the royal couple's state visit to Kenya, focused on strengthening legal cooperation between Kenya and the Netherlands, particularly in areas of international law, trade regulations, and judicial excellence. The Attorney General presented Kenya's significant legal reforms and constitutional developments, highlighting the country's commitment to rule of law and justice for all citizens. The royal visitors expressed admiration for Kenya's legal system and the progressive leadership of the Office of the Attorney General.",
    content_sw: "Katika mkutano wa kidiplomasia wa kihistoria, Mwanasheria Mkuu Mheshimiwa Dorcas Oduor leo amewakaribisha Mfalme Willem-Alexander na Malkia Maxima wa Uholanzi katika Mahakama Kuu ya Kenya. Mkutano huu wa kihistoria, ambao ni sehemu ya ziara ya kikazi ya jozi la kifalme Kenya, ulilenga kuimarisha ushirikiano wa kisheria kati ya Kenya na Uholanzi, hasa katika maeneo ya sheria za kimataifa, kanuni za biashara, na ubora wa mahakama. Mwanasheria Mkuu aliwasilisha mageuzi makubwa ya kisheria ya Kenya na maendeleo ya kikatiba, akisisitiza kujitolea kwa nchi katika utawala wa sheria na haki kwa raia wote.",
    status: 'published',
    is_featured: true,
    published_at: new Date().toISOString(),
    tags: ['diplomacy', 'international-relations', 'legal-cooperation', 'royal-visit']
  },
  {
    title_en: "Attorney General Advances Constitutional Implementation Framework",
    title_sw: "Mwanasheria Mkuu Anaendeleza Mfumo wa Utekelezaji wa Kikatiba",
    slug: "attorney-general-advances-constitutional-implementation-framework",
    excerpt_en: "The Office of the Attorney General continues to lead comprehensive constitutional implementation initiatives, ensuring all government institutions align with the 2010 Constitution's provisions and principles.",
    excerpt_sw: "Ofisi ya Mwanasheria Mkuu inaendelea kuongoza mipango ya kina ya utekelezaji wa kikatiba, ikihakikisha taasisi zote za serikali zinafuata masharti na kanuni za Katiba ya 2010.",
    content_en: "The Office of the Attorney General has launched a comprehensive constitutional implementation framework designed to ensure seamless alignment of all government operations with the 2010 Constitution. This initiative includes regular constitutional audits, legal compliance assessments, and institutional capacity building programs. The framework emphasizes transparency, accountability, and citizen participation in governance processes, reflecting the constitutional values of democracy and rule of law.",
    content_sw: "Ofisi ya Mwanasheria Mkuu imeanzisha mfumo wa kina wa utekelezaji wa kikatiba uliobuniwa kuhakikisha mfumo wa serikali unafuata Katiba ya 2010. Mpango huu unajumuisha ukaguzi wa mara kwa mara wa kikatiba, tathmini za kufuata sheria, na mipango ya kujenga uwezo wa kitaasisi. Mfumo huu unasisitiza uwazi, uwajibikaji, na ushiriki wa raia katika michakato ya utawala.",
    status: 'published',
    is_featured: false,
    published_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // Yesterday
    tags: ['constitution', 'implementation', 'governance', 'legal-framework']
  },
  {
    title_en: "Legal Education Initiative Empowers Kenyan Citizens",
    title_sw: "Mpango wa Elimu ya Kisheria Unawapa Nguvu Raia wa Kenya",
    slug: "legal-education-initiative-empowers-kenyan-citizens",
    excerpt_en: "A new comprehensive legal education program launched by the Attorney General's office aims to enhance citizens' understanding of their rights and the legal system.",
    excerpt_sw: "Mpango mpya wa kina wa elimu ya kisheria ulioanzishwa na ofisi ya Mwanasheria Mkuu unalenga kuongeza uelewa wa raia kuhusu haki zao na mfumo wa kisheria.",
    content_en: "The Office of the Attorney General has unveiled an ambitious legal education initiative designed to empower Kenyan citizens with comprehensive knowledge of their constitutional rights and legal processes. The program includes community workshops, digital resources, multilingual educational materials, and partnerships with educational institutions across the country. This initiative represents a significant step toward achieving universal legal literacy and ensuring all Kenyans can effectively access justice and participate in democratic processes.",
    content_sw: "Ofisi ya Mwanasheria Mkuu imeanzisha mpango mkubwa wa elimu ya kisheria uliobuniwa kuwapa raia wa Kenya maarifa ya kina kuhusu haki zao za kikatiba na michakato ya kisheria. Mpango huu unajumuisha warsha za kijamii, rasilimali za kidijitali, vifaa vya kielimu vya lugha nyingi, na ushirikiano na taasisi za elimu nchini kote. Mpango huu unawakilisha hatua muhimu katika kufikia ujuzi wa kisheria kwa wote na kuhakikisha Wakenya wote wanaweza kupata haki na kushiriki katika michakato ya kidemokrasia.",
    status: 'published',
    is_featured: false,
    published_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    tags: ['legal-education', 'citizen-empowerment', 'constitutional-rights', 'access-to-justice']
  }
];

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    if (req.method === 'GET') {
      // Return import status (simplified for serverless)
      return res.json({
        success: true,
        data: {
          status: 'idle',
          message: 'News import system ready'
        }
      });
    }

    if (req.method === 'POST') {
      // Check if Supabase is configured
      if (!supabaseUrl || !supabaseKey) {
        return res.status(500).json({
          success: false,
          error: 'Database configuration missing'
        });
      }

      let importResults = {
        processed: 0,
        imported: 0,
        skipped: 0,
        errors: 0,
        errorDetails: []
      };

      // Import sample news data
      for (const article of sampleNewsData) {
        try {
          importResults.processed++;

          // Check if article already exists
          const { data: existing } = await supabase
            .from('news_articles')
            .select('id')
            .eq('slug', article.slug)
            .single();

          if (existing) {
            importResults.skipped++;
            continue;
          }

          // Insert new article
          const { error } = await supabase
            .from('news_articles')
            .insert(article);

          if (error) {
            importResults.errors++;
            importResults.errorDetails.push(`Error importing ${article.slug}: ${error.message}`);
          } else {
            importResults.imported++;
          }

        } catch (error) {
          importResults.errors++;
          importResults.errorDetails.push(`Exception importing ${article.slug}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      }

      return res.json({
        success: true,
        message: 'News import completed',
        data: {
          ...importResults,
          status: 'completed',
          completedAt: new Date().toISOString()
        }
      });
    }

    return res.status(405).json({
      success: false,
      error: 'Method not allowed'
    });

  } catch (error) {
    console.error('News import error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
