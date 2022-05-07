import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";

import * as ddb from "@libs/aws/ddb";
import {
  IContact,
  IUpdateContact,
  IContactListResponse,
  IPaginationQuery,
} from "src/models/contact";

/**
 * Function that get all the contacts by slug
 * @slug   {String}    name of a contact in lowercase
 */
export const getContactBySlug = async (slug: string): Promise<IContact[]> => {
  const params = {
    TableName: process.env.CONTACTS_TABLE || "",
    IndexName: process.env.CONTACTS_TABLE_INDEX,
    KeyConditionExpression: "#status = :status and #slug = :slug",
    // FilterExpression: '#status = :status', # if you are using scan
    ExpressionAttributeNames: {
      "#status": "status",
      "#slug": "slug",
    },
    ExpressionAttributeValues: marshall({
      ":status": "ok",
      ":slug": slug,
    }),
    ScanIndexForward: true,
  };

  const res = await ddb.query(params);

  return (
    res.Items ? res.Items.map((item) => unmarshall(item)) : []
  ) as IContact[];
};

export const create = async (payload: IContact): Promise<void> => {
  await ddb.put({
    TableName: process.env.CONTACTS_TABLE || "",
    Item: marshall(payload),
  });
};

export const get = async (id: string): Promise<IContact | null> => {
  const res = await ddb.get({
    TableName: process.env.CONTACTS_TABLE || "",
    Key: marshall({ id }),
    ExpressionAttributeNames: {
      "#ID": "id",
      "#Name": "name",
      "#cellNumber": "cellNumber",
      "#city": "city",
      "#state": "state",
      "#zipCode": "zipCode",
      "#createdAt": "createdAt",
      "#updatedAt": "updatedAt",
    },
    ProjectionExpression:
      "#ID, #Name, #cellNumber, #city, #state, #zipCode, #createdAt, #updatedAt",
  });

  const contact = res.Item ? (unmarshall(res.Item) as IContact) : null;

  return contact;
};

export const list = async (
  query: IPaginationQuery
): Promise<IContactListResponse> => {
  // using GSI to get paginated results from DB in sorted order.
  const params = {
    TableName: process.env.CONTACTS_TABLE || "",
    IndexName: process.env.CONTACTS_TABLE_INDEX || "",
    KeyConditionExpression: "#status = :status",
    ExpressionAttributeNames: {
      "#status": "status",
    },
    ExpressionAttributeValues: marshall({
      ":status": "ok",
    }),
    ScanIndexForward: true,
    Limit: query.size,
    ExclusiveStartKey: query.nextPageToken
      ? JSON.parse(
          Buffer.from(query.nextPageToken as string, "base64").toString("utf-8")
        )
      : undefined,
  };

  const res = await ddb.query(params);

  const data: IContactListResponse = {
    contacts: res.Items ? res.Items.map((item) => unmarshall(item)) : [],
    nextPageToken: res.LastEvaluatedKey
      ? Buffer.from(JSON.stringify(res.LastEvaluatedKey)).toString("base64")
      : null,
    itemsReturned: res.Count ? res.Count : 0,
  };

  return data;
};

export const deleteContact = async (id: string): Promise<void> => {
  await ddb.deleteItem({
    TableName: process.env.CONTACTS_TABLE || "",
    Key: marshall({ id }),
  });
};

export const update = async (
  id: string,
  data: IUpdateContact
): Promise<void> => {
  const params = {
    TableName: process.env.CONTACTS_TABLE || "",
    Key: marshall({ id }),
    UpdateExpression:
      "SET #name = :name, #slug = :slug, #cellNumber = :cellNumber, #city = :city, #state = :state, #zipCode = :zipCode, #updatedAt = :updatedAt",
    ExpressionAttributeValues: marshall({
      ":name": data.name,
      ":slug": data.slug,
      ":cellNumber": data.cellNumber,
      ":city": data.city,
      ":state": data.state,
      ":zipCode": data.zipCode,
      ":updatedAt": data.updatedAt,
    }),
    ExpressionAttributeNames: {
      "#name": "name",
      "#slug": "slug",
      "#cellNumber": "cellNumber",
      "#city": "city",
      "#state": "state",
      "#zipCode": "zipCode",
      "#updatedAt": "updatedAt",
    },
    ReturnValues: "NONE",
    ReturnConsumedCapacity: "TOTAL",
  };

  await ddb.update(params);
};
