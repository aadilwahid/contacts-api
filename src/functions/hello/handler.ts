import type { ValidatedEventAPIGatewayProxyEvent } from "@libs/api-gateway";
import { formatJSONResponse } from "@libs/api-gateway";
import { middyfy } from "@libs/lambda";

import { StatusCodes } from "src/constants/statusCodes";
import schema from "./schema";

const hello: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (
  event
) => {
  return formatJSONResponse(
    {
      message: `Hello, welcome to the exciting Serverless world!`,
      event,
    },
    StatusCodes.OK
  );
};

export const main = middyfy(hello);
