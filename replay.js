const debug = require('debug')
const log = debug('replay')
debug.enable('*')

const {readCache} = require('./cache')

const actionsMap = readCache('actions')

const actions = Object.keys(actionsMap).reduce((acc, id) => acc.concat(actionsMap[id]), [])

actions.sort((a1, a2) => {
  const d1 = new Date(a1.date)
  const d2 = new Date(a2.date)
  if (d1 < d2) return -1
  if (d1 > d2) return 1
  return 0
})

log(actions.map(cardDescription).join('\n'))

function cardDescription (action) {
  let description = `${action.date} - ${action.memberCreator.username}`
  if (action.type === 'updateCard') {
    return description + ` moved "${action.data.card.name}" from ${action.data.listBefore.name} to ${action.data.listAfter.name}`
  }
  if (action.type === 'commentCard') {
    return description + ` commented on card "${action.data.card.name}"` // `${action.data.text}`
  }

  return description + ' - unhandled type ->' + action.type
}
