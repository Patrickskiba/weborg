import React, { useEffect, useState, useContext } from 'react'
import { StoreContext } from '../Store'
import parse from '../../parser/index'
import TextContent from '../TextContent'
import { State } from '../Headline'
import { getText } from '../FileExplorer'
import { getAgendaWeekView } from '../../parser/agenda'
import format from 'date-fns/format'

const agendaDateText = ({ overDueDays, taskType, date }) => {
  if (overDueDays < 0 && taskType === 'DEADLINE') return `Overdue ${Math.abs(overDueDays)} days`
  if (overDueDays < 0 && taskType === 'SCHEDULED')
    return `Scheduled ${Math.abs(overDueDays)} days ago`
  if (overDueDays > 0 && taskType === 'DEADLINE') {
    const time = format(date, 'hh:mm a')
    if (time === '12:00 AM') {
      return `Due in ${overDueDays} days`
    }
      return `Due in ${overDueDays} days at ${time}`
  }
  if (overDueDays > 0 && taskType === 'SCHEDULED') {
    const time = format(date, 'hh:mm a')
    if (time === '12:00 AM') {
      return `Scheduled in ${overDueDays} days`
    }
      return `Scheduled in ${overDueDays} days at ${time}`
  }
  if (overDueDays === 0 && taskType === 'DEADLINE') {
    const time = format(date, 'hh:mm a..aaa')
    if (time === '12:00 AM') {
      return `Due today`
    }
    return `Due today at ${format(date, 'hh:mm a')}`
  }
  if (overDueDays === 0 && taskType === 'SCHEDULED') {
    const time = format(date, 'hh:mm a..aaa')
    if (time === '12:00 AM') {
      return `Scheduled today`
    }
    return `Scheduled today at ${format(date, 'hh:mm a')}`
  }
}

const centerWindowOn = text => {
  const elements = [...document.querySelectorAll('.headline-text')]
  const element = elements.find(el => el.outerText.trim() === text.replace(/^\**/, '').trim())
  return window.scrollTo(0, element.offsetTop - 5)
}

const Tasks = ({ tasks, dispatch }) =>
  tasks.length ? (
    tasks.map((task, idx) => {
      const headline = parse(task.headline)[0]
      return (
        <div key={`task-${idx}`} className='task-entry'>
          <div onClick={() => {
              getText(task.file, dispatch).then(() => {
                dispatch({ type: 'setSelectedRow', payload: task.file })
                dispatch({
                  type: 'setMode',
                  payload: { type: 'View', payload: null }
                })
                centerWindowOn(task.headline)
              })
            }}>
            {"- "}
            {headline.State && <State state={headline.State} />}
            {headline.priority && <Priority priority={headline.priority} />}
            <TextContent content={headline.content} />
          </div>
          <div className='agenda-subheader'>
            {task.file.replace('.org', ' - ')}
            {agendaDateText({
              overDueDays: task.overDueDays,
              taskType: task.taskType,
              date: task.date
            })}
          </div>
          {idx < tasks.length - 1 && <div className='agenda-horizontal-rule' />}
        </div>
      )
    })
  ) : (
    <div className='agenda-subheader'>No tasks</div>
  )

export default () => {
  const [agendaList, setAgendaList] = useState([])
  const { dispatch } = useContext(StoreContext)

  useEffect(() => {
    getAgendaWeekView().then(agendas => setAgendaList(agendas))
  }, [])

  return (
    <div className='agenda'>
      {agendaList.length ? (
        agendaList.map((agenda, idx) => (
          <div key={`agenda-${idx}`}>
            <div className='agenda-container'>
              <div className='agenda-day'>{format(agenda.day, 'cccc')}</div>
              <div className='agenda-date agenda-margin'>{format(agenda.day, 'LLLL')}</div>
              <div className='agenda-date agenda-margin'>{format(agenda.day, 'd')}</div>
              <div className='agenda-date agenda-margin'>{format(agenda.day, 'yyyy')}</div>
            </div>
            <div className='task-container'>
              <Tasks tasks={agenda.tasks} dispatch={dispatch}/>
            </div>
            <div className='agenda-horizontal-rule' />
          </div>
        ))
      ) : (
        <div></div>
      )}
    </div>

  )
}
