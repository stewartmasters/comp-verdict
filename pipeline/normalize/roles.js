'use strict';

/**
 * Role normalisation: occupation codes → CompVerdict role names
 *
 * Each source uses different occupation classification systems.
 * This module provides unified lookup functions.
 *
 * Classification systems:
 *   SOC 2018 (US)    — BLS OEWS
 *   SOC 2010 (UK)    — ONS ASHE
 *   CNO-11 (Spain)   — INE
 *   ISCO-08 (intl)   — general fallback
 *   SO DevType text  — Stack Overflow survey
 */

// ── US SOC 2018 → CompVerdict roles ──────────────────────────────────────────
const SOC_ROLES = {
  '151252': ['Software Engineer', 'Backend Engineer'],
  '151254': ['Frontend Engineer'],
  '151255': ['Frontend Engineer', 'UX Designer'],
  '152051': ['Data Scientist', 'Machine Learning Engineer'],
  '151244': ['DevOps Engineer', 'Site Reliability Engineer'],
  '151299': ['Platform Engineer', 'DevOps Engineer'],
  '113021': ['Engineering Manager'],
  '151212': ['Security Engineer'],
  '151253': ['QA Engineer'],
  '152031': ['Data Scientist'],
  '151251': ['Full Stack Engineer', 'Software Engineer'],
  '151243': ['Data Engineer'],
  '151141': ['Product Manager'],
};

// ── UK SOC 2010 → CompVerdict roles ──────────────────────────────────────────
const ONS_SOC_ROLES = {
  '2135': ['Software Engineer', 'Backend Engineer'],
  '2136': ['Backend Engineer', 'Full Stack Engineer', 'Software Engineer'],
  '2137': ['Frontend Engineer', 'DevOps Engineer'],
  '2139': ['Machine Learning Engineer', 'Data Scientist', 'Platform Engineer'],
  '2150': ['Data Scientist'],
  '2151': ['IT managers'],  // not a CV role — exclude
  '1136': ['Engineering Manager'],
  '2166': ['UX Designer', 'Product Designer'],
  '3131': ['DevOps Engineer', 'QA Engineer'],
  '3132': ['Software Engineer'], // entry-level IT
};

// ── Spain CNO-11 → CompVerdict roles ─────────────────────────────────────────
const CNO_ROLES = {
  '21':   ['Software Engineer', 'Backend Engineer'],
  '214':  ['Software Engineer', 'Backend Engineer', 'DevOps Engineer'],
  '2141': ['Data Engineer', 'Backend Engineer'],
  '2152': ['DevOps Engineer', 'Site Reliability Engineer'],
  '2153': ['Data Engineer'],
  '215':  ['Data Scientist', 'Machine Learning Engineer'],
  '216':  ['UX Designer', 'Product Designer'],
  '12':   ['Engineering Manager'],
};

// ── ISCO-08 → CompVerdict roles (international fallback) ─────────────────────
const ISCO_ROLES = {
  '2512': ['Software Engineer', 'Backend Engineer'],
  '2513': ['Frontend Engineer'],
  '2514': ['Mobile Engineer'],
  '2519': ['Full Stack Engineer', 'DevOps Engineer'],
  '2521': ['Data Engineer'],
  '2522': ['DevOps Engineer', 'Site Reliability Engineer'],
  '2523': ['DevOps Engineer'],
  '2529': ['Platform Engineer'],
  '1330': ['Engineering Manager'],
  '2511': ['Software Engineer'],
};

// ── SO DevType text → CompVerdict roles ──────────────────────────────────────
const SO_DEVTYPE_ROLES = {
  'Developer, back-end':              ['Backend Engineer', 'Software Engineer'],
  'Developer, front-end':             ['Frontend Engineer'],
  'Developer, full-stack':            ['Full Stack Engineer', 'Software Engineer'],
  'Data scientist or machine learning specialist': ['Data Scientist', 'Machine Learning Engineer'],
  'DevOps specialist':                ['DevOps Engineer', 'Site Reliability Engineer'],
  'Engineer, site reliability':       ['Site Reliability Engineer', 'DevOps Engineer'],
  'Engineer, data':                   ['Data Engineer'],
  'Product manager':                  ['Product Manager'],
  'Engineer, platform':               ['Platform Engineer'],
  'Designer':                         ['UX Designer'],
  'Engineering manager':              ['Engineering Manager'],
  'Security professional':            ['Security Engineer'],
  'Developer, mobile':                ['Mobile Engineer'],
};

// ── Unified lookup ────────────────────────────────────────────────────────────
function getRolesForOccupation(source, occupationCode) {
  switch (source) {
    case 'bls':
      return SOC_ROLES[occupationCode?.replace('-', '')] ?? [];
    case 'ons':
      return ONS_SOC_ROLES[occupationCode] ?? [];
    case 'ine':
      return CNO_ROLES[occupationCode] ?? [];
    case 'stackoverflow': {
      // SO occupation_code is a mangled DevType string — match against keys
      const cleaned = (occupationCode ?? '').replace(/_/g, ' ').toLowerCase();
      for (const [k, v] of Object.entries(SO_DEVTYPE_ROLES)) {
        if (k.toLowerCase() === cleaned) return v;
      }
      return [];
    }
    default:
      return ISCO_ROLES[occupationCode] ?? [];
  }
}

// All CompVerdict role names (matches data.js)
const ALL_CV_ROLES = [
  'Software Engineer',
  'Backend Engineer',
  'Full Stack Engineer',
  'Frontend Engineer',
  'Mobile Engineer',
  'iOS Engineer',
  'Android Engineer',
  'Data Scientist',
  'Data Engineer',
  'Machine Learning Engineer',
  'DevOps Engineer',
  'Site Reliability Engineer',
  'Platform Engineer',
  'Security Engineer',
  'QA Engineer',
  'Product Manager',
  'Engineering Manager',
  'UX Designer',
  'UI Designer',
  'Product Designer',
  'Marketing Manager',
  'Growth Manager',
  'Finance Analyst',
  'Operations Manager',
];

module.exports = {
  SOC_ROLES,
  ONS_SOC_ROLES,
  CNO_ROLES,
  ISCO_ROLES,
  SO_DEVTYPE_ROLES,
  getRolesForOccupation,
  ALL_CV_ROLES,
};
