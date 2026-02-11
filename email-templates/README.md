# True North Email Templates

This directory contains email templates for True North's automated email communications using Postmark.

## Templates

### 1. Application Confirmation (`application-confirmation`)
Sent automatically when a user submits an application to join True North.

**Features:**
- Modern gradient design matching True North's brand
- Application details summary
- Timeline of next steps
- Responsive HTML design
- Fallback plain text version

## Setup Instructions

### 1. Configure Postmark

1. Create a Postmark account at [postmarkapp.com](https://postmarkapp.com)
2. Create a new server for your application
3. Get your Server API Token from the server's API Tokens tab
4. Add your sending domain and verify it

### 2. Environment Variables

Add the following to your `.env.local` file:

```env
POSTMARK_SERVER_TOKEN=your_server_api_token_here
POSTMARK_FROM_EMAIL=noreply@yourdomain.com
```

### 3. Upload Template to Postmark (Recommended)

You can upload the template to Postmark for better management:

1. Go to your Postmark server
2. Navigate to Templates → Transactional
3. Click "Add Template"
4. Set Template Alias to: `application-confirmation`
5. Copy the HTML from `application-confirmation.html`
6. Set up the template variables as defined in `application-confirmation.json`

### 4. Template Variables

The application confirmation email uses these variables:

- `first_name` - Applicant's first name
- `last_name` - Applicant's last name  
- `email` - Applicant's email
- `account_type` - Either "artist" or "label"
- `entity_name` - Artist name or Label name
- `entity_name_label` - "Artist Name" or "Label Name"
- `application_id` - Unique application ID
- `submission_date` - Formatted submission date/time
- `application_status_url` - Link to check application status

## Testing

To test the email template:

1. Use Postmark's Template Preview feature in their dashboard
2. Send test emails using the example data in `application-confirmation.json`
3. Check rendering across different email clients using Postmark's spam testing tools

## Customization

To customize the template:

1. Edit the HTML in `application-confirmation.html`
2. Maintain the gradient color scheme: 
   - Primary: `#FF1493` (Deep Pink)
   - Secondary: `#FF69B4` (Hot Pink)
3. Keep the dark theme background: `#0a0a0a`
4. Ensure mobile responsiveness is maintained

## Email Delivery Best Practices

1. **SPF/DKIM/DMARC**: Configure these in your domain's DNS settings via Postmark
2. **From Address**: Use a consistent from address that matches your verified domain
3. **Reply-To**: Consider setting a monitored reply-to address for user responses
4. **Unsubscribe**: Add unsubscribe links for marketing emails (transactional emails like confirmations don't require this)
5. **Testing**: Always test emails across multiple clients (Gmail, Outlook, Apple Mail, etc.)

## Troubleshooting

If emails are not sending:

1. Check your Postmark Server API Token is correct
2. Verify your sending domain is verified in Postmark
3. Check the Postmark Activity feed for bounce/spam reports
4. Review console logs in your application for error messages
5. Ensure your account has sufficient credits

## Additional Templates

You may want to add these templates in the future:

- Application Approved
- Application Rejected  
- Payment Confirmation
- Welcome Onboarding
- Password Reset
- Account Verification