import { readFileSync } from 'fs'
import { NightwatchxEnvironements } from '../src/types/nightwatch.custom'

let customEnvs = {}
try {
  customEnvs = JSON.parse(readFileSync(`${process.env.INIT_CWD}/config/environments.json`, 'utf8'))
} catch (e) {
  throw new Error('Please add environments in your config')
}
const envs: NightwatchxEnvironements = customEnvs

export default envs
