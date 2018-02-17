const log = require('debug')('cache')

const {join} = require('path')
const {readFileSync, writeFileSync} = require('fs')

const jsonPathFor = (name) => join(__dirname, `${name}.json`)

module.exports = { writeCache, readCache, setKey, getKey }

function writeCache (cache, name) {
  log('writeCache', name)
  const contents = typeof cache === 'object' ? JSON.stringify(cache) : cache
  writeFileSync(jsonPathFor(name), contents, 'utf-8')
}

function readCache (name) {
  log('readCache', name)
  let contents = '{}'
  const cacheLocation = jsonPathFor(name)
  try {
    contents = readFileSync(cacheLocation, 'utf-8')
  } catch (e) {
    writeCache(contents, name)
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
