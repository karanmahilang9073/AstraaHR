import React, {useState} from 'react'
import { applyLeave } from '../../services/LeaveService'
import { toast } from 'react-toastify'


function LeaveForm() {
    const [startDate, setStartDate] = useState('')
    const [endDate, setEndDate] = useState('')
    const [leaveType, setLeaveType] = useState('Sick')
    const [reason, setReason] = useState('')
    const [loading, setLoading] = useState(false)

    // to prevent date selection before that day 
    const today = new Date().toISOString().split('T')[0]

    // calculate total days
    const totaldays = (start, end) => {
        if(!start || !end) return 0
        const diff = new Date(end) - new Date(start)
        return Math.floor(diff / (1000 * 60 * 60 * 24)) + 1 
    }

    const handleSubmit = async(e) => {
        e.preventDefault()
        if(!leaveType || !startDate || !endDate || !reason.trim()){
            toast.error('all fields are required')
            return
        }
        if(new Date(endDate) < new Date(startDate)){
            toast.error('end date cannot be before start date')
            return
        }
        try {
            setLoading(true)
            await applyLeave({leaveType, startDate, endDate, reason})
            toast.success('leave applied successfully')
            setStartDate('')
            setEndDate('')
            setReason('')
            setLeaveType('Sick')
        } catch (error) {
            console.error('error while applying leave', error)
            toast.error('failed to apply for leave')
        } finally {
            setLoading(false)
        }
    }

  return (
    <div className='p-4 bg-white shadow rounded-lg max-w-md mx-auto'>

        {/* loading */}
        {loading && (
            <div className="flex justify-center py-6">
                <div className="w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        )}

        {/* title  */}
        <h2 className="text-xl font-semibold mb-4">Apply Leave</h2>

        {/* form */}
        <form onSubmit={handleSubmit}>
            {/* leave type */}
            <div>
                <label className='block text-sm mb-1'>Leave type</label>
                <select value={leaveType} onChange={(e) => setLeaveType(e.target.value)} className='w-full border p-2 rounded'>
                    <option value="Sick">Sick</option>
                    <option value="Casual">Casual</option>
                    <option value="Weekoff">Weekoff</option>
                    <option value="Earned">Earned</option>
                </select>
            </div>
            
            {/* start date */}
            <div>
                <label className='block text-sm mb-1'>start date</label>
                <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} min={today} className='w-full border p-2 rounded' placeholder='select start date' />
            </div>

            {/* end date */}
            <div>
                <label className='block text-sm mb-1'>end date</label>
                <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} min={today} className='w-full border p-2 rounded' placeholder='select end date'  />
            </div>

            {endDate && startDate && ( 
                <p className="text-sm text-gray-600 mt-2">
                    <span className='font-semibold'>{totaldays(startDate, endDate)} days</span> leave requested
                </p>
            )}

            {/* reason */}
            <div>
                <label className="block text-sm mb-1">Reason</label>
                <textarea value={reason} onChange={(e) => setReason(e.target.value)} placeholder='enter reason' className='w-full border p-2 rounded' rows={3} />
            </div>

            {/* button */}
            <button type='submit' disabled={loading} className={`w-full py-2 text-white rounded ${loading ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-700'}`}>
                {loading ? 'submitting...' : 'apply leave'}
            </button>
        </form>
      
    </div>
  )
}

export default LeaveForm
