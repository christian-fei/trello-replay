var html = require('choo/html')
var rawHtml = require('choo/html/raw')
var css = require('sheetify')
var stringToColour = require('../lib/string-to-colour')
var {toCommentAction, toUpdateAction} = require('./components-raw')
var TITLE = 'web - main'

const horizonalPrefix = css`
:host {
  display: flex;
  flex-direction: row;
  max-height: 100vh;
}
:host > * {
  /*
  min-width: 60%;
  min-width: 60vw;
  */
 min-width: 100%;
}

body::-webkit-scrollbar {
  width: 15px;
  height: 15px;
}

body::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 1em rgba(0,0,0,0.3);
}

body::-webkit-scrollbar-thumb {
background-color: darkgrey;
outline: 1px solid slategrey;
}
`
const actionPrefix = css`
:host {
  display: block;
  max-width: 100vw;
  overflow: scroll;
  max-height: 100vh;
  position: relative;
}
:host pre {
  white-space: pre-line;
}
`

const attachmentsPrefix = css`
:host{
  height: 100px;
  height: auto;
  padding: 0.5em;
}
:host img {
  border-radius: 2px;
  width: 350px;
  vertical-align: middle;
  box-shadow: 1px 1px 11px 0px #dedede;
  margin-left: 1em;
  margin-right: 1em;
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
    <body class="code lh-copy" style="font-size: 14px">
      <main class="${horizontal ? horizonalPrefix : ''}">
        ${state.actions
          .map(toActionWithAttachments(state.attachmentsByCard))
          .map(rawHtml)}
      </main>
    </body>
  `
}

function toActionWithAttachments (attachmentsByCard) {
  return (action, index) => {
    let description = ''

    description += `
    <section>
      ${toAction(action, index)}
      <section class="${attachmentsPrefix}">
        ${(attachmentsByCard[action.data.card.id] || [])
          .map(a => a.url)
          .filter(u => u.includes('.png'))
          .map(u => `<a tabindex="-1" target="_blank" href="${u}"><img src="${u}"/></a>`)
          .join('')}
      </section>
    </section>`

    return description
  }
}

function toAction (action, index) {
  let description = ''

  const actionColour = stringToColour(action.data.card.name)
  if (action.type === 'updateCard') {
    description += toUpdateAction(action, actionColour)
  }
  if (action.type === 'commentCard') {
    description += toCommentAction(action, actionColour)
  }
  return `
    <section tabindex="${index}" class="${actionPrefix} pa5">${description}</section>`
}
