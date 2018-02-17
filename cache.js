const {join} = require('path')
const {readFileSync, writeFileSync} = require('fs')

const jsonPathFor = (name) => join(__dirname, `${name}.json`)
const jsonPath = jsonPathFor('trello-replay')

module.exports = { writeCache, readCache, setKey, getKey }

function writeCache (cache) {
  writeFileSync(jsonPath, JSON.stringify(cache), 'utf-8')
}

function readCache () {
  let contents = '{}'
  try {
    contents = readFileSync(jsonPath, 'utf-8')
  } catch (e) {
    console.error('failed to read from cache', e)
  }
  return JSON.parse(contents)
}

function setKey (key, value) {
  const cache = readCache()
  cache[key] = value
  writeCache(cache)
  return cache
}

function getKey (key) {
  const cache = readCache()
  return cache[key]
}
