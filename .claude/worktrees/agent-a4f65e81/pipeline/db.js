'use strict';

const Database = require('better-sqlite3');
const fs       = require('fs');
const path     = require('path');

const DB_PATH     = path.join(__dirname, 'data', 'pipeline.db');
const SCHEMA_PATH = path.join(__dirname, 'schema.sql');

let _db = null;

function getDb() {
  if (_db) return _db;

  fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
  _db = new Database(DB_PATH);
  _db.pragma('journal_mode = WAL');
  _db.pragma('foreign_keys = ON');

  const schema = fs.readFileSync(SCHEMA_PATH, 'utf8');
  _db.exec(schema);

  return _db;
}

// ── Exchange rates ────────────────────────────────────────────────────────────
function saveExchangeRates(rates, fetchedAt) {
  const db = getDb();
  const insert = db.prepare(`
    INSERT INTO exchange_rates (base, quote, rate, source, fetched_at)
    VALUES (@base, @quote, @rate, @source, @fetched_at)
  `);
  const insertMany = db.transaction(items => items.forEach(r => insert.run(r)));
  insertMany(rates.map(r => ({ ...r, fetched_at: fetchedAt })));
}

function getLatestRates() {
  const db = getDb();
  return db.prepare(`
    SELECT quote, rate FROM exchange_rates
    WHERE rowid IN (
      SELECT MAX(rowid) FROM exchange_rates GROUP BY quote
    )
  `).all().reduce((acc, r) => { acc[r.quote] = r.rate; return acc; }, {});
}

// ── Raw observations ──────────────────────────────────────────────────────────
function saveObservations(rows) {
  const db = getDb();
  const insert = db.prepare(`
    INSERT INTO raw_observations
      (source, source_version, occupation_code, occupation_label,
       geography_code, geography_label, metric, value, currency,
       sample_n, period, fetched_at)
    VALUES
      (@source, @source_version, @occupation_code, @occupation_label,
       @geography_code, @geography_label, @metric, @value, @currency,
       @sample_n, @period, @fetched_at)
  `);
  const insertMany = db.transaction(items => {
    let count = 0;
    for (const row of items) {
      insert.run({
        source:           row.source,
        source_version:   row.source_version   ?? null,
        occupation_code:  row.occupation_code  ?? null,
        occupation_label: row.occupation_label ?? null,
        geography_code:   row.geography_code   ?? null,
        geography_label:  row.geography_label  ?? null,
        metric:           row.metric,
        value:            row.value,
        currency:         row.currency,
        sample_n:         row.sample_n         ?? null,
        period:           row.period           ?? null,
        fetched_at:       row.fetched_at,
      });
      count++;
    }
    return count;
  });
  return insertMany(rows);
}

function getObservations({ source, period, occupationCode, geographyCode } = {}) {
  const db = getDb();
  const conditions = ['1=1'];
  const params = {};
  if (source)         { conditions.push('source = @source');                  params.source = source; }
  if (period)         { conditions.push('period = @period');                  params.period = period; }
  if (occupationCode) { conditions.push('occupation_code = @occupation_code'); params.occupation_code = occupationCode; }
  if (geographyCode)  { conditions.push('geography_code = @geography_code');  params.geography_code = geographyCode; }

  return db.prepare(`
    SELECT * FROM raw_observations WHERE ${conditions.join(' AND ')}
    ORDER BY fetched_at DESC
  `).all(params);
}

// ── Calibrated benchmarks ─────────────────────────────────────────────────────
function saveBenchmarks(rows, dataVersion) {
  const db = getDb();
  const upsert = db.prepare(`
    INSERT INTO calibrated_benchmarks
      (role, city, band, p25, p50, p75, currency, source_ids, source_labels, calibrated_at, data_version)
    VALUES
      (@role, @city, @band, @p25, @p50, @p75, @currency, @source_ids, @source_labels, @calibrated_at, @data_version)
    ON CONFLICT(role, city, band, data_version) DO UPDATE SET
      p25           = excluded.p25,
      p50           = excluded.p50,
      p75           = excluded.p75,
      source_ids    = excluded.source_ids,
      source_labels = excluded.source_labels,
      calibrated_at = excluded.calibrated_at
  `);
  const now = new Date().toISOString();
  const upsertAll = db.transaction(items => {
    let count = 0;
    for (const row of items) {
      upsert.run({
        role:          row.role,
        city:          row.city,
        band:          row.band,
        p25:           row.p25,
        p50:           row.p50,
        p75:           row.p75,
        currency:      row.currency,
        source_ids:    JSON.stringify(row.source_ids ?? []),
        source_labels: row.source_labels ?? null,
        calibrated_at: now,
        data_version:  dataVersion,
      });
      count++;
    }
    return count;
  });
  return upsertAll(rows);
}

function getBenchmarks(dataVersion) {
  const db = getDb();
  return db.prepare(`
    SELECT * FROM calibrated_benchmarks
    WHERE data_version = ?
    ORDER BY role, city, band
  `).all(dataVersion);
}

// ── Pipeline runs ─────────────────────────────────────────────────────────────
function startRun(sources) {
  const db = getDb();
  const result = db.prepare(`
    INSERT INTO pipeline_runs (started_at, sources_run, status)
    VALUES (?, ?, 'running')
  `).run(new Date().toISOString(), JSON.stringify(sources));
  return result.lastInsertRowid;
}

function completeRun(runId, { observationsAdded, benchmarksUpdated, error } = {}) {
  const db = getDb();
  db.prepare(`
    UPDATE pipeline_runs SET
      completed_at        = ?,
      observations_added  = ?,
      benchmarks_updated  = ?,
      status              = ?,
      error_message       = ?
    WHERE id = ?
  `).run(
    new Date().toISOString(),
    observationsAdded  ?? 0,
    benchmarksUpdated  ?? 0,
    error ? 'error' : 'success',
    error ?? null,
    runId
  );
}

function getLastRunTime(source) {
  const db = getDb();
  const row = db.prepare(`
    SELECT MAX(fetched_at) AS last_fetched
    FROM raw_observations WHERE source = ?
  `).get(source);
  return row?.last_fetched ?? null;
}

module.exports = {
  getDb,
  saveExchangeRates, getLatestRates,
  saveObservations,  getObservations,
  saveBenchmarks,    getBenchmarks,
  startRun,          completeRun,
  getLastRunTime,
};
