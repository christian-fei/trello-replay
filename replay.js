const debug = require('debug')
const log = debug('replay')
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

const actionsByCard = actions.reduce(groupByCard, {})
Object.keys(actionsByCard)
.forEach((card, i, arr) => {
  // console.log('i', i, card)
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

// log(Object.keys(actionsByUser).reduce((acc, user) => {
//   console.log('user', user)
//   const curr = actionsByUser[user]
//   curr.sort(sortByDate)
//   // return Object.assign({}, acc, {
//   //   [user]: curr.length
//   // })
// }))

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

function groupByUser (acc, action) {
  const key = action.memberCreator.initials
  return Object.assign({}, acc, {
    [key]: (acc[key] || []).concat([action])
  })
}
function groupByCard (acc, action) {
  const key = action.data.card.name
  return Object.assign({}, acc, {
    [key]: (acc[key] || []).concat([action])
  })
}

function sortByDate (a1, a2) {
  const d1 = new Date(a1.date)
  const d2 = new Date(a2.date)
  if (d1 < d2) return -1
  if (d1 > d2) return 1
  return 0
  // return d1 - d2
}
