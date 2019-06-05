import React from 'react'
import { Dropbox } from 'dropbox'

const authenticateUser = () => { 
  const client = new Dropbox({ clientId: 'ly01o1ewx36u70x' })
  const url = client.getAuthenticationUrl('http://localhost:8080/')
  window.location.href = url
}


export default () => <div onClick={authenticateUser}><img style={{width: '25px'}} src="dropbox.svg"/></div>
