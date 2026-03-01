require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing required environment variables');
  process.exit(1);
}

async function testProductionAuth() {
  const email = 'derek@ruffner.io';
  const password = 'helloworld';

  console.log('Testing PRODUCTION authentication for:', email);
  console.log('Supabase URL:', supabaseUrl);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  try {
    // Test with service role to check/update user
    const adminSupabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });

    console.log('\n1. Checking if user exists in auth...');
    const { data: users, error: listError } = await adminSupabase.auth.admin.listUsers();
    
    if (listError) {
      console.error('Error listing users:', listError);
      return;
    }

    const user = users.users.find(u => u.email === email);
    
    if (!user) {
      console.error('❌ User not found in auth!');
      console.log('\nCreating user in production...');
      
      // Create the user
      const { data: newUser, error: createError } = await adminSupabase.auth.admin.createUser({
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
      const { error: updateError } = await adminSupabase.auth.admin.updateUserById(user.id, {
        password: password
      });
      
      if (updateError) {
        console.error('Error updating password:', updateError);
        return;
      } else {
        console.log('✅ Password updated successfully');
      }
    }

    // Now test actual login using anon client
    console.log('\n3. Testing login with anon client (like the app would)...');
    const anonSupabase = createClient(supabaseUrl, supabaseAnonKey);
    
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
      const { data: profile, error: profileError } = await adminSupabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (profileError) {
        console.error('Error checking profile:', profileError);
      } else {
        console.log('✅ Profile exists');
        console.log('  - Account type:', profile.account_type);
        console.log('  - Account status:', profile.account_status);
        console.log('  - Artist name:', profile.artist_name);
      }
    }

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅ Summary:');
    console.log('Email:', email);
    console.log('Password:', password);
    console.log('\nThe user should now be able to log in at: https://truenorthdistro.com/login');

  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

testProductionAuth();