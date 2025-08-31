import React, { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext()

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}

// API Configuration
// If REACT_APP_API_URL is empty string, use relative URLs (same domain)
// If not set or has value, use that URL or localhost default
const getApiBaseUrl = () => {
    const envUrl = process.env.REACT_APP_API_URL
    if (envUrl === '') {
        // Empty string means same domain (production)
        return ''
    }
    return envUrl || 'http://localhost:8000'
}

const API_BASE_URL = getApiBaseUrl()
const USE_DJANGO_API = process.env.REACT_APP_USE_BACKEND === 'true'

console.log('Auth Context Config:', {
    API_BASE_URL,
    USE_DJANGO_API,
    REACT_APP_USE_BACKEND: process.env.REACT_APP_USE_BACKEND,
    REACT_APP_API_URL: process.env.REACT_APP_API_URL,
    USING_RELATIVE_URLS: API_BASE_URL === ''
})

// Helper function to get CSRF token
const getCSRFToken = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/csrf/`, {
            credentials: 'include'
        })
        const data = await response.json()
        return data.csrfToken
    } catch (error) {
        console.warn('Failed to get CSRF token:', error)
        return null
    }
}

// API request helper
const apiRequest = async (endpoint, options = {}) => {
    const url = `${API_BASE_URL}${endpoint}`
    const defaultOptions = {
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        }
    }

    // Get CSRF token for POST/PUT/DELETE requests
    if (['POST', 'PUT', 'DELETE'].includes(options.method)) {
        const csrfToken = await getCSRFToken()
        if (csrfToken) {
            defaultOptions.headers['X-CSRFToken'] = csrfToken
        }
    }

    const finalOptions = {
        ...defaultOptions,
        ...options,
        headers: {
            ...defaultOptions.headers,
            ...options.headers
        }
    }

    const response = await fetch(url, finalOptions)
    return response
}

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')

    // Check for existing user session on app load
    useEffect(() => {
        // Initialize demo users if no users exist
        const users = getUsers()
        if (users.length === 0) {
            const demoUsers = [
                {
                    id: 'demo1',
                    username: 'demo',
                    password: 'demo123',
                    firstName: 'Demo',
                    lastName: 'User',
                    email: 'demo@habify.com',
                    createdAt: new Date().toISOString()
                },
                {
                    id: 'admin1',
                    username: 'admin',
                    password: 'admin123',
                    firstName: 'Admin',
                    lastName: 'User',
                    email: 'admin@habify.com',
                    createdAt: new Date().toISOString()
                }
            ]
            saveUsers(demoUsers)
        }

        // Check for existing user session
        const savedUser = localStorage.getItem('habify_user')
        if (savedUser) {
            try {
                const userSession = JSON.parse(savedUser)
                // Verify the session is still valid (less than 24 hours old)
                const loginTime = new Date(userSession.loginTime)
                const now = new Date()
                const hoursSinceLogin = (now - loginTime) / (1000 * 60 * 60)
                
                if (hoursSinceLogin < 24) {
                    setUser(userSession)
                    // Update hidden input field
                    const usernameElement = document.getElementById('username')
                    if (usernameElement) {
                        usernameElement.value = userSession.username
                    }
                } else {
                    // Session expired, clear it
                    localStorage.removeItem('habify_user')
                }
            } catch (err) {
                localStorage.removeItem('habify_user')
            }
        }
    }, [])

    // Simulate user database
    const getUsers = () => {
        const users = localStorage.getItem('habify_users')
        return users ? JSON.parse(users) : []
    }

    const saveUsers = (users) => {
        localStorage.setItem('habify_users', JSON.stringify(users))
    }

    const login = async (username, password) => {
        setIsLoading(true)
        setError('')

        try {
            if (USE_DJANGO_API) {
                console.log('Using Django API for login:', { username, API_BASE_URL })
                // Use Django API for authentication
                const response = await apiRequest('/api/login/', {
                    method: 'POST',
                    body: JSON.stringify({
                        username: username,
                        password: password
                    })
                })

                if (response.ok) {
                    const userData = await response.json()
                    const userSession = {
                        id: userData.id || userData.user_id,
                        username: userData.username,
                        firstName: userData.first_name || '',
                        lastName: userData.last_name || '',
                        email: userData.email || '',
                        loginTime: new Date().toISOString()
                    }

                    setUser(userSession)
                    localStorage.setItem('habify_user', JSON.stringify(userSession))
                    
                    // Update the hidden input field that App.js checks
                    const usernameInput = document.getElementById('username')
                    if (usernameInput) {
                        usernameInput.value = userData.username
                    }
                    
                    return { success: true, user: userSession }
                } else {
                    const errorData = await response.json().catch(() => ({}))
                    console.error('Login failed:', response.status, errorData)
                    throw new Error(errorData.error || `Login failed (${response.status})`)
                }
            } else {
                // Fallback to localStorage authentication
                await new Promise(resolve => setTimeout(resolve, 1000))

                const users = getUsers()
                const foundUser = users.find(u => 
                    u.username.toLowerCase() === username.toLowerCase() && 
                    u.password === password
                )

                if (foundUser) {
                    const userSession = {
                        id: foundUser.id,
                        username: foundUser.username,
                        firstName: foundUser.firstName,
                        lastName: foundUser.lastName,
                        loginTime: new Date().toISOString()
                    }
                    
                    setUser(userSession)
                    localStorage.setItem('habify_user', JSON.stringify(userSession))
                    
                    // Update the hidden input field that App.js checks
                    const usernameInput = document.getElementById('username')
                    if (usernameInput) {
                        usernameInput.value = foundUser.username
                    }
                    
                    return { success: true, user: userSession }
                } else {
                    throw new Error('Invalid username or password')
                }
            }
        } catch (err) {
            setError(err.message)
            return { success: false, error: err.message }
        } finally {
            setIsLoading(false)
        }
    }

    const signup = async (userData) => {
        setIsLoading(true)
        setError('')

        try {
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 1000))

            const { username, password, firstName, lastName, email } = userData

            // Validation
            if (!username || !password || !firstName || !lastName || !email) {
                throw new Error('All fields are required')
            }

            if (username.length < 3) {
                throw new Error('Username must be at least 3 characters long')
            }

            if (password.length < 6) {
                throw new Error('Password must be at least 6 characters long')
            }

            if (USE_DJANGO_API) {
                console.log('Using Django API for signup:', { username, API_BASE_URL })
                // Use Django API for user registration
                const response = await apiRequest('/api/new/', {
                    method: 'POST',
                    body: JSON.stringify({
                        username: username.trim(),
                        password: password,
                        first_name: firstName.trim(),
                        last_name: lastName.trim(),
                        email: email.trim()
                    })
                })

                if (response.ok) {
                    const newUserData = await response.json()
                    const userSession = {
                        id: newUserData.id || newUserData.user_id,
                        username: newUserData.username,
                        firstName: newUserData.first_name || firstName,
                        lastName: newUserData.last_name || lastName,
                        email: newUserData.email || email,
                        loginTime: new Date().toISOString()
                    }

                    setUser(userSession)
                    localStorage.setItem('habify_user', JSON.stringify(userSession))

                    // Update the hidden input field that App.js checks
                    const usernameInput = document.getElementById('username')
                    if (usernameInput) {
                        usernameInput.value = newUserData.username
                    }

                    return { success: true, user: userSession }
                } else {
                    const errorData = await response.json().catch(() => ({}))
                    throw new Error(errorData.error || 'Registration failed')
                }
            }

            // Fallback to localStorage registration
            const users = getUsers()
            
            // Check if username or email already exists
            if (users.find(u => u.username.toLowerCase() === username.toLowerCase())) {
                throw new Error('Username already exists')
            }
            
            if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
                throw new Error('Email address already exists')
            }

            // Create new user
            const newUser = {
                id: Date.now().toString(),
                username: username.trim(),
                password: password,
                firstName: firstName.trim(),
                lastName: lastName.trim(),
                email: email.trim(),
                createdAt: new Date().toISOString()
            }

            users.push(newUser)
            saveUsers(users)

            const userSession = {
                id: newUser.id,
                username: newUser.username,
                firstName: newUser.firstName,
                lastName: newUser.lastName,
                loginTime: new Date().toISOString()
            }

            setUser(userSession)
            localStorage.setItem('habify_user', JSON.stringify(userSession))
            
            // Update the hidden input field that App.js checks
            const usernameInput = document.getElementById('username')
            if (usernameInput) {
                usernameInput.value = newUser.username
            }

            return { success: true, user: userSession }
        } catch (err) {
            setError(err.message)
            return { success: false, error: err.message }
        } finally {
            setIsLoading(false)
        }
    }

    const logout = async () => {
        try {
            if (USE_DJANGO_API) {
                // Call Django logout API
                await apiRequest('/api/logout/', {
                    method: 'POST'
                }).catch(() => {
                    // Ignore logout API errors, still clear local session
                    console.warn('Django logout API failed, clearing local session anyway')
                })
            }
        } catch (error) {
            console.warn('Logout API error:', error)
        }

        // Always clear local session
        setUser(null)
        localStorage.removeItem('habify_user')
        
        // Update the hidden input field that App.js checks
        const usernameInput = document.getElementById('username')
        if (usernameInput) {
            usernameInput.value = 'AnonymousUser'
        }
        
        // Don't reload - let React handle the state change
        // The App component will automatically show the login page
    }

    const forgotPassword = async (email) => {
        setIsLoading(true)
        setError('')

        try {
            if (USE_DJANGO_API) {
                console.log('Using Django API for forgot password:', { email, API_BASE_URL })
                // Use Django API for password reset
                const response = await apiRequest('/api/forgot-password/', {
                    method: 'POST',
                    body: JSON.stringify({
                        email: email
                    })
                })

                if (response.ok) {
                    const data = await response.json()
                    return { 
                        success: true, 
                        message: data.message,
                        resetToken: data.demo_token, // Demo mode only
                        resetUid: data.demo_uid      // Demo mode only
                    }
                } else {
                    const errorData = await response.json().catch(() => ({}))
                    console.error('Forgot password failed:', response.status, errorData)
                    throw new Error(errorData.error || `Request failed (${response.status})`)
                }
            } else {
                // Fallback to localStorage mode
                await new Promise(resolve => setTimeout(resolve, 1000))

                const users = getUsers()
                const foundUser = users.find(u => u.email.toLowerCase() === email.toLowerCase())

                if (!foundUser) {
                    throw new Error('No account found with this email address')
                }

                // Simulate password reset email
                const resetToken = Math.random().toString(36).substring(2, 15)
                
                // Store reset token temporarily (in real app, this would be stored securely on server)
                localStorage.setItem('password_reset_token', JSON.stringify({
                    email: email,
                    token: resetToken,
                    expires: Date.now() + 3600000 // 1 hour
                }))

                return { 
                    success: true, 
                    message: `Password reset instructions have been sent to ${email}`,
                    resetToken: resetToken // In real app, this would only be sent via email
                }
            }

        } catch (err) {
            setError(err.message)
            return { success: false, error: err.message }
        } finally {
            setIsLoading(false)
        }
    }

    const resetPassword = async (token, newPassword, uid = null) => {
        setIsLoading(true)
        setError('')

        try {
            if (USE_DJANGO_API && uid) {
                console.log('Using Django API for password reset')
                // Use Django API for password reset
                const response = await apiRequest('/api/reset-password/', {
                    method: 'POST',
                    body: JSON.stringify({
                        token: token,
                        uid: uid,
                        new_password: newPassword
                    })
                })

                if (response.ok) {
                    const data = await response.json()
                    return { 
                        success: true, 
                        message: data.message
                    }
                } else {
                    const errorData = await response.json().catch(() => ({}))
                    console.error('Reset password failed:', response.status, errorData)
                    throw new Error(errorData.error || `Request failed (${response.status})`)
                }
            } else {
                // Fallback to localStorage mode
                await new Promise(resolve => setTimeout(resolve, 1000))

                const resetData = JSON.parse(localStorage.getItem('password_reset_token') || 'null')
                
                if (!resetData || resetData.token !== token || Date.now() > resetData.expires) {
                    throw new Error('Invalid or expired reset token')
                }

                const users = getUsers()
                const userIndex = users.findIndex(u => u.email.toLowerCase() === resetData.email.toLowerCase())
                
                if (userIndex === -1) {
                    throw new Error('User not found')
                }

                // Update password
                users[userIndex].password = newPassword
                saveUsers(users)

                // Clear reset token
                localStorage.removeItem('password_reset_token')

                return { success: true, message: 'Password has been successfully reset' }
            }

        } catch (err) {
            setError(err.message)
            return { success: false, error: err.message }
        } finally {
            setIsLoading(false)
        }
    }

    const clearError = () => {
        setError('')
    }

    const value = {
        user,
        isLoading,
        error,
        login,
        signup,
        logout,
        forgotPassword,
        resetPassword,
        clearError,
        setError,
        isAuthenticated: !!user
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext
