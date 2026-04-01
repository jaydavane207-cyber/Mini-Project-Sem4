// Run RLS policy fixes directly via Supabase REST API
// Uses the postgres role via a direct HTTP request to the SQL execution endpoint

const SUPABASE_URL = 'https://eaukxgiwfzajxcpbfgfq.supabase.co';
const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVhdWt4Z2l3ZnphanhjcGJmZ2ZxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQzNTM5NzIsImV4cCI6MjA4OTkyOTk3Mn0.15CZyxuXRtDbeJNkaUfRSTe7c2-YGa7rFiJ_y27pT8o';

// Each policy as a separate statement so we can run/report individually
const policies = [
  {
    name: 'SEC-2: profiles DELETE',
    sql: `CREATE POLICY "Users can delete own profile" ON public.profiles FOR DELETE USING (auth.uid() = id);`
  },
  {
    name: 'SEC-3: group_members DELETE',
    sql: `CREATE POLICY "Members can leave groups" ON public.group_members FOR DELETE USING (auth.uid() = profile_id);`
  },
  {
    name: 'SEC-4: tasks UPDATE',
    sql: `CREATE POLICY "Group members can update tasks" ON public.tasks FOR UPDATE USING (EXISTS (SELECT 1 FROM public.group_members WHERE group_members.group_id = tasks.group_id AND group_members.profile_id = auth.uid()));`
  },
  {
    name: 'SEC-5: messages DELETE',
    sql: `CREATE POLICY "Users can delete own messages" ON public.messages FOR DELETE USING (auth.uid() = sender_id);`
  }
];

async function runPolicy(policy) {
  // Supabase's REST API doesn't allow DDL via anon key
  // Try the pg-meta endpoint (requires service_role)
  const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/`, {
    method: 'POST',
    headers: {
      'apikey': ANON_KEY,
      'Authorization': `Bearer ${ANON_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ query: policy.sql })
  });
  const text = await res.text();
  return { status: res.status, body: text };
}

console.log('Testing Supabase connection and permissions...\n');

(async () => {
  for (const policy of policies) {
    try {
      const result = await runPolicy(policy);
      console.log(`[${policy.name}] Status: ${result.status}`);
      console.log(`  Response: ${result.body.substring(0, 200)}\n`);
    } catch (err) {
      console.log(`[${policy.name}] Error: ${err.message}\n`);
    }
  }
  
  // Check if we can at least read from profiles (anon access check)
  console.log('--- Checking anon access to profiles table ---');
  const checkRes = await fetch(`${SUPABASE_URL}/rest/v1/profiles?select=id&limit=1`, {
    headers: {
      'apikey': ANON_KEY,
      'Authorization': `Bearer ${ANON_KEY}`
    }
  });
  console.log(`Profiles endpoint status: ${checkRes.status}`);
  console.log(`Response: ${await checkRes.text()}`);
  
  console.log('\n--- Conclusion ---');
  console.log('DDL statements (CREATE POLICY) require the service_role key.');
  console.log('The anon key cannot execute DDL. Use the Supabase Dashboard SQL Editor directly.');
})();
