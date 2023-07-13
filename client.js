const RPC = require('@hyperswarm/rpc')
const libUtils = require('@hyper-cmd/lib-utils')
const libKeys = require('@hyper-cmd/lib-keys')

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

let keyPair = null

if (argv.i) {
  keyPair = libUtils.resolveIdentity([], argv.i)

  if (!keyPair) {
    console.error('Error: identity file invalid')
    process.exit(-1)
  }

  keyPair = libKeys.parseKeyPair(keyPair)
}

const rpc = new RPC({
  keyPair
})

if (!argv.t) {
  argv.t = 5000
}

const client = rpc.connect(Buffer.from(argv.s, 'hex'));

(async () => {
  const res = await client.request(argv.m, Buffer.from(argv.d), {
    timeout: argv.t
  })

  console.log(res.toString())
})()
