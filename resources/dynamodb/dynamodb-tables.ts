/**
 * Dynamo DB table
 */

export default {
  ContactsTable: {
    Type: "AWS::DynamoDB::Table",
    Properties: {
      TableName: "${self:provider.environment.CONTACTS_TABLE}",
      AttributeDefinitions: [
        { AttributeName: "id", AttributeType: "S" },
        { AttributeName: "status", AttributeType: "S" },
        { AttributeName: "slug", AttributeType: "S" },
      ],
      KeySchema: [{ AttributeName: "id", KeyType: "HASH" }],
      BillingMode: "PAY_PER_REQUEST",
      GlobalSecondaryIndexes: [
        {
          IndexName: "${self:provider.environment.CONTACTS_TABLE_INDEX}",
          KeySchema: [
            { AttributeName: "status", KeyType: "HASH" },
            { AttributeName: "slug", KeyType: "RANGE" },
          ],
          Projection: {
            // attributes to project into the index
            ProjectionType: "ALL", // (ALL | KEYS_ONLY | INCLUDE)
          },
        },
      ],
    },
  },
};
