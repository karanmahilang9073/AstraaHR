import { createContext, useContext, useState, useEffect, useCallback } from "react"

 export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        try {
            const storedUser = localStorage.getItem('user')
            const token = localStorage.getItem('token')
            if(storedUser && token && isValidToken(token)) {
                setUser(JSON.parse(storedUser))
            } else {
                localStorage.removeItem('user')
                localStorage.removeItem('token')
            }
        } catch (error) {
            console.error('invalid user data in localStorage', error)
            localStorage.removeItem('user')
            localStorage.removeItem('token')
        } finally {
            setLoading(false)
        }
    }, [])

    const isValidToken = (token) => {
        if(!token) return false
        return token.includes('.') && token.split('.').length === 3
    }

    const login = useCallback((data) => {
        setUser(data.user)
        localStorage.setItem("token", data.token)
        localStorage.setItem("user", JSON.stringify(data.user))
    }, [])

    const logout = useCallback(() => {
        setUser(null)
        localStorage.removeItem("token")
        localStorage.removeItem("user")
    }, [])

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const context = useContext(AuthContext)
    if(!context) {
        throw new Error('useauth must be used within  authprovider')
    }
    return context
}