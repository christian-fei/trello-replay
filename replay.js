const debug = require('debug')
const log = debug('replay')
const {sortByDate, groupByCard, groupByUser, fromDate, toDate} = require('./action-utils')
debug.enable('*')

const {readCache} = require('./cache')

const actionsMap = readCache('actions')

const actions = Object.keys(actionsMap).reduce((acc, id) => acc.concat(actionsMap[id]), [])

actions.sort(sortByDate)

// log(actions.map(cardDescription).join('\n'))

// const actionsByUser = actions.reduce(groupByUser, {})
// Object.keys(actionsByUser)
// .forEach((user, i, arr) => {
//   // console.log('i', i, user)
//   const actions = actionsByUser[user]
//   console.log('user', user, actions.length)
// })

// log(Object.keys(actionsByUser).reduce((acc, user) => {
//   console.log('user', user)
//   const curr = actionsByUser[user]
//   curr.sort(sortByDate)
//   const from = curr.reduce(fromDate, 0)
//   const to = curr.reduce(toDate, 0)
//   return Object.assign({}, acc, {
//     [user]: curr.length
//   })
// }))

const actionsByCard = actions.reduce(groupByCard, {})
Object.keys(actionsByCard)
.forEach((card, i, arr) => {
  let actions = actionsByCard[card].filter(a => a.type === 'updateCard').sort(sortByDate)
  let durationInMillis
  if (actions.length > 1) durationInMillis = +new Date(actions[actions.length - 1].date) - +new Date(actions[0].date)
  log('card', card, actions.length)
  if (durationInMillis) {
    const durationInMinutes = parseInt(durationInMillis / 1000 / 60)
    if (durationInMinutes > 60) {
      const leftMinutes = durationInMinutes % 60
      const durationInFullHours = (durationInMinutes - leftMinutes) / 60
      log(`  -> took ${durationInFullHours}:${leftMinutes}h`)
    } else {
      log(`  -> took ${durationInMinutes}min`)
    }
  }
})

function cardDescription (action) {
  let description = `${action.date} - ${action.memberCreator.username}`
  if (action.type === 'updateCard') {
    return description + ` moved "${action.data.card.name}" from ${action.data.listBefore.name} to ${action.data.listAfter.name}`
  }
  if (action.type === 'commentCard') {
    return description + ` commented on card "${action.data.card.name}"\n${action.data.text}`
  }

  return description + ' - unhandled type ->' + action.type
}
