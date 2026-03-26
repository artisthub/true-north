import * as postmark from './postmark';
import * as mailgun from './mailgun';

type AsyncVoidFn = (...args: any[]) => Promise<any>;

interface EmailProvider {
  sendApplicationConfirmationEmail: AsyncVoidFn;
  sendApplicationConfirmationEmailInline: AsyncVoidFn;
  sendApplicationAcceptedEmail: AsyncVoidFn;
  sendApplicationAcceptedEmailInline: AsyncVoidFn;
  sendWelcomeRevelatorEmail: AsyncVoidFn;
  sendWelcomeRevelatorEmailInline: AsyncVoidFn;
}

const provider = process.env.EMAIL_PROVIDER || 'postmark';

const email: EmailProvider = provider === 'mailgun' ? mailgun : postmark;

export const sendApplicationConfirmationEmail = email.sendApplicationConfirmationEmail;
export const sendApplicationConfirmationEmailInline = email.sendApplicationConfirmationEmailInline;
export const sendApplicationAcceptedEmail = email.sendApplicationAcceptedEmail;
export const sendApplicationAcceptedEmailInline = email.sendApplicationAcceptedEmailInline;
export const sendWelcomeRevelatorEmail = email.sendWelcomeRevelatorEmail;
export const sendWelcomeRevelatorEmailInline = email.sendWelcomeRevelatorEmailInline;
