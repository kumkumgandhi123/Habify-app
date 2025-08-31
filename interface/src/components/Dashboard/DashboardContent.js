import Calendar from "./Calendar/Calendar"
import UserContext from "../../context/user-context"
import React, {useContext, useEffect, useState} from "react"
import HeaderCont from "./Header/HeaderCont"
import ShopContent from '../Shop/ShopContent'
import Inventory from "../Inventory/Inventory"
import { useAuth } from "../../context/auth-context"

const DashboardContent = () => {
    const user = useContext(UserContext)
    const { user: authUser } = useAuth()
    const [profile, setProfile] = useState({
        coins: 100,
        streak: 0,
        mult: 1
    })

    useEffect(() => {
        // Initialize or load user profile from localStorage
        const loadProfile = () => {
            const currentUser = authUser?.username || user.user
            if (currentUser && currentUser !== 'AnonymousUser') {
                const savedProfile = localStorage.getItem(`habify_profile_${currentUser}`)
                if (savedProfile) {
                    try {
                        setProfile(JSON.parse(savedProfile))
                    } catch (err) {
                        // Use default profile if parsing fails
                        setProfile({
                            coins: 100,
                            streak: 5,
                            mult: 2
                        })
                    }
                } else {
                    // Create default profile for new users
                    const defaultProfile = {
                        coins: 100,
                        streak: 0,
                        mult: 1,
                        createdAt: new Date().toISOString()
                    }
                    setProfile(defaultProfile)
                    localStorage.setItem(`habify_profile_${currentUser}`, JSON.stringify(defaultProfile))
                }
            }
        }

        loadProfile()
    }, [authUser, user])

    const [disabledBtn, setDisabledBtn] = useState(false)
    const [innerCont, setInnerCont] = useState(<Calendar streak={profile.streak} mult={profile.mult}/>)
    
    const togglePageFunc = (page) => {
        if (page === 'cal'){
            setDisabledBtn(false)
            setInnerCont(<Calendar streak={profile.streak} mult={profile.mult}/>)
        }else if (page === 'shop'){
            setDisabledBtn(false)
            setInnerCont(<ShopContent />)
        }else if (page === 'inv'){
            setDisabledBtn(true)
            setInnerCont(<Inventory />)
        }
    }

    // Update inner content when profile changes
    useEffect(() => {
        setInnerCont(<Calendar streak={profile.streak} mult={profile.mult}/>)
    }, [profile])

    return (
        <UserContext.Provider value={{
            user: user.user, 
            coins: profile.coins, 
            mult: profile.mult.toString(), 
            streak: profile.streak
        }}>
            <HeaderCont togglePage={togglePageFunc} disabled={disabledBtn}/>
            <div id="content-wrap">
                {innerCont}
            </div>
        </UserContext.Provider>
    )
}

export default DashboardContent