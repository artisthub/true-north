const fetch = require('node-fetch');

async function testDashboard() {
  const baseUrl = 'https://truenorthdistro.com';
  
  console.log('1. Logging in...');
  const loginResponse = await fetch(`${baseUrl}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'derek@ruffner.io',
      password: 'helloworld'
    })
  });
  
  const loginData = await loginResponse.json();
  console.log('Login response:', loginData.success ? 'Success' : 'Failed');
  
  if (!loginData.success) {
    console.error('Login failed:', loginData.error);
    return;
  }
  
  // Extract cookies from login response
  const cookies = loginResponse.headers.raw()['set-cookie'];
  console.log('Received cookies:', cookies ? cookies.length : 0);
  
  // Test /api/user/me
  console.log('\n2. Testing /api/user/me...');
  try {
    const meResponse = await fetch(`${baseUrl}/api/user/me`, {
      headers: {
        'Cookie': cookies ? cookies.join('; ') : ''
      }
    });
    
    console.log('Status:', meResponse.status);
    const meText = await meResponse.text();
    console.log('Response:', meText.substring(0, 200));
  } catch (error) {
    console.error('Error fetching /api/user/me:', error);
  }
  
  // Test /api/user/pitches
  console.log('\n3. Testing /api/user/pitches...');
  try {
    const pitchesResponse = await fetch(`${baseUrl}/api/user/pitches`, {
      headers: {
        'Cookie': cookies ? cookies.join('; ') : ''
      }
    });
    
    const pitchesData = await pitchesResponse.json();
    console.log('Status:', pitchesResponse.status);
    console.log('Response:', JSON.stringify(pitchesData, null, 2));
  } catch (error) {
    console.error('Error fetching /api/user/pitches:', error);
  }
}

testDashboard().catch(console.error);