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

interface WelcomeRevelatorEmailData {
  firstName: string;
  lastName: string;
  email: string;
  accountType: 'artist' | 'label';
  entityName: string;
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
    const applicationStatusUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'https://truenorthdistro.com'}/application/status/${data.applicationId}`;

    const result = await client.sendEmailWithTemplate({
      "From": process.env.POSTMARK_FROM_EMAIL || "noreply@truenorthdistro.com",
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
            <h1 style="color: white; margin: 0;">TRUE NORTH</h1>
            <p style="color: white; margin: 8px 0 0 0; font-size: 14px; letter-spacing: 2px;">MUSIC DISTRIBUTION</p>
          </div>
          <div style="background: #f9f9f9; padding: 40px 20px; border-radius: 0 0 10px 10px;">
            <h2 style="text-align: center;">Application Received</h2>
            <p style="text-align: center;">Hi {{first_name}}, we've received your {{account_type}} application for <strong>{{entity_name}}</strong>. Our team will review it within 24-48 hours.</p>
            <p style="text-align: center; color: #666;">Questions? <a href="mailto:support@truenorthdistro.com">support@truenorthdistro.com</a></p>
          </div>
          <div style="text-align: center; margin-top: 20px; color: #999; font-size: 14px;">
            <p>True North Music Distribution. All rights reserved.</p>
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
    const applicationStatusUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'https://truenorthdistro.com'}/application/status/${data.applicationId}`;
    
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
      "From": process.env.POSTMARK_FROM_EMAIL || "noreply@truenorthdistro.com",
      "To": data.email,
      "Subject": "Application Received - True North",
      "HtmlBody": htmlTemplate,
      "TextBody": `Application Received - True North

Hi ${data.firstName},

We've received your ${data.accountType} application for ${data.entityName}. Our team will review it within 24-48 hours.

Questions? support@truenorthdistro.com

True North Music Distribution. All rights reserved.`,
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
      "From": process.env.POSTMARK_FROM_EMAIL || "noreply@truenorthdistro.com",
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
            <h1 style="color: white; margin: 0;">TRUE NORTH</h1>
            <p style="color: white; margin: 8px 0 0 0; font-size: 14px; letter-spacing: 2px;">MUSIC DISTRIBUTION</p>
          </div>
          
          <div style="background: #f9f9f9; padding: 40px 20px; border-radius: 0 0 10px 10px;">
            <h2 style="text-align: center;">Your Application is Approved</h2>
            <p style="text-align: center;">Your {{account_type}} application for <strong>{{entity_name}}</strong> has been approved. Complete your payment below to activate your account.</p>
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 5px 0;"><strong>Account Type:</strong> {{account_type}}</p>
              <p style="margin: 5px 0;"><strong>{{entity_name_label}}:</strong> {{entity_name}}</p>
              <p style="margin: 5px 0;"><strong>Annual Fee:</strong> \${{annual_fee}}</p>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="{{payment_link}}" style="background: linear-gradient(135deg, #FF1493 0%, #FF69B4 100%); color: #fff; padding: 14px 40px; text-decoration: none; border-radius: 25px; display: inline-block; font-weight: bold; font-size: 16px;">
                Complete Payment
              </a>
            </div>
            
            <p style="text-align: center; color: #666;">Please complete payment within <strong>48 hours</strong> to secure your spot.</p>
            <p style="text-align: center; color: #666;">Questions? <a href="mailto:onboarding@truenorthdistro.com">onboarding@truenorthdistro.com</a></p>
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
      "From": process.env.POSTMARK_FROM_EMAIL || "noreply@truenorthdistro.com",
      "To": data.email,
      "Subject": "Your True North Application is Approved",
      "HtmlBody": htmlTemplate,
      "TextBody": `Your True North Application is Approved

Your ${data.accountType} application for ${data.entityName} has been approved.

Account Details:
- Account Type: ${data.accountType}
- ${entityNameLabel}: ${data.entityName}
- Annual Fee: $${data.annualFee}

Complete Payment: ${data.paymentLink}

Please complete payment within 48 hours to secure your spot.

Questions? onboarding@truenorthdistro.com

True North Music Distribution. All rights reserved.`,
      "MessageStream": "outbound"
    });

    console.log('Application accepted email sent successfully:', result.MessageID);
    return result;
  } catch (error) {
    console.error('Failed to send application accepted email:', error);
    throw error;
  }
}

export async function sendWelcomeRevelatorEmail(data: WelcomeRevelatorEmailData) {
  if (!client) {
    console.warn('Postmark server token not configured, skipping email send');
    return;
  }

  try {
    const entityNameLabel = data.accountType === 'artist' ? 'Artist Name' : 'Label Name';

    const result = await client.sendEmailWithTemplate({
      "From": process.env.POSTMARK_FROM_EMAIL || "noreply@truenorthdistro.com",
      "To": data.email,
      "TemplateAlias": "welcome-revelator",
      "TemplateModel": {
        first_name: data.firstName,
        last_name: data.lastName,
        email: data.email,
        account_type: data.accountType,
        entity_name: data.entityName,
        entity_name_label: entityNameLabel,
        dashboard_link: process.env.REVELATOR_WEB_URL || 'https://auth.truenorthdistro.com',
      },
      "MessageStream": "outbound"
    });

    console.log('Welcome Revelator email sent successfully:', result.MessageID);
    return result;
  } catch (error) {
    console.error('Failed to send welcome Revelator email:', error);
    throw error;
  }
}

export async function sendWelcomeRevelatorEmailInline(data: WelcomeRevelatorEmailData) {
  if (!client) {
    console.warn('Postmark server token not configured, skipping email send');
    return;
  }

  try {
    let htmlTemplate = '';

    try {
      const fs = await import('fs/promises');
      const path = await import('path');
      const templatePath = path.join(process.cwd(), 'email-templates', 'welcome-revelator.html');
      htmlTemplate = await fs.readFile(templatePath, 'utf-8');
    } catch {
      console.warn('Could not read welcome Revelator email template, using fallback HTML');
      htmlTemplate = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Your True North Account is Ready!</title>
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #FF1493 0%, #FF69B4 100%); padding: 40px 20px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0;">True North</h1>
            <p style="color: white; margin: 10px 0 0 0;">Music Distribution</p>
          </div>
          <div style="background: #f9f9f9; padding: 40px 20px; border-radius: 0 0 10px 10px;">
            <h2>Your Account is Ready!</h2>
            <p>Hey {{first_name}},</p>
            <p>Your payment has been confirmed and your <strong>{{entity_name}}</strong> account is now <strong>active</strong>.</p>
            <p>You're being redirected to the distribution dashboard where you can start uploading your music. If you weren't redirected, click the button below.</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="{{dashboard_link}}" style="background: linear-gradient(135deg, #FF1493 0%, #FF69B4 100%); color: #fff; padding: 15px 40px; text-decoration: none; border-radius: 25px; display: inline-block; font-weight: bold; font-size: 18px;">
                Open Distribution Dashboard
              </a>
            </div>
            <p>Questions? Contact us at <a href="mailto:onboarding@truenorthdistro.com">onboarding@truenorthdistro.com</a></p>
          </div>
          <div style="text-align: center; margin-top: 30px; color: #999; font-size: 14px;">
            <p>&copy; 2024 True North Music Distribution. All rights reserved.</p>
          </div>
        </body>
        </html>
      `;
    }

    const entityNameLabel = data.accountType === 'artist' ? 'Artist Name' : 'Label Name';

    htmlTemplate = htmlTemplate
      .replace(/{{first_name}}/g, data.firstName)
      .replace(/{{last_name}}/g, data.lastName)
      .replace(/{{email}}/g, data.email)
      .replace(/{{account_type}}/g, data.accountType)
      .replace(/{{entity_name}}/g, data.entityName)
      .replace(/{{entity_name_label}}/g, entityNameLabel)
      .replace(/{{dashboard_link}}/g, process.env.REVELATOR_WEB_URL || 'https://auth.truenorthdistro.com');

    const result = await client.sendEmail({
      "From": process.env.POSTMARK_FROM_EMAIL || "noreply@truenorthdistro.com",
      "To": data.email,
      "Subject": "Your True North Account is Ready - Start Distributing!",
      "HtmlBody": htmlTemplate,
      "TextBody": `Your True North Account is Ready!

Hey ${data.firstName},

Your payment has been confirmed and your ${data.entityName} account on True North is now active.

---
ACTION REQUIRED: Submit Your VEVO Form
---
To complete your onboarding, please fill out the VEVO submission form:
https://docs.google.com/forms/d/e/1FAIpQLSdfOcXaajwCXEtxH4LLEHh-Kg_V0pGwTODuWoGIHuZU-dO_mA/viewform?usp=publish-editor

Getting Started:

1. Access Your Dashboard
   You'll be redirected automatically after payment. If not, go to:
   ${process.env.REVELATOR_WEB_URL || 'https://auth.truenorthdistro.com'}

2. Create Your First Release
   Add your tracks, artwork, and release details

3. Submit for Distribution
   Choose your stores and send your music to 150+ platforms worldwide

Quick Tips:
- Have artwork ready (3000x3000px, JPG/PNG)
- Audio files should be WAV (16-bit, 44.1kHz)
- Submit releases at least 4 weeks before release date

Need help?
Email: onboarding@truenorthdistro.com

© 2024 True North Music Distribution. All rights reserved.`,
      "MessageStream": "outbound"
    });

    console.log('Welcome Revelator email sent successfully:', result.MessageID);
    return result;
  } catch (error) {
    console.error('Failed to send welcome Revelator email:', error);
    throw error;
  }
}
