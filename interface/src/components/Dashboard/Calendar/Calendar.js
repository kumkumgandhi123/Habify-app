import { useState, useEffect, useCallback, useContext } from "react"
import { ActivityCalendar } from "react-activity-calendar"
import UserContext from "../../../context/user-context"
import { useAuth } from "../../../context/auth-context"

const Calendar = ({ onSubmissionSuccess }) => {
    const user = useContext(UserContext)
    const { user: authUser } = useAuth()
    const [sampleData, setSampleData] = useState([])
    const [refreshKey, setRefreshKey] = useState(0)
    
    // API Configuration
    const USE_DJANGO_API = process.env.REACT_APP_USE_BACKEND === 'true'
    const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000'
    
    console.log('Calendar - API Config:', {
        USE_DJANGO_API,
        API_BASE_URL,
        authUser: authUser ? authUser.username : 'None'
    })

    // Color customization for activity levels
    const colorCustomization = {
        light:['#161b22', '#0e4429', '#006d32', '#26a641', '#39d353']
    }

    const loadUserData = useCallback(async () => {
        console.log('Loading user data for calendar...')
        
        try {
            if (USE_DJANGO_API && authUser) {
                console.log('Fetching from Django API...')
                
                const response = await fetch(`${API_BASE_URL}/api/submissions/`, {
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })

                if (!response.ok) {
                    console.error('API Error:', response.status, response.statusText)
                    throw new Error(`API Error: ${response.status}`)
                }

                const data = await response.json()
                console.log('API Response:', data)

                if (data.submissions && Array.isArray(data.submissions)) {
                    const transformedData = data.submissions.map(submission => ({
                        date: submission.created_at.split('T')[0],
                        count: 1,
                        level: submission.activity
                    }))
                    
                    console.log('Transformed data:', transformedData)
                    setSampleData(transformedData)
                } else {
                    console.log('No submissions found in API response')
                    setSampleData([])
                }
                
            } else {
                console.log('Using localStorage fallback...')
                
                const submissions = JSON.parse(localStorage.getItem(`habify_submissions_${user.user}`) || '[]')
                console.log('LocalStorage submissions:', submissions)
                
                const transformedData = submissions.map(submission => ({
                    date: submission.day,
                    count: 1,
                    level: submission.activity
                }))
                
                console.log('Transformed localStorage data:', transformedData)
                setSampleData(transformedData)
            }
            
        } catch (error) {
            console.error('Failed to load calendar data:', error)
            
            console.log('Falling back to localStorage due to error...')
            const submissions = JSON.parse(localStorage.getItem(`habify_submissions_${user.user}`) || '[]')
            const transformedData = submissions.map(submission => ({
                date: submission.day,
                count: 1,
                level: submission.activity
            }))
            setSampleData(transformedData)
        }
    }, [USE_DJANGO_API, API_BASE_URL, authUser, user.user])

    useEffect(() => {
        console.log('Calendar useEffect triggered')
        loadUserData()
    }, [loadUserData])

    const handleSubmissionSuccess = useCallback(async (submissionData) => {
        console.log('Calendar: Handling successful submission:', submissionData)
        
        await loadUserData()
        
        setTimeout(() => {
            setRefreshKey(prev => prev + 1)
            console.log('Calendar: Refresh key updated, component should re-render')
        }, 100)
        
    }, [loadUserData])

    useEffect(() => {
        if (onSubmissionSuccess) {
            onSubmissionSuccess(handleSubmissionSuccess)
        }
    }, [onSubmissionSuccess, handleSubmissionSuccess])

    console.log('Calendar rendering with data:', sampleData)
    console.log('Refresh key:', refreshKey)

    return (
        <div style={{ marginTop: '24px' }}>
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
                    📊 Your Progress Calendar
                </h2>
                
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    minHeight: '200px'
                }}>
                    <ActivityCalendar
                        key={refreshKey}
                        data={sampleData}
                        blockSize={12}
                        blockMargin={2}
                        fontSize={12}
                        hideColorLegend={false}
                        hideTotalCount={false}
                        showWeekdayLabels={true}
                    />
                </div>
                
                <div style={{
                    textAlign: 'center',
                    marginTop: '16px',
                    fontSize: '14px',
                    color: '#666'
                }}>
                    <p style={{ margin: '4px 0' }}>
                        🟢 Success • 🟡 Partial • 🔴 Struggle • ⚫ No data
                    </p>
                    <p style={{ margin: '4px 0', fontWeight: 'bold' }}>
                        Total entries: {sampleData.length}
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Calendar
