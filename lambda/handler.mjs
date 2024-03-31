import AWS from '/var/runtime/node_modules/aws-sdk/lib/aws.js';
const { DynamoDB } = AWS;

const dynamoDB = new DynamoDB.DocumentClient();

export const main = async (event) => {
  const params = {
    TableName: 'SaveUserDataInvokeEC2', // The name of your DynamoDB table
    Item: {
      'id': Date.now().toString(), // Ensure this is unique; you might use a UUID or similar
      'userText': event.queryStringParameters.text,
      'inputFileBucket': event.queryStringParameters.bucket,
      'inputFileKey': event.queryStringParameters.s3key
    }
  };

  await dynamoDB.put(params).promise();
  return 'Successfully added item to DynamoDB';
};