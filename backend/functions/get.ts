import {APIGatewayProxyHandlerV2} from "aws-lambda";
import AWS from "aws-sdk";
import handler from "./util/handler";
import dynamoDb from "./util/dynamodb";

const tableName = process.env.TABLE_NAME!;

export const main = handler(async event => {
    const pathParams = event.pathParameters;
    if (!pathParams || !pathParams.id) {
        throw new Error("Missing parameter id.");
    }
    const params: AWS.DynamoDB.DocumentClient.GetItemInput = {
        TableName: tableName,
        // 'Key' defines the partition key and sort key of the item to be retrieved
        Key: {
            userId: event.requestContext.authorizer.iam.cognitoIdentity.identityId, // The id of the author
            noteId: pathParams.id, // The id of the note from the path
        },
    };

    const result = await dynamoDb.get(params);
    if (!result.Item) {
        throw new Error("Item not found.");
    }

    return result.Item;
});
