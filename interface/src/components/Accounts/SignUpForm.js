import React, {useState} from 'react'
import { useAuth } from '../../context/auth-context'
import './AuthForms.css'

const SignUpForm = () => {
    const { signup, isLoading, error, clearError, setError } = useAuth()
    const [success, setSuccess] = useState('')
    const [formData, setFormData] = useState({
        username: '',
        firstName: '',
        lastName: '',
        email: '',
        password: ''
    })

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
        
        // Clear errors when user starts typing
        if (error) {
            clearError()
        }
        if (success) {
            setSuccess('')
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setSuccess('')

        const { username, firstName, lastName, email, password } = formData

        // Basic validation
        if (!username.trim() || !firstName.trim() || !lastName.trim() || !email.trim() || !password) {
            return
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(email.trim())) {
            setError('Please enter a valid email address')
            return
        }

        const result = await signup({
            username: username.trim(),
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            email: email.trim(),
            password: password
        })
        
        if (result.success) {
            setSuccess('Account created successfully! Welcome to Habify!')
            // Don't reload the page - let React handle the state change
            // The App component will automatically show the dashboard
        }
    }

    return (
        <div className="auth-card">
            <div className="auth-header">
                <h3 className="auth-title">Create Account</h3>
                <p className="auth-subtitle">Join us and start your journey</p>
            </div>

            {error && <div className="auth-error">{error}</div>}
            {success && <div className="auth-success">{success}</div>}

            <form className="auth-form" onSubmit={handleSubmit}>
                <div className="auth-input-row">
                    <div className="auth-input-group">
                        <label className="auth-label" htmlFor="firstName">First Name</label>
                        <input 
                            type="text" 
                            className="auth-input"
                            placeholder="First name" 
                            id="firstName"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleInputChange}
                            autoComplete="given-name"
                            required
                            disabled={isLoading}
                        />
                    </div>
                    
                    <div className="auth-input-group">
                        <label className="auth-label" htmlFor="lastName">Last Name</label>
                        <input 
                            type="text" 
                            className="auth-input"
                            placeholder="Last name" 
                            id="lastName"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleInputChange}
                            autoComplete="family-name"
                            required
                            disabled={isLoading}
                        />
                    </div>
                </div>

                <div className="auth-input-group">
                    <label className="auth-label" htmlFor="email">Email Address</label>
                    <input 
                        type="email" 
                        className="auth-input"
                        placeholder="Enter your email address" 
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        autoComplete="email"
                        required
                        disabled={isLoading}
                    />
                </div>

                <div className="auth-input-group">
                    <label className="auth-label" htmlFor="username">Username</label>
                    <input 
                        type="text" 
                        className="auth-input"
                        placeholder="Choose a username (min 3 chars)" 
                        id="username"
                        name="username"
                        value={formData.username}
                        onChange={handleInputChange}
                        autoComplete="username"
                        required
                        disabled={isLoading}
                        minLength="3"
                    />
                </div>

                <div className="auth-input-group">
                    <label className="auth-label" htmlFor="password">Password</label>
                    <input 
                        type="password" 
                        className="auth-input"
                        placeholder="Create a password (min 6 chars)" 
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        autoComplete="new-password"
                        required
                        disabled={isLoading}
                        minLength="6"
                    />
                </div>

                <button 
                    type="submit" 
                    className="auth-submit-btn"
                    disabled={isLoading || !formData.username.trim() || !formData.firstName.trim() || 
                             !formData.lastName.trim() || !formData.email.trim() || !formData.password}
                >
                    {isLoading ? 'Creating Account...' : 'Create Account'}
                </button>
            </form>
        </div>
    )
}

export default SignUpForm