import React, { useState } from 'react'
import { useAuth } from '../../context/auth-context'
import './AuthForms.css'

const ForgotPassword = ({ onBack, onResetSuccess }) => {
    const { forgotPassword, resetPassword, isLoading, error, clearError } = useAuth()
    const [email, setEmail] = useState('')
    const [resetToken, setResetToken] = useState('')
    const [resetUid, setResetUid] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [step, setStep] = useState('email') // 'email', 'token', 'password'
    const [success, setSuccess] = useState('')

    const handleEmailSubmit = async (e) => {
        e.preventDefault()
        clearError()
        setSuccess('')

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(email.trim())) {
            return
        }

        const result = await forgotPassword(email.trim())
        
        if (result.success) {
            setSuccess(result.message)
            setResetToken(result.resetToken || '') // In demo mode, auto-fill the token
            setResetUid(result.resetUid || '') // Store the UID for Django backend
            setStep('token')
        }
    }

    const handleTokenSubmit = (e) => {
        e.preventDefault()
        if (resetToken.trim()) {
            setStep('password')
        }
    }

    const handlePasswordSubmit = async (e) => {
        e.preventDefault()
        clearError()
        setSuccess('')

        if (newPassword !== confirmPassword) {
            return
        }

        if (newPassword.length < 6) {
            return
        }

        const result = await resetPassword(resetToken, newPassword, resetUid)
        
        if (result.success) {
            setSuccess(result.message)
            setTimeout(() => {
                onResetSuccess()
            }, 2000)
        }
    }

    const handleInputChange = (setter) => (e) => {
        setter(e.target.value)
        if (error) clearError()
        if (success) setSuccess('')
    }

    return (
        <div className="auth-card">
            <div className="auth-header">
                <h3 className="auth-title">
                    {step === 'email' && 'Reset Password'}
                    {step === 'token' && 'Check Your Email'}
                    {step === 'password' && 'Create New Password'}
                </h3>
                <p className="auth-subtitle">
                    {step === 'email' && 'Enter your email to receive reset instructions'}
                    {step === 'token' && 'Enter the reset code from your email'}
                    {step === 'password' && 'Choose a new secure password'}
                </p>
            </div>

            {error && <div className="auth-error">{error}</div>}
            {success && <div className="auth-success">{success}</div>}

            {/* Step 1: Email Input */}
            {step === 'email' && (
                <form className="auth-form" onSubmit={handleEmailSubmit}>
                    <div className="auth-input-group">
                        <label className="auth-label" htmlFor="reset-email">Email Address</label>
                        <input 
                            type="email" 
                            className="auth-input"
                            placeholder="Enter your email address" 
                            id="reset-email"
                            value={email}
                            onChange={handleInputChange(setEmail)}
                            required
                            disabled={isLoading}
                        />
                    </div>

                    <button 
                        type="submit" 
                        className="auth-submit-btn"
                        disabled={isLoading || !email.trim()}
                    >
                        {isLoading ? 'Sending Reset Email...' : 'Send Reset Instructions'}
                    </button>
                </form>
            )}

            {/* Step 2: Token Input */}
            {step === 'token' && (
                <>
                    <div style={{
                        background: '#e3f2fd',
                        border: '1px solid #2196f3',
                        borderRadius: '8px',
                        padding: '16px',
                        marginBottom: '24px',
                        textAlign: 'center'
                    }}>
                        <div style={{ fontSize: '32px', marginBottom: '8px' }}>📧</div>
                        <p style={{ margin: '0 0 8px 0', color: '#1976d2', fontWeight: '600' }}>
                            Demo Mode - Reset Code:
                        </p>
                        <p style={{ 
                            margin: '0', 
                            fontFamily: 'monospace', 
                            fontSize: '18px', 
                            fontWeight: 'bold',
                            color: '#1976d2',
                            letterSpacing: '2px'
                        }}>
                            {resetToken}
                        </p>
                        <p style={{ margin: '8px 0 0 0', fontSize: '12px', color: '#666' }}>
                            In production, this would be sent to your email
                        </p>
                    </div>

                    <form className="auth-form" onSubmit={handleTokenSubmit}>
                        <div className="auth-input-group">
                            <label className="auth-label" htmlFor="reset-token">Reset Code</label>
                            <input 
                                type="text" 
                                className="auth-input"
                                placeholder="Enter the reset code from your email" 
                                id="reset-token"
                                value={resetToken}
                                onChange={handleInputChange(setResetToken)}
                                required
                                style={{ 
                                    fontFamily: 'monospace', 
                                    letterSpacing: '1px',
                                    textAlign: 'center'
                                }}
                            />
                        </div>

                        <button 
                            type="submit" 
                            className="auth-submit-btn"
                            disabled={!resetToken.trim()}
                        >
                            Verify Code
                        </button>
                    </form>
                </>
            )}

            {/* Step 3: New Password */}
            {step === 'password' && (
                <form className="auth-form" onSubmit={handlePasswordSubmit}>
                    <div className="auth-input-group">
                        <label className="auth-label" htmlFor="new-password">New Password</label>
                        <input 
                            type="password" 
                            className="auth-input"
                            placeholder="Enter new password (min 6 chars)" 
                            id="new-password"
                            value={newPassword}
                            onChange={handleInputChange(setNewPassword)}
                            required
                            disabled={isLoading}
                            minLength="6"
                        />
                    </div>

                    <div className="auth-input-group">
                        <label className="auth-label" htmlFor="confirm-password">Confirm Password</label>
                        <input 
                            type="password" 
                            className="auth-input"
                            placeholder="Confirm your new password" 
                            id="confirm-password"
                            value={confirmPassword}
                            onChange={handleInputChange(setConfirmPassword)}
                            required
                            disabled={isLoading}
                            style={{
                                borderColor: confirmPassword && newPassword !== confirmPassword ? '#ff6b6b' : undefined
                            }}
                        />
                        {confirmPassword && newPassword !== confirmPassword && (
                            <p style={{ 
                                color: '#ff6b6b', 
                                fontSize: '12px', 
                                margin: '4px 0 0 0' 
                            }}>
                                Passwords do not match
                            </p>
                        )}
                    </div>

                    <button 
                        type="submit" 
                        className="auth-submit-btn"
                        disabled={isLoading || !newPassword || !confirmPassword || newPassword !== confirmPassword}
                    >
                        {isLoading ? 'Resetting Password...' : 'Reset Password'}
                    </button>
                </form>
            )}

            {/* Back Button */}
            <div className="auth-toggle-container">
                <button 
                    className="auth-toggle-btn" 
                    onClick={onBack}
                    type="button"
                    disabled={isLoading}
                >
                    ← Back to Login
                </button>
            </div>
        </div>
    )
}

export default ForgotPassword
