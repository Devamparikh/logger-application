const {createClient} = require('redis');

const client = async () => {
  const client = createClient({
      url: process.env.REDIS_URL
    })

  client.on('error', (err) => console.log('Redis Client Error', err))

  await client.connect()

  const pong = await client.sendCommand(['PING'])
  console.log(pong)
return client

}
module.exports = client 