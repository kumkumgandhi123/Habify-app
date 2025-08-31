import { useEffect, useState, useContext, useCallback } from "react"
import UserContext from "../../../context/user-context"
import { useAuth } from "../../../context/auth-context"
import { ActivityCalendar } from 'activity-calendar-react'
import DayActivityForm from "../Forms/DayActivityForm"

const Calendar = (props) => {
    const user = useContext(UserContext)
    const { user: authUser } = useAuth()
    
    const [days, setDays] = useState([])
    const [refreshKey, setRefreshKey] = useState(0)
    const [isRefreshing, setIsRefreshing] = useState(false)
    
    const USE_DJANGO_API = process.env.REACT_APP_USE_BACKEND === 'true'
    const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000'

    // Use useCallback to stabilize loadUserData reference for useEffect
    const loadUserData = useCallback(async () => {
        try {
            setIsRefreshing(true)
            
            if (USE_DJANGO_API && authUser) {
                const response = await fetch(`${API_BASE_URL}/api/submissions/`, {
                    credentials: 'include',
                    headers: { 'Content-Type': 'application/json' }
                })
                if (response.ok) {
                    const data = await response.json()
                    const formattedDays = data.submissions.map(sub => ({
                        day: sub.day,
                        activity: sub.activity
                    }))
                    setDays([...formattedDays])
                    localStorage.setItem(`habify_submissions_${user.user}`, JSON.stringify(formattedDays))
                    return
                }
            }

            const submissions = JSON.parse(localStorage.getItem(`habify_submissions_${user.user}`) || '[]')
            const formattedSubmissions = submissions.map(sub => ({
                day: sub.day,
                activity: sub.activity
            }))
            setDays([...formattedSubmissions])
        } catch (error) {
            const submissions = JSON.parse(localStorage.getItem(`habify_submissions_${user.user}`) || '[]')
            const formattedSubmissions = submissions.map(sub => ({
                day: sub.day,
                activity: sub.activity
            }))
            setDays([...formattedSubmissions])
        } finally {
            setIsRefreshing(false)
        }
    }, [authUser, user.user, USE_DJANGO_API, API_BASE_URL])

    useEffect(() => {
        loadUserData()
    }, [loadUserData, refreshKey])

    const handleSubmissionSuccess = async (submission) => {
        await loadUserData()
        setRefreshKey(prev => prev + 1)
    }

    const [actCal, setActCal] = useState()

    useEffect(() => {
        const colorCustomization = {
            activity0: '#f0f0f0',
            activity1: '#ff6b6b',
            activity2: '#feca57',
            activity3: '#48dbfb',
            activity4: '#0be881',
            activity5: '#0be881',
        }
        setActCal(
            <ActivityCalendar 
                key={`calendar-${refreshKey}`}
                sampleData={days} 
                showMonth={true} 
                colorCustomization={colorCustomization}
            />
        )
    }, [days, refreshKey])

    const calculateStreak = () => {
        const sortedDays = days
            .filter(day => day.activity === 4 || day.activity === 5)
            .sort((a, b) => new Date(b.day) - new Date(a.day))
        
        let streak = 0
        const today = new Date()
        
        for (let i = 0; i < sortedDays.length; i++) {
            const dayDate = new Date(sortedDays[i].day)
            const expectedDate = new Date(today)
            expectedDate.setDate(today.getDate() - i)
            
            if (dayDate.toDateString() === expectedDate.toDateString()) {
                streak++
            } else break
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
                {isRefreshing && <span style={{ color: '#87CEEB', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>🔄 Updating...</span>}
            </div>
            
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                gap: '16px',
                marginBottom: '24px'
            }}>
                <div style={{ background: 'linear-gradient(135deg, #0be881, #0abde3)', color: 'white', padding: '16px', borderRadius: '12px', textAlign: 'center' }}>
                    <h3 style={{ margin: '0 0 8px 0', fontSize: '24px' }}>{currentStreak}</h3>
                    <p style={{ margin: 0, fontSize: '14px' }}>Day Streak</p>
                </div>
                <div style={{ background: 'linear-gradient(135deg, #48dbfb, #0abde3)', color: 'white', padding: '16px', borderRadius: '12px', textAlign: 'center' }}>
                    <h3 style={{ margin: '0 0 8px 0', fontSize: '24px' }}>₹ {user.coins}</h3>
                    <p style={{ margin: 0, fontSize: '14px' }}>Rupees Earned</p>
                </div>
                <div style={{ background: 'linear-gradient(135deg, #feca57, #ff9ff3)', color: 'white', padding: '16px', borderRadius: '12px', textAlign: 'center' }}>
                    <h3 style={{ margin: '0 0 8px 0', fontSize: '24px' }}>{successRate}%</h3>
                    <p style={{ margin: 0, fontSize: '14px' }}>Success Rate</p>
                </div>
                <div style={{ background: 'linear-gradient(135deg, #ff6b6b, #ee5a24)', color: 'white', padding: '16px', borderRadius: '12px', textAlign: 'center' }}>
                    <h3 style={{ margin: '0 0 8px 0', fontSize: '24px' }}>x{user.mult}</h3>
                    <p style={{ margin: 0, fontSize: '14px' }}>Multiplier</p>
                </div>
            </div>
            
            <div id="calendar-wrap">
                {actCal}
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', margin: '20px 0', flexWrap: 'wrap' }}>
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
