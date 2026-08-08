import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata = {
  title: "Digital Twin College Campus | Virtual Operations & ML Crowd Engine",
  description: "Real-time digital twin of a college campus displaying room availability, crowd levels, events, maintenance, and ML crowd forecasts.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-slate-950 text-gray-100 min-h-screen flex flex-col antialiased">
        <Navbar />
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
        <footer className="border-t border-gray-900 py-6 text-center text-xs text-gray-400">
          <p>© 2026 Digital Twin Campus Operations Platform • FastAPI & Next.js Engine</p>
        </footer>
      </body>
    </html>
  );
}
