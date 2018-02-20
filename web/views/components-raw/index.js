var css = require('sheetify')
var snarkdown = require('snarkdown')

const cardActionPrefix = css`
:host {
  vertical-align: middle;
  border-radius: 10%;
  margin: 5px;
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
  border-top-width: 1em;
  border-top-style: solid;
  margin: 0;
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
  //  style="background: ${actionColour};"
  let description = ''
  description += `<span>${action.date}</span>`
  description += `
  <br>
  <h2 class="${actionCardNamePrefix}" style="border-color: ${actionColour};">
      <img class="${cardActionPrefix}" src="/assets/comment.png">
    <span>"${action.data.card.name}"</span>
  </h2>`

  description += `
  <br>
  <i><img class="${avatarPrefix}"  src="https://trello-avatars.s3.amazonaws.com/${action.memberCreator.avatarHash}/170.png"/></i>`

  description += `
  <br>
  <h3>${snarkdown(action.data.text)}</h3>`

  return description
}

function toUpdateAction (action, actionColour) {
  let description = ''
  description += `<span>${action.date}</span>`
  description += `
  <br>
  <h2 class="${actionCardNamePrefix}" style="border-color: ${actionColour};">
    <img class="${cardActionPrefix}" src="/assets/forward.png">
    <span>"${action.data.card.name}"</span>
  </h2>`

  description += `
  <br>
  <i><img class="${avatarPrefix}" src="https://trello-avatars.s3.amazonaws.com/${action.memberCreator.avatarHash}/170.png"/></i>`

  description += `
  <br>
  from <h1 class="di">${action.data.listBefore.name}</h1>
  to <h1 class="di">${action.data.listAfter.name}</h1>`

  return description
}
