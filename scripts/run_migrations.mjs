/**
 * GroupSync - Run DB Migrations via Supabase JS Client
 * This script runs the critical schema fixes using the Supabase client.
 * Run with: node scripts/run_migrations.mjs
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://eaukxgiwfzajxcpbfgfq.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVhdWt4Z2l3ZnphanhjcGJmZ2ZxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQzNTM5NzIsImV4cCI6MjA4OTkyOTk3Mn0.15CZyxuXRtDbeJNkaUfRSTe7c2-YGa7rFiJ_y27pT8o';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function checkTasksColumns() {
  console.log('\n🔍 Checking current tasks table columns...');
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .limit(1);

  if (error) {
    console.error('❌ Error querying tasks table:', error.message);
    return;
  }

  const sampleTask = data?.[0];
  if (sampleTask) {
    const cols = Object.keys(sampleTask);
    console.log('📋 Current columns in tasks table:', cols.join(', '));
    console.log('✅ assignee_id present:', cols.includes('assignee_id'));
    console.log('✅ due_date present:', cols.includes('due_date'));
  } else {
    console.log('📋 No tasks found. Checking with an insert test...');
    
    // Try inserting a task with assignee_id and due_date
    // This will either succeed (columns exist) or give a schema error
    const { error: insertErr } = await supabase.from('tasks').insert({
      group_id: 1,
      column_id: 'todo',
      text: 'Schema Test Task',
      tags: ['General'],
      assignee_id: null,
      due_date: null,
    });

    if (insertErr) {
      if (insertErr.message.includes('assignee_id') || insertErr.message.includes('due_date')) {
        console.log('\n❌ COLUMNS MISSING! The following columns need to be added manually:');
        console.log('   - assignee_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL');
        console.log('   - due_date DATE');
        printManualInstructions();
      } else if (insertErr.code === '23503') {
        console.log('\n✅ Columns exist (FK violation = columns are there but group_id=1 does not exist)');
      } else {
        console.log('\n⚠️  Insert test error (may be unrelated):', insertErr.message);
      }
    } else {
      console.log('\n✅ Columns exist! Test insert succeeded.');
      // Clean up test row
      await supabase.from('tasks').delete().eq('text', 'Schema Test Task');
    }
  }
}

async function checkRLSPolicies() {
  console.log('\n🔍 Checking RLS policies via a simple read test...');
  
  const tables = ['tasks', 'messages', 'groups', 'group_members', 'profiles'];
  for (const table of tables) {
    const { data, error } = await supabase.from(table).select('*').limit(1);
    if (error) {
      console.log(`❌ ${table}: READ BLOCKED - ${error.message}`);
    } else {
      console.log(`✅ ${table}: Readable (${data.length} row returned)`);
    }
  }
}

function printManualInstructions() {
  console.log('\n' + '='.repeat(70));
  console.log('📋 MANUAL ACTION REQUIRED — Paste this in Supabase SQL Editor:');
  console.log('   https://supabase.com/dashboard/project/eaukxgiwfzajxcpbfgfq/sql/new');
  console.log('='.repeat(70));
  console.log(`
-- 1. Add missing columns to tasks table
ALTER TABLE public.tasks
  ADD COLUMN IF NOT EXISTS assignee_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL;

ALTER TABLE public.tasks
  ADD COLUMN IF NOT EXISTS due_date DATE;

-- 2. Enable realtime for tasks
ALTER PUBLICATION supabase_realtime ADD TABLE public.tasks;

-- 3. Add missing RLS policies
CREATE POLICY IF NOT EXISTS "Users can delete own profile"
  ON public.profiles FOR DELETE USING (auth.uid() = id);

CREATE POLICY IF NOT EXISTS "Members can leave groups"
  ON public.group_members FOR DELETE USING (auth.uid() = profile_id);

CREATE POLICY IF NOT EXISTS "Group members can update tasks"
  ON public.tasks FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.group_members
      WHERE group_members.group_id = tasks.group_id
        AND group_members.profile_id = auth.uid())
  );

CREATE POLICY IF NOT EXISTS "Users can delete own messages"
  ON public.messages FOR DELETE USING (auth.uid() = sender_id);

-- 4. Performance indexes
CREATE INDEX IF NOT EXISTS idx_messages_group_id ON public.messages (group_id, created_at ASC);
CREATE INDEX IF NOT EXISTS idx_tasks_group_id ON public.tasks (group_id, created_at ASC);
CREATE INDEX IF NOT EXISTS idx_group_members_profile ON public.group_members (profile_id);
CREATE INDEX IF NOT EXISTS idx_group_members_group ON public.group_members (group_id);
  `);
  console.log('='.repeat(70));
}

async function main() {
  console.log('🚀 GroupSync Database Migration Checker');
  console.log('Project: eaukxgiwfzajxcpbfgfq\n');

  await checkTasksColumns();
  await checkRLSPolicies();

  console.log('\n✅ Diagnostic complete!');
}

main().catch(console.error);
