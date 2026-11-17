import { APILogger } from "../utils/logger";
import { RequestHandler } from "../utils/request-handler";
import { config } from '../api-test.config'
import { request } from "@playwright/test";

export async function createToken(email: string | undefined, password: string | undefined) {

  const logger = new APILogger()
  const context = await request.newContext()
  const api = new RequestHandler(context, config.apiUrl, logger)

  try {
    const tokenResponse = await api
      .path('/users/login')
      .body({
        "user": { "email": email, "password": password }
      })
      .postRequest(200)

    // console.log(tokenResponse);
    return `Token ${tokenResponse.user.token}`;  

  } catch(error) {
    if (error instanceof Error) {
      Error.captureStackTrace(error, createToken)
    }
    throw error
  } finally {
    await context.dispose()
  }
}