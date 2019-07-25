import React, { useState } from 'react'
import welcome from '../utils/welcome-file'

const StoreContext = React.createContext()

const StoreProvider = ({ children }) => {
  const [text, setText] = useState(welcome.text)

  const [mode, setMode] = useState({
    type: 'View',
    payload: null,
  })

  return (
    <StoreContext.Provider value={{ text, setText, mode, setMode }}>
      {children}
    </StoreContext.Provider>
  )
}

export { StoreProvider, StoreContext }
