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
    const { professor } = await req.json()

    if (!professor || !professor.email || !professor.password || !professor.name) {
      return new Response(JSON.stringify({ error: 'Professor details are required' }), {
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
      email: professor.email,
      password: professor.password,
      email_confirm: true, // Automatically confirm the email
    })

    if (authError) {
      throw authError
    }

    const userId = authData.user.id

    // 2. Create the professor profile
    const { error: professorError } = await supabaseAdmin.from('teachers').insert({
      id: userId,
      name: professor.name,
      email: professor.email,
      subjects: professor.subjects,
      classes: professor.classes,
    })

    if (professorError) {
      // If profile creation fails, delete the auth user to avoid orphans
      await supabaseAdmin.auth.admin.deleteUser(userId)
      throw professorError
    }

    return new Response(JSON.stringify({ message: 'Professor created successfully' }), {
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