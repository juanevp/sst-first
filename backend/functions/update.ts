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
    const params: AWS.DynamoDB.DocumentClient.UpdateItemInput = {
        TableName: tableName,
        // 'Key' defines the partition key and sort key of the item to be updated
        Key: {
            userId: event.requestContext.authorizer.iam.cognitoIdentity.identityId, // The id of the author
            noteId: pathParams.id, // The id of the note from the path
        },
        // 'UpdateExpression' defines the attributes to be updated
        // 'ExpressionAttributeValues' defines the value in the update expression
        UpdateExpression: "SET content = :content, attachment = :attachment",
        ExpressionAttributeValues: {
            ":attachment": data.attachment ?? null,
            ":content": data.content ?? null,
        },
        // 'ReturnValues' specifies if and how to return the item's attributes,
        // where ALL_NEW returns all attributes of the item after the update; you
        // can inspect 'result' below to see how it works with different settings
        ReturnValues: "ALL_NEW",
    };

    await dynamoDb.update(params);

    return {status: true};
});
