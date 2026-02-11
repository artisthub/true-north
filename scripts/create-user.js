require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing required environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function createUser() {
  const email = 'derek@ruffner.io';
  const password = 'mhe_NPF@xmz.bvq8yqn';
  const applicationId = 'a8e49417-85f4-40bb-806f-b1f43d12761c';

  try {
    // Create the user in Supabase Auth
    const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
      email: email,
      password: password,
      email_confirm: true // Auto-confirm the email
    });

    if (authError) {
      console.error('Error creating auth user:', authError);
      return;
    }

    console.log('Auth user created:', authUser.user.id);

    // Create the profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: authUser.user.id,
        email: email,
        account_type: 'artist',
        artist_name: 'Alchemi',
        application_id: applicationId,
        account_status: 'active'
      })
      .select()
      .single();

    if (profileError) {
      console.error('Error creating profile:', profileError);
      // Try to clean up the auth user if profile creation fails
      await supabase.auth.admin.deleteUser(authUser.user.id);
      return;
    }

    console.log('Profile created:', profile.id);

    // Update the application with the profile_id
    const { error: updateError } = await supabase
      .from('applications')
      .update({ 
        profile_id: authUser.user.id,
        status: 'payment_complete' // Mark as fully complete
      })
      .eq('id', applicationId);

    if (updateError) {
      console.error('Error updating application:', updateError);
    } else {
      console.log('Application updated with profile_id');
    }

    console.log('\n✅ User successfully created!');
    console.log('Email:', email);
    console.log('Password:', password);
    console.log('User ID:', authUser.user.id);
    console.log('\nThe user can now log in at /login');

  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

createUser();