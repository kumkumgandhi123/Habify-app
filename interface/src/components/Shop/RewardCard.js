


const RewardCard = (props) => {
    return (
        <div className='reward-card'>
            <img className='reward-img' src={props.img} alt={props.name || "Reward item"} />
            <h4>{props.name}</h4>
            <button className="buy-btn" onClick={props.func} disabled={props.disabled}>{props.btnText}</button>
        </div>
    )
}

export default RewardCard