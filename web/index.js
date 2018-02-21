var css = require('sheetify')
var choo = require('choo')
var fetch = require('unfetch')

css('tachyons')

var app = choo()
if (process.env.NODE_ENV !== 'production') {
  app.use(require('choo-devtools')())
} else {
  app.use(require('choo-service-worker')())
}

app.use(require('./stores/trello'))

app.route('/*', require('./views/main'))

init(app)

if (!module.parent) app.mount('body')
else module.exports = app

function init ({emitter}) {
  emitter.on('DOMContentLoaded', function () {
    fetch('http://localhost:9000/actions.json', { method: 'GET' })
    .then(res => res.json())
    .then(data => emitter.emit('actions', data))
    .catch(err => console.log('failed to fetch actions.json', err))

    fetch('http://localhost:9000/cards.json', { method: 'GET' })
    .then(res => res.json())
    .then(data => emitter.emit('cards', data))
    .catch(err => console.log('failed to fetch cards.json', err))

    fetch('http://localhost:9000/attachmentsByCard.json', { method: 'GET' })
    .then(res => res.json())
    .then(data => emitter.emit('attachmentsByCard', data))
    .catch(err => console.log('failed to fetch attachmentsByCard.json', err))
  })
}
