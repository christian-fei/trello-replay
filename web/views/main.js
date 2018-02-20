var html = require('choo/html')
var rawHtml = require('choo/html/raw')
var css = require('sheetify')
var snarkdown = require('snarkdown')

var TITLE = 'web - main'

const cardActionPrefix = css`
:host {
  vertical-align: middle;
}
`

const avatarPrefix = css`
:host {
  border-radius: 50%;
  width: 100px;
  height: 100px;
}
`

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
  align-items: center;
}
:host > * {
  min-width: 60%;
  min-width: 60vw;
}
`
const actionPrefix = css`
:host {
  max-width: 100vw;
  overflow: scroll;
  max-height: 100vh;
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
    <body class="code lh-copy" style="font-size: 14px">
      <main class="${horizontal ? horizonalPrefix : ''}">
        ${rawHtml(state.actions.map(toDescription).join(''))}
      </main>
    </body>
  `
}

function toDescription (action, index) {
  let description = `<h2>${action.date}</h2>
    <br>
    <i><img class="${avatarPrefix}" src="https://trello-avatars.s3.amazonaws.com/${action.memberCreator.avatarHash}/170.png"/></i>`

  const actionColour = stringToColour(action.data.card.name)
  if (action.type === 'updateCard') {
    description += `
      <br>
      <h2 class="${actionCardNamePrefix}" style="background: ${actionColour}; ">
        <img class="${cardActionPrefix}" src="/assets/forward-white.png">
        <span>"${action.data.card.name}"</span>
      </h2>
      <br>
      from <h1 class="di">${action.data.listBefore.name}</h1>
      to <h1 class="di">${action.data.listAfter.name}</h1>`
  }
  if (action.type === 'commentCard') {
    description += `
    <h2 class="${actionCardNamePrefix}" style="background: ${actionColour}; ">
        <img class="${cardActionPrefix}" src="/assets/comment-white.png">
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