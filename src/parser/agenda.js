import { get, keys } from 'idb-keyval'
import { parseDateTime } from '../utils/date-helpers'

const taskRegExp = /((SCHEDULED|DEADLINE):\s*<\d\d\d\d-\d\d-\d\d\s*(\w\w\w\s*)?(\d\d:\d\d:(AM|PM|am|pm)\s*)?((\+|\+\+|\.\+)\d+(y|w|m|d|h))?>)/g
const headlineRegExp = /^(\*+)\s+(?:(TODO|DONE)\s+)?(?:\[#(A|B|C)\]\s+)?(.*?)\s*(:(?:\w+:)+)?$/

const getAgenda = text => {
  const lines = text.split('\n')

  return lines
    .map((line, idx) => {
      const isTask = line.match(taskRegExp)
      if (!isTask) return

      const aboveLine = lines[idx - 1]

      const isBelowHeadline = aboveLine.match(headlineRegExp)
      if (!isBelowHeadline) return

      return {
        headline: aboveLine,
        task: line
      }
    })
    .filter(item => item)
}

const agenda = async () => {
  const fileList = await keys()

  const agendas = Promise.all(
    fileList.map(async file => {
      const text = await get(file)
      return { file, text: getAgenda(text), dt: parseDateTime(text) }
    })
  )

  return agendas
}

export { getAgenda }
export default agenda
