import "./globals.css";
import Navbar from "@/components/Navbar";
import { ThemeProvider } from "@/components/ThemeProvider";
import AmbientBackground from "@/components/AmbientBackground";

export const metadata = {
  title: "Digital Twin College Campus | Virtual Twin & AI Engine",
  description: "Real-time digital twin of a college campus displaying room availability, crowd levels, events, maintenance, and ML crowd forecasts.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="cyber">
      <body className="min-h-screen flex flex-col antialiased relative selection:bg-cyan-500 selection:text-white">
        <ThemeProvider>
          <AmbientBackground />
          <div className="relative z-10 flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
              {children}
            </main>
            <footer className="border-t border-white/10 py-6 text-center text-xs text-gray-400 glass-panel mt-12">
              <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
                <p>© 2026 Digital Twin Campus Operations Platform • FastAPI & Next.js Engine</p>
                <div className="flex items-center space-x-4 text-[11px] text-gray-400">
                  <span className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping inline-block"></span>
                    WebSocket Active
                  </span>
                  <span>•</span>
                  <span>FastAPI Virtual Engine</span>
                </div>
              </div>
            </footer>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
