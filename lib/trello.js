const log = require('debug')('trello')
const {get} = require('got')

const key = process.env.npm_config_TRELLO_API_KEY
const token = process.env.npm_config_TRELLO_API_TOKEN

module.exports = {
  getBoards,
  getBoardCards,
  getCardActions,
  getCardAttachments
}

function getBoards () {
  const url = `https://api.trello.com/1/members/me/boards?key=${key}&token=${token}`
  log('-> getBoards')
  return get(url, {json: true}).then(r => r.body)
}

function getBoardCards (boardId) {
  const url = `https://api.trello.com/1/boards/${boardId}/cards?key=${key}&token=${token}`
  log('-> getBoardCards', boardId)
  return get(url, {json: true}).then(r => r.body)
}

function getCardActions (cardId) {
  const url = `https://api.trello.com/1/cards/${cardId}/actions?limit=100&key=${key}&token=${token}`
  log('-> getCardActions', cardId)
  return get(url, {json: true}).then(r => r.body)
}

function getCardAttachments (cardId) {
  const url = `https://api.trello.com/1/cards/${cardId}/attachments?limit=100&key=${key}&token=${token}`
  log('-> getCardAttachments', cardId)
  return get(url, {json: true}).then(r => r.body)
}