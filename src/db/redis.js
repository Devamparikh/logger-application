const {createClient} = require('redis');

  const client = createClient({
      url: process.env.REDIS_URL
    })

  client.on('error', (err) => console.log('Redis Client Error', err))

  client.connect()
console.log('redis connect');
  // const pong = client.sendCommand(['PING'])
  // console.log(pong)

module.exports = client 