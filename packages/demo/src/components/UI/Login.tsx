/** @jsxImportSource @emotion/react */

import { css } from '@emotion/react'

import React, { useContext, useState } from "react"
import { WorkerProps, AsUIComponent } from "react-multi-threaded/src"
import { ThreadContext } from 'react-multi-threaded/src'

const login = (props: WorkerProps<{ login: (username: string, password: string) => void }>) => {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const context = useContext(ThreadContext)

    return <div>
        <div css={css`color:red;`}>Login ({context})</div>

        <input
            type="text"
            onChange={(e) => { console.log(context); setUsername(e.target.value) }}
            placeholder="username"
        />
        <input
            type="text"
            onChange={(e) => setPassword(e.target.value)}
            placeholder="password"
        />
        <button
            onClick={() =>
                props.login(username, password)
            }
        >
            LogIn
        </button>

        {props?.children}
    </div>
}
export const Login = AsUIComponent(login)
