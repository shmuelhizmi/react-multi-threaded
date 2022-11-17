/** @jsxImportSource @emotion/react */

import { css } from '@emotion/react'

import React from "react"
import { WorkerProps, AsUIComponent } from "react-multi-threaded/src"


const footer = (props: WorkerProps<{}>) => <div css={css`font-weight:bold; color:blue;`}>
    Footer
</div>

export const Footer = AsUIComponent(footer)