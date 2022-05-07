import { formatJSONResponse } from "@libs/api-gateway";
import { middyfy } from "@libs/lambda";

import * as log from "@libs/logger";
import { StatusCodes } from "src/constants/statusCodes";
import { ResponseMessage } from "src/constants/responseMessages";
import { IPaginationQuery, IContactListResponse } from "src/models/contact";
import * as dbService from "src/services/contactDatabaseService";

const listContact = async (event) => {
  try {
    /***
     * Get the number of contacts to be returned in single response,
     * if not supplied then 10 is the assummed by default.
     ***/
    const size = event.queryStringParameters?.size
      ? parseInt(event.queryStringParameters?.size)
      : 10;

    /*** Get the next page token: if the req is subsequently made ***/
    const nextPageToken = event.queryStringParameters?.nextPageToken;

    const query: IPaginationQuery = {
      size,
      nextPageToken,
    };

    /***  Get the contacts from the Dynamo DB. ***/
    const response: IContactListResponse = await dbService.list(query);

    return formatJSONResponse(
      {
        message: ResponseMessage.SUCCESS,
        response,
      },
      StatusCodes.OK
    );
  } catch (err) {
    if (err instanceof Error) log.error(err.message);

    return formatJSONResponse(
      {
        message: ResponseMessage.SERVER_ERROR,
      },
      StatusCodes.ERROR
    );
  }
};

export const main = middyfy(listContact);
