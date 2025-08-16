import { useEffect, useState, useContext, useRef } from "react"
import UserContext from "../../../context/user-context"
import { ActivityCalendar } from 'activity-calendar-react'
import DayActivityForm from "../Forms/DayActivityForm"

const Calendar = (props) => {
    const user = useContext(UserContext)
    
    // User activity data from submissions
    const [days, setDays] = useState([])
    
    useEffect(() => {
        // Load actual user submissions from localStorage
        const loadUserData = () => {
            const submissions = JSON.parse(localStorage.getItem(`habify_submissions_${user.user}`) || '[]')
            setDays(submissions)
        }
        
        loadUserData()
    }, [user.user])
    
    // Calendar package
    const didMount = useRef(false)
    const [actCal, setActCal] = useState()
    
    useEffect(() => {
        const colorCustomization = {
            activity0: '#f0f0f0',    // No data - light gray
            activity1: '#ff6b6b',    // Fail - red
            activity2: '#feca57',    // Warning - yellow
            activity3: '#48dbfb',    // Milestone - blue
            activity4: '#0be881',    // Success - green
        }
        
        if (didMount.current) {
            setActCal(
                <ActivityCalendar 
                    id="calendar" 
                    sampleData={days} 
                    showMonth={true} 
                    colorCustomization={colorCustomization}
                />
            )
        } else {
            didMount.current = true
        }
    }, [days])
    
    // Calculate current streak
    const calculateStreak = () => {
        const sortedDays = days
            .filter(day => day.activity === 4) // Only successful days
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
        Math.round((days.filter(d => d.activity === 4).length / days.filter(d => d.activity > 0 && d.activity !== 3).length) * 100) : 0
    
    return (
        <div id="calendarpg-wrap">
            <h2 className="page-title">Habit Calendar</h2>
            
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
            
            <DayActivityForm />
        </div>
    )
}

export default Calendar