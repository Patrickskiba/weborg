import React from 'react'
import ReactDOM from 'react-dom'
import Dropbox from 'dropbox'

const client = new Dropbox.Dropbox({ clientId: 'ly01o1ewx36u70x' })

const authenticateUser = () => { 
    const url = client.getAuthenticationUrl('http://localhost:8080/')
    window.location.href = url
}
    

export default () => <div onClick={authenticateUser}><img style={{width: '25px'}} src="dropbox.svg"/></div>
