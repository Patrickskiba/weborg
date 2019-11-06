import React, { useEffect, useState } from 'react'
import { getAgendaWeekView } from '../../parser/agenda'
import format from 'date-fns/format'

export default ({ showAgenda, setShowAgenda }) => {
  const [agendaList, setAgendaList] = useState([])

  useEffect(() => {
    getAgendaWeekView().then(agendas => setAgendaList(agendas))
  }, [])

  return (
    <>
      {showAgenda && (
        <>
          <div className='file-explorer-darken' onClick={() => setShowAgenda(false)} />
          <div className='file-explorer-container tall'>
            <div className='file-explorer-list tall'>
              <div className='file-explorer-list-container'>
                {agendaList.map(agenda => (
                  <div className='agenda-row'>
                    <div>{format(agenda.day, 'cccc')}</div>
                    <div>{format(agenda.day, 'd')}</div>
                    <div>{format(agenda.day, 'LLLL')}</div>
                    <div>{format(agenda.day, 'yyyy')}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  )
}
