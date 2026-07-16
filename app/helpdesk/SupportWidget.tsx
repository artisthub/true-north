'use client';

import Script from 'next/script';
import { useEffect, useState } from 'react';

export function SupportWidget() {
  const [styleUrl, setStyleUrl] = useState<string | null>(null);

  useEffect(() => {
    setStyleUrl(`${window.location.origin}/support-widget.css`);
  }, []);

  if (!styleUrl) {
    return null;
  }

  return (
    <>
      <Script
        id="true-north-support-widget"
        strategy="afterInteractive"
        src="https://support.elkayal.me/widget/widget.js"
        data-project="true-north"
        data-base-url="https://support.elkayal.me"
        data-label="Need help?"
        data-title="True North support chat"
        data-position="right"
        data-style-url={styleUrl}
      />
      <style jsx global>{`
        body .support-rag-host {
          right: 28px;
          bottom: 28px;
          left: auto;
          z-index: 1000;
          font-family: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        }

        body .support-rag-host__launcher {
          width: auto;
          min-width: 0;
          min-height: 48px;
          padding: 0 18px;
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 999px;
          background: #ff1493;
          color: #ffffff;
          box-shadow: 0 18px 42px rgba(0, 0, 0, 0.38), inset 0 1px 0 rgba(255, 255, 255, 0.2);
          font: 700 14px/1 Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
          transition: transform 160ms ease, background 160ms ease, box-shadow 160ms ease;
        }

        body .support-rag-host__launcher:hover {
          transform: translateY(-2px);
          background: #ff48aa;
          box-shadow: 0 22px 48px rgba(0, 0, 0, 0.45), inset 0 1px 0 rgba(255, 255, 255, 0.2);
        }

        body .support-rag-host__launcher:focus-visible {
          outline: 3px solid #ff9bd2;
          outline-offset: 4px;
        }

        body .support-rag-host__frame {
          right: 0;
          bottom: 64px;
          width: min(430px, calc(100vw - 40px));
          height: min(720px, calc(100dvh - 124px));
          overflow: hidden;
          border: 1px solid rgba(255, 255, 255, 0.14);
          border-radius: 20px;
          background: #101013;
          box-shadow: 0 30px 80px rgba(0, 0, 0, 0.48);
        }

        @media (max-width: 520px) {
          body .support-rag-host {
            inset: auto 0 0;
          }

          body .support-rag-host__launcher {
            position: fixed;
            right: max(16px, env(safe-area-inset-right));
            bottom: max(16px, env(safe-area-inset-bottom));
          }

          body .support-rag-host__frame {
            position: fixed;
            inset: 0;
            width: 100vw;
            height: 100dvh;
            border: 0;
            border-radius: 0;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          body .support-rag-host__launcher {
            transition: none;
          }
        }
      `}</style>
    </>
  );
}
