import { useState } from "react"
import LoginForm from "./LoginForm"
import SignUpForm from "./SignUpForm"
import ForgotPassword from "./ForgotPassword"
import './AuthForms.css'

const ToggleFormBtn = () => {
    const [currentForm, setCurrentForm] = useState('login') // 'login', 'signup', 'forgot'
    
    const showLogin = () => setCurrentForm('login')
    const showSignup = () => setCurrentForm('signup')
    const showForgotPassword = () => setCurrentForm('forgot')

    const handleResetSuccess = () => {
        setCurrentForm('login')
        // Could show a success message here
    }

    const renderForm = () => {
        switch (currentForm) {
            case 'signup':
                return <SignUpForm />
            case 'forgot':
                return <ForgotPassword onBack={showLogin} onResetSuccess={handleResetSuccess} />
            default:
                return <LoginForm onForgotPassword={showForgotPassword} />
        }
    }

    return (
        <div className="auth-container">
            {renderForm()}
            
            {currentForm !== 'forgot' && (
                <div className="auth-toggle-container">
                    <p className="auth-toggle-text">
                        {currentForm === 'login' 
                            ? "Don't have an account?" 
                            : "Already have an account?"
                        }
                    </p>
                    <button 
                        className="auth-toggle-btn" 
                        onClick={currentForm === 'login' ? showSignup : showLogin}
                        type="button"
                    >
                        {currentForm === 'login' ? 'Sign Up' : 'Sign In'}
                    </button>
                </div>
            )}
        </div>
    )
}

export default ToggleFormBtn