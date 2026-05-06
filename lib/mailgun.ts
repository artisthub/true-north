import FormData from 'form-data';
import Mailgun from 'mailgun.js';

const mailgun = new Mailgun(FormData);

let mg: any = null;

function getClient() {
  if (mg) return mg;
  const apiKey = process.env.MAILGUN_API_KEY;
  const domain = process.env.MAILGUN_DOMAIN;
  if (!apiKey || !domain) return null;
  mg = mailgun.client({ username: 'api', key: apiKey });
  return mg;
}

function getFromEmail(): string {
  return process.env.POSTMARK_FROM_EMAIL || process.env.MAILGUN_FROM_EMAIL || 'noreply@truenorthdistro.com';
}

interface ApplicationEmailData {
  firstName: string;
  lastName: string;
  email: string;
  accountType: 'artist' | 'label';
  entityName: string;
  applicationId: string;
}

interface AcceptedEmailData extends ApplicationEmailData {
  paymentLink: string;
  annualFee: string;
}

interface AdminNewApplicationEmailData {
  firstName: string;
  lastName: string;
  email: string;
  accountType: 'artist' | 'label';
  entityName: string;
  country: string;
  applicationId: string;
}

interface WelcomeRevelatorEmailData {
  firstName: string;
  lastName: string;
  email: string;
  accountType: 'artist' | 'label';
  entityName: string;
}

async function readTemplate(templateName: string): Promise<string> {
  try {
    const fs = await import('fs/promises');
    const path = await import('path');
    const templatePath = path.join(process.cwd(), 'email-templates', templateName);
    return await fs.readFile(templatePath, 'utf-8');
  } catch {
    return '';
  }
}

async function sendMail(to: string, subject: string, html: string, text: string) {
  const client = getClient();
  if (!client) {
    console.warn('Mailgun not configured, skipping email send');
    return;
  }

  try {
    const domain = process.env.MAILGUN_DOMAIN!;
    await client.messages.create(domain, {
      from: getFromEmail(),
      to: [to],
      subject,
      html,
      text,
    });
  } catch (error) {
    console.error('Mailgun send failed:', error);
    throw error;
  }
}

export async function sendApplicationConfirmationEmail(data: ApplicationEmailData) {
  const client = getClient();
  if (!client) {
    console.warn('Mailgun not configured, skipping email send');
    return;
  }

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

  const html = (await readTemplate('application-confirmation.html'))
    .replace(/{{first_name}}/g, data.firstName)
    .replace(/{{last_name}}/g, data.lastName)
    .replace(/{{email}}/g, data.email)
    .replace(/{{account_type}}/g, data.accountType)
    .replace(/{{entity_name}}/g, data.entityName)
    .replace(/{{entity_name_label}}/g, entityNameLabel)
    .replace(/{{application_id}}/g, data.applicationId)
    .replace(/{{submission_date}}/g, submissionDate)
    .replace(/{{application_status_url}}/g, applicationStatusUrl);

  const text = `Application Received - True North

Hi ${data.firstName},

We've received your ${data.accountType} application for ${data.entityName}. Our team will review it within 24-48 hours.

Questions? support@truenorthdistro.com

True North Music Distribution. All rights reserved.`;

  await sendMail(data.email, 'Application Received - True North', html, text);
  console.log('Application confirmation email sent via Mailgun:', data.email);
}

export async function sendApplicationConfirmationEmailInline(data: ApplicationEmailData) {
  return sendApplicationConfirmationEmail(data);
}

export async function sendApplicationAcceptedEmail(data: AcceptedEmailData) {
  const client = getClient();
  if (!client) {
    console.warn('Mailgun not configured, skipping email send');
    return;
  }

  const entityNameLabel = data.accountType === 'artist' ? 'Artist Name' : 'Label Name';

  const html = (await readTemplate('application-accepted.html'))
    .replace(/{{first_name}}/g, data.firstName)
    .replace(/{{last_name}}/g, data.lastName)
    .replace(/{{email}}/g, data.email)
    .replace(/{{account_type}}/g, data.accountType)
    .replace(/{{entity_name}}/g, data.entityName)
    .replace(/{{entity_name_label}}/g, entityNameLabel)
    .replace(/{{annual_fee}}/g, data.annualFee)
    .replace(/{{payment_link}}/g, data.paymentLink);

  const text = `Your True North Application is Approved

Your ${data.accountType} application for ${data.entityName} has been approved.

Account Details:
- Account Type: ${data.accountType}
- ${entityNameLabel}: ${data.entityName}
- Annual Fee: $${data.annualFee}

Complete Payment: ${data.paymentLink}

Please complete payment within 48 hours to secure your spot.

Questions? onboarding@truenorthdistro.com

True North Music Distribution. All rights reserved.`;

  await sendMail(data.email, 'Your True North Application is Approved', html, text);
  console.log('Application accepted email sent via Mailgun:', data.email);
}

export async function sendApplicationAcceptedEmailInline(data: AcceptedEmailData) {
  return sendApplicationAcceptedEmail(data);
}

export async function sendAdminNewApplicationEmail(data: AdminNewApplicationEmailData) {
  const adminEmails = (process.env.ADMIN_NOTIFICATION_EMAIL || '').split(',').map(e => e.trim()).filter(Boolean);
  if (adminEmails.length === 0) {
    console.log('No admin notification emails configured, skipping admin notification');
    return;
  }

  const client = getClient();
  if (!client) {
    console.warn('Mailgun not configured, skipping email send');
    return;
  }

  const submissionDate = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    timeZoneName: 'short'
  });

  const accountTypeLabel = data.accountType === 'artist' ? 'Artist' : 'Label';
  const entityNameLabel = data.accountType === 'artist' ? 'Artist Name' : 'Label Name';
  const adminUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'https://truenorthdistro.com'}/admin`;

  const html = (await readTemplate('admin-new-application.html'))
    .replace(/{{first_name}}/g, data.firstName)
    .replace(/{{last_name}}/g, data.lastName)
    .replace(/{{email}}/g, data.email)
    .replace(/{{account_type}}/g, data.accountType)
    .replace(/{{account_type_label}}/g, accountTypeLabel)
    .replace(/{{entity_name}}/g, data.entityName)
    .replace(/{{entity_name_label}}/g, entityNameLabel)
    .replace(/{{country}}/g, data.country)
    .replace(/{{submission_date}}/g, submissionDate)
    .replace(/{{application_id}}/g, data.applicationId)
    .replace(/{{admin_url}}/g, adminUrl);

  const text = `New ${accountTypeLabel} Application

A new application has been submitted:

Applicant: ${data.firstName} ${data.lastName}
Email: ${data.email}
Account Type: ${data.accountType}
${entityNameLabel}: ${data.entityName}
Country: ${data.country}
Submitted: ${submissionDate}
Application ID: ${data.applicationId}

Review: ${adminUrl}

True North Music Distribution`;

  await sendMail(adminEmails.join(','), `New ${accountTypeLabel} Application - ${data.entityName}`, html, text);
  console.log('Admin new application notification sent via Mailgun:', adminEmails.join(', '));
}

export async function sendAdminNewApplicationEmailInline(data: AdminNewApplicationEmailData) {
  return sendAdminNewApplicationEmail(data);
}

export async function sendWelcomeRevelatorEmail(data: WelcomeRevelatorEmailData) {
  return sendWelcomeRevelatorEmailInline(data);
}

export async function sendWelcomeRevelatorEmailInline(data: WelcomeRevelatorEmailData) {
  const client = getClient();
  if (!client) {
    console.warn('Mailgun not configured, skipping email send');
    return;
  }

  const entityNameLabel = data.accountType === 'artist' ? 'Artist Name' : 'Label Name';
  const dashboardLink = process.env.REVELATOR_WEB_URL || 'https://auth.truenorthdistro.com';

  const html = (await readTemplate('welcome-revelator.html'))
    .replace(/{{first_name}}/g, data.firstName)
    .replace(/{{last_name}}/g, data.lastName)
    .replace(/{{email}}/g, data.email)
    .replace(/{{account_type}}/g, data.accountType)
    .replace(/{{entity_name}}/g, data.entityName)
    .replace(/{{entity_name_label}}/g, entityNameLabel)
    .replace(/{{dashboard_link}}/g, dashboardLink);

  const text = `Your True North Account is Ready!

Hey ${data.firstName},

Your payment has been confirmed and your ${data.entityName} account on True North is now active.

Getting Started:
1. Access Your Dashboard - ${dashboardLink}
2. Create Your First Release - Add your tracks, artwork, and release details
3. Submit for Distribution - Choose your stores and send your music to 150+ platforms worldwide

Quick Tips:
- Have artwork ready (3000x3000px, JPG/PNG)
- Audio files should be WAV (16-bit, 44.1kHz)
- Submit releases at least 4 weeks before release date

Need help? Email: onboarding@truenorthdistro.com

© 2024 True North Music Distribution. All rights reserved.`;

  await sendMail(data.email, 'Your True North Account is Ready - Start Distributing!', html, text);
  console.log('Welcome Revelator email sent via Mailgun:', data.email);
}
