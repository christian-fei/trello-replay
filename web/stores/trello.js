module.exports = store

function store (state, emitter) {
  state.actions = []
  state.cards = {}
  state.attachmentsByCard = {}

  emitter.on('DOMContentLoaded', function () {
    emitter.on('actions', function (actions) {
      actions.sort(byDate)
      state.actions = actions
      emitter.emit(state.events.RENDER)
    })
    emitter.on('cards', function (cards) {
      state.cards = cards
      emitter.emit(state.events.RENDER)
    })
    emitter.on('attachmentsByCard', function (attachmentsByCard) {
      state.attachmentsByCard = attachmentsByCard
      emitter.emit(state.events.RENDER)
    })
  })
}

function byDate (a1, a2) {
  const d1 = new Date(a1.date)
  const d2 = new Date(a2.date)
  if (d1 < d2) return -1
  if (d1 > d2) return 1
  return 0
}
