/** @jsxImportSource @emotion/react */

import { css } from '@emotion/react'

import React, { useState } from "react"
import { UIComponentProps, AsUIComponent } from "react-multi-threaded/src"

// class Login extends React.Component<
//     UIComponentProps<{ login: (username: string, password: string) => void }>,
//     { username: string; password: string }
// > {
//     state = {
//         username: "",
//         password: "",
//     };
//     render() {
//         return (
//             <div>
//                 <input
//                     type="text"
//                     onChange={(e) => this.setState({ username: e.target.value })}
//                     placeholder="username"
//                 />
//                 <input
//                     type="text"
//                     onChange={(e) => this.setState({ password: e.target.value })}
//                     placeholder="password"
//                 />
//                 <button
//                     onClick={() =>
//                         this.props.login(this.state.username, this.state.password)
//                     }
//                 >
//                     LogIn
//                 </button>
//             </div>
//         )
//     }
// }


const login = (props: UIComponentProps<{ login: (username: string, password: string) => void }>) => {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")

    return (
        <div>
            <div css={css`color:red;`}>Login</div>

            <input
                type="text"
                onChange={(e) => setUsername(e.target.value)}
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
        </div>
    )
}
export const Login = AsUIComponent(login)
