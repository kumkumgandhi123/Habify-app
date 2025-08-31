import React from "react";

const UserContext = React.createContext({
    user: '',
    coins: '',
    mult: '',
    streak: '',
})

export default UserContext