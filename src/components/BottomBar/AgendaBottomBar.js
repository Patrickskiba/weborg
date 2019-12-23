import React, { useEffect, useContext } from 'react'
import { StoreContext } from '../Store'
import addWeeks from 'date-fns/addWeeks'
import format from 'date-fns/format'
import startOfWeek from 'date-fns/startOfWeek'
import endOfWeek from 'date-fns/endOfWeek'

export default ({ sideBarVisible, setSideBarVisible, setShouldSubmit }) => {
  const { mode, agendaDay, dispatch } = useContext(StoreContext)

  useEffect(() => {
    setShouldSubmit()
  }, [mode])

  return (
    <>
      <div className='mdc-bottom-app-bar__row mdc-vert-center'>
        <div className='mdc-flex-row mdc-flex-spread-apart'>
          <div onClick={() => setSideBarVisible(!sideBarVisible)}>
            <i title='toggle-file-explorer' aria-label='Menu' className='material-icons'>
              menu
            </i>
          </div>

          <div className='mdc-flex-row'>
            <div
              onClick={() => dispatch({ type: 'setAgendaDate', payload: addWeeks(agendaDay, -1) })}>
              <i
                title='agenda-previous-week'
                aria-label='Previous-week'
                className='material-icons mdc-large-nav-icons'>
                chevron_left
              </i>
            </div>
            <div className='mdc-bottom-app-bar-text'>
              {format(startOfWeek(agendaDay), 'MMM d')} - {format(endOfWeek(agendaDay), 'MMM d')}
            </div>
            <div
              onClick={() => dispatch({ type: 'setAgendaDate', payload: addWeeks(agendaDay, 1) })}>
              <i
                title='agenda-next-week'
                aria-label='Next-week'
                className='material-icons mdc-large-nav-icons'>
                chevron_right
              </i>
            </div>
          </div>
          <div onClick={() => dispatch({ type: 'setMode', payload: { type: 'View' } })}>
            <i title='navigate-to-home' aria-label='Home' className='material-icons'>
              home
            </i>
          </div>
        </div>
      </div>
    </>
  )
}
