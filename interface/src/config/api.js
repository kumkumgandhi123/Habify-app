// API Configuration for Habify
// Supports both Django backend and localStorage fallback

const API_CONFIG = {
    // Set to true to use Django backend, false for localStorage only
    USE_DJANGO_BACKEND: process.env.REACT_APP_USE_BACKEND === 'true',
    
    // Django backend URL
    DJANGO_BASE_URL: process.env.REACT_APP_API_URL || 'http://localhost:8000',
    
    // API endpoints
    ENDPOINTS: {
        LOGIN: '/api/login/',
        REGISTER: '/api/new/',
        LOGOUT: '/api/logout/',
        PROFILE: '/api/profile/',
        DAYLOG: '/api/daylog/',
        REWARDS: '/api/rewards/',
        BUY_REWARD: '/buyreward/',
        CSRF: '/api/csrf/'
    }
}

// Helper function to get full API URL
export const getApiUrl = (endpoint) => {
    if (API_CONFIG.USE_DJANGO_BACKEND) {
        return `${API_CONFIG.DJANGO_BASE_URL}${API_CONFIG.ENDPOINTS[endpoint]}`
    }
    return null // Use localStorage instead
}

// API request helper with CSRF token support
export const apiRequest = async (endpoint, options = {}) => {
    if (!API_CONFIG.USE_DJANGO_BACKEND) {
        throw new Error('Django backend is disabled. Using localStorage.')
    }

    const url = getApiUrl(endpoint)
    const defaultOptions = {
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        }
    }

    // Get CSRF token for POST/PUT/DELETE requests
    if (['POST', 'PUT', 'DELETE'].includes(options.method)) {
        try {
            const csrfResponse = await fetch(getApiUrl('CSRF'), {
                credentials: 'include'
            })
            const csrfData = await csrfResponse.json()
            defaultOptions.headers['X-CSRFToken'] = csrfData.csrfToken
        } catch (error) {
            console.warn('Failed to get CSRF token:', error)
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
    
    if (!response.ok) {
        throw new Error(`API request failed: ${response.status} ${response.statusText}`)
    }

    return response.json()
}

export default API_CONFIG
