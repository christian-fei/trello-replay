var html = require('choo/html')
var rawHtml = require('choo/html/raw')
var fetch = require('unfetch')
var snarkdown = require('snarkdown')

var TITLE = 'web - main'

module.exports = view

let fetched = false

function view (state, emit) {
  if (state.title !== TITLE) emit(state.events.DOMTITLECHANGE, TITLE)
  if (!fetched) {
    fetched = true
    fetch('http://localhost:9000/actions.json', { method: 'GET' })
    .then(res => {
      if (!res.ok) return console.log('oh no!')
      return res.json()
    })
    .then(data => emit('actions', data))
    .catch(err => console.log('oh no!', err))

    fetch('http://localhost:9000/cards.json', { method: 'GET' })
    .then(res => {
      if (!res.ok) return console.log('oh no!')
      return res.json()
    })
    .then(data => emit('cards', data))
    .catch(err => console.log('oh no!', err))
  }

  return html`
    <body class="code lh-copy">
      <main class="flex">
        <section class="w-100">
          <h1>xx</h1>
          ${rawHtml(state.actions.map(a => description(a)).join(''))}
        </section>
      </main>
    </body>
  `
}

function description (action) {
  let description = `${action.date} - ${action.memberCreator.username}`
  if (action.type === 'updateCard') {
    description += ` moved "${action.data.card.name}" from ${action.data.listBefore.name} to ${action.data.listAfter.name}`
  }
  if (action.type === 'commentCard') {
    const md = snarkdown(action.data.text)
    description += ` commented on card "${action.data.card.name}"\n${md}`
  }

  // description + ' - unhandled type ->' + action.type

  // console.log('description', description)
  return `<div>${description}</div>`
}
