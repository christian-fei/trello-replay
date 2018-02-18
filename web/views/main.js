var html = require('choo/html')
var rawHtml = require('choo/html/raw')
var snarkdown = require('snarkdown')

var TITLE = 'web - main'

module.exports = view

function view (state, emit) {
  if (state.title !== TITLE) emit(state.events.DOMTITLECHANGE, TITLE)

  return html`
    <body class="code lh-copy">
      <main class="flex">
        <section class="w-100">
          ${rawHtml(state.actions.map(a => description(a)).join(''))}
        </section>
      </main>
    </body>
  `
}

function description (action) {
  let description = `<b>${action.date}</b> - <i>${action.memberCreator.initials}</i>`
  if (action.type === 'updateCard') {
    description += ` moved "${action.data.card.name}" from ${action.data.listBefore.name} to ${action.data.listAfter.name}`
  }
  if (action.type === 'commentCard') {
    const md = snarkdown(action.data.text)
    description += ` commented on card "${action.data.card.name}"\n${md}`
  }
  return `<div class="pa3 w-100">${description}</div>`
}
