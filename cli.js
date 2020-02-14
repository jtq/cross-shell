#!/usr/bin/env node

const path = require('path');
const { spawn } = require("cross-spawn");

const [/*nodePath*/, /*thisPath*/, ...args] = process.argv;

let [cmd, ...cmdParams] = [...args];
let normalisePath = path.normalize;

const packParams = strings => {
    return strings.join(' ');
};

if(cmd === '--preserve-shell' || cmd === '-p') {    // Try to execute command in the same shell as the current one (if different to OS-native shell)

    if(process.env.SHELL) { // POSIX shell
        cmd = process.env.SHELL;    // Path to shell
        cmdParams = ['-c', packParams(cmdParams)];  // 'Execute following comand and then terminate' parameter to bash
        normalisePath = path.posix.normalize;
    }
    else if(process.env.ComSpec) {  // Win32 shell
        cmd = process.env.ComSpec;  // Path to shell
        cmdParams = ['/C', packParams(cmdParams)];  // 'Execute following comand and then terminate' parameter to windows shell
        normalisePath = path.win32.normalize;
    }
}

const normalisedCmd = normalisePath(cmd);  // If cmd is a path to a script, normalise it (includes correcting path-separators if necessary)

const shell = spawn(normalisedCmd, cmdParams, {
    stdio: [process.stdin, process.stdout, process.stderr]
});
