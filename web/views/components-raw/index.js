var css = require('sheetify')
var snarkdown = require('snarkdown')

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

module.exports = {
  toCommentAction,
  toUpdateAction
}

function toCommentAction (action, actionColour) {
  let description = ''
  description += `
  <br>
  <h2 class="${actionCardNamePrefix}" style="background: ${actionColour}; ">
      <img class="${cardActionPrefix}" src="/assets/comment-white.png">
    <span>"${action.data.card.name}"</span>
  </h2>`

  description += `<h2>${action.date}</h2>
  <br>
  <i><img class="${avatarPrefix}" src="https://trello-avatars.s3.amazonaws.com/${action.memberCreator.avatarHash}/170.png"/></i>`

  description += `
  <br>
  <h3>${snarkdown(action.data.text)}</h3>`

  return description
}

function toUpdateAction (action, actionColour) {
  let description = ''
  description += `
  <br>
  <h2 class="${actionCardNamePrefix}" style="background: ${actionColour}; ">
    <img class="${cardActionPrefix}" src="/assets/forward-white.png">
    <span>"${action.data.card.name}"</span>
  </h2>`

  description += `<h2>${action.date}</h2>
  <br>
  <i><img class="${avatarPrefix}" src="https://trello-avatars.s3.amazonaws.com/${action.memberCreator.avatarHash}/170.png"/></i>`

  description += `
  <br>
  from <h1 class="di">${action.data.listBefore.name}</h1>
  to <h1 class="di">${action.data.listAfter.name}</h1>`

  return description
}
