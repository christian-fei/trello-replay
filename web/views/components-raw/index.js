var css = require('sheetify')
var snarkdown = require('snarkdown')
var stringToColour = require('../../lib/string-to-colour')

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
  position: absolute;
  right: 4em;
  top: 3.5em;
  border: 1.2rem solid white;
}
`

const actionCardNamePrefix = css`
:host {
  padding: 2em 0;
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
  toUpdateAction,
  toAction,
  toActionWithAttachments
}

function toCommentAction (action, actionColour) {
  //  style="background: ${actionColour};"
  let description = ''
  description += `<span>${action.date}</span>`

  description += `
  <br>
  <i><img class="${avatarPrefix}"  src="https://trello-avatars.s3.amazonaws.com/${action.memberCreator.avatarHash}/170.png"/></i>`

  description += `
  <br>
  <h2 class="${actionCardNamePrefix}" style="border-color: ${actionColour};">
    <span>"${action.data.card.name}"</span>
    </br>
    <img class="${cardActionPrefix}" src="/assets/comment.png">
  </h2>`

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
  <img class="${avatarPrefix}" src="https://trello-avatars.s3.amazonaws.com/${action.memberCreator.avatarHash}/170.png"/>`

  description += `
  <br>
  <h2 class="${actionCardNamePrefix}" style="border-color: ${actionColour};">
    <span>"${action.data.card.name}"</span>
    </br>
    <img class="${cardActionPrefix}" src="/assets/forward.png">
  </h2>`

  description += `
  <br>
  from <h1 class="di">${action.data.listBefore.name}</h1>
  to <h1 class="di">${action.data.listAfter.name}</h1>
  ${action.data.listAfter.name.toLowerCase().includes('done') ? '<h1>🎉🎊🚀</h1>' : ''}`

  return description
}

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
