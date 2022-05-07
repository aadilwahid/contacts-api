import type { ValidatedEventAPIGatewayProxyEvent } from "@libs/api-gateway";
import { formatJSONResponse } from "@libs/api-gateway";
import { middyfy } from "@libs/lambda";

import schema from "./schema";
import * as log from "@libs/logger";
import { StatusCodes } from "src/constants/statusCodes";
import { ResponseMessage } from "src/constants/responseMessages";
import {
  IContact,
  IUpdateContactPayload,
  IUpdateContact,
} from "src/models/contact";
import * as dbService from "src/services/contactDatabaseService";

const updateContact: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (
  event
) => {
  try {
    /*** Get the id of the contact that needs to be updated. ***/
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

    /*** Get the fields that the user is trying to update. ***/
    const requestBody: IUpdateContactPayload = event.body;

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

    /***
     * Initiliaze a new contact with the values that needed to be updated,
     * and persist those values that don't need to be updated.
     ***/
    const updatedContact: IUpdateContact = {
      name: requestBody.name || contact.name,
      slug:
        requestBody.name.trim().toLowerCase() ||
        contact.name.trim().toLowerCase(),
      cellNumber: requestBody.cellNumber || contact.cellNumber,
      city: requestBody.city || contact.city,
      state: requestBody.state || contact.state,
      zipCode: requestBody.zipCode || contact.zipCode,
      updatedAt: new Date().toISOString(),
    };

    /*** Update the contact ***/
    await dbService.update(id, updatedContact);

    return formatJSONResponse(
      {
        message: ResponseMessage.SUCCESS,
        updatedContact,
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

export const main = middyfy(updateContact);
