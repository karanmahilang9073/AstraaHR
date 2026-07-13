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
export const getUsers = async(page = 1, limit = 10) => {
    try {
        const res = await axiosClient.get(`/users?page=${page}&limit=${limit}`)
        return res.data
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

//create user
export const createUser = async(data) =>{
    try {
        const res = await axiosClient.post('/users/create', data)
        return res.data
    } catch (error) {
        throw errorHandler(error)
    }
}