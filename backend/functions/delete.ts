import {APIGatewayProxyHandlerV2} from "aws-lambda";
import handler from "./util/handler";
import dynamoDb from "./util/dynamodb";

const tableName = process.env.TABLE_NAME!;

export const main = handler(async event => {
    const pathParams = event.pathParameters;
    if (!pathParams || !pathParams.id) {
        throw new Error("Missing parameter id.");
    }

    const data = JSON.parse(event.body!);
    const params: AWS.DynamoDB.DocumentClient.DeleteItemInput = {
        TableName: tableName,
        // 'Key' defines the partition key and sort key of the item to be updated
        Key: {
            userId: event.requestContext.authorizer.iam.cognitoIdentity.identityId, // The id of the author
            noteId: pathParams.id, // The id of the note from the path
        },
    };

    await dynamoDb.delete(params);

    return {status: true};
});
