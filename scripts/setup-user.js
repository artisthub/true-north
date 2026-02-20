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

async function setupUser() {
  const email = 'derek@ruffner.io';
  const password = 'helloworld';
  const applicationId = 'a8e49417-85f4-40bb-806f-b1f43d12761c';

  try {
    // First check if user already exists
    const { data: existingUsers, error: listError } = await supabase.auth.admin.listUsers();
    
    if (listError) {
      console.error('Error listing users:', listError);
      return;
    }

    const existingUser = existingUsers.users.find(u => u.email === email);
    
    let userId;
    
    if (existingUser) {
      console.log('User already exists in auth:', existingUser.id);
      userId = existingUser.id;
      
      // Update the user's password
      const { error: updateError } = await supabase.auth.admin.updateUserById(userId, {
        password: password
      });
      
      if (updateError) {
        console.error('Error updating password:', updateError);
      } else {
        console.log('Password updated successfully');
      }
    } else {
      // Create new auth user
      const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
        email: email,
        password: password,
        email_confirm: true
      });

      if (authError) {
        console.error('Error creating auth user:', authError);
        return;
      }

      console.log('New auth user created:', authUser.user.id);
      userId = authUser.user.id;
    }

    // Check if profile exists
    const { data: existingProfile, error: profileCheckError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (profileCheckError && profileCheckError.code !== 'PGRST116') {
      console.error('Error checking profile:', profileCheckError);
      return;
    }

    if (existingProfile) {
      console.log('Profile already exists:', existingProfile.id);
      
      // Update the profile
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          email: email,
          account_type: 'artist',
          artist_name: 'Alchemi',
          application_id: applicationId,
          account_status: 'active'
        })
        .eq('id', userId);
        
      if (updateError) {
        console.error('Error updating profile:', updateError);
      } else {
        console.log('Profile updated');
      }
    } else {
      // Create new profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: userId,
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
        return;
      }

      console.log('Profile created:', profile.id);
    }

    // Update the application with the profile_id
    const { error: updateError } = await supabase
      .from('applications')
      .update({ 
        profile_id: userId,
        status: 'payment_complete'
      })
      .eq('id', applicationId);

    if (updateError) {
      console.error('Error updating application:', updateError);
    } else {
      console.log('Application updated with profile_id');
    }

    console.log('\n✅ User setup complete!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Email:', email);
    console.log('Password:', password);
    console.log('User ID:', userId);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\nThe user can now log in at: http://localhost:3000/login');

  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

setupUser();