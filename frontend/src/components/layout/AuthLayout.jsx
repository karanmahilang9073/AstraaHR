import React from 'react'

function AuthLayout({children}) {
  return (
    <div className='min-h-screen flex items-center justify-center overflow-hidden bg-slate-950 px-4 py-10 text-white'>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(99,102,241,0.35),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(236,72,153,0.22),transparent_30%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] bg-size-[56px_56px] opacity-20" />
      <div className="relative w-full max-w-5xl">
        {children}
      </div>
    </div>
  )
}

export default AuthLayout
