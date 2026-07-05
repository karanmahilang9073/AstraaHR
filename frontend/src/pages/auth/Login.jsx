import React, { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext'
import { toast } from 'react-toastify'
import {login as loginService} from '../../services/AuthService'


function Login() {
  const [formData, setFormData] = useState({
    email : '',
    password : ''
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  const {login} = useContext(AuthContext)

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]:e.target.value})
  }

  const handleSubmit = async(e) => {
    e.preventDefault()
    if(!formData.email || !formData.password){
      setError('all fields are required')
      toast.error('all fields are required')
      return
    }
    setLoading(true)
    setError(null)
    try {
      const res = await loginService(formData)
      login(res)
      toast.success('welcome back to AstraaHR')
      if (res.user.role === 'Admin' || res.user.role === 'HR') {
        navigate('/admin')
      }else {
        navigate('/employee')
      }
    } catch (error) {
      const message = error?.message || error || 'login failed'
      setError(message)
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="grid overflow-hidden rounded-3xl border border-white/10 bg-white/10 shadow-[0_30px_90px_rgba(15,23,42,0.45)] backdrop-blur-xl lg:grid-cols-[1.15fr_0.85fr]">
      <div className="relative hidden flex-col justify-between p-10 text-white lg:flex">
        <div className="absolute inset-0 bg-linear-to-br from-indigo-500/90 via-slate-900/30 to-fuchsia-500/60" />
        <div className="absolute right-8 top-8 h-32 w-32 rounded-full bg-white/10 blur-3xl" />
        <div className="relative space-y-6">
          <div className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium tracking-wide">
            WorkSphere HR Suite
          </div>
          <div>
            <h1 className="text-4xl font-semibold tracking-tight">
              Welcome back.
            </h1>
            <p className="mt-4 max-w-md text-base leading-7 text-white/80">
              Sign in to manage attendance, leaves, tasks, and salary data from one clean workspace.
            </p>
          </div>
        </div>

        <div className="relative grid grid-cols-3 gap-3 text-sm">
          <div className="rounded-2xl border border-white/15 bg-white/10 p-4">
            <p className="text-white/60">Faster</p>
            <p className="mt-1 font-semibold">Daily ops</p>
          </div>
          <div className="rounded-2xl border border-white/15 bg-white/10 p-4">
            <p className="text-white/60">Clearer</p>
            <p className="mt-1 font-semibold">Team view</p>
          </div>
          <div className="rounded-2xl border border-white/15 bg-white/10 p-4">
            <p className="text-white/60">Smarter</p>
            <p className="mt-1 font-semibold">Workflows</p>
          </div>
        </div>
      </div>

      <div className="bg-slate-950/90 p-6 sm:p-8 lg:p-10">
        <form onSubmit={handleSubmit} className="mx-auto w-full max-w-md space-y-6">
          <div className="space-y-2 text-center lg:text-left">
            <p className="text-sm font-medium uppercase tracking-[0.25em] text-indigo-300/90">
              Sign in
            </p>
            <h2 className="text-3xl font-semibold text-white">
              Welcome back
            </h2>
            <p className="text-sm leading-6 text-slate-300">
              Use your WorkSphere credentials to continue.
            </p>
          </div>

          {error && (
            <div className="rounded-2xl border border-rose-400/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-200">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              autoFocus
              onChange={handleChange}
              placeholder="Enter your email"
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3.5 text-white placeholder:text-slate-500 outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-400/15"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-slate-200">
                Password
              </label>
              <span className="text-xs text-slate-400">
                Secure access
              </span>
            </div>
            <input
              type="password"
              name="password"
              onChange={handleChange}
              placeholder="Enter your password"
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3.5 text-white placeholder:text-slate-500 outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-400/15"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="inline-flex w-full items-center justify-center rounded-2xl bg-linear-to-r from-indigo-500 to-fuchsia-500 px-4 py-3.5 font-semibold text-white shadow-lg shadow-indigo-500/20 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>

          <p className="text-center text-sm text-slate-400">
            Don’t have an account?{' '}
            <Link to="/register" className="font-semibold text-indigo-300 hover:text-indigo-200 hover:underline">
              Create one
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}

export default Login
