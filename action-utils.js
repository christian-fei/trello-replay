module.exports = {
  groupByUser,
  groupByCard,
  sortByDate,
  fromDate,
  toDate,
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

function fromDate (acc, action) {
  const date = Date.parse(action.date)
  if (!acc) return date
  return acc > date ? date : acc
}
function toDate (acc, action) {
  const date = Date.parse(action.date)
  if (!acc) return date
  return acc < date ? date : acc
}
