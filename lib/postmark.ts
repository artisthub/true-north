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