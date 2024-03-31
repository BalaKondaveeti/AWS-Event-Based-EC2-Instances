import * as cdk from 'aws-cdk-lib';
import { Bucket, HttpMethods } from 'aws-cdk-lib/aws-s3';
import { Construct } from 'constructs';
import { Function, Runtime, Code } from 'aws-cdk-lib/aws-lambda';
import { LambdaIntegration, RestApi } from 'aws-cdk-lib/aws-apigateway';

export class CdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const s3Bucket = new Bucket(this, 'The Main Bucket', {
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      bucketName: 'filesaver-lamba-learn',
      cors: [
        {
          allowedMethods: [HttpMethods.GET, HttpMethods.PUT, HttpMethods.POST, HttpMethods.DELETE],
          allowedOrigins: ['*'],
          allowedHeaders: ['*'],
        },
      ],
    });

    const lambda = new Function(this, 'The Lambda Function', {
      runtime: Runtime.NODEJS_18_X,
      code: Code.fromAsset("/Users/balakondaveeti/Desktop/AWS Project/lambda"),
      handler: "handler.main",
      environment: {
        ACCESSKEY: "AKIA47CRVLP3LEY6RGYH",
        SECRETKEY: "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"
      }
    });
    
    const lambdaApi = new RestApi(this, "lambda API", {
      restApiName: "Lambda API",
      description: "Invokes Lambda from React App",
    });

    lambdaApi.root.addResource('invokeLambda').addMethod('POST', new LambdaIntegration(lambda));
  }
}
