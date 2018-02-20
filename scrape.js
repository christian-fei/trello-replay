const {getBoards, getBoardCards, getCardActions} = require('./trello')
const {writeCache, setKey, getKey} = require('./cache')
const debug = require('debug')

const boardName = process.env.npm_config_BOARD_NAME

const LOG_NAME = 'trello-replay'
const log = debug(LOG_NAME)

debug.enable('*')

log('process.env.npm_config_TRELLO_API_KEY')
log(process.env.npm_config_TRELLO_API_KEY)

main()

async function main () {
  const boards = await getBoards()
  if (!boards) { log('no boards found'); process.exit(1) }
  log('boards', boards.map(b => b.id))
  const board = boards.find(b => b.name === boardName)
  if (!board) { log(`no board found named "${boardName}"`, `\navailable ${boards.map(b => b.name).join(', ')}`); process.exit(1) }
  log(`getting cards on "${board.name}"`)
  const cards = await getBoardCards(board.id)
  log(` -> ${cards.length} cards`)
  const allActions = []
  for (const card of cards) {
    if (!getKey(card.id, 'cards')) setKey(card.id, card, 'cards')
    if (getKey(card.id, 'actions')) continue
    const actionsByCard = await getCardActions(card.id)
    allActions.push(...actionsByCard)
    writeCache(allActions, 'actions')
  }
}
