/** @jsxImportSource @emotion/react */

import { css } from '@emotion/react'

import React, { useEffect, useState } from "react"
import { WorkerProps, AsUIComponent } from "react-multi-threaded/src"

console.log('Footer')
const footer = (props: WorkerProps<{ onTimer?: (value: number) => void }>) => {
    const [count, setCount] = useState(0)
    const isWorker = typeof WorkerGlobalScope !== 'undefined' && self instanceof WorkerGlobalScope

    useEffect(() => {
        setTimeout(() => {
            const isWorker = typeof WorkerGlobalScope !== 'undefined' && self instanceof WorkerGlobalScope
            console.log("isWorker: ", isWorker, count + 1) //run in main thread

            setCount(count + 1)

            props?.onTimer(count + 1)
        }, 1000)
    }, [count])

    return <div css={css`font-weight:bold; color:blue;`}>
        Footer ({count})

        <div>isWorker: {isWorker + ''}</div>
        {props.children}
    </div>
}
export const Footer = AsUIComponent(footer)