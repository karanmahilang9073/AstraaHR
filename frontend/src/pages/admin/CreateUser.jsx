import React, { useContext, useState } from 'react'
import { createUser } from '../../services/userService'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext'
import { toast } from 'react-toastify'

function CreateUser() {
    const  [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        department: '',
        role: 'HR',
    })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const navigate = useNavigate()
    const {user} = useContext(AuthContext)

    const handleChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value})
    }

    const handleSubmit = async(e) => {
        e.preventDefault()
        if(!formData.name || !formData.email || !formData.password || !formData.role){
            setError('all fields are required')
            toast.error('all fields are required')
            return
        }

        try {
            setLoading(true)
            setError(null)
            const res = await createUser(formData)
            toast.success(res.message || 'user created successfully')
            navigate('/admin/employees')
        } catch (error) {
            const message = error.response?.data?.message || 'failed to create user'
            setError(message)
            toast.error(message)
        } finally {
            setLoading(false)
        }
    }

    if(user?.role !== 'Admin'){
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-red-500 font-semibold">only admin can access this page.</p>
            </div>
        )
    }

  return (
    <div className='min-h-screen bg-gray-100 p-6 flex items-center justify-center'>
      <form onSubmit={handleSubmit} className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 space-y-5">

        <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-800">Create User</h2>
            <p className="text-sm text-gray-500">Create HR or Admin Account</p>
        </div>

        {error && (
            <div className="bg-red-50 border-red-200 text-red-600 text-sm rounded px-3 py-2">
                {error}
            </div>
        )}

        <div className="space-y-2">
            <label className='text-sm text-gray-700'>Name</label>
            <input type="text" name='name' value={formData.name} onChange={handleChange} className='w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400' placeholder='enter name' />
        </div>

        <div className="space-y-2">
            <label className='text-sm text-gray-700'>Email</label>
            <input type="email" name='email' value={formData.email} onChange={handleChange} className='w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400' placeholder='enter email' />
        </div>

        <div className="space-y-2">
            <label className='text-sm text-gray-700'>Password</label>
            <input type="password" name='password' value={formData.password} onChange={handleChange} className='w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400' placeholder='enter password' />
        </div>

        <div className="space-y-2">
            <label className='text-sm text-gray-700'>Department</label>
            <input type="text" name='department' value={formData.department} onChange={handleChange} className='w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400' placeholder='enter department' />
        </div>

        <div className="space-y-2">
            <label className='text-sm text-gray-700'>role</label>
            <select  name='role' value={formData.role} onChange={handleChange} className='w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400' placeholder='enter department' >
                <option value="HR">HR</option>
                <option value="Admin">Admin</option>
            </select>
        </div>

        <button type='submit' disabled = {loading} className='w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition font-semibold disabled:opacity-70'>
            {loading ? 'Creating' : 'Create User'}
        </button>
        
      </form>
    </div>
  )
}

export default CreateUser
