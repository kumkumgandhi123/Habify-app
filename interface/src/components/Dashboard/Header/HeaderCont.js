import React, { useContext, useState } from 'react'
import { useAuth } from '../../../context/auth-context'
import UserContext from '../../../context/user-context'
import './HeaderStyles.css'

const HeaderCont = (props) => {
    const { logout, user: authUser } = useAuth()
    const userContext = useContext(UserContext)
    const [showDropdown, setShowDropdown] = useState(false)
    
    const handleLogout = () => {
        if (window.confirm('Are you sure you want to logout?')) {
            logout()
        }
        setShowDropdown(false)
    }

    const toggleDropdown = () => {
        setShowDropdown(!showDropdown)
    }

    // Get user's information for display
    const getUserInfo = () => {
        if (authUser) {
            return {
                initial: authUser.firstName?.charAt(0).toUpperCase() || authUser.username?.charAt(0).toUpperCase() || 'U',
                name: `${authUser.firstName || ''} ${authUser.lastName || ''}`.trim() || authUser.username,
                username: authUser.username
            }
        }
        if (userContext?.user && userContext.user !== 'AnonymousUser') {
            return {
                initial: userContext.user.charAt(0).toUpperCase(),
                name: userContext.user,
                username: userContext.user
            }
        }
        return {
            initial: 'U',
            name: 'User',
            username: 'user'
        }
    }

    const userInfo = getUserInfo()

    return (
        <div id="navbar">
            <img id="nav-logo" src="/static/imgs/brand/soberize.svg" alt="Habify Logo" />
            <span className="r-nav">
                <button className="nav-link" onClick={() => props.togglePage('cal')} title="Calendar">
                    <img style={{width: '30px'}} src="/static/imgs/nav/calendar-icon.svg" alt="Calendar" />
                    <span className="nav-label">Calendar</span>
                </button>
                <button className="nav-link" onClick={() => props.togglePage('shop')} title="Shop">
                    <img style={{width: '30px'}} src="/static/imgs/nav/shop-icon.svg" alt="Shop" />
                    <span className="nav-label">Shop</span>
                </button>
                <button className="nav-link" disabled={props.disabled} onClick={() => props.togglePage('inv')} title="Profile">
                    <img style={{width: '30px'}} src="/static/imgs/nav/profile-icon.svg" alt="Profile" />
                    <span className="nav-label">Profile</span>
                </button>
                
                {/* Smart Responsive Profile Menu */}
                <div className="profile-menu-container">
                    <div 
                        className="profile-avatar"
                        onClick={toggleDropdown}
                        title={`${userInfo.name} (${userInfo.username})`}
                    >
                        {userInfo.initial}
                    </div>
                    
                    {showDropdown && (
                        <div className="profile-dropdown">
                            <div className="profile-dropdown-header">
                                <div className="profile-dropdown-avatar">
                                    {userInfo.initial}
                                </div>
                                <div className="profile-dropdown-info">
                                    <div className="profile-dropdown-name">{userInfo.name}</div>
                                    <div className="profile-dropdown-username">@{userInfo.username}</div>
                                </div>
                            </div>
                            <div className="profile-dropdown-divider"></div>
                            <button 
                                className="profile-dropdown-item logout-btn"
                                onClick={handleLogout}
                            >
                                <span className="logout-icon">🚪</span>
                                <span className="logout-text">Logout</span>
                            </button>
                        </div>
                    )}
                </div>
            </span>
            
            {/* Overlay to close dropdown when clicking outside */}
            {showDropdown && (
                <div 
                    className="dropdown-overlay"
                    onClick={() => setShowDropdown(false)}
                ></div>
            )}
        </div>
    )
}

export default HeaderCont