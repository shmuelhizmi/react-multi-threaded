/** @jsxImportSource @emotion/react */

import { css } from '@emotion/react'

import React, { useContext, useState } from "react"
import { ThreadContext } from 'react-multi-threaded/src'
import { About } from '../UI/About'
import { Footer } from '../UI/Footer'
import { Gif } from "../UI/Gif"
import { Home } from "../UI/Home"
import { Login } from "../UI/Login"
import { Prompt } from "../UI/Prompt"


export const WorkerApp = (props: { className?: string }) => {
    const context = useContext(ThreadContext)

    const [location, setLocation] = useState<"home" | "error" | "login">("login")
    const [name, setName] = useState("")
    return <>
        {location === "home" && <>
            <Home logout={() => {
                setLocation("login")
                return null
            }} username={name}>

                <Gif url="https://upload.wikimedia.org/wikipedia/commons/7/78/GRACE_globe_animation.gif" />
                <Gif url="https://upload.wikimedia.org/wikipedia/commons/7/78/GRACE_globe_animation.gif" />
            </Home>
        </>}

        {location === "login" && <>
            <Login
                login={(username, password) => {
                    console.log("Login", context)

                    if (password === "0000") {
                        setName(username)
                        setLocation("home")
                    } else {
                        setLocation("error")
                    }

                    return null
                }}>

                <About />

            </Login>
        </>}

        {
            location === "error" && (
                <Prompt message={"wrong password"} onOk={() => {
                    console.log("onOK", context) //worker

                    setLocation("login")

                    return null
                }}>
                    <About />

                    <Gif url="https://upload.wikimedia.org/wikipedia/commons/7/78/GRACE_globe_animation.gif" />
                </Prompt>
            )
        }
    </>
}

