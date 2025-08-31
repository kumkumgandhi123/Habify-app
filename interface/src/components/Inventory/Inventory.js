import { useEffect, useContext, useState } from "react"
import UserContext from "../../context/user-context"
import { useAuth } from "../../context/auth-context"

const Inventory = () => {
    const user = useContext(UserContext)
    const { user: authUser } = useAuth()
    const [userRewards, setUserRewards] = useState([])
    const [activeAvatars, setActiveAvatars] = useState([])
    
    useEffect(() => {
        // Load user's purchased items
        const purchases = JSON.parse(localStorage.getItem(`habify_purchases_${user.user}`) || '[]')
        setUserRewards(purchases)
        
        // Load active avatars/pets
        const activePets = JSON.parse(localStorage.getItem(`habify_active_pets_${user.user}`) || '[]')
        setActiveAvatars(activePets)
    }, [user.user])

    const applyPet = (pet) => {
        // Toggle pet active status
        const isActive = activeAvatars.some(activePet => activePet.purchaseId === pet.purchaseId)
        
        if (isActive) {
            // Remove from active pets
            const newActivePets = activeAvatars.filter(activePet => activePet.purchaseId !== pet.purchaseId)
            setActiveAvatars(newActivePets)
            localStorage.setItem(`habify_active_pets_${user.user}`, JSON.stringify(newActivePets))
            alert(`${pet.name} is no longer active!`)
        } else {
            // Add to active pets (limit to 3)
            if (activeAvatars.length >= 3) {
                alert('You can only have 3 active pets at a time!')
                return
            }
            const newActivePets = [...activeAvatars, pet]
            setActiveAvatars(newActivePets)
            localStorage.setItem(`habify_active_pets_${user.user}`, JSON.stringify(newActivePets))
            alert(`${pet.name} is now your active companion!`)
        }
    }

    const getUserInitial = () => {
        if (authUser?.firstName) {
            return authUser.firstName.charAt(0).toUpperCase()
        }
        return user.user?.charAt(0).toUpperCase() || 'U'
    }

    const getUserDisplayName = () => {
        if (authUser?.firstName && authUser?.lastName) {
            return `${authUser.firstName} ${authUser.lastName}`
        }
        return user.user || 'User'
    }

    // Calculate user stats
    const totalSpent = userRewards.reduce((sum, item) => sum + item.price, 0)
    const joinDate = authUser?.loginTime ? new Date(authUser.loginTime).toLocaleDateString() : new Date().toLocaleDateString()

    return (
        <div id="inventorypg-wrap">
            {/* Profile Header */}
            <div style={{
                background: 'linear-gradient(135deg, #87CEEB, #5F9EA0)',
                borderRadius: '16px',
                padding: '24px',
                color: 'white',
                marginBottom: '24px',
                boxShadow: '0 8px 32px rgba(135, 206, 235, 0.3)'
            }}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '20px'
                }}>
                    <div style={{
                        width: '80px',
                        height: '80px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #ffffff, #f0f0f0)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '32px',
                        fontWeight: 'bold',
                        color: '#87CEEB',
                        border: '4px solid rgba(255, 255, 255, 0.3)'
                    }}>
                        {getUserInitial()}
                    </div>
                    <div style={{ flex: 1 }}>
                        <h2 style={{ margin: '0 0 8px 0', fontSize: '28px' }}>
                            {getUserDisplayName()}
                        </h2>
                        <p style={{ margin: '0 0 4px 0', opacity: 0.9 }}>
                            @{user.user}
                        </p>
                        <p style={{ margin: 0, opacity: 0.8, fontSize: '14px' }}>
                            Member since {joinDate}
                        </p>
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                gap: '16px',
                marginBottom: '32px'
            }}>
                <div style={{
                    background: 'linear-gradient(135deg, #feca57, #ff9ff3)',
                    color: 'white',
                    padding: '20px',
                    borderRadius: '12px',
                    textAlign: 'center'
                }}>
                    <h3 style={{ margin: '0 0 8px 0', fontSize: '24px' }}>₹ {user.coins}</h3>
                    <p style={{ margin: 0, fontSize: '14px' }}>Current Rupees</p>
                </div>
                <div style={{
                    background: 'linear-gradient(135deg, #48dbfb, #0abde3)',
                    color: 'white',
                    padding: '20px',
                    borderRadius: '12px',
                    textAlign: 'center'
                }}>
                    <h3 style={{ margin: '0 0 8px 0', fontSize: '24px' }}>{userRewards.length}</h3>
                    <p style={{ margin: 0, fontSize: '14px' }}>Pets Owned</p>
                </div>
                <div style={{
                    background: 'linear-gradient(135deg, #0be881, #0abde3)',
                    color: 'white',
                    padding: '20px',
                    borderRadius: '12px',
                    textAlign: 'center'
                }}>
                    <h3 style={{ margin: '0 0 8px 0', fontSize: '24px' }}>{activeAvatars.length}/3</h3>
                    <p style={{ margin: 0, fontSize: '14px' }}>Active Pets</p>
                </div>
                <div style={{
                    background: 'linear-gradient(135deg, #ff6b6b, #ee5a24)',
                    color: 'white',
                    padding: '20px',
                    borderRadius: '12px',
                    textAlign: 'center'
                }}>
                    <h3 style={{ margin: '0 0 8px 0', fontSize: '24px' }}>{totalSpent}</h3>
                    <p style={{ margin: 0, fontSize: '14px' }}>Total Spent</p>
                </div>
            </div>

            {/* Active Pets Section */}
            {activeAvatars.length > 0 && (
                <div style={{ marginBottom: '32px' }}>
                    <h3 style={{
                        color: '#87CEEB',
                        borderBottom: '2px solid #87CEEB',
                        paddingBottom: '8px',
                        marginBottom: '16px'
                    }}>
                        🌟 Active Companions ({activeAvatars.length}/3)
                    </h3>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                        gap: '16px'
                    }}>
                        {activeAvatars.map((pet) => (
                            <div 
                                key={pet.purchaseId}
                                style={{
                                    background: 'linear-gradient(135deg, #e8f5e8, #f0f8ff)',
                                    borderRadius: '12px',
                                    padding: '16px',
                                    border: '2px solid #0be881',
                                    textAlign: 'center',
                                    position: 'relative'
                                }}
                            >
                                <div style={{
                                    position: 'absolute',
                                    top: '8px',
                                    right: '8px',
                                    background: '#0be881',
                                    color: 'white',
                                    padding: '4px 8px',
                                    borderRadius: '12px',
                                    fontSize: '10px',
                                    fontWeight: 'bold'
                                }}>
                                    ACTIVE
                                </div>
                                <img 
                                    src={pet.image} 
                                    alt={pet.name}
                                    style={{
                                        width: '80px',
                                        height: '80px',
                                        objectFit: 'cover',
                                        borderRadius: '50%',
                                        marginBottom: '12px'
                                    }}
                                />
                                <h4 style={{ margin: '0 0 8px 0', color: '#333' }}>{pet.name}</h4>
                                <button
                                    onClick={() => applyPet(pet)}
                                    style={{
                                        background: '#ff6b6b',
                                        color: 'white',
                                        border: 'none',
                                        padding: '6px 12px',
                                        borderRadius: '16px',
                                        fontSize: '12px',
                                        cursor: 'pointer'
                                    }}
                                >
                                    Deactivate
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Inventory Section */}
            <h3 style={{
                color: '#87CEEB',
                borderBottom: '2px solid #87CEEB',
                paddingBottom: '8px',
                marginBottom: '16px'
            }}>
                🎒 Pet Collection
            </h3>

            {userRewards.length === 0 ? (
                <div style={{
                    textAlign: 'center',
                    padding: '40px',
                    background: '#f8f9fa',
                    borderRadius: '12px',
                    border: '2px dashed #ddd'
                }}>
                    <div style={{ fontSize: '48px', marginBottom: '16px' }}>🛒</div>
                    <h3 style={{ color: '#666', marginBottom: '8px' }}>No pets yet!</h3>
                    <p style={{ color: '#888', margin: 0 }}>
                        Visit the shop to adopt your first companion
                    </p>
                </div>
            ) : (
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '16px'
                }}>
                    {userRewards.map((reward) => {
                        const isActive = activeAvatars.some(activePet => activePet.purchaseId === reward.purchaseId)
                        const purchaseDate = new Date(reward.purchaseDate).toLocaleDateString()
                        
                        return (
                            <div 
                                key={reward.purchaseId}
                                style={{
                                    background: 'white',
                                    borderRadius: '12px',
                                    padding: '16px',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                    border: isActive ? '2px solid #0be881' : '1px solid #e0e0e0',
                                    position: 'relative'
                                }}
                            >
                                {isActive && (
                                    <div style={{
                                        position: 'absolute',
                                        top: '8px',
                                        right: '8px',
                                        background: '#0be881',
                                        color: 'white',
                                        padding: '4px 8px',
                                        borderRadius: '12px',
                                        fontSize: '10px',
                                        fontWeight: 'bold'
                                    }}>
                                        ACTIVE
                                    </div>
                                )}
                                <img 
                                    src={reward.image} 
                                    alt={reward.name}
                                    style={{
                                        width: '100%',
                                        height: '100px',
                                        objectFit: 'contain',
                                        borderRadius: '8px',
                                        marginBottom: '12px',
                                        backgroundColor: '#f8f9fa'
                                    }}
                                />
                                <h4 style={{ margin: '0 0 8px 0', color: '#333' }}>{reward.name}</h4>
                                <p style={{ 
                                    margin: '0 0 8px 0', 
                                    color: '#666', 
                                    fontSize: '12px'
                                }}>
                                    Purchased: {purchaseDate}
                                </p>
                                <p style={{ 
                                    margin: '0 0 12px 0', 
                                    color: '#888', 
                                    fontSize: '11px'
                                }}>
                                    {reward.description}
                                </p>
                                <button
                                    onClick={() => applyPet(reward)}
                                    disabled={!isActive && activeAvatars.length >= 3}
                                    style={{
                                        width: '100%',
                                        background: isActive 
                                            ? '#ff6b6b' 
                                            : (activeAvatars.length >= 3 ? '#ccc' : 'linear-gradient(135deg, #87CEEB, #5F9EA0)'),
                                        color: 'white',
                                        border: 'none',
                                        padding: '8px',
                                        borderRadius: '8px',
                                        fontWeight: 'bold',
                                        cursor: (!isActive && activeAvatars.length >= 3) ? 'not-allowed' : 'pointer'
                                    }}
                                >
                                    {isActive ? 'Deactivate' : (activeAvatars.length >= 3 ? 'Max Active (3/3)' : 'Activate')}
                                </button>
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}

export default Inventory