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

async function testAuth() {
  const email = 'derek@ruffner.io';
  const password = 'helloworld';

  console.log('Testing authentication for:', email);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  try {
    // Test with service role client
    console.log('\n1. Checking if user exists in auth...');
    const { data: users, error: listError } = await supabase.auth.admin.listUsers();
    
    if (listError) {
      console.error('Error listing users:', listError);
      return;
    }

    const user = users.users.find(u => u.email === email);
    
    if (!user) {
      console.error('❌ User not found in auth!');
      console.log('\nRunning setup to create user...');
      
      // Create the user
      const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
        email: email,
        password: password,
        email_confirm: true
      });
      
      if (createError) {
        console.error('Error creating user:', createError);
        return;
      }
      
      console.log('✅ User created:', newUser.user.id);
    } else {
      console.log('✅ User exists:', user.id);
      
      // Update password to ensure it's correct
      console.log('\n2. Updating password to ensure it matches...');
      const { error: updateError } = await supabase.auth.admin.updateUserById(user.id, {
        password: password
      });
      
      if (updateError) {
        console.error('Error updating password:', updateError);
      } else {
        console.log('✅ Password updated successfully');
      }
    }

    // Now test actual login using anon client
    console.log('\n3. Testing login with anon client (like the app would)...');
    const anonSupabase = createClient(
      supabaseUrl,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );
    
    const { data: loginData, error: loginError } = await anonSupabase.auth.signInWithPassword({
      email: email,
      password: password
    });

    if (loginError) {
      console.error('❌ Login failed:', loginError.message);
      console.error('Error details:', loginError);
    } else {
      console.log('✅ Login successful!');
      console.log('User ID:', loginData.user.id);
      console.log('Session:', loginData.session ? 'Created' : 'Not created');
    }

    // Check profile
    console.log('\n4. Checking profile...');
    const userId = user ? user.id : loginData?.user?.id;
    
    if (userId) {
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (profileError) {
        if (profileError.code === 'PGRST116') {
          console.log('❌ Profile does not exist');
          
          // Create profile
          console.log('Creating profile...');
          const { data: newProfile, error: createProfileError } = await supabase
            .from('profiles')
            .insert({
              id: userId,
              email: email,
              account_type: 'artist',
              artist_name: 'Alchemi',
              account_status: 'active'
            })
            .select()
            .single();
          
          if (createProfileError) {
            console.error('Error creating profile:', createProfileError);
          } else {
            console.log('✅ Profile created');
          }
        } else {
          console.error('Error checking profile:', profileError);
        }
      } else {
        console.log('✅ Profile exists');
        console.log('  - Account type:', profile.account_type);
        console.log('  - Account status:', profile.account_status);
        console.log('  - Artist name:', profile.artist_name);
      }
    }

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Summary:');
    console.log('Email:', email);
    console.log('Password:', password);
    console.log('\nYou should now be able to log in at: http://localhost:3000/login');

  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

testAuth();