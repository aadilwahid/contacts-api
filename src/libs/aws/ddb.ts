// istanbul ignore file, pure AWS interaction, not much to test here
import {
  DynamoDBClient,
  QueryCommand,
  QueryCommandInput,
  ScanCommand,
  ScanCommandInput,
  GetItemCommand,
  GetItemCommandInput,
  PutItemCommand,
  PutItemCommandInput,
  UpdateItemCommand,
  UpdateItemCommandInput,
  BatchWriteItemCommand,
  BatchWriteItemCommandInput,
  DeleteItemCommandInput,
  DeleteItemCommand,
} from "@aws-sdk/client-dynamodb";

const client = new DynamoDBClient({ region: process.env.REGION });

export interface IUpdateAction {
  Action: "PUT" | "DELETE" | "ADD";
  Value: any;
}

export const scan = (params: ScanCommandInput) => {
  const command = new ScanCommand(params);
  return client.send(command);
};

export const get = (params: GetItemCommandInput) => {
  const command = new GetItemCommand(params);
  return client.send(command);
};

export const put = (params: PutItemCommandInput) => {
  const command = new PutItemCommand(params);
  return client.send(command);
};

export const update = (params: UpdateItemCommandInput) => {
  const command = new UpdateItemCommand(params);
  return client.send(command);
};

export const quickUpdate = (table: string, key: any, options: any) => {
  const params: UpdateItemCommandInput = {
    TableName: table,
    Key: key,
    AttributeUpdates: options,
    ReturnValues: "NONE",
    ReturnConsumedCapacity: "TOTAL",
  };
  const command = new UpdateItemCommand(params);
  return client.send(command);
};

export const query = (params: QueryCommandInput) => {
  const command = new QueryCommand(params);
  return client.send(command);
};

export const batchRequest = (params: BatchWriteItemCommandInput) => {
  const command = new BatchWriteItemCommand(params);
  return client.send(command);
};

export const deleteItem = (params: DeleteItemCommandInput) => {
  const command = new DeleteItemCommand(params);
  return client.send(command);
};

const getMappings = (
  fields: string[],
  mappings: Record<string, string>
): Record<string, string> => {
  const validFields = fields.filter((key: string) => !!mappings[key]);

  if (validFields.length <= 0) {
    return {};
  }

  const data: Record<string, string> = {};

  validFields.forEach((key: string) => {
    data[mappings[key]] = key;
  });

  return data;
};

export const getFilteredListParams = (
  params: any,
  fields: string[],
  mappings: Record<string, string>
) => {
  const newParams = params;

  if (fields.length > 0) {
    const fieldMappings = getMappings(fields, mappings);

    if (fieldMappings) {
      newParams.ExpressionAttributeNames = {
        ...(newParams.ExpressionAttributeNames || {}),
        ...fieldMappings,
      };

      newParams.ProjectionExpression = Object.keys(
        newParams.ExpressionAttributeNames
      ).join(", ");
    }
  }

  return newParams;
};

export const getUpdateParams = (
  params: any,
  mappings: Record<string, string>
) => {
  const newParams = {
    UpdateExpression: "SET ",
    ExpressionAttributeValues: {} as any,
    ExpressionAttributeNames: {} as any,
  };

  const fieldMappings = { ...getMappings(Object.keys(params), mappings) };
  const fieldMappingKeys = Object.keys(fieldMappings);
  for (let i = 0; i < fieldMappingKeys.length; i++) {
    const name = fieldMappingKeys[i];
    const attributeName = fieldMappings[name];
    const attributeValueKey = `:${attributeName}`;
    newParams.UpdateExpression +=
      `${name}=${attributeValueKey}` +
      (i + 1 === fieldMappingKeys.length ? "" : ",");
    newParams.ExpressionAttributeValues[attributeValueKey] =
      params[attributeName];
    newParams.ExpressionAttributeNames[name] = attributeName;
  }

  return newParams;
};
