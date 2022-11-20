import React, { ReactNode, useEffect, useRef, useState } from "react"
import { render } from "react-dom"
import { createRoot } from 'react-dom/client'
import { UI } from "react-multi-threaded/src"
import { WorkerClient } from "./app.client"
import { FooterClient } from "./footer.client"

const Content = () => {
    return <div>
        <UI>
            <WorkerClient />
            <FooterClient />
        </UI>
        <UI>
            <table><tbody>
                <tr>
                    <td><FooterClient /></td>
                    <td><FooterClient /></td>
                </tr></tbody>
            </table>
        </UI>

    </div>
}

const container = document.getElementById("main")
const root = createRoot(container)

root.render(<Content />) 