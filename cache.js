const log = require('debug')('cache')

const {join} = require('path')
const {readFileSync, writeFileSync} = require('fs')

const jsonPathFor = (name) => join(__dirname, `${name}.json`)

module.exports = { writeCache, readCache, setKey, getKey }

function writeCache (cache, name) {
  log('writeCache', name)
  writeFileSync(jsonPathFor(name), JSON.stringify(cache), 'utf-8')
}

function readCache (name) {
  log('readCache', name)
  let contents = '{}'
  try {
    contents = readFileSync(jsonPathFor(name), 'utf-8')
  } catch (e) {
    console.error('failed to read from cache', e)
  }
  return JSON.parse(contents)
}

function setKey (key, value, name) {
  log('setKey', key, name)
  const cache = readCache(name)
  cache[key] = value
  writeCache(cache, name)
  return cache
}

function getKey (key, name) {
  log('getKey', key, name)
  const cache = readCache(name)
  return cache[key]
}
