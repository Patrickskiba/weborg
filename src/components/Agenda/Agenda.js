import React, { useEffect, useState } from 'react'
import { getAgendaWeekView } from '../../parser/agenda'
import format from 'date-fns/format'
import isToday from 'date-fns/isToday'

export default ({ showAgenda, setShowAgenda }) => {
  const [agendaList, setAgendaList] = useState([])

  useEffect(() => {
    getAgendaWeekView().then(agendas => setAgendaList(agendas))
  }, [])
  console.log(agendaList)

  return (
    <>
      {showAgenda && (
        <>
          <div className='file-explorer-darken' onClick={() => setShowAgenda(false)} />
          <div className='file-explorer-container tall'>
            <div className='agenda-header'>W40</div>
            <div className='file-explorer-list tall'>
              <div className='file-explorer-list-container'>
                {agendaList.map((agenda, idx) => (
                  <>
                    <div
                      key={`agenda-${idx}`}
                      className={`agenda-row ${isToday(agenda.day) ? 'current-day' : 'default'}`}>
                      <div className='agenda-weekday'>{format(agenda.day, 'cccc')}</div>
                      <div>{format(agenda.day, 'd')}</div>
                      <div>{format(agenda.day, 'LLLL')}</div>
                      <div>{format(agenda.day, 'yyyy')}</div>
                    </div>
                    {agenda.tasks.length !== 0 && (
                      <>
                        {agenda.tasks.map(t => (
                          <div className='agenda-task-row'>
                            <div className='agenda-weekday'>{t.file.replace('.org', ':')}</div>
                            {t.overDueDays && <div>{t.overDueDays}</div>}
                            <div className='agenda-weekday'>
                              {t.headline.replace('* ', '').replace('*', '')}
                            </div>
                          </div>
                        ))}
                      </>
                    )}
                  </>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  )
}
