const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const projectRoot = path.resolve(__dirname, '..');
const resultsDir = path.join(projectRoot, 'docs', 'test', 'results');
const reportsDir = path.join(projectRoot, 'docs', 'test', 'reports');
const jestJsonPath = path.join(resultsDir, 'jest-results.json');
const playwrightJsonPath = path.join(resultsDir, 'playwright-results.json');
const reportHtmlPath = path.join(reportsDir, 'index.html');

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function runCommand(label, command, args, options = {}) {
  process.stdout.write(`\n[${label}] Running ${command} ${args.join(' ')}\n`);

  const result = spawnSync(command, args, {
    cwd: projectRoot,
    encoding: 'utf8',
    stdio: options.captureStdout ? ['inherit', 'pipe', 'inherit'] : 'inherit',
    shell: false,
    env: process.env,
  });

  if (result.error) {
    throw result.error;
  }

  if (result.status !== 0) {
    process.exit(result.status || 1);
  }

  if (options.captureStdout && typeof result.stdout === 'string') {
    return result.stdout;
  }

  return null;
}

function getNpmCommandArgs(scriptName, extraArgs = []) {
  if (process.platform === 'win32') {
    return ['cmd.exe', ['/c', 'npm', 'run', scriptName, '--', ...extraArgs]];
  }

  return ['npm', ['run', scriptName, '--', ...extraArgs]];
}

function getNpxCommandArgs(commandArgs = []) {
  if (process.platform === 'win32') {
    return ['cmd.exe', ['/c', 'npx', ...commandArgs]];
  }

  return ['npx', commandArgs];
}

function parseJestResults(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function collectPlaywrightSpecs(suites, parentTitles = []) {
  const specs = [];

  for (const suite of suites || []) {
    const nextTitles = suite.title ? [...parentTitles, suite.title] : parentTitles;

    for (const spec of suite.specs || []) {
      const testRuns = (spec.tests || []).flatMap((test) =>
        (test.results || []).map((result) => ({
          projectName: test.projectName || 'default',
          status: result.status || 'unknown',
          duration: result.duration || 0,
          retry: result.retry || 0,
          errors: result.errors || [],
        }))
      );

      const latestRun = testRuns[testRuns.length - 1] || {
        projectName: 'default',
        status: 'unknown',
        duration: 0,
        retry: 0,
        errors: [],
      };

      specs.push({
        file: suite.file || '',
        titlePath: [...nextTitles, spec.title].filter(Boolean),
        title: spec.title,
        ok: spec.ok !== false,
        duration: testRuns.reduce((sum, run) => sum + run.duration, 0),
        projectName: latestRun.projectName,
        status: latestRun.status,
        errors: latestRun.errors,
      });
    }

    specs.push(...collectPlaywrightSpecs(suite.suites || [], nextTitles));
  }

  return specs;
}

function parsePlaywrightResults(filePath) {
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  const specs = collectPlaywrightSpecs(data.suites || []);

  const passed = specs.filter((spec) => spec.status === 'passed').length;
  const failed = specs.filter((spec) => spec.status !== 'passed').length;
  const duration = specs.reduce((sum, spec) => sum + spec.duration, 0);

  return {
    stats: {
      totalSuites: (data.suites || []).length,
      totalTests: specs.length,
      passedTests: passed,
      failedTests: failed,
      duration,
    },
    specs,
  };
}

function formatDuration(ms) {
  if (!ms && ms !== 0) {
    return '-';
  }

  return `${(ms / 1000).toFixed(2)} s`;
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function renderJestSuiteRows(testResults) {
  return testResults
    .map((suite) => {
      const failedAssertions = suite.assertionResults.filter((item) => item.status !== 'passed');
      const status = failedAssertions.length > 0 || suite.status === 'failed' ? 'Failed' : 'Passed';
      return `
        <tr>
          <td>${escapeHtml(suite.name)}</td>
          <td>${escapeHtml(status)}</td>
          <td>${suite.numPassingTests ?? suite.assertionResults.filter((item) => item.status === 'passed').length}</td>
          <td>${suite.numFailingTests ?? failedAssertions.length}</td>
          <td>${formatDuration(suite.endTime && suite.startTime ? suite.endTime - suite.startTime : 0)}</td>
        </tr>
      `;
    })
    .join('');
}

function renderPlaywrightRows(specs) {
  return specs
    .map((spec) => {
      const title = spec.titlePath.join(' > ');
      const errorText = spec.errors.length > 0
        ? `<details><summary>Errors</summary><pre>${escapeHtml(JSON.stringify(spec.errors, null, 2))}</pre></details>`
        : '-';

      return `
        <tr>
          <td>${escapeHtml(spec.file || '-')}</td>
          <td>${escapeHtml(title)}</td>
          <td>${escapeHtml(spec.status)}</td>
          <td>${formatDuration(spec.duration)}</td>
          <td>${errorText}</td>
        </tr>
      `;
    })
    .join('');
}

function getJestRuntime(testResults) {
  return (testResults || []).reduce((sum, suite) => {
    if (suite.endTime && suite.startTime) {
      return sum + (suite.endTime - suite.startTime);
    }

    return sum;
  }, 0);
}

function buildHtml({ jestResults, playwrightResults, generatedAt }) {
  const totalPassed = jestResults.numPassedTests + playwrightResults.stats.passedTests;
  const totalFailed = jestResults.numFailedTests + playwrightResults.stats.failedTests;
  const totalTests = jestResults.numTotalTests + playwrightResults.stats.totalTests;
  const jestRuntime = getJestRuntime(jestResults.testResults);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>MatchProof Test Results</title>
  <style>
    :root {
      color-scheme: light dark;
      --bg: #0f172a;
      --panel: #111827;
      --panel-2: #1f2937;
      --text: #e5e7eb;
      --muted: #94a3b8;
      --ok: #16a34a;
      --fail: #dc2626;
      --border: #334155;
      --accent: #38bdf8;
    }
    body {
      margin: 0;
      padding: 32px;
      font-family: Arial, sans-serif;
      background: var(--bg);
      color: var(--text);
    }
    h1, h2 { margin-top: 0; }
    .meta { color: var(--muted); margin-bottom: 24px; }
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
      gap: 16px;
      margin-bottom: 28px;
    }
    .card {
      background: var(--panel);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 16px;
    }
    .card strong {
      display: block;
      font-size: 28px;
      margin-top: 8px;
    }
    .section {
      margin-top: 28px;
      background: var(--panel);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 20px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 12px;
    }
    th, td {
      text-align: left;
      padding: 10px 12px;
      border-bottom: 1px solid var(--border);
      vertical-align: top;
    }
    th {
      background: var(--panel-2);
    }
    .passed { color: var(--ok); font-weight: 700; }
    .failed { color: var(--fail); font-weight: 700; }
    pre {
      white-space: pre-wrap;
      word-break: break-word;
      background: #020617;
      padding: 12px;
      border-radius: 8px;
      border: 1px solid var(--border);
    }
    a { color: var(--accent); }
  </style>
</head>
<body>
  <h1>MatchProof Test Results</h1>
  <div class="meta">Generated at: ${escapeHtml(generatedAt)}</div>

  <div class="grid">
    <div class="card">
      <div>Total Tests</div>
      <strong>${totalTests}</strong>
    </div>
    <div class="card">
      <div>Passed</div>
      <strong class="passed">${totalPassed}</strong>
    </div>
    <div class="card">
      <div>Failed</div>
      <strong class="${totalFailed > 0 ? 'failed' : 'passed'}">${totalFailed}</strong>
    </div>
    <div class="card">
      <div>Jest Suites</div>
      <strong>${jestResults.numTotalTestSuites}</strong>
    </div>
    <div class="card">
      <div>Playwright Specs</div>
      <strong>${playwrightResults.stats.totalTests}</strong>
    </div>
  </div>

  <div class="section">
    <h2>Jest Summary</h2>
    <p>
      Suites: <strong>${jestResults.numPassedTestSuites}/${jestResults.numTotalTestSuites}</strong> passed<br />
      Tests: <strong>${jestResults.numPassedTests}/${jestResults.numTotalTests}</strong> passed<br />
      Runtime: <strong>${formatDuration(jestRuntime)}</strong>
    </p>
    <table>
      <thead>
        <tr>
          <th>Suite</th>
          <th>Status</th>
          <th>Passed</th>
          <th>Failed</th>
          <th>Duration</th>
        </tr>
      </thead>
      <tbody>
        ${renderJestSuiteRows(jestResults.testResults)}
      </tbody>
    </table>
  </div>

  <div class="section">
    <h2>Playwright E2E Summary</h2>
    <p>
      Specs: <strong>${playwrightResults.stats.passedTests}/${playwrightResults.stats.totalTests}</strong> passed<br />
      Duration: <strong>${formatDuration(playwrightResults.stats.duration)}</strong>
    </p>
    <table>
      <thead>
        <tr>
          <th>File</th>
          <th>Spec</th>
          <th>Status</th>
          <th>Duration</th>
          <th>Errors</th>
        </tr>
      </thead>
      <tbody>
        ${renderPlaywrightRows(playwrightResults.specs)}
      </tbody>
    </table>
  </div>
</body>
</html>`;
}

function main() {
  ensureDir(resultsDir);
  ensureDir(reportsDir);

  const [npmCommand, npmArgs] = getNpmCommandArgs('test:unit', [
    '--json',
    '--outputFile',
    path.relative(projectRoot, jestJsonPath),
  ]);
  runCommand('Jest', npmCommand, npmArgs);

  const [npxCommand, npxArgs] = getNpxCommandArgs(['playwright', 'test', '--reporter=json']);
  const playwrightStdout = runCommand('Playwright', npxCommand, npxArgs, { captureStdout: true });

  fs.writeFileSync(playwrightJsonPath, playwrightStdout, 'utf8');

  const jestResults = parseJestResults(jestJsonPath);
  const playwrightResults = parsePlaywrightResults(playwrightJsonPath);
  const html = buildHtml({
    jestResults,
    playwrightResults,
    generatedAt: new Date().toISOString(),
  });

  fs.writeFileSync(reportHtmlPath, html, 'utf8');

  process.stdout.write(`\nHTML report generated: ${reportHtmlPath}\n`);
}

main();
