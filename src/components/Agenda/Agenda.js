import React, { useEffect } from 'react'
import { getAgendaWeekView } from '../../parser/agenda'

export default ({ showAgenda, setShowAgenda }) => {
  useEffect(() => {
    getAgendaWeekView().then(console.log)
  }, [])

  return (
    <>
      {showAgenda && (
        <>
          <div className='file-explorer-darken' onClick={() => setShowAgenda(false)} />
          <div className={`file-explorer-container tall`}>
            <div className={`file-explorer-list tall`}>
              <div className='file-explorer-list-container'>hi</div>
            </div>
          </div>
        </>
      )}
    </>
  )
}
