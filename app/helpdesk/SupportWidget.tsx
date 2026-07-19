'use client';

import Script from 'next/script';

export function SupportWidget() {
  return (
    <Script
      id="true-north-support-widget"
      strategy="afterInteractive"
      src="https://support.elkayal.me/widget/widget.js"
      data-project="true-north"
      data-base-url="https://support.elkayal.me"
      data-label="Need help?"
      data-title="True North support chat"
      data-position="right"
    />
  );
}
