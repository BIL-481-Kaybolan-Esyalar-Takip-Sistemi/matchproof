const { spawn } = require('child_process');

const npmCommand = process.platform === 'win32' ? 'npm.cmd' : 'npm';
const childProcesses = [];
let shuttingDown = false;

function stopAll(exitCode = 0) {
  if (shuttingDown) {
    return;
  }

  shuttingDown = true;

  for (const child of childProcesses) {
    if (!child.killed) {
      child.kill('SIGINT');
    }
  }

  setTimeout(() => {
    process.exit(exitCode);
  }, 200);
}

function runScript(label, scriptName) {
  const child = spawn(npmCommand, ['run', scriptName], {
    stdio: 'inherit',
    shell: false,
  });

  childProcesses.push(child);

  child.on('exit', (code, signal) => {
    if (shuttingDown) {
      return;
    }

    if (signal) {
      console.log(`[${label}] stopped with signal ${signal}`);
      stopAll(0);
      return;
    }

    if (code !== 0) {
      console.error(`[${label}] exited with code ${code}`);
      stopAll(code || 1);
      return;
    }

    console.log(`[${label}] exited successfully`);
    stopAll(0);
  });

  child.on('error', (error) => {
    console.error(`[${label}] failed to start:`, error);
    stopAll(1);
  });
}

process.on('SIGINT', () => stopAll(0));
process.on('SIGTERM', () => stopAll(0));

runScript('server', 'dev');
runScript('client', 'dev:client');
