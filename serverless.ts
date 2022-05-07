import type { AWS } from "@serverless/typescript";

import dynamoDbTables from "./resources/dynamodb/dynamodb-tables";
import functions from "@functions/index";

const serverlessConfiguration: AWS = {
  service: "contacts-service",
  frameworkVersion: "3",
  plugins: ["serverless-esbuild"],
  provider: {
    name: "aws",
    stage: "dev",
    region: "us-west-1",
    runtime: "nodejs14.x",
    profile: "dev-profile",
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: "1",
      REGION: "${self:provider.region}",
      STAGE: "${self:provider.stage}",
      CONTACTS_TABLE: "contacts-table-${opt:stage, self:provider.stage}",
      CONTACTS_TABLE_INDEX: "query_contact_by_name",
    },
    iamRoleStatements: [
      {
        Effect: "Allow",
        Action: [
          "dynamodb:DescribeTable",
          "dynamodb:Query",
          "dynamodb:Scan",
          "dynamodb:GetItem",
          "dynamodb:PutItem",
          "dynamodb:UpdateItem",
          "dynamodb:DeleteItem",
        ],
        Resource: "*",
      },
    ],
  },
  // import the function via paths
  // functions: { hello, createContact },
  functions,
  resources: {
    Resources: {
      ...dynamoDbTables,
    },
  },
  package: { individually: true },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ["aws-sdk"],
      target: "node14",
      define: { "require.resolve": undefined },
      platform: "node",
      concurrency: 10,
    },
  },
};

module.exports = serverlessConfiguration;
