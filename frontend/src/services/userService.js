import axiosClient from "../api/axiosClient";

const errorHandler = (error) => {
    const errorData = error?.response?.data || {message: error?.message || 'something went wrong'}
    console.error('UserService error', errorData);
    return {
        message: errorData?.message || 'failed to process request',
        status: error?.response?.status,
        data: errorData
    }
}

//get all users
export const getUsers = async() => {
    try {
        const res = await axiosClient.get('/users')
        return res.data.users
    } catch (error) {
        throw errorHandler(error)
    }
}

//get profile
export const getUserProfile = async() => {
    try {
        const res = await axiosClient.get('/users/profile')
        return res.data.user
    } catch (error) {
        throw errorHandler(error)
    }
}

//update user 
export const updateUser = async(id, data) => {
    try {
        const res = await axiosClient.put(`/users/${id}`, data)
        return res.data.user
    } catch (error) {
        throw errorHandler(error)
    }
}

//delete user
export const deleteUser = async(id) => {
    try {
        const res = await axiosClient.delete(`/users/${id}`)
        return res.data
    } catch (error) {
     throw errorHandler(error)   
    }
}