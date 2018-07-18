import uuid from "uuid";
import AWS from "aws-sdk";
import * as dynamoDbLib from "./libs/dynamodb-lib";
import {success, failure} from "./libs/response-lib";


AWS.config.update({region: "us-east-1"});
const dynamoDb = new AWS.DynamoDB.DocumentClient();

export async function main(event, context, callback){
const data = JSON.parse(event.body);

const params = {
    TableName: "notes",
// 'Item' contains the attributes of the item to be created
    // - 'userId': user identities are federated through the
    //             Cognito Identity Pool, we will use the identity id
    //             as the user id of the authenticated user
    // - 'noteId': a unique uuid
    // - 'content': parsed from request body
    // - 'attachment': parsed from request body
    // - 'createdAt': current Unix timesta
    Item:{
        userId: event.requestContext.identity.cognitoIdentityId,
        noteId: uuid.v1(),
        content: data.content,
        attachment: data.attachment,
        createdAt: Date.now()
    }
};

  try{
      await dynamoDbLib.call("put", params);
      callback(null, success(params.Item));
  }catch (e){
      callback(null, failure({staus: false}));
  }

}
