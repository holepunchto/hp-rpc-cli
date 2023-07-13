const RPC = require('@hyperswarm/rpc')
const argv = require('minimist')(process.argv.slice(2))

const helpMsg = 'Usage:\nhp-rpc-cli ?-i identity.json ?-s peer_key -m method -d data'

if (argv.help) {
  console.log(helpMsg)
  process.exit(-1)
}

if (!argv.s) {
  console.error('Error: peer invalid')
  process.exit(-1)
}

if (!argv.m) {
  console.error('Error: method invalid')
  process.exit(-1)
}

if (!argv.d) {
  console.error('Error: data invalid')
  process.exit(-1)
}

const rpc = new RPC({
  
})

const client = rpc.connect(Buffer.from(argv.s, 'hex'));

(async () => {
  const res = await client.request(argv.m, Buffer.from(argv.d))

  console.log(res.toString())
})()
