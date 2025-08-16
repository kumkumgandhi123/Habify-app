import axios from "axios"
import { useState, useEffect } from "react"
const QuotesRender = () => {

    const [quote, setQuote] = useState()

    
    const genQuotes = () => {
        axios.get('https://type.fit/api/quotes').then(res => {
            let randQuote = res.data[Math.floor(Math.random() * res.data.length)]
            if(randQuote.author === null){
                randQuote.author = "Incognito"
            }
            let finalQuote = `${randQuote.text} - ${randQuote.author}`
            setQuote(finalQuote)
        })
    }
    useEffect(() => {
        genQuotes()
    },[])
    return(
        
        <div>
        {quote}
        <button onClick={genQuotes}>New quote</button>
        </div>
        
    )
}

export default QuotesRender