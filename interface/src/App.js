import React, { useState, useEffect } from 'react'
import ToggleFormBtn from './components/Accounts/ToggleFormBtn'
import DashboardContent from './components/Dashboard/DashboardContent'
import { AuthProvider, useAuth } from './context/auth-context'
import UserContext from './context/user-context'
import { clearAllAuthData } from './utils/clearAuthData'

function AppContent() {
  const { user: authUser, isAuthenticated } = useAuth()
  const [loggedUser, setLoggedUser] = useState('AnonymousUser')

  useEffect(() => {
    // Clear data on fresh start if needed
    if (window.location.search.includes('fresh=true')) {
      clearAllAuthData()
      // Remove the fresh parameter from URL
      window.history.replaceState({}, document.title, window.location.pathname)
    }
  }, [])

  useEffect(() => {
    // Update the logged user state based on authentication
    if (isAuthenticated && authUser) {
      setLoggedUser(authUser.username)
      
      // Update the hidden input field for compatibility
      const usernameElement = document.getElementById('username')
      if (usernameElement) {
        usernameElement.value = authUser.username
      }
    } else {
      setLoggedUser('AnonymousUser')
      
      // Update the hidden input field for compatibility
      const usernameElement = document.getElementById('username')
      if (usernameElement) {
        usernameElement.value = 'AnonymousUser'
      }
    }
  }, [isAuthenticated, authUser])

  // Determine what content to show
  const shouldShowAuth = !isAuthenticated || loggedUser === 'AnonymousUser' || !loggedUser
  
  return (
    <div className="App">
      <UserContext.Provider value={{user: loggedUser}}>
        {shouldShowAuth ? <ToggleFormBtn /> : <DashboardContent />}
      </UserContext.Provider>
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}

export default App