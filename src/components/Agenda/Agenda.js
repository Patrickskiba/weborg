import React, { useEffect, useState, useContext } from 'react'
import { StoreContext } from '../Store'
import ElevatedTray from '../ElevatedTray'
import { getText } from '../FileExplorer'
import { getAgendaWeekView } from '../../parser/agenda'
import format from 'date-fns/format'
import isToday from 'date-fns/isToday'

const AgendaDate = ({ overDueDays, taskType }) => (
  <div className='agenda-date'>
    {taskType === 'SCHEDULED'
      ? !overDueDays
        ? 'Scheduled'
        : `Sched.${Math.abs(overDueDays)}x`
      : !overDueDays
      ? 'Deadline'
      : `${Math.abs(overDueDays)} d. ago`}
  </div>
)

const centerWindowOn = text => {
  const elements = [...document.querySelectorAll('.headline-text')]
  const element = elements.find(el => el.outerText.trim() === text.replace(/^\**/, '').trim())
  return window.scrollTo(0, element.offsetTop - 5)
}

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
              {agenda.tasks.map((t, i) => (
                <div
                  key={`agenda-task-${idx}-${i}`}
                  className='agenda-task-row'
                  onClick={() => {
                    getText(t.file, dispatch).then(() => {
                      dispatch({ type: 'setSelectedRow', payload: t.file })
                      setShowAgenda(false)
                      console.log(centerWindowOn(t.headline))
                    })
                  }}>
                  <div className='agenda-weekday'>{t.file.replace('.org', ':')}</div>
                  <AgendaDate overDueDays={t.overDueDays} task={t.taskType} />
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
