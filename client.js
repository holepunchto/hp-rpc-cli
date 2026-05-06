#!/usr/bin/env node

'use strict'

const fs = require('fs')
const DHT = require('hyperdht')
const RPC = require('@hyperswarm/rpc')
const libUtils = require('hyper-cmd-lib-utils')
const libKeys = require('hyper-cmd-lib-keys')
const { command, flag, summary } = require('paparam')

const cmd = command(
  'hp-rpc-cli',
  summary('Holepunch RPC Cli'),
  flag('-i [identity]', 'identity file (e.g. identity.json)'),
  flag('-s [peer]', 'peer key'),
  flag('--cp [capability]', 'capability (hex)'),
  flag('-m [method]', 'rpc method'),
  flag('-d [data]', 'rpc data payload'),
  flag('-f [file]', 'rpc data payload from file'),
  flag('-t [timeout]', 'request timeout in ms').default(5000),
  flag('--dp [port]', 'dht port'),
  flag('--bn [nodes]', 'dht bootstrap nodes (comma separated)'),
  flag('--ds [seed]', 'dht keypair seed (hex)')
)

const parsed = cmd.parse()

if (parsed === null) {
  process.exit(-1)
}

const flags = parsed.flags

if (!flags.s) {
  console.error('Error: peer invalid')
  process.exit(-1)
}

const peerKey = libUtils.resolveHostToKey([], flags.s)

if (!flags.m) {
  console.error('Error: method invalid')
  process.exit(-1)
}

if (!flags.d && !flags.f) {
  console.error('Error: data invalid')
  process.exit(-1)
}

let data = flags.d
if (flags.f) {
  data = fs.readFileSync(flags.f)
}

let keyPair = null

if (flags.i) {
  keyPair = libUtils.resolveIdentity([], flags.i)

  if (!keyPair) {
    console.error('Error: identity file invalid')
    process.exit(-1)
  }

  keyPair = libKeys.parseKeyPair(keyPair)
}

const dhtOpts = {}

if (flags.bn) {
  dhtOpts.bootstrap = flags.bn.split(',').map(n => n.trim())
}

if (flags.dp) {
  dhtOpts.port = +flags.dp
}

if (flags.ds) {
  dhtOpts.keyPair = DHT.keyPair(Buffer.from(flags.ds, 'hex'))
}

const timeout = +flags.t

const connectOpts = {}
if (flags.cp) {
  connectOpts.capability = Buffer.from(flags.cp.toString(), 'hex')
}

const main = async () => {
  try {
    let dht
    if (Object.keys(dhtOpts).length > 0) {
      dht = new DHT(dhtOpts)
      await dht.ready()
    }

    const rpc = new RPC({
      dht,
      keyPair
    })

    const client = rpc.connect(Buffer.from(peerKey, 'hex'), connectOpts)

    const res = await client.request(flags.m, Buffer.from(data), {
      timeout
    })

    console.log(res.toString())

    await rpc.destroy()
    if (dht) {
      await dht.destroy()
    }

    process.exit(0)
  } catch (err) {
    console.error(err)
    process.exit(-1)
  }
}

main()
