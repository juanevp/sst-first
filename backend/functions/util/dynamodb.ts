import AWS from "aws-sdk";
import DynamoDBClient = AWS.DynamoDB.DocumentClient;

const client = new AWS.DynamoDB.DocumentClient();


export default {
  get: (params: DynamoDBClient.GetItemInput) => client.get(params).promise(),
  put: (params: DynamoDBClient.PutItemInput) => client.put(params).promise(),
  query: (params: DynamoDBClient.QueryInput) => client.query(params).promise(),
  update: (params: DynamoDBClient.UpdateItemInput) => client.update(params).promise(),
  delete: (params: DynamoDBClient.DeleteItemInput) => client.delete(params).promise(),
};