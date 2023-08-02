const fs = require('fs')
const RPC = require('@hyperswarm/rpc')
const libUtils = require('@hyper-cmd/lib-utils')
const libKeys = require('@hyper-cmd/lib-keys')

const argv = require('minimist')(process.argv.slice(2))

const helpMsg = 'Usage:\nhp-rpc-cli ?-i identity.json ?-s peer_key -m method -d data (| -f data_file) ?-t timeout_ms'

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

if (!argv.d && !argv.f) {
  console.error('Error: data invalid')
  process.exit(-1)
}

if (argv.f) {
  const fpath = argv.f
  argv.d = fs.readFileSync(fpath)
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
  process.exit(-1)
})()
