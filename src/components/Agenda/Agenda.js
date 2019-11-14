import React, { useEffect, useState, useContext } from 'react'
import { StoreContext } from '../Store'
import ElevatedTray from '../ElevatedTray'
import { getText } from '../FileExplorer'
import { getAgendaWeekView } from '../../parser/agenda'
import format from 'date-fns/format'
import isToday from 'date-fns/isToday'

const AgendaDate = ({ overDueDays, task }) => (
  <div className='agenda-date'>
    {task[9] === ':'
      ? !overDueDays
        ? 'Scheduled'
        : `Sched.${Math.abs(overDueDays)}x`
      : !overDueDays
      ? 'Deadline'
      : `${Math.abs(overDueDays)} d. ago`}
  </div>
)

export default ({ showAgenda, setShowAgenda }) => {
  const [agendaList, setAgendaList] = useState([])
  const { dispatch } = useContext(StoreContext)

  useEffect(() => {
    getAgendaWeekView().then(agendas => setAgendaList(agendas))
  }, [])

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
                <div
                  className='agenda-task-row'
                  onClick={() => {
                    getText(t.file, dispatch)
                    dispatch({ type: 'setSelectedRow', payload: t.file })
                    setShowAgenda(false)
                  }}>
                  <div className='agenda-weekday'>{t.file.replace('.org', ':')}</div>
                  <AgendaDate overDueDays={t.overDueDays} task={t.task} />
                  <div className='agenda-task-details'>
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
