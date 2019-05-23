import React  from 'react'
import ReactDOM from 'react-dom'


export default ({fileList}) => fileList.map((file, idx) => <div key={idx}>{JSON.stringify(file)}</div>)

