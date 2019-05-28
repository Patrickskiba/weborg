import React, { useState } from 'react'
import ReactDOM from 'react-dom'

export default ({ size = 24, outerVisible }) => <svg height={`${size}px`} width={`${size}px`}>
    { outerVisible && <circle cx='50%' cy='50%' r={`${size/2}px`} fill='#e1e1e1' /> }
    <circle cx='50%' cy='50%' r={`${size/4}px`} fill='#616161'/>
</svg>


