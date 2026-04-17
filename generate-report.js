const fs = require('fs');

const rawData = fs.readFileSync('reports/test-results.json', 'utf-8');
const results = JSON.parse(rawData);

function getAllSpecs(suites) {
    let specs = [];
    for (const suite of suites) {
        if (suite.specs) specs = specs.concat(suite.specs);
        if (suite.suites) specs = specs.concat(getAllSpecs(suite.suites));
    }
    return specs;
}

const allSpecs = getAllSpecs(results.suites || []);
const passed = allSpecs.filter(s => s.ok);
const failed = allSpecs.filter(s => !s.ok);

const html = `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <title>Rapport QA — SauceDemo</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Segoe UI', sans-serif; background: #f0f2f5; color: #333; }
    header {
      background: linear-gradient(135deg, #1e5aa0, #2980b9);
      color: white; padding: 40px; text-align: center;
    }
    header h1 { font-size: 2em; margin-bottom: 8px; }
    header p { opacity: 0.85; }
    .stats { display: flex; justify-content: center; gap: 24px; padding: 30px; flex-wrap: wrap; }
    .stat-card { background: white; border-radius: 12px; padding: 24px 40px; text-align: center; box-shadow: 0 2px 12px rgba(0,0,0,0.08); min-width: 160px; }
    .stat-card .number { font-size: 2.5em; font-weight: bold; }
    .stat-card .label { color: #888; margin-top: 4px; }
    .total .number { color: #1e5aa0; }
    .success .number { color: #27ae60; }
    .failure .number { color: #e74c3c; }
    .section { max-width: 900px; margin: 0 auto 30px; padding: 0 20px; }
    .section h2 { font-size: 1.2em; margin-bottom: 14px; padding-left: 10px; border-left: 4px solid #1e5aa0; }
    .test-item { background: white; border-radius: 10px; padding: 16px 20px; margin-bottom: 10px; display: flex; align-items: center; gap: 12px; box-shadow: 0 1px 6px rgba(0,0,0,0.06); }
    .test-item.pass { border-left: 4px solid #27ae60; }
    .test-item.fail { border-left: 4px solid #e74c3c; }
    .test-name { flex: 1; font-weight: 500; }
    .test-file { font-size: 0.8em; color: #999; }
    .test-duration { font-size: 0.85em; color: #aaa; }
    .bug-card { background: white; border-radius: 10px; padding: 20px; margin-bottom: 14px; border-left: 4px solid #e74c3c; box-shadow: 0 1px 6px rgba(0,0,0,0.06); }
    .bug-card h3 { color: #e74c3c; margin-bottom: 8px; }
    .bug-card .bug-file { font-size: 0.85em; color: #999; margin-bottom: 10px; }
    .bug-card .bug-error { background: #fff5f5; border-radius: 6px; padding: 12px; font-family: monospace; font-size: 0.85em; color: #c0392b; white-space: pre-wrap; }
    footer { text-align: center; padding: 30px; color: #aaa; font-size: 0.85em; }
  </style>
</head>
<body>
<header>
  <h1>🧪 Rapport QA Automatisé</h1>
  <p>Site testé : SauceDemo — Généré le ${new Date().toLocaleString('fr-FR')}</p>
</header>
<div class="stats">
  <div class="stat-card total"><div class="number">${passed.length + failed.length}</div><div class="label">Total tests</div></div>
  <div class="stat-card success"><div class="number">${passed.length}</div><div class="label">✅ Passés</div></div>
  <div class="stat-card failure"><div class="number">${failed.length}</div><div class="label">❌ Échoués</div></div>
</div>
${failed.length > 0 ? `
<div class="section">
  <h2>🐛 Bugs détectés</h2>
  ${failed.map(t => `
  <div class="bug-card">
    <h3>${t.title}</h3>
    <div class="bug-file">📁 ${t.file || 'fichier inconnu'}</div>
    <div class="bug-error">${t.tests?.[0]?.results?.[0]?.errors?.[0]?.message?.replace(/</g, '&lt;') || 'Erreur non spécifiée'}</div>
  </div>`).join('')}
</div>` : ''}
<div class="section">
  <h2>✅ Tests réussis</h2>
  ${passed.map(t => `
  <div class="test-item pass">
    <span>✅</span>
    <div><div class="test-name">${t.title}</div><div class="test-file">📁 ${t.file || ''}</div></div>
    <span class="test-duration">${t.tests?.[0]?.results?.[0]?.duration || 0}ms</span>
  </div>`).join('')}
</div>
<div class="section">
  <h2>❌ Tests échoués</h2>
  ${failed.map(t => `
  <div class="test-item fail">
    <span>❌</span>
    <div><div class="test-name">${t.title}</div><div class="test-file">📁 ${t.file || ''}</div></div>
  </div>`).join('')}
</div>
<footer>Rapport généré automatiquement par l'outil QA de Zeineb Ajroudi</footer>
</body>
</html>`;

fs.writeFileSync('reports/rapport-qa.html', html);
console.log('✅ Rapport généré : reports/rapport-qa.html');