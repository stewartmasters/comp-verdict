-- CompVerdict salary data pipeline schema
-- All monetary values stored in local currency (not normalised to EUR at rest)
-- Currency conversion applied at calibration time

PRAGMA journal_mode = WAL;
PRAGMA foreign_keys = ON;

-- ── Raw observations from external sources ────────────────────────────────────
CREATE TABLE IF NOT EXISTS raw_observations (
  id               INTEGER PRIMARY KEY AUTOINCREMENT,
  source           TEXT NOT NULL,          -- 'bls' | 'ons' | 'ine' | 'stackoverflow' | 'manual'
  source_version   TEXT,                   -- '2024', '2024-May', '2024-survey'
  occupation_code  TEXT,                   -- original code: SOC, ISCO, CNO, etc.
  occupation_label TEXT,                   -- e.g. 'Software Developers'
  geography_code   TEXT,                   -- original CBSA / NUTS / region code
  geography_label  TEXT,                   -- e.g. 'San Francisco-Oakland-Hayward, CA'
  metric           TEXT NOT NULL,          -- 'p25' | 'p50' | 'p75' | 'mean'
  value            REAL NOT NULL,          -- annual gross, original currency
  currency         TEXT NOT NULL,          -- 'USD' | 'GBP' | 'EUR' | 'CHF' | etc.
  sample_n         INTEGER,                -- number of workers in sample (if available)
  period           TEXT,                   -- '2024', '2024-Q1', etc.
  fetched_at       TEXT NOT NULL           -- ISO 8601 UTC
);

CREATE INDEX IF NOT EXISTS idx_raw_source       ON raw_observations(source);
CREATE INDEX IF NOT EXISTS idx_raw_occ_geo      ON raw_observations(occupation_code, geography_code);
CREATE INDEX IF NOT EXISTS idx_raw_period       ON raw_observations(period);

-- ── Calibrated benchmarks (aggregate → experience bands) ─────────────────────
CREATE TABLE IF NOT EXISTS calibrated_benchmarks (
  id              INTEGER PRIMARY KEY AUTOINCREMENT,
  role            TEXT NOT NULL,   -- CompVerdict role name
  city            TEXT NOT NULL,   -- CompVerdict city name
  band            TEXT NOT NULL,   -- 'junior' | 'mid' | 'senior' | 'staff'
  p25             REAL NOT NULL,
  p50             REAL NOT NULL,
  p75             REAL NOT NULL,
  currency        TEXT NOT NULL,   -- local currency symbol key (e.g. 'GBP', 'EUR')
  source_ids      TEXT,            -- JSON array of raw_observation ids used
  source_labels   TEXT,            -- human-readable e.g. 'bls:2024,stackoverflow:2024'
  calibrated_at   TEXT NOT NULL,   -- ISO 8601 UTC
  data_version    TEXT NOT NULL,   -- e.g. '2025-Q1' — used to version data.js exports
  UNIQUE(role, city, band, data_version)
);

CREATE INDEX IF NOT EXISTS idx_cal_role_city ON calibrated_benchmarks(role, city);
CREATE INDEX IF NOT EXISTS idx_cal_version   ON calibrated_benchmarks(data_version);

-- ── Exchange rates snapshot ───────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS exchange_rates (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  base       TEXT NOT NULL,   -- 'EUR'
  quote      TEXT NOT NULL,   -- 'USD', 'GBP', etc.
  rate       REAL NOT NULL,   -- 1 EUR = {rate} quote currency
  source     TEXT NOT NULL,   -- 'ecb'
  fetched_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_fx_quote ON exchange_rates(quote, fetched_at);

-- ── Pipeline run log ──────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS pipeline_runs (
  id              INTEGER PRIMARY KEY AUTOINCREMENT,
  started_at      TEXT NOT NULL,
  completed_at    TEXT,
  sources_run     TEXT,            -- JSON array of source names
  observations_added  INTEGER DEFAULT 0,
  benchmarks_updated  INTEGER DEFAULT 0,
  status          TEXT DEFAULT 'running',  -- 'running' | 'success' | 'partial' | 'error'
  error_message   TEXT
);
