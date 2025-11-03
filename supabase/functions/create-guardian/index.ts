import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { guardian, students } = await req.json()

    if (!guardian || !guardian.email || !guardian.password || !guardian.name) {
      return new Response(JSON.stringify({ error: 'Guardian details are required' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      })
    }

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // 1. Create the authentication user
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: guardian.email,
      password: guardian.password,
      email_confirm: true, // Automatically confirm the email
    })

    if (authError) {
      throw authError
    }

    const userId = authData.user.id

    // 2. Create the guardian profile
    const { error: guardianError } = await supabaseAdmin.from('guardians').insert({
      id: userId,
      name: guardian.name,
      email: guardian.email,
      phone: guardian.phone,
      due_date_day: guardian.dueDateDay,
    })

    if (guardianError) {
      // If profile creation fails, delete the auth user to avoid orphans
      await supabaseAdmin.auth.admin.deleteUser(userId)
      throw guardianError
    }

    // 3. Create and link students
    if (students && students.length > 0) {
      const studentsToInsert = students.map((s: any) => ({
        name: s.name,
        class_name: s.class,
        guardian_id: userId,
      }))
      const { error: studentError } = await supabaseAdmin.from('students').insert(studentsToInsert)
      if (studentError) {
        // In a real-world scenario, you might want a transaction here.
        throw studentError
      }
    }

    return new Response(JSON.stringify({ message: 'Guardian created successfully' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: { message: error.message } }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})