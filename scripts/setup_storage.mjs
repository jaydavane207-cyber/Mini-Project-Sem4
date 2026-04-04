/**
 * GroupSync - Setup Supabase Storage for Chat Media
 * Creates a public 'chat-media' bucket for storing chat images/files.
 * Run with: node scripts/setup_storage.mjs
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://eaukxgiwfzajxcpbfgfq.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVhdWt4Z2l3ZnphanhjcGJmZ2ZxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQzNTM5NzIsImV4cCI6MjA4OTkyOTk3Mn0.15CZyxuXRtDbeJNkaUfRSTe7c2-YGa7rFiJ_y27pT8o';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function main() {
  console.log('🚀 GroupSync Storage Setup\n');

  // 1. Try to create the bucket (will fail gracefully if it already exists)
  const { data, error } = await supabase.storage.createBucket('chat-media', {
    public: true,
    fileSizeLimit: 26214400, // 25 MB
    allowedMimeTypes: [
      'image/jpeg', 'image/png', 'image/gif', 'image/webp',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'video/mp4', 'video/webm',
    ],
  });

  if (error) {
    if (error.message?.includes('already exists') || error.message?.includes('duplicate')) {
      console.log('✅ Bucket "chat-media" already exists — skipping creation.');
    } else {
      console.error('❌ Failed to create bucket:', error.message);
      console.log('\nThis typically means the anon key does not have storage admin rights.');
      console.log('Please run the following SQL in the Supabase SQL Editor instead:');
      console.log('   https://supabase.com/dashboard/project/eaukxgiwfzajxcpbfgfq/sql/new\n');
    }
  } else {
    console.log('✅ Bucket "chat-media" created successfully!');
  }

  // 2. Print the RLS SQL that must be applied via the dashboard
  const separator = '='.repeat(72);
  console.log(`\n${separator}`);
  console.log('📋 REQUIRED: Paste this SQL in the Supabase SQL Editor to allow uploads:');
  console.log(`   https://supabase.com/dashboard/project/eaukxgiwfzajxcpbfgfq/sql/new`);
  console.log(separator);
  console.log(`
-- Allow any authenticated user to upload to chat-media
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'chat-media',
  'chat-media',
  true,
  26214400,
  ARRAY[
    'image/jpeg','image/png','image/gif','image/webp',
    'application/pdf','application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'video/mp4','video/webm'
  ]
)
ON CONFLICT (id) DO NOTHING;

-- Storage RLS: allow authenticated users to upload
CREATE POLICY IF NOT EXISTS "Auth users can upload chat media"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'chat-media');

-- Storage RLS: allow public read of chat media
CREATE POLICY IF NOT EXISTS "Public can view chat media"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'chat-media');

-- Storage RLS: allow users to delete their own uploads
CREATE POLICY IF NOT EXISTS "Users can delete own chat media"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'chat-media' AND auth.uid()::text = (storage.foldername(name))[1]);
  `);
  console.log(separator);
  console.log('\n✅ Setup script complete!');
}

main().catch(console.error);
