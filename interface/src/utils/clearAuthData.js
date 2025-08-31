// Utility to clear all authentication data for fresh start
export const clearAllAuthData = () => {
    // Clear localStorage data
    localStorage.removeItem('habify_user')
    localStorage.removeItem('habify_users')
    
    // Clear any profile data
    const keys = Object.keys(localStorage)
    keys.forEach(key => {
        if (key.startsWith('habify_profile_')) {
            localStorage.removeItem(key)
        }
    })
    
    // Reset hidden input field
    const usernameElement = document.getElementById('username')
    if (usernameElement) {
        usernameElement.value = 'AnonymousUser'
    }
}

// Auto-clear on page load for fresh testing
if (window.location.search.includes('fresh=true')) {
    clearAllAuthData()
}
