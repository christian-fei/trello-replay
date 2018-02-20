var html = require('choo/html')
var rawHtml = require('choo/html/raw')
var css = require('sheetify')
var snarkdown = require('snarkdown')

var TITLE = 'web - main'

const horizonalPrefix = css`
:host {
  display: flex;
  flex-direction: row;
  max-height: 100vh;
}
:host > * {
  min-width: 60%;
  min-width: 60vw;
}
`
const actionPrefix = css`
:host {
  border-bottom: 2px solid lightgrey;
  max-width: 100vw;
  overflow: scroll;
}
:host pre {
  white-space: pre-line;
}
:host img {
  width: 5em;
  vertical-align: middle;
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
  let description = `<h2>${action.date}</h2>
    <br>
    <i>${action.memberCreator.initials}</i>`
  if (action.type === 'updateCard') {
    description += `
      <img src="/assets/forward.png">
      moved
      <br>
      <h2>"${action.data.card.name}"</h2>
      <br>
      from <h1 class="di">${action.data.listBefore.name}</h1>
      to <h1 class="di">${action.data.listAfter.name}</h1>`
  }
  if (action.type === 'commentCard') {
    description += `
      <img src="/assets/comment.png">
      commented on card
      <br>
      <h2>"${action.data.card.name}"</h2>
      <br>
      <h3>${snarkdown(action.data.text)}</h3>`
  }
  return `
    <section class="${actionPrefix} pa5">${description}</section>`
}
