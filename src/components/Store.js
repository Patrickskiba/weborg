import React, { useReducer } from 'react'
import welcome from '../utils/welcome-file'
import { set } from 'idb-keyval'

const StoreContext = React.createContext()

const initialState = {
  mode: {
    type: 'View',
    payload: null,
  },
}

const reducer = (state, action) => {
  switch (action.type) {
    case 'setText':
      return { ...state, text: action.payload }
    case 'setSelectedRow':
      set('lastVisitedPage', action.payload)
      return { ...state, selectedRow: action.payload }
    case 'setMode':
      return { ...state, mode: action.payload }
    case 'moveNode':
      return { ...state, mode: action.payload.mode, text: action.payload.text }
    case 'initLastFileState':
      return {
        ...state,
        text: action.payload.text,
        selectedRow: action.payload.selectedRow,
      }
    default:
      throw new Error()
  }
}

const StoreProvider = ({
  text = welcome.text,
  selectedRow = welcome.fileName,
  children,
  initState = initialState,
}) => {
  const [state, dispatch] = useReducer(reducer, {
    text,
    selectedRow,
    ...initState,
  })

  return (
    <StoreContext.Provider value={{ ...state, dispatch }}>
      {children}
    </StoreContext.Provider>
  )
}

export { StoreProvider, StoreContext }
