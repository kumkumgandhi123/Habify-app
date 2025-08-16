import axios from "axios"
import UserContext from "../../context/user-context"
import { useContext, useEffect, useState } from "react"
import RewardCard from "./RewardCard"

const PriceLevelOne = (props) => {
    const rewardTotal = 350

    // Auth
    const user = useContext(UserContext)
    const [csrfToken, setCsrfToken] = useState()
    useEffect(() => {
        axios.get('api/csrf').then(res => setCsrfToken(res.data.csrfToken))
    }, [])

    // Profile
    const [disabled, setDisabled] = useState(true)
    useEffect(() => {
        if (Number(user.coins) >= rewardTotal){
            setDisabled(false)
        }

    }, [setDisabled, user])

   
    const buyFunc =() => {
        axios.post('rewards/buyreward/', {
            user: user.user,
            price: rewardTotal,
            img: props.image,
            title: props.name
        },{
            headers: {'X-CSRFToken': csrfToken}
        }).then(res => {
            props.setWallet(rewardTotal)
        })
    }

    return (
        <>
        <RewardCard img={props.image} name={props.name} btnText={'₹350'} func={buyFunc} disabled={disabled}/>
        </>
    )
}

export default PriceLevelOne


// <img src={props.image} alt="present" />
// <h3>{props.name}</h3>
// <p>₹350</p>
// <button onClick={buyFunc} disabled={disabled}>Buy</button>