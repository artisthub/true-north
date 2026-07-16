import { SupportWidget } from './SupportWidget';

export default function HelpdeskLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <SupportWidget />
    </>
  );
}
