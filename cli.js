#!/usr/bin/env node

const path = require('path');
const { spawn } = require("cross-spawn");

const [/*nodePath*/, /*thisPath*/, ...args] = process.argv;

const [cmd, ...cmdParams] = [...args];
const normalisedCmd = path.normalize(cmd);  // If cmd is a path to a script, normalise it (includes correcting path-separators if necessary)

const shell = spawn(normalisedCmd, cmdParams, {
    stdio: [process.stdin, process.stdout, process.stderr],
    shell: true
});