# Node-Hill-S

A modified version of [Node-Hill](https://gitlab.com/brickhill/open-source/node-hill) made for SandPile and improving the developer experience

example run command:
```bash
deno run --allow-net --allow-env --allow-read=.,./maps,./user_scripts,./node_modules,./data,../dist,../node_modules,../src --allow-write=./data --deny-run --deny-sys --unstable-detect-cjs start.js
```

this is basically node-hill-s but deno and without vm2
this is either way more secure or incredibly insecure idfk