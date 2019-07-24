import React, { useState } from 'react'
import welcome from '../utils/welcome-file'

const StoreContext = React.createContext()

const StoreProvider = ({ children }) => {
  const [text, setText] = useState(welcome.text)

  return (
    <StoreContext.Provider value={{ text, setText }}>
      {children}
    </StoreContext.Provider>
  )
}

export { StoreProvider, StoreContext }
