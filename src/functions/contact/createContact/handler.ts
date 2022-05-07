import type { ValidatedEventAPIGatewayProxyEvent } from "@libs/api-gateway";
import { formatJSONResponse } from "@libs/api-gateway";
import { middyfy } from "@libs/lambda";
import { v4 } from "uuid";

import schema from "./schema";
import * as log from "@libs/logger";
import { StatusCodes } from "src/constants/statusCodes";
import { ResponseMessage } from "src/constants/responseMessages";
import { IContact, ICreateContact } from "src/models/contact";
import * as dbService from "src/services/contactDatabaseService";

const createContact: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (
  event
) => {
  try {
    /*** Must contains name & cellNumber to create a new contact. ***/
    const requestBody: ICreateContact = event.body;

    /*** Check if a contact with same name already exists or not. ***/
    const foundContacts: IContact[] = await dbService.getContactBySlug(
      requestBody.name.trim().toLowerCase()
    );
    if (foundContacts.length > 0) {
      /*** Return to tell the user that contact already exists. ***/
      return formatJSONResponse(
        {
          message: ResponseMessage.CONTACT_ALREADY_EXISTS,
        },
        StatusCodes.NO_CONTENT
      );
    }

    /***
     * - Initialize a new contact.
     * - status & slug(simply the name in lowercase) are added to contact schema for GSI(Global Secondary Index),
     * which will help to query a contact by slug, if we don't do this we've to scan the whole DB to check whether
     * the contact with same same already exist or not, (completely for DynamoDB case, coz it's scan is very expensive.
     ***/
    const newContact: IContact = {
      id: v4(),
      status: "ok",
      slug: requestBody.name.trim().toLowerCase(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...requestBody,
    };

    /*** Add a new contact in DB. ***/
    await dbService.create(newContact);

    return formatJSONResponse(
      {
        message: ResponseMessage.CREATE_CONTACT_SUCCESS,
        data: newContact,
      },
      StatusCodes.CREATED
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

export const main = middyfy(createContact);
