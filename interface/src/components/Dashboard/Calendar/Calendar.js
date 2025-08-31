import { useEffect, useState, useContext, useRef } from "react"
import UserContext from "../../../context/user-context"
import { useAuth } from "../../../context/auth-context"
import { ActivityCalendar } from 'activity-calendar-react'
import DayActivityForm from "../Forms/DayActivityForm"

const Calendar = (props) => {
    const user = useContext(UserContext)
    const { user: authUser } = useAuth()
    
    // User activity data from submissions
    const [days, setDays] = useState([])
    const [refreshKey, setRefreshKey] = useState(0)
    const [isRefreshing, setIsRefreshing] = useState(false)
    
    // API Configuration
    const USE_DJANGO_API = process.env.REACT_APP_USE_BACKEND === 'true'
    const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000'
    
    const loadUserData = async () => {
        try {
            setIsRefreshing(true)
            console.log('=== LOADING CALENDAR DATA ===')
            console.log('Refresh key:', refreshKey)
            console.log('Auth user:', authUser ? authUser.username : 'None')
            console.log('USE_DJANGO_API:', USE_DJANGO_API)
            
            if (USE_DJANGO_API && authUser) {
                // Load from Django API
                console.log('Loading calendar data from Django API')
                const response = await fetch(`${API_BASE_URL}/api/submissions/`, {
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                
                if (response.ok) {
                    const data = await response.json()
                    console.log('API calendar data:', data.submissions)
                    
                    // Transform API data to match ActivityCalendar format
                    const formattedDays = data.submissions.map(submission => ({
                        day: submission.day,
                        activity: submission.activity
                    }))
                    
                    console.log('Formatted days for calendar:', formattedDays)
                    console.log('🔄 Setting new days data in state')
                    setDays([...formattedDays]) // Force new array reference
                    
                    // Also sync to localStorage for consistency
                    localStorage.setItem(`habify_submissions_${user.user}`, JSON.stringify(formattedDays))
                    
                    return
                }
            }
            
            // Fallback to localStorage
            console.log('Loading calendar data from localStorage')
            const submissions = JSON.parse(localStorage.getItem(`habify_submissions_${user.user}`) || '[]')
            
            // Ensure data is in the correct format for ActivityCalendar
            const formattedSubmissions = submissions.map(submission => ({
                day: submission.day,
                activity: submission.activity
            }))
            
            console.log('LocalStorage formatted days:', formattedSubmissions)
            console.log('🔄 Setting localStorage days data in state')
            setDays([...formattedSubmissions]) // Force new array reference
            
        } catch (error) {
            console.error('Error loading calendar data:', error)
            // Fallback to localStorage on error
            const submissions = JSON.parse(localStorage.getItem(`habify_submissions_${user.user}`) || '[]')
            
            // Ensure data is in the correct format for ActivityCalendar
            const formattedSubmissions = submissions.map(submission => ({
                day: submission.day,
                activity: submission.activity
            }))
            
            console.log('Error fallback formatted days:', formattedSubmissions)
            console.log('🔄 Setting error fallback days data in state')
            setDays([...formattedSubmissions]) // Force new array reference
        } finally {
            setIsRefreshing(false)
            console.log('=== CALENDAR DATA LOADING COMPLETE ===')
        }
    }
    
    useEffect(() => {
        console.log('🔄 useEffect triggered - loading calendar data')
        console.log('   - user.user:', user.user)
        console.log('   - refreshKey:', refreshKey)
        console.log('   - authUser:', authUser ? authUser.username : 'None')
        loadUserData()
    }, [user.user, refreshKey, authUser])

    // Callback function to refresh calendar when new submission is added
    const handleSubmissionSuccess = async (submission) => {
        console.log('🔄 Calendar refresh callback triggered!', submission)
        
        // Force immediate data reload
        console.log('⚡ Forcing immediate calendar data reload...')
        await loadUserData()
        
        // Also update refresh key to force component re-render
        setRefreshKey(prev => {
            const newKey = prev + 1
            console.log('📈 Updated refresh key from', prev, 'to', newKey)
            return newKey
        })
    }
    
    // Calendar package rendering
    const [actCal, setActCal] = useState()
    
    useEffect(() => {
        const colorCustomization = {
            activity0: '#f0f0f0',    // No data - light gray
            activity1: '#ff6b6b',    // Fail - red
            activity2: '#feca57',    // Warning - yellow
            activity3: '#48dbfb',    // Milestone - blue
            activity4: '#0be881',    // Success - green
            activity5: '#0be881',    // Success - green (backend uses 5)
        }
        
        console.log('🎨 Calendar component re-rendering...')
        console.log('   - Days data:', days)
        console.log('   - Days length:', days.length)
        console.log('   - Refresh key:', refreshKey)
        console.log('   - Current time:', new Date().toLocaleTimeString())
        
        // Always render the calendar, force re-mount with key when refreshKey changes
        setActCal(
            <ActivityCalendar 
                key={`calendar-${refreshKey}`}
                sampleData={days} 
                showMonth={true} 
                colorCustomization={colorCustomization}
            />
        )
    }, [days, refreshKey])
    
    // Calculate current streak
    const calculateStreak = () => {
        const sortedDays = days
            .filter(day => day.activity === 4 || day.activity === 5) // Success can be 4 or 5
            .sort((a, b) => new Date(b.day) - new Date(a.day))
        
        let streak = 0
        const today = new Date()
        
        for (let i = 0; i < sortedDays.length; i++) {
            const dayDate = new Date(sortedDays[i].day)
            const expectedDate = new Date(today)
            expectedDate.setDate(today.getDate() - i)
            
            if (dayDate.toDateString() === expectedDate.toDateString()) {
                streak++
            } else {
                break
            }
        }
        
        return streak
    }
    
    const currentStreak = calculateStreak()
    const successRate = days.length > 0 ? 
        Math.round((days.filter(d => d.activity === 4 || d.activity === 5).length / days.filter(d => d.activity > 0 && d.activity !== 3).length) * 100) : 0
    


    return (
        <div id="calendarpg-wrap">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h2 className="page-title" style={{ margin: 0 }}>Habit Calendar</h2>
                {isRefreshing && (
                    <span style={{ 
                        color: '#87CEEB', 
                        fontSize: '14px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                    }}>
                        🔄 Updating...
                    </span>
                )}
            </div>
            
            {/* Stats Summary */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                gap: '16px',
                marginBottom: '24px'
            }}>
                <div style={{
                    background: 'linear-gradient(135deg, #0be881, #0abde3)',
                    color: 'white',
                    padding: '16px',
                    borderRadius: '12px',
                    textAlign: 'center'
                }}>
                    <h3 style={{ margin: '0 0 8px 0', fontSize: '24px' }}>{currentStreak}</h3>
                    <p style={{ margin: 0, fontSize: '14px' }}>Day Streak</p>
                </div>
                <div style={{
                    background: 'linear-gradient(135deg, #48dbfb, #0abde3)',
                    color: 'white',
                    padding: '16px',
                    borderRadius: '12px',
                    textAlign: 'center'
                }}>
                    <h3 style={{ margin: '0 0 8px 0', fontSize: '24px' }}>₹ {user.coins}</h3>
                    <p style={{ margin: 0, fontSize: '14px' }}>Rupees Earned</p>
                </div>
                <div style={{
                    background: 'linear-gradient(135deg, #feca57, #ff9ff3)',
                    color: 'white',
                    padding: '16px',
                    borderRadius: '12px',
                    textAlign: 'center'
                }}>
                    <h3 style={{ margin: '0 0 8px 0', fontSize: '24px' }}>{successRate}%</h3>
                    <p style={{ margin: 0, fontSize: '14px' }}>Success Rate</p>
                </div>
                <div style={{
                    background: 'linear-gradient(135deg, #ff6b6b, #ee5a24)',
                    color: 'white',
                    padding: '16px',
                    borderRadius: '12px',
                    textAlign: 'center'
                }}>
                    <h3 style={{ margin: '0 0 8px 0', fontSize: '24px' }}>x{user.mult}</h3>
                    <p style={{ margin: 0, fontSize: '14px' }}>Multiplier</p>
                </div>
            </div>
            
            <div id="calendar-wrap">
                {actCal}
            </div>
            
            {/* Calendar Legend */}
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '20px',
                margin: '20px 0',
                flexWrap: 'wrap'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '12px', height: '12px', backgroundColor: '#0be881', borderRadius: '2px' }}></div>
                    <span style={{ fontSize: '12px', color: '#666' }}>Success</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '12px', height: '12px', backgroundColor: '#ff6b6b', borderRadius: '2px' }}></div>
                    <span style={{ fontSize: '12px', color: '#666' }}>Failed</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '12px', height: '12px', backgroundColor: '#48dbfb', borderRadius: '2px' }}></div>
                    <span style={{ fontSize: '12px', color: '#666' }}>Milestone</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '12px', height: '12px', backgroundColor: '#f0f0f0', borderRadius: '2px', border: '1px solid #ddd' }}></div>
                    <span style={{ fontSize: '12px', color: '#666' }}>No data</span>
                </div>
            </div>
            
            <DayActivityForm onSubmissionSuccess={handleSubmissionSuccess} />
        </div>
    )
}

export default Calendar