export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-bg-primary px-4">
      {/* Stadium floodlight effects */}
      <div className="floodlight-left" />
      <div className="floodlight-right" />

      {/* Noise texture */}
      <div className="noise-overlay" />

      {/* Centered content */}
      <div className="relative z-10 w-full max-w-[400px]">
        {children}
      </div>

      {/* Bottom pitch grass line */}
      <div className="pointer-events-none fixed bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-pitch-green/40 to-transparent" />
    </div>
  );
}
