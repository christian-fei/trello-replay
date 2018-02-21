var html = require('choo/html')
var rawHtml = require('choo/html/raw')
var css = require('sheetify')
var {toActionWithAttachments} = require('./components-raw')
var TITLE = 'web - main'

const horizonalPrefix = css`
:host { display: flex; flex-direction: row; max-height: 100vh; }
:host > * { min-width: 100%; }

body::-webkit-scrollbar { width: 15px; height: 15px; }
body::-webkit-scrollbar-track { -webkit-box-shadow: inset 0 0 1em rgba(0,0,0,0.3); }
body::-webkit-scrollbar-thumb { background-color: darkgrey; outline: 1px solid slategrey; }
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
