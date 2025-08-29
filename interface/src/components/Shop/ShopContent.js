import { useContext, useState } from "react"
import UserContext from "../../context/user-context"

const ShopContent = () => {
    const user = useContext(UserContext)
    const [wallet, setWallet] = useState(user.coins)

    // Sample shop items with varied pricing and categories
    const shopItems = [
        // Pet Companions (150-500 rupees)
        { 
            id: 1, 
            image: '/static/imgs/pets/0.svg', 
            name: 'Aquilance', 
            price: 150, 
            category: 'Starter Pets',
            description: 'A loyal water companion perfect for beginners'
        },
        { 
            id: 2, 
            image: '/static/imgs/pets/1.svg', 
            name: 'Pyrogriff', 
            price: 300, 
            category: 'Fire Pets',
            description: 'Majestic fire spirit that boosts your motivation'
        },
        { 
            id: 3, 
            image: '/static/imgs/pets/2.svg', 
            name: 'Draven', 
            price: 250, 
            category: 'Shadow Pets',
            description: 'Mysterious companion with dark magic abilities'
        },
        { 
            id: 4, 
            image: '/static/imgs/pets/3.svg', 
            name: 'Doge', 
            price: 100, 
            category: 'Meme Pets',
            description: 'Much wow! Very supportive! Such companion!'
        },
        { 
            id: 5, 
            image: '/static/imgs/pets/4.svg', 
            name: 'Starshock', 
            price: 450, 
            category: 'Electric Pets',
            description: 'High-energy companion that sparks your determination'
        },
        { 
            id: 6, 
            image: '/static/imgs/pets/5.svg', 
            name: 'Verminator', 
            price: 350, 
            category: 'Bug Pets',
            description: 'Helps you squash bad habits one by one'
        },
        { 
            id: 7, 
            image: '/static/imgs/pets/6.svg', 
            name: 'Freddie', 
            price: 200, 
            category: 'Friendly Pets',
            description: 'Your cheerful buddy for tough days'
        },
        { 
            id: 8, 
            image: '/static/imgs/pets/7.svg', 
            name: 'Blanco', 
            price: 275, 
            category: 'Ice Pets',
            description: 'Cool-headed companion to keep you calm'
        },
        { 
            id: 9, 
            image: '/static/imgs/pets/8.svg', 
            name: 'Petally', 
            price: 180, 
            category: 'Nature Pets',
            description: 'Grows stronger as your habits bloom'
        },
        { 
            id: 10, 
            image: '/static/imgs/pets/9.svg', 
            name: 'Skiddo', 
            price: 320, 
            category: 'Adventure Pets',
            description: 'Ready to leap over any obstacle with you'
        }
    ]

    const displayWallet = (cost) => {
        setWallet(wallet - cost)
    }

    const buyItem = (item) => {
        if (wallet >= item.price) {
            displayWallet(item.price)
            
            // Save purchase to localStorage
            const purchases = JSON.parse(localStorage.getItem(`habify_purchases_${user.user}`) || '[]')
            purchases.push({
                ...item,
                purchaseDate: new Date().toISOString(),
                purchaseId: Date.now()
            })
            localStorage.setItem(`habify_purchases_${user.user}`, JSON.stringify(purchases))
            
            alert(`🎉 You purchased ${item.name}! Check your inventory.`)
        } else {
            alert(`💰 You need ${item.price - wallet} more rupees to buy ${item.name}!`)
        }
    }

    // Group items by category
    const categories = [...new Set(shopItems.map(item => item.category))]

    return (
        <div id="shoppg-wrap">
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '20px'
            }}>
                <h2 className="page-title">Pet Market</h2>
                <div style={{
                    background: 'linear-gradient(135deg, #feca57, #ff9ff3)',
                    color: 'white',
                    padding: '12px 20px',
                    borderRadius: '25px',
                    fontWeight: 'bold',
                    fontSize: '18px',
                    boxShadow: '0 4px 15px rgba(254, 202, 87, 0.3)'
                }}>
                    ₹ {wallet} rupees
                </div>
            </div>

            {/* Shop Stats */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
                gap: '12px',
                marginBottom: '24px'
            }}>
                <div style={{
                    background: '#e3f2fd',
                    padding: '12px',
                    borderRadius: '8px',
                    textAlign: 'center',
                    border: '1px solid #2196f3'
                }}>
                    <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#1976d2' }}>
                        {shopItems.length}
                    </div>
                    <div style={{ fontSize: '12px', color: '#555' }}>Available Pets</div>
                </div>
                <div style={{
                    background: '#e8f5e8',
                    padding: '12px',
                    borderRadius: '8px',
                    textAlign: 'center',
                    border: '1px solid #4caf50'
                }}>
                    <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#2e7d32' }}>
                        {Math.min(...shopItems.map(item => item.price))}
                    </div>
                    <div style={{ fontSize: '12px', color: '#555' }}>Cheapest Pet</div>
                </div>
                <div style={{
                    background: '#fff3e0',
                    padding: '12px',
                    borderRadius: '8px',
                    textAlign: 'center',
                    border: '1px solid #ff9800'
                }}>
                    <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#f57c00' }}>
                        {categories.length}
                    </div>
                    <div style={{ fontSize: '12px', color: '#555' }}>Categories</div>
                </div>
            </div>

            {/* Categories */}
            {categories.map(category => (
                <div key={category} style={{ marginBottom: '32px' }}>
                    <h3 style={{
                        color: '#87CEEB',
                        borderBottom: '2px solid #87CEEB',
                        paddingBottom: '8px',
                        marginBottom: '16px'
                    }}>
                        {category}
                    </h3>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                        gap: '16px'
                    }}>
                        {shopItems
                            .filter(item => item.category === category)
                            .map(item => (
                                <div 
                                    key={item.id}
                                    style={{
                                        background: 'white',
                                        borderRadius: '12px',
                                        padding: '16px',
                                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                        border: '1px solid #e0e0e0',
                                        transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.target.style.transform = 'translateY(-4px)'
                                        e.target.style.boxShadow = '0 8px 24px rgba(0,0,0,0.15)'
                                    }}
                                    onMouseLeave={(e) => {
                                        e.target.style.transform = 'translateY(0)'
                                        e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)'
                                    }}
                                >
                                    <img 
                                        src={item.image} 
                                        alt={item.name}
                                        style={{
                                            width: '100%',
                                            height: '120px',
                                            objectFit: 'contain',
                                            borderRadius: '8px',
                                            marginBottom: '12px',
                                            backgroundColor: '#f8f9fa'
                                        }}
                                    />
                                    <h4 style={{ 
                                        margin: '0 0 8px 0', 
                                        color: '#333',
                                        fontSize: '18px'
                                    }}>
                                        {item.name}
                                    </h4>
                                    <p style={{ 
                                        margin: '0 0 12px 0', 
                                        color: '#666',
                                        fontSize: '14px',
                                        lineHeight: '1.4'
                                    }}>
                                        {item.description}
                                    </p>
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center'
                                    }}>
                                        <span style={{
                                            fontSize: '20px',
                                            fontWeight: 'bold',
                                            color: '#87CEEB'
                                        }}>
                                            ₹ {item.price}
                                        </span>
                                        <button
                                            onClick={() => buyItem(item)}
                                            disabled={wallet < item.price}
                                            style={{
                                                background: wallet >= item.price 
                                                    ? 'linear-gradient(135deg, #87CEEB, #5F9EA0)' 
                                                    : '#ccc',
                                                color: 'white',
                                                border: 'none',
                                                padding: '8px 16px',
                                                borderRadius: '20px',
                                                fontWeight: 'bold',
                                                cursor: wallet >= item.price ? 'pointer' : 'not-allowed',
                                                transition: 'all 0.2s ease'
                                            }}
                                        >
                                            {wallet >= item.price ? 'Buy Now' : 'Need More Rupees'}
                                        </button>
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                </div>
            ))}
        </div>
    )
}

export default ShopContent