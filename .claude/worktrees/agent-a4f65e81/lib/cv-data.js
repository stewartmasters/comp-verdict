import fs from 'fs'
import path from 'path'
import { createContext, runInContext } from 'vm'

function loadCVData() {
  const src = fs.readFileSync(path.join(process.cwd(), 'data.js'), 'utf8')
  const sandbox = { window: {} }
  createContext(sandbox)
  runInContext(src, sandbox)
  return sandbox.window.CV_DATA
}

export const CV_DATA = loadCVData()
