import React, { useEffect, useState } from 'react'
import ElevatedTray from '../ElevatedTray'
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
    <ElevatedTray show={showAgenda} setShow={setShowAgenda} header='W42'>
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
    </ElevatedTray>
  )
}
