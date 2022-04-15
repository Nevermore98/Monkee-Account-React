const server = require('pushstate-server')

server.start({
  port: 9810,
  directory: './dist'
})
