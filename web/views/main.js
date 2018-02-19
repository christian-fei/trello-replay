var html = require('choo/html')
var rawHtml = require('choo/html/raw')
var css = require('sheetify')
var snarkdown = require('snarkdown')

var TITLE = 'web - main'

const horizonalPrefix = css`
:host {
  display: flex;
  flex-direction: row;
}
:host > * {
  min-width: 100vw;
}
`
const actionPrefix = css`
:host {
  border-bottom: 2px solid lightgrey;
  max-width: 40em;
  overflow: scroll;
}
:host pre {
  white-space: pre-line;
}
`

module.exports = view

function view (state, emit) {
  if (state.title !== TITLE) emit(state.events.DOMTITLECHANGE, TITLE)

  let horizontal = false
  if (typeof window !== 'undefined') {
    horizontal = window.location.href.includes('horizontal')
  }

  return html`
    <body class="code lh-copy">
      <main class="flexxxx ${horizontal ? horizonalPrefix : ''}">
        ${rawHtml(state.actions.map(toDescription).join(''))}
      </main>
    </body>
  `
}

function toDescription (action, index) {
  let description = `<b>${action.date}</b> - <i>${action.memberCreator.initials}</i>`
  if (action.type === 'updateCard') {
    description += ` <b>moved</b> "${action.data.card.name}" from ${action.data.listBefore.name} to ${action.data.listAfter.name}`
  }
  if (action.type === 'commentCard') {
    description += ` <b>commented</b> on card "${action.data.card.name}"\n${snarkdown(action.data.text)}`
  }
  return `<section class="${actionPrefix} pa3">${description}</section>`
}
