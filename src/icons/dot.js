import React, { useState } from 'react'
import ReactDOM from 'react-dom'

export default ({ size = 1, color = "grey" }) => <svg style={{position: 'absolute', top: '50%'}} height={`${size}rem`} width={`${size}rem`}>
    <circle cx='50%' cy='50%' r={`${size/2}rem`} fill={color} />
</svg>


