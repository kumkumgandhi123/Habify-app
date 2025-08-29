import React, {useState} from 'react'
import { useAuth } from '../../context/auth-context'
import './AuthForms.css'

// Demo credentials available: demo/demo123 or admin/admin123

const LoginForm = ({ onForgotPassword }) => {
    const { login, isLoading, error, clearError } = useAuth()
    const [success, setSuccess] = useState('')
    const [formData, setFormData] = useState({
        username: '',
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

        const { username, password } = formData

        // Basic validation
        if (!username.trim() || !password) {
            return
        }

        const result = await login(username.trim(), password)
        
        if (result.success) {
            setSuccess('Login successful! Welcome back!')
            // Don't reload the page - let React handle the state change
            // The App component will automatically show the dashboard
        }
    }
    
    return (
        <div className="auth-card">
            <div className="auth-header">
                <h3 className="auth-title">Welcome Back</h3>
                <p className="auth-subtitle">Sign in to your account</p>
            </div>

            {error && <div className="auth-error">{error}</div>}
            {success && <div className="auth-success">{success}</div>}

            <form className="auth-form" onSubmit={handleSubmit}>
                <div className="auth-input-group">
                    <label className="auth-label" htmlFor="username">Username</label>
                    <input 
                        type="text" 
                        className="auth-input"
                        placeholder="Enter your username" 
                        id="username"
                        name="username"
                        value={formData.username}
                        onChange={handleInputChange}
                        autoComplete="username"
                        required
                        disabled={isLoading}
                    />
                </div>

                <div className="auth-input-group">
                    <label className="auth-label" htmlFor="password">Password</label>
                    <input 
                        type="password" 
                        className="auth-input"
                        placeholder="Enter your password" 
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        autoComplete="current-password"
                        required
                        disabled={isLoading}
                    />
                </div>

                <button 
                    type="submit" 
                    className="auth-submit-btn"
                    disabled={isLoading || !formData.username.trim() || !formData.password}
                >
                    {isLoading ? 'Signing In...' : 'Sign In'}
                </button>

                {/* Forgot Password Link */}
                <div style={{ textAlign: 'center', marginTop: '16px' }}>
                    <button
                        type="button"
                        onClick={onForgotPassword}
                        className="auth-forgot-password"
                        disabled={isLoading}
                    >
                        Forgot Password?
                    </button>
                </div>
            </form>
        </div>
    )
}

export default LoginForm