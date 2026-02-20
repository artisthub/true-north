import * as postmark from "postmark";

// Initialize Postmark client only if token is provided
const client = process.env.POSTMARK_SERVER_TOKEN 
  ? new postmark.ServerClient(process.env.POSTMARK_SERVER_TOKEN) 
  : null;

interface ApplicationEmailData {
  firstName: string;
  lastName: string;
  email: string;
  accountType: 'artist' | 'label';
  entityName: string; // Artist name or Label name
  applicationId: string;
}

interface AcceptedEmailData extends ApplicationEmailData {
  paymentLink: string;
  annualFee: string;
}

export async function sendApplicationConfirmationEmail(data: ApplicationEmailData) {
  if (!client) {
    console.warn('Postmark server token not configured, skipping email send');
    return;
  }

  try {
    const submissionDate = new Date().toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      timeZoneName: 'short'
    });

    const entityNameLabel = data.accountType === 'artist' ? 'Artist Name' : 'Label Name';
    const applicationStatusUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'https://truenorth.com'}/application/status/${data.applicationId}`;

    const result = await client.sendEmailWithTemplate({
      "From": process.env.POSTMARK_FROM_EMAIL || "noreply@truenorth.com",
      "To": data.email,
      "TemplateAlias": "application-confirmation", // or use TemplateId if you have the numeric ID
      "TemplateModel": {
        first_name: data.firstName,
        last_name: data.lastName,
        email: data.email,
        account_type: data.accountType,
        entity_name: data.entityName,
        entity_name_label: entityNameLabel,
        application_id: data.applicationId,
        submission_date: submissionDate,
        application_status_url: applicationStatusUrl
      },
      "MessageStream": "outbound"
    });

    console.log('Application confirmation email sent successfully:', result.MessageID);
    return result;
  } catch (error) {
    console.error('Failed to send application confirmation email:', error);
    throw error;
  }
}

// Alternative: Send using inline HTML (if template not yet uploaded to Postmark)
export async function sendApplicationConfirmationEmailInline(data: ApplicationEmailData) {
  if (!client) {
    console.warn('Postmark server token not configured, skipping email send');
    return;
  }

  try {
    let htmlTemplate = '';
    
    // Try to read HTML template if it exists
    try {
      const fs = await import('fs/promises');
      const path = await import('path');
      const templatePath = path.join(process.cwd(), 'email-templates', 'application-confirmation.html');
      htmlTemplate = await fs.readFile(templatePath, 'utf-8');
    } catch (fileError) {
      console.warn('Could not read email template file, using fallback HTML');
      // Use a simple fallback HTML template
      htmlTemplate = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Application Received - True North</title>
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #FF1493 0%, #FF69B4 100%); padding: 40px 20px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0;">True North</h1>
            <p style="color: white; margin: 10px 0 0 0;">Music Distribution</p>
          </div>
          
          <div style="background: #f9f9f9; padding: 40px 20px; border-radius: 0 0 10px 10px;">
            <h2>Application Received!</h2>
            <p>Hi {{first_name}},</p>
            <p>Thank you for applying to join True North's exclusive roster. We've received your <strong>{{account_type}}</strong> application and our team is reviewing it carefully.</p>
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin-top: 0;">Application Details</h3>
              <p><strong>Application ID:</strong> #{{application_id}}</p>
              <p><strong>Account Type:</strong> {{account_type}}</p>
              <p><strong>{{entity_name_label}}:</strong> {{entity_name}}</p>
              <p><strong>Submitted:</strong> {{submission_date}}</p>
            </div>
            
            <h3>What Happens Next?</h3>
            <ol>
              <li><strong>Application Review:</strong> Our team reviews your application within 24-48 hours</li>
              <li><strong>Decision Email:</strong> You'll receive an email with our decision and next steps</li>
              <li><strong>Onboarding:</strong> If approved, you'll receive setup instructions and access credentials</li>
            </ol>
            
            <p>Have questions? Contact us at <a href="mailto:support@truenorth.com">support@truenorth.com</a></p>
          </div>
          
          <div style="text-align: center; margin-top: 30px; color: #999; font-size: 14px;">
            <p>© 2024 True North Music Distribution. All rights reserved.</p>
          </div>
        </body>
        </html>
      `;
    }
    
    // Replace variables
    const submissionDate = new Date().toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      timeZoneName: 'short'
    });

    const entityNameLabel = data.accountType === 'artist' ? 'Artist Name' : 'Label Name';
    const applicationStatusUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'https://truenorth.com'}/application/status/${data.applicationId}`;
    
    // Replace placeholders in HTML
    htmlTemplate = htmlTemplate
      .replace(/{{first_name}}/g, data.firstName)
      .replace(/{{last_name}}/g, data.lastName)
      .replace(/{{email}}/g, data.email)
      .replace(/{{account_type}}/g, data.accountType)
      .replace(/{{entity_name}}/g, data.entityName)
      .replace(/{{entity_name_label}}/g, entityNameLabel)
      .replace(/{{application_id}}/g, data.applicationId)
      .replace(/{{submission_date}}/g, submissionDate)
      .replace(/{{application_status_url}}/g, applicationStatusUrl);

    const result = await client.sendEmail({
      "From": process.env.POSTMARK_FROM_EMAIL || "noreply@truenorth.com",
      "To": data.email,
      "Subject": "Application Received - Welcome to True North! 🎵",
      "HtmlBody": htmlTemplate,
      "TextBody": `Application Received - True North

Hi ${data.firstName},

Thank you for applying to join True North's exclusive roster. We've received your ${data.accountType} application and our team is reviewing it carefully.

Application Details:
- Application ID: #${data.applicationId}
- Account Type: ${data.accountType}
- ${entityNameLabel}: ${data.entityName}
- Submitted: ${submissionDate}

What Happens Next?

1. Application Review
   Our team reviews your application within 24-48 hours

2. Decision Email
   You'll receive an email with our decision and next steps

3. Onboarding
   If approved, you'll receive setup instructions and access credentials

Check your application status: ${applicationStatusUrl}

Have questions about your application?
Contact us at support@truenorth.com

© 2024 True North Music Distribution. All rights reserved.
Your music deserves the best distribution.`,
      "MessageStream": "outbound"
    });

    console.log('Application confirmation email sent successfully:', result.MessageID);
    return result;
  } catch (error) {
    console.error('Failed to send application confirmation email:', error);
    throw error;
  }
}

// Send application accepted email
export async function sendApplicationAcceptedEmail(data: AcceptedEmailData) {
  if (!client) {
    console.warn('Postmark server token not configured, skipping email send');
    return;
  }

  try {
    const entityNameLabel = data.accountType === 'artist' ? 'Artist Name' : 'Label Name';

    const result = await client.sendEmailWithTemplate({
      "From": process.env.POSTMARK_FROM_EMAIL || "noreply@truenorth.com",
      "To": data.email,
      "TemplateAlias": "application-accepted",
      "TemplateModel": {
        first_name: data.firstName,
        last_name: data.lastName,
        email: data.email,
        account_type: data.accountType,
        entity_name: data.entityName,
        entity_name_label: entityNameLabel,
        annual_fee: data.annualFee,
        payment_link: data.paymentLink
      },
      "MessageStream": "outbound"
    });

    console.log('Application accepted email sent successfully:', result.MessageID);
    return result;
  } catch (error) {
    console.error('Failed to send application accepted email:', error);
    throw error;
  }
}

// Send application accepted email with inline HTML
export async function sendApplicationAcceptedEmailInline(data: AcceptedEmailData) {
  if (!client) {
    console.warn('Postmark server token not configured, skipping email send');
    return;
  }

  try {
    let htmlTemplate = '';
    
    // Try to read HTML template if it exists
    try {
      const fs = await import('fs/promises');
      const path = await import('path');
      const templatePath = path.join(process.cwd(), 'email-templates', 'application-accepted.html');
      htmlTemplate = await fs.readFile(templatePath, 'utf-8');
    } catch (fileError) {
      console.warn('Could not read accepted email template file, using fallback HTML');
      // Use a simple fallback HTML template
      htmlTemplate = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Application Approved - True North</title>
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #FF1493 0%, #FF69B4 100%); padding: 40px 20px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0;">🎉 Congratulations!</h1>
            <p style="color: white; margin: 10px 0 0 0; font-size: 20px;">Welcome to True North</p>
          </div>
          
          <div style="background: #f9f9f9; padding: 40px 20px; border-radius: 0 0 10px 10px;">
            <h2>Your Application is Approved!</h2>
            <p>Dear {{first_name}},</p>
            <p>We're thrilled to inform you that your <strong>{{account_type}}</strong> application has been <strong>APPROVED</strong>!</p>
            <p>Welcome to True North's exclusive roster. We're excited to partner with <strong>{{entity_name}}</strong>.</p>
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin-top: 0;">Your Account Details</h3>
              <p><strong>Account Type:</strong> {{account_type}}</p>
              <p><strong>{{entity_name_label}}:</strong> {{entity_name}}</p>
              <p><strong>Email:</strong> {{email}}</p>
              <p><strong>Annual Fee:</strong> ${{annual_fee}}</p>
            </div>
            
            <h3>Complete Your Setup</h3>
            <ol>
              <li><strong>Complete Payment:</strong> Pay your annual fee to activate your account</li>
              <li><strong>Account Activation:</strong> Receive your login credentials</li>
              <li><strong>Start Distributing:</strong> Upload your music to 150+ platforms</li>
            </ol>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="{{payment_link}}" style="background: linear-gradient(135deg, #FF1493 0%, #FF69B4 100%); color: #fff; padding: 15px 40px; text-decoration: none; border-radius: 25px; display: inline-block; font-weight: bold; font-size: 18px;">
                Complete Payment →
              </a>
            </div>
            
            <p style="text-align: center; color: #666;">⏰ Please complete payment within 48 hours to secure your spot</p>
            
            <p>Questions? Contact us at <a href="mailto:onboarding@truenorth.com">onboarding@truenorth.com</a></p>
          </div>
          
          <div style="text-align: center; margin-top: 30px; color: #999; font-size: 14px;">
            <p>© 2024 True North Music Distribution. All rights reserved.<br>Welcome to the family! 🎵</p>
          </div>
        </body>
        </html>
      `;
    }
    
    // Replace variables
    const entityNameLabel = data.accountType === 'artist' ? 'Artist Name' : 'Label Name';
    
    // Replace placeholders in HTML
    htmlTemplate = htmlTemplate
      .replace(/{{first_name}}/g, data.firstName)
      .replace(/{{last_name}}/g, data.lastName)
      .replace(/{{email}}/g, data.email)
      .replace(/{{account_type}}/g, data.accountType)
      .replace(/{{entity_name}}/g, data.entityName)
      .replace(/{{entity_name_label}}/g, entityNameLabel)
      .replace(/{{annual_fee}}/g, data.annualFee)
      .replace(/{{payment_link}}/g, data.paymentLink);

    const result = await client.sendEmail({
      "From": process.env.POSTMARK_FROM_EMAIL || "noreply@truenorth.com",
      "To": data.email,
      "Subject": "🎉 Congratulations! Your True North Application is Approved!",
      "HtmlBody": htmlTemplate,
      "TextBody": `Congratulations - Your True North Application is Approved!

Dear ${data.firstName},

We're thrilled to inform you that your ${data.accountType} application has been APPROVED!

Welcome to True North's exclusive roster of artists and labels. We're excited to partner with ${data.entityName} and help you reach new heights in music distribution.

Your Account Details:
- Account Type: ${data.accountType}
- ${entityNameLabel}: ${data.entityName}
- Account Email: ${data.email}
- Annual Fee: $${data.annualFee}

Complete Your Setup:

1. Complete Payment
   Click the link below to pay your annual fee and activate your account

2. Account Activation
   Once payment is confirmed, you'll receive your login credentials

3. Start Distributing
   Upload your music and start distributing to 150+ platforms worldwide

Complete Payment: ${data.paymentLink}

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

    console.log('Application accepted email sent successfully:', result.MessageID);
    return result;
  } catch (error) {
    console.error('Failed to send application accepted email:', error);
    throw error;
  }
}
