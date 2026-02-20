require('dotenv').config({ path: '.env.local' });
const postmark = require('postmark');

// Initialize Postmark client
const client = new postmark.ServerClient(process.env.POSTMARK_SERVER_TOKEN);

async function testEmailSending() {
  console.log('Testing Postmark email sending...');
  console.log('Server Token:', process.env.POSTMARK_SERVER_TOKEN ? '✓ Configured' : '✗ Missing');
  console.log('From Email:', process.env.POSTMARK_FROM_EMAIL || 'Not configured');

  try {
    // Test 1: Simple test email
    console.log('\n1. Sending simple test email...');
    const testResult = await client.sendEmail({
      "From": process.env.POSTMARK_FROM_EMAIL || "derek@artisthub.io",
      "To": "derek@ruffner.io",
      "Subject": "Test Email from True North",
      "HtmlBody": "<h1>Test Email</h1><p>This is a test email from your True North application to verify Postmark integration is working.</p>",
      "TextBody": "Test Email\n\nThis is a test email from your True North application to verify Postmark integration is working.",
      "MessageStream": "outbound"
    });
    console.log('✓ Test email sent successfully!');
    console.log('  Message ID:', testResult.MessageID);

    // Test 2: Application confirmation email
    console.log('\n2. Sending application confirmation email...');
    
    // Read HTML template
    const fs = require('fs');
    const path = require('path');
    let htmlTemplate = fs.readFileSync(
      path.join(__dirname, '..', 'email-templates', 'application-confirmation.html'),
      'utf-8'
    );

    // Replace placeholders
    const testData = {
      firstName: 'Derek',
      lastName: 'Ruffner',
      email: 'derek@ruffner.io',
      accountType: 'artist',
      entityName: 'Alchemi',
      applicationId: 'TEST-' + Date.now(),
      submissionDate: new Date().toLocaleString()
    };

    htmlTemplate = htmlTemplate
      .replace(/{{first_name}}/g, testData.firstName)
      .replace(/{{last_name}}/g, testData.lastName)
      .replace(/{{email}}/g, testData.email)
      .replace(/{{account_type}}/g, testData.accountType)
      .replace(/{{entity_name}}/g, testData.entityName)
      .replace(/{{entity_name_label}}/g, 'Artist Name')
      .replace(/{{application_id}}/g, testData.applicationId)
      .replace(/{{submission_date}}/g, testData.submissionDate)
      .replace(/{{application_status_url}}/g, 'https://truenorth.com/application/status/' + testData.applicationId);

    const confirmationResult = await client.sendEmail({
      "From": process.env.POSTMARK_FROM_EMAIL || "derek@artisthub.io",
      "To": "derek@ruffner.io",
      "Subject": "Application Received - Welcome to True North! 🎵",
      "HtmlBody": htmlTemplate,
      "TextBody": `Application Received - True North

Hi ${testData.firstName},

Thank you for applying to join True North's exclusive roster. We've received your ${testData.accountType} application and our team is reviewing it carefully.

Application Details:
- Application ID: #${testData.applicationId}
- Account Type: ${testData.accountType}
- Artist Name: ${testData.entityName}
- Submitted: ${testData.submissionDate}

What Happens Next?

1. Application Review
   Our team reviews your application within 24-48 hours

2. Decision Email
   You'll receive an email with our decision and next steps

3. Onboarding
   If approved, you'll receive setup instructions and access credentials

Have questions about your application?
Contact us at support@truenorth.com

© 2024 True North Music Distribution. All rights reserved.
Your music deserves the best distribution.`,
      "MessageStream": "outbound"
    });
    console.log('✓ Application confirmation email sent successfully!');
    console.log('  Message ID:', confirmationResult.MessageID);

    // Test 3: Application accepted email
    console.log('\n3. Sending application accepted email...');
    
    let acceptedHtmlTemplate = fs.readFileSync(
      path.join(__dirname, '..', 'email-templates', 'application-accepted.html'),
      'utf-8'
    );

    const acceptedData = {
      firstName: 'Derek',
      lastName: 'Ruffner',
      email: 'derek@ruffner.io',
      accountType: 'artist',
      entityName: 'Alchemi',
      annualFee: '999',
      paymentLink: 'https://truenorth.com/payment?id=TEST-' + Date.now()
    };

    acceptedHtmlTemplate = acceptedHtmlTemplate
      .replace(/{{first_name}}/g, acceptedData.firstName)
      .replace(/{{last_name}}/g, acceptedData.lastName)
      .replace(/{{email}}/g, acceptedData.email)
      .replace(/{{account_type}}/g, acceptedData.accountType)
      .replace(/{{entity_name}}/g, acceptedData.entityName)
      .replace(/{{entity_name_label}}/g, 'Artist Name')
      .replace(/{{annual_fee}}/g, acceptedData.annualFee)
      .replace(/{{payment_link}}/g, acceptedData.paymentLink);

    const acceptedResult = await client.sendEmail({
      "From": process.env.POSTMARK_FROM_EMAIL || "derek@artisthub.io",
      "To": "derek@ruffner.io",
      "Subject": "🎉 Congratulations! Your True North Application is Approved!",
      "HtmlBody": acceptedHtmlTemplate,
      "TextBody": `Congratulations - Your True North Application is Approved!

Dear ${acceptedData.firstName},

We're thrilled to inform you that your ${acceptedData.accountType} application has been APPROVED!

Welcome to True North's exclusive roster of artists and labels. We're excited to partner with ${acceptedData.entityName} and help you reach new heights in music distribution.

Your Account Details:
- Account Type: ${acceptedData.accountType}
- Artist Name: ${acceptedData.entityName}
- Account Email: ${acceptedData.email}
- Annual Fee: $${acceptedData.annualFee}

Complete Your Setup:

1. Complete Payment
   Click the link below to pay your annual fee and activate your account

2. Account Activation
   Once payment is confirmed, you'll receive your login credentials

3. Start Distributing
   Upload your music and start distributing to 150+ platforms worldwide

Complete Payment: ${acceptedData.paymentLink}

⏰ Please complete payment within 48 hours to secure your spot

What's Included:
✅ Distribution to 150+ platforms worldwide
✅ 100% of your royalties - we never take a cut
✅ Real-time analytics and reporting
✅ YouTube Content ID and monetization
✅ Dedicated support team
✅ Unlimited releases and re-uploads

Questions about getting started?
Email: onboarding@truenorth.com

© 2024 True North Music Distribution. All rights reserved.
Welcome to the family! 🎵`,
      "MessageStream": "outbound"
    });
    console.log('✓ Application accepted email sent successfully!');
    console.log('  Message ID:', acceptedResult.MessageID);

    console.log('\n✅ All email tests completed successfully!');
    console.log('\nEmails have been sent to: derek@ruffner.io');
    console.log('Please check your inbox to verify the emails were received correctly.');

  } catch (error) {
    console.error('\n❌ Error sending email:');
    console.error('  Message:', error.message);
    if (error.code) console.error('  Error Code:', error.code);
    if (error.statusCode) console.error('  Status Code:', error.statusCode);
    console.error('\nFull error:', error);
    
    console.log('\nTroubleshooting tips:');
    console.log('1. Verify POSTMARK_SERVER_TOKEN is correct in .env.local');
    console.log('2. Ensure POSTMARK_FROM_EMAIL domain is verified in Postmark');
    console.log('3. Check Postmark dashboard for any account issues');
  }
}

testEmailSending();