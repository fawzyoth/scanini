import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  title: "Menu",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default function MenuLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="menu-public">
      <style>{`
        html, body {
          overflow: hidden !important;
          background: #ffffff !important;
          height: 100% !important;
        }
      `}</style>
      {children}
    </div>
  );
}
