import { useState, useEffect, useContext } from "react"
import UserContext from "../../../context/user-context"
import { useAuth } from "../../../context/auth-context"

const DayActivityForm = ({ onSubmissionSuccess }) => {
    const user = useContext(UserContext)
    const { user: authUser } = useAuth()
    const [formContent, setFormContent] = useState(true)
    const [sober, setSober] = useState(null)
    const [isSubmitting, setIsSubmitting] = useState(false)
    
    // API Configuration
    const USE_DJANGO_API = process.env.REACT_APP_USE_BACKEND === 'true'
    const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000'
    
    // Get today's date in YYYY-MM-DD format
    const today = new Date()
    const todayString = today.toISOString().split('T')[0]
    
    useEffect(() => {
        // Check if user has already submitted today
        const submissions = JSON.parse(localStorage.getItem(`habify_submissions_${user.user}`) || '[]')
        const todaySubmission = submissions.find(sub => sub.day === todayString)
        
        if (todaySubmission) {
                    setFormContent(false)
                }
    }, [user.user, todayString])

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

    const formHandler = async (e) => {
        e.preventDefault()
        
        if (sober === null) {
            alert('Please select Pass or Fail first!')
            return
        }
        
        setIsSubmitting(true)
        
        try {
            const notes = e.target.notes.value
            let newSubmission = {
                day: todayString,
                activity: sober,
                notes: notes,
                user: user.user,
                timestamp: new Date().toISOString()
            }

            if (USE_DJANGO_API && authUser) {
                // Submit to Django API
                console.log('Submitting to Django API:', newSubmission)
                
                const csrfToken = await getCSRFToken()
                console.log('CSRF Token:', csrfToken ? 'Retrieved successfully' : 'Failed to retrieve')
                const response = await fetch(`${API_BASE_URL}/api/daylog/`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRFToken': csrfToken,
                        'Referer': window.location.origin
                    },
                    credentials: 'include',
                    body: JSON.stringify({
                        activity: sober === 4 ? 5 : sober, // Convert frontend value to backend value
                        notes: notes
                    })
                })

                if (!response.ok) {
                    const errorText = await response.text()
                    console.error('API Error Response:', response.status, errorText)
                    throw new Error(`API request failed: ${response.status} - ${errorText}`)
                }
                
                console.log('✅ Successfully submitted to Django API')
                
                // Award coins for successful day
                if (sober === 4) { // Pass
                    const coinsEarned = 10 * (user.mult || 1)
                    alert(`🎉 Great job! You earned ₹${coinsEarned} rupees for staying on track!`)
                } else {
                    alert('📝 Thank you for your honesty. Tomorrow is a new day!')
                }
                
                setFormContent(false)
                
                // IMMEDIATELY call calendar refresh callback after successful API submission
                console.log('🚀 Form: Calling calendar refresh IMMEDIATELY after API success')
                if (onSubmissionSuccess) {
                    await onSubmissionSuccess(newSubmission)
                    console.log('✅ Form: Calendar refresh callback completed')
                } else {
                    console.error('❌ Form: No callback function provided for calendar refresh!')
                }
                
            } else {
                // Fallback to localStorage
                console.log('Using localStorage fallback')
                await new Promise(resolve => setTimeout(resolve, 800)) // Simulate API delay
                
                // Always save to localStorage for frontend consistency
                const submissions = JSON.parse(localStorage.getItem(`habify_submissions_${user.user}`) || '[]')
                
                // Remove any existing submission for today first
                const filteredSubmissions = submissions.filter(sub => sub.day !== todayString)
                filteredSubmissions.push(newSubmission)
                localStorage.setItem(`habify_submissions_${user.user}`, JSON.stringify(filteredSubmissions))
                
                console.log('Form: Saved submission to localStorage:', newSubmission)
                console.log('Form: All submissions:', filteredSubmissions)
                
                // Award coins for successful day
                if (sober === 4) { // Pass
                    const coinsEarned = 10 * (user.mult || 1)
                    
                    // Update user profile with coins
                    const currentUser = JSON.parse(localStorage.getItem(`habify_profile_${user.user}`) || '{}')
                    currentUser.coins = (currentUser.coins || 0) + coinsEarned
                    currentUser.lastActivity = todayString
                    localStorage.setItem(`habify_profile_${user.user}`, JSON.stringify(currentUser))
                    
                    alert(`🎉 Great job! You earned ₹${coinsEarned} rupees for staying on track!`)
                } else {
                    alert('📝 Thank you for your honesty. Tomorrow is a new day!')
                }
                
                setFormContent(false)
                
                // Call parent callback to refresh calendar data
                console.log('📤 Form: About to call calendar refresh callback (localStorage)')
                if (onSubmissionSuccess) {
                    console.log('🚀 Form: Calling onSubmissionSuccess now!')
                    await onSubmissionSuccess(newSubmission)
                    console.log('✅ Form: Callback called successfully')
                } else {
                    console.error('❌ Form: No callback function provided for calendar refresh!')
                }
            }
            
        } catch (error) {
            console.error('Submission error:', error)
            alert('Something went wrong. Please try again.')
        } finally {
            setIsSubmitting(false)
        }
    }
    
    const resetForm = () => {
        if (window.confirm('Are you sure you want to submit for today again? This will override your previous entry.')) {
            // Remove today's submission
            const submissions = JSON.parse(localStorage.getItem(`habify_submissions_${user.user}`) || '[]')
            const filteredSubmissions = submissions.filter(sub => sub.day !== todayString)
            localStorage.setItem(`habify_submissions_${user.user}`, JSON.stringify(filteredSubmissions))
            
            setFormContent(true)
            setSober(null)
            
            // Call parent callback to refresh calendar data
            if (onSubmissionSuccess) {
                onSubmissionSuccess(null) // Signal data refresh needed
            }
        }
    }
    
    return (
        <div style={{ marginTop: '24px' }}>
        {formContent ? (
                <div style={{
                    background: 'white',
                    borderRadius: '16px',
                    padding: '24px',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                    border: '1px solid #e0e0e0'
                }}>
                    <h2 style={{
                        textAlign: 'center',
                        margin: '0 0 24px 0',
                        color: '#333',
                        fontSize: '24px'
                    }}>
                        📅 Daily Check-in
                    </h2>
                    
                    <div style={{
                        textAlign: 'center',
                        marginBottom: '24px',
                        padding: '16px',
                        background: 'linear-gradient(135deg, #87CEEB, #5F9EA0)',
                        borderRadius: '12px',
                        color: 'white'
                    }}>
                        <h3 style={{ margin: '0 0 8px 0' }}>
                            {today.toLocaleDateString('en-US', { 
                                weekday: 'long', 
                                year: 'numeric', 
                                month: 'long', 
                                day: 'numeric' 
                            })}
                        </h3>
                        <p style={{ margin: 0, opacity: 0.9 }}>
                            How did your day go?
                        </p>
                    </div>

                    <form onSubmit={formHandler}>
                        <div style={{ marginBottom: '24px' }}>
                            <h4 style={{ 
                                margin: '0 0 16px 0', 
                                color: '#333',
                                textAlign: 'center'
                            }}>
                                Rate your day:
                            </h4>
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: '1fr 1fr',
                                gap: '16px'
                            }}>
                                <button 
                                    onClick={() => setSober(4)} 
                                    type="button" 
                                    style={{
                                        padding: '20px',
                                        borderRadius: '12px',
                                        border: sober === 4 ? '3px solid #0be881' : '2px solid #e0e0e0',
                                        background: sober === 4 ? '#e8f5e8' : 'white',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s ease',
                                        fontSize: '16px',
                                        fontWeight: 'bold',
                                        color: sober === 4 ? '#0be881' : '#666'
                                    }}
                                >
                                    <div style={{ fontSize: '32px', marginBottom: '8px' }}>✅</div>
                                    Success!
                                    <div style={{ fontSize: '12px', fontWeight: 'normal', marginTop: '4px' }}>
                                        Stayed on track
                                    </div>
                                </button>
                                
                                <button 
                                    onClick={() => setSober(1)} 
                                    type="button" 
                                    style={{
                                        padding: '20px',
                                        borderRadius: '12px',
                                        border: sober === 1 ? '3px solid #ff6b6b' : '2px solid #e0e0e0',
                                        background: sober === 1 ? '#ffe6e6' : 'white',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s ease',
                                        fontSize: '16px',
                                        fontWeight: 'bold',
                                        color: sober === 1 ? '#ff6b6b' : '#666'
                                    }}
                                >
                                    <div style={{ fontSize: '32px', marginBottom: '8px' }}>❌</div>
                                    Struggled
                                    <div style={{ fontSize: '12px', fontWeight: 'normal', marginTop: '4px' }}>
                                        Had difficulties
                                    </div>
                                </button>
                            </div>
                        </div>

                        <div style={{ marginBottom: '24px' }}>
                            <label style={{
                                display: 'block',
                                marginBottom: '8px',
                                fontWeight: 'bold',
                                color: '#333'
                            }}>
                                Notes (optional):
                            </label>
                            <textarea 
                                name="notes"
                                placeholder="How are you feeling? What went well? What was challenging?"
                                style={{
                                    width: '100%',
                                    height: '100px',
                                    padding: '12px',
                                    borderRadius: '8px',
                                    border: '2px solid #e0e0e0',
                                    resize: 'vertical',
                                    fontSize: '14px',
                                    boxSizing: 'border-box'
                                }}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={sober === null || isSubmitting}
                            style={{
                                width: '100%',
                                padding: '16px',
                                borderRadius: '12px',
                                border: 'none',
                                background: sober === null || isSubmitting 
                                    ? '#ccc' 
                                    : 'linear-gradient(135deg, #87CEEB, #5F9EA0)',
                                color: 'white',
                                fontSize: '18px',
                                fontWeight: 'bold',
                                cursor: sober === null || isSubmitting ? 'not-allowed' : 'pointer',
                                transition: 'all 0.2s ease'
                            }}
                        >
                            {isSubmitting ? '🔄 Submitting...' : '📝 Submit Daily Check-in'}
                        </button>
        </form>
                </div>
            ) : (
                <div style={{
                    background: 'linear-gradient(135deg, #e8f5e8, #f0f8ff)',
                    borderRadius: '16px',
                    padding: '32px',
                    textAlign: 'center',
                    border: '2px solid #0be881'
                }}>
                    <div style={{ fontSize: '64px', marginBottom: '16px' }}>🎉</div>
                    <h2 style={{ 
                        margin: '0 0 12px 0', 
                        color: '#0be881',
                        fontSize: '24px'
                    }}>
                        All done for today!
                    </h2>
                    <p style={{ 
                        margin: '0 0 20px 0', 
                        color: '#666',
                        fontSize: '16px'
                    }}>
                        Thank you for checking in. See you tomorrow!
                    </p>
                    <button
                        onClick={resetForm}
                        style={{
                            background: 'transparent',
                            color: '#87CEEB',
                            border: '2px solid #87CEEB',
                            padding: '8px 16px',
                            borderRadius: '20px',
                            fontSize: '14px',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease'
                        }}
                    >
                        Update Today's Entry
                    </button>
                </div>
            )}
        </div>
    )
}

export default DayActivityForm