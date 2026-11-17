import dotenv from 'dotenv'

const env = process.env.TEST_ENV

const config = {
  apiUrl: process.env.BASE_URL,
  userEmail: process.env.TEST_USER_EMAIL,
  userPassword: process.env.TEST_USER_PASSWORD
}

if (env === 'qa') {
  config.apiUrl = requireEnv('BASE_URL_QA')
  config.userEmail= process.env.TEST_USER_EMAIL_QA,
  config.userPassword = process.env.TEST_USER_PASSWORD_QA

}

function requireEnv(name: string): string {
  const value = process.env[name]
  if (!value) throw new Error(`Missing required env var: ${name}`)
  return value
}


export { config }