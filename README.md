# hp-rpc-cli

A basic command-line client for hyperswarm/rpc

```
hp-rpc-cli --help

Usage:
nhp-rpc-cli ?-i identity.json ?-s peer_key -m method -d data (| -f data_file) ?-t timeout_ms ?-dp dht_port ?-bn dht_bootstrap_nodes ?-ds dht_keypair_seed
```

Options:
```
-s SERVER_PEER_KEY : server peer key (command-line)
-i keypair.json : keypair file
-m method
-d data as a string
-f data as a file
-t timeout in milliseconds
-bn dht boostrap nodes (comma separated ip:port entries)
-dp dht node port
-ds dht node keypair seed (32 byte hex)
```

Read more about using identities here: https://github.com/prdn/hyper-cmd-docs/blob/main/identity.md

Host resolution: https://github.com/prdn/hyper-cmd-docs/blob/main/resolve.md
