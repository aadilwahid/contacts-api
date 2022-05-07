import { formatJSONResponse } from "@libs/api-gateway";
import { middyfy } from "@libs/lambda";

import * as log from "@libs/logger";
import { StatusCodes } from "src/constants/statusCodes";
import { ResponseMessage } from "src/constants/responseMessages";
import { IContact } from "src/models/contact";
import * as dbService from "src/services/contactDatabaseService";

const deleteContact = async (event) => {
  try {
    /*** Get the id of the contact that needs to be deleted. ***/
    const id = event.pathParameters?.id || "";
    if (!id) {
      /*** return if no id is provided. ***/
      return formatJSONResponse(
        {
          message: ResponseMessage.INVALID_REQUEST,
        },
        StatusCodes.BAD_REQUEST
      );
    }

    /*** Check whether if the contact exists or not. ***/
    const contact: IContact = await dbService.get(id);
    if (!contact) {
      /*** Return to tell them contact not found. ***/
      return formatJSONResponse(
        {
          message: ResponseMessage.CONTACT_NOT_FOUND,
          contact: null,
        },
        StatusCodes.NOT_FOUND
      );
    }

    /*** Delete the contact. ***/
    await dbService.deleteContact(id);

    return formatJSONResponse(
      {
        message: ResponseMessage.SUCCESS,
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

export const main = middyfy(deleteContact);
