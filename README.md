# hp-rpc-cli

A basic command-line client for hyperswarm/rpc

```
hp-rpc-cli --help

Usage:
hp-rpc-cli ?-i identity.json ?-s peer_key -m method -d data ?-t timeout_ms
```

Options:
```
-s SERVER_PEER_KEY : server peer key (command-line)
-i keypair.json : keypair file
-m method
-d data as a string
-t timeout in milliseconds
```

Read more about using identities here: https://github.com/prdn/hyper-cmd-docs/blob/main/identity.md
