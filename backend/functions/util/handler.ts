import { APIGatewayEventRequestContextV2WithAuthorizer, APIGatewayProxyEventV2WithRequestContext, APIGatewayProxyResultV2, Context, Handler } from "aws-lambda";

import * as debug from "./debug";

export type APIGatewayProxyEventV2 = APIGatewayProxyEventV2WithRequestContext<APIGatewayEventRequestContextV2WithAuthorizer<any>>;
export type APIGatewayProxyHandlerV2<T = never> = Handler<APIGatewayProxyEventV2, APIGatewayProxyResultV2<T>>;

export default function handler(lambda: (event: APIGatewayProxyEventV2, context: Context) => any) {
  const fn: APIGatewayProxyHandlerV2 = async (event, context) => {
    let body, statusCode;

    debug.init(event);
    try {
      // Run the Lambda
      body = await lambda(event, context);
      statusCode = 200;
    } catch (e: any) {
      // Print debug messages
      debug.flush(e);
      
      body = { error: e.message };
      statusCode = 500;
    }

    // Return HTTP response
    return {
      statusCode,
      body: JSON.stringify(body),
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
    };
  };
  return fn;
};
