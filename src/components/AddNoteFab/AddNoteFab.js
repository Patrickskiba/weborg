import React, { useContext } from 'react'
import { StoreContext } from '../Store'

import Fab from '@material/react-fab'

export default () => {
  const { dispatch } = useContext(StoreContext)
  return (
    <Fab
      aria-label='Add'
      title='Add'
      icon={<i className='material-icons mdc-fab-icon'>add</i>}
      onClick={() => dispatch({ type: 'setMode', payload: { type: 'Add' } })}
    />
  )
}
