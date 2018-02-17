const {getBoards, getBoardCards, getCardActions, scrape} = require('./trello')
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
  process.stdout.write(JSON.stringify(cards[0]))
  for (const card of cards) {
    const actions = await getCardActions(card.id)
    log('actions', JSON.stringify(actions.map(a => a.type)))
  }
}
