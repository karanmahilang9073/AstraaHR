import { useState, useContext } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext.jsx'
import { toast } from 'react-toastify'
import { register } from '../../services/AuthService.js'
import 'react-toastify/dist/ReactToastify.css'

function Register () {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'Employee',
        department: ''
    })
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)

    const navigate = useNavigate()
    const { login } = useContext(AuthContext)

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const validate = () => {
        if (!formData.name || !formData.email || !formData.password) {
            return 'all fields are required'
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if(!emailRegex.test(formData.email)) {
            return 'please enter a valid email'
        }
        if (formData.password.length < 6) {
            return 'password must be at least 6 characters'
        }
        if (formData.password !== formData.confirmPassword) {
            return 'passwords do not match'
        }
        return null
    }

    const handleSubmit = async(e) => {
        e.preventDefault()

        const validationError = validate()
        if (validationError) {
            setError(validationError)
            toast.error(validationError)
            return
        }
        setLoading(true)
        setError(null)
        try {
            const res = await register(formData)
            login(res)
            toast.success('user registered successfully')
            if (res.user?.role.toLowerCase() === 'admin') {
                navigate('/admin')
            } else {
                navigate('/employee')
            }
        } catch (err) {
            const message = err.message || 'registration failed'
            setError(message)
            toast.error(message)
        } finally {
            setLoading(false)
        }
    }

    return (
            <div className="grid overflow-hidden rounded-3xl border border-white/10 bg-white/10 shadow-[0_30px_90px_rgba(15,23,42,0.45)] backdrop-blur-xl lg:grid-cols-[0.9fr_1.1fr]">
                <div className="relative hidden flex-col justify-between p-10 text-white lg:flex">
                    <div className="absolute inset-0 bg-linear-to-br from-fuchsia-500/85 via-slate-900/35 to-indigo-500/80" />
                    <div className="absolute left-6 top-6 h-32 w-32 rounded-full bg-white/10 blur-3xl" />
                    <div className="relative space-y-6">
                        <div className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium tracking-wide">
                            Join WorkSphere
                        </div>
                        <div>
                            <h1 className="text-4xl font-semibold tracking-tight">
                                Build your team profile.
                            </h1>
                            <p className="mt-4 max-w-md text-base leading-7 text-white/80">
                                Set up an account for HR, admin, or employees and start managing your workspace in minutes.
                            </p>
                        </div>
                    </div>

                    <div className="relative grid grid-cols-3 gap-3 text-sm">
                        <div className="rounded-2xl border border-white/15 bg-white/10 p-4">
                            <p className="text-white/60">Simple</p>
                            <p className="mt-1 font-semibold">Onboarding</p>
                        </div>
                        <div className="rounded-2xl border border-white/15 bg-white/10 p-4">
                            <p className="text-white/60">Flexible</p>
                            <p className="mt-1 font-semibold">Roles</p>
                        </div>
                        <div className="rounded-2xl border border-white/15 bg-white/10 p-4">
                            <p className="text-white/60">Ready</p>
                            <p className="mt-1 font-semibold">Fast start</p>
                        </div>
                    </div>
                </div>

                <div className="bg-slate-950/90 p-6 sm:p-8 lg:p-10">
                    <form onSubmit={handleSubmit} className="mx-auto w-full max-w-md space-y-5">
                        <div className="space-y-2 text-center lg:text-left">
                            <p className="text-sm font-medium uppercase tracking-[0.25em] text-indigo-300/90">
                                Create account
                            </p>
                            <h2 className="text-3xl font-semibold text-white">
                                Register for WorkSphere
                            </h2>
                            <p className="text-sm leading-6 text-slate-300">
                                Add your details below to create a new workspace account.
                            </p>
                        </div>

                        {error && (
                            <div className="rounded-2xl border border-rose-400/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
                                {error}
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-200">Full Name</label>
                            <input
                                name='name'
                                type='text'
                                autoFocus
                                value={formData.name}
                                onChange={handleChange}
                                placeholder='Enter your full name'
                                className='w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3.5 text-white placeholder:text-slate-500 outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-400/15'
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-200">Email</label>
                            <input
                                name='email'
                                type='email'
                                value={formData.email}
                                placeholder='abc@gmail.com'
                                onChange={handleChange}
                                className='w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3.5 text-white placeholder:text-slate-500 outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-400/15'
                                required
                            />
                        </div>

                        <div className="grid gap-5 sm:grid-cols-2">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-200">Password</label>
                                <input
                                    name='password'
                                    type='password'
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder='********'
                                    className='w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3.5 text-white placeholder:text-slate-500 outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-400/15'
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-200">Confirm Password</label>
                                <input
                                    name='confirmPassword'
                                    type='password'
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    placeholder='********'
                                    className='w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3.5 text-white placeholder:text-slate-500 outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-400/15'
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid gap-5 sm:grid-cols-2">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-200">Role</label>
                                <select
                                    name='role'
                                    value={formData.role}
                                    onChange={handleChange}
                                    className='w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3.5 text-white outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-400/15'
                                    required
                                >
                                    <option value="Employee">Employee</option>
                                    <option value="Hr">HR</option>
                                    <option value="Admin">Admin</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-200">Department</label>
                                <input
                                    name='department'
                                    type='text'
                                    value={formData.department}
                                    onChange={handleChange}
                                    placeholder='Enter department'
                                    className='w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3.5 text-white placeholder:text-slate-500 outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-400/15'
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type='submit'
                            className='inline-flex w-full items-center justify-center rounded-2xl bg-linear-to-r from-indigo-500 to-fuchsia-500 px-4 py-3.5 font-semibold text-white shadow-lg shadow-indigo-500/20 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70'
                            disabled={loading}
                        >
                            {loading ? 'Registering...' : 'Register'}
                        </button>

                        <p className='text-center text-sm text-slate-400'>
                            already have an account?{' '}
                            <Link to='/login' className='font-semibold text-indigo-300 hover:text-indigo-200 hover:underline'>
                                login
                            </Link>
                        </p>
                    </form>
                </div>
            </div>
    )
}
export default Register