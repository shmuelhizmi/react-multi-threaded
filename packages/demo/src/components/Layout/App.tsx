import React, { useState } from "react"
import Gif from "../UI/Gif"
import Home from "../UI/Home"
import Login from "../UI/Login"
import Prompt from "../UI/Prompt"

console.log('App')
const App = () => {
    const [location, setLocation] = useState<"home" | "error" | "login">("login")
    const [name, setName] = useState("")
    return (
        <>
            {location === "home" && (
                <Home logout={() => setLocation("login")} username={name}>
                    <Gif url="https://upload.wikimedia.org/wikipedia/commons/7/78/GRACE_globe_animation.gif" />
                    <Gif url="https://upload.wikimedia.org/wikipedia/commons/7/78/GRACE_globe_animation.gif" />
                </Home>
            )}
            {location === "login" && (
                <Login
                    login={(username, password) => {
                        if (password === "0000") {
                            setName(username)
                            setLocation("home")
                        } else {
                            setLocation("error")
                        }
                    }}
                />
            )}
            {location === "error" && (
                <Prompt message={"worng password"} onOk={() => setLocation("login")}>
                    <Gif url="https://upload.wikimedia.org/wikipedia/commons/7/78/GRACE_globe_animation.gif" />
                </Prompt>
            )}
        </>
    )
}

export default App