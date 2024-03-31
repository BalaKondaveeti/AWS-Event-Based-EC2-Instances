import * as cdk from 'aws-cdk-lib';
import { Bucket, HttpMethods } from 'aws-cdk-lib/aws-s3';
import { Construct } from 'constructs';
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class CdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const s3Bucket = new Bucket(this, 'The Main Bucket',{
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      bucketName: 'filesaver-lamba-learn',
      // To avoid cors error at React
      cors: [
        {
          allowedMethods: [HttpMethods.GET, HttpMethods.PUT, HttpMethods.POST, HttpMethods.DELETE],
          allowedOrigins: ['*'],
          allowedHeaders: ['*'],
        },
      ],
    });

  }
}
