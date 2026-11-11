import React from "react"

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <section className="relative flex min-h-[calc(100dvh-8rem)] w-full items-center justify-center overflow-hidden px-4 py-16">
      {/* Indigo glow bleeding in from the top */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-80 bg-[radial-gradient(60%_100%_at_50%_0%,rgba(99,102,241,0.18),transparent_70%)]"
      />
      {/* Soft pool of light behind the card */}
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-0 left-1/2 h-[420px] w-[680px] max-w-[90vw] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(99,102,241,0.14),transparent)] blur-2xl"
      />

      <div className="relative z-10 w-full max-w-md">{children}</div>
    </section>
  )
}

export default AuthLayout
