var html = require('choo/html')
var rawHtml = require('choo/html/raw')
var css = require('sheetify')
var snarkdown = require('snarkdown')

var TITLE = 'web - main'

const actionCardNamePrefix = css`
:host {
  padding: 2em;
  line-height: 1.5;
}
:host span {
  background-color:white;
  padding: 0.3em;
}
`

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

  const actionColour = stringToColour(action.data.card.name)
  if (action.type === 'updateCard') {
    description += `
      <img src="/assets/forward.png">
      moved
      <br>
      <h2 class="${actionCardNamePrefix}" style="background: ${actionColour}; ">
        <span>"${action.data.card.name}"</span>
      </h2>
      <br>
      from <h1 class="di">${action.data.listBefore.name}</h1>
      to <h1 class="di">${action.data.listAfter.name}</h1>`
  }
  if (action.type === 'commentCard') {
    description += `
      <img src="/assets/comment.png">
      commented on card
      <br>
      <h2 class="${actionCardNamePrefix}" style="background: ${actionColour}; ">
        <span>"${action.data.card.name}"</span>
      </h2>
      <br>
      <h3>${snarkdown(action.data.text)}</h3>`
  }
  return `
    <section class="${actionPrefix} pa5">${description}</section>`
}


function stringToColour (str) {
  var hash = 0;
  for (var i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  var colour = '#';
  for (var i = 0; i < 3; i++) {
    var value = (hash >> (i * 8)) & 0xFF;
    colour += ('00' + value.toString(16)).substr(-2);
  }
  return colour;
}