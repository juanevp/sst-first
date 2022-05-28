import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import handler from "./util/handler";
import dynamoDb from "./util/dynamodb";

const tableName = process.env.TABLE_NAME!;

export const main = handler(async (event) => {
  const params: AWS.DynamoDB.DocumentClient.QueryInput = {
    TableName: tableName,
    // 'KeyConditionExpression' defines the condition for the query
    // - 'userId = :userId': only return items with matching 'userId'
    //   partition key
    KeyConditionExpression: "userId = :userId",
    // 'ExpressionAttributeValues' defines the value in the condition
    // - ':userId': defines 'userId' to be the id of the author
    ExpressionAttributeValues: {
      ":userId": event.requestContext.authorizer.iam.cognitoIdentity.identityId,
    },
  };

  const result = await dynamoDb.query(params);

  // Return the matching list of items in response body
  return result.Items;
});
