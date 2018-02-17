const {createServer} = require('http')
const {createReadStream} = require('fs')
const {parse} = require('url')
const mime = require('./mime')

createServer(requestListener)
.listen(process.env.npm_config_HTTP_PORT || 9000, function () {
  console.info('web:listening', this.address())
})

function requestListener ({url, headers: {accept}}, res, {log, error} = console) {
  const {pathname} = parse(url)
  const filepath = pathname.length === 1 ? '/index.html' : pathname
  const filename = `./www${filepath}`
  createReadStream(filename)
    .on('open', () => {
      const contentType = mime(filename)
      res.writeHead(200, {'content-type': contentType})
      log('web:%s %s %s (200)', pathname, filename, contentType)
    })
    .on('error', (err) => {
      if (/text\/html/.test(accept)) {
        log('web:%s', 'defaulting to www/index.html')
        createReadStream('www/index.html')
          .on('open', () => {
            res.writeHead(200, { 'content-type': 'text/html' })
            log('web:%s ./www/index.html (200)', pathname)
          })
          .pipe(res)
        return
      }
      res.writeHead(404, { 'content-type': 'text/plain' })
      res.end('Not Found.')
      error('web:%s (404)', pathname, err)
    })
    .pipe(res)
}
