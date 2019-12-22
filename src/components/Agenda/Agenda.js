import React, { useEffect, useState, useContext } from 'react'
import { StoreContext } from '../Store'
import parse from '../../parser/index'
import TextContent from '../TextContent'
import { State } from '../Headline'
import { getText } from '../FileExplorer'
import { getAgendaWeekView } from '../../parser/agenda'
import format from 'date-fns/format'
import isToday from 'date-fns/isToday'

const AgendaDate = ({ overDueDays, taskType }) => {
  const getDateLabel = (t, o) => {
    if (t === 'SCHEDULED') {
      if (!o) return 'Scheduled'
      else return `Sched.${Math.abs(o)}x`
    } else {
      if (!o) return 'Deadline'
      else if (o > 0) return `${Math.abs(o)} d.`
      else return `${Math.abs(o)} d. ago`
    }
  }
  return <div className='agenda-date'>{getDateLabel(taskType, overDueDays)}</div>
}

const centerWindowOn = text => {
  const elements = [...document.querySelectorAll('.headline-text')]
  const element = elements.find(el => el.outerText.trim() === text.replace(/^\**/, '').trim())
  return window.scrollTo(0, element.offsetTop - 5)
}

const Tasks = ({ tasks }) =>
  tasks.length ? (
    tasks.map((task, idx) => {
      const headline = parse(task.headline)[0]
      return (
        <div className='agenda'>
          <div>
            {headline.State && <State state={headline.State} />}
            {headline.priority && <Priority priority={headline.priority} />}
            <TextContent content={headline.content} />
          </div>
          {task.file.replace('.org', ' - ')}
          {idx < tasks.length - 1 && <div className='horizontal-rule' />}
        </div>
      )
    })
  ) : (
    <div></div>
  )

export default () => {
  const [agendaList, setAgendaList] = useState([])
  const { dispatch } = useContext(StoreContext)

  useEffect(() => {
    getAgendaWeekView().then(agendas => setAgendaList(agendas))
  }, [])
  console.log(agendaList)
  return (
    <div>
      {agendaList.length ? (
        agendaList.map((agenda, idx) => (
          <div key={`agenda-${idx}`}>
            <div className='agenda-container'>
              <div className='agenda-day agenda-margin'>{format(agenda.day, 'cccc')}</div>
              <div className='agenda-date agenda-margin'>{format(agenda.day, 'LLLL')}</div>
              <div className='agenda-date agenda-margin'>{format(agenda.day, 'd')}</div>
              <div className='agenda-date agenda-margin'>{format(agenda.day, 'yyyy')}</div>
            </div>
            <div className='task-container'>
              <Tasks tasks={agenda.tasks} />
            </div>
            <div className='horizontal-rule' />
          </div>
        ))
      ) : (
        <div></div>
      )}
    </div>
  )
}
