import * as cdk from 'aws-cdk-lib';
import { Bucket, HttpMethods } from 'aws-cdk-lib/aws-s3';
import { Construct } from 'constructs';
import { Function, Runtime, Code } from 'aws-cdk-lib/aws-lambda';
import { Integration, LambdaIntegration, RestApi } from 'aws-cdk-lib/aws-apigateway';
import { CorsHttpMethod, HttpApi, HttpMethod, HttpStage } from 'aws-cdk-lib/aws-apigatewayv2';
import { HttpLambdaIntegration  } from 'aws-cdk-lib/aws-apigatewayv2-integrations';
import { AttributeType, Table } from 'aws-cdk-lib/aws-dynamodb';
import { PolicyStatement } from 'aws-cdk-lib/aws-iam';

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
      runtime: Runtime.NODEJS_14_X, // Dependeny issues
      code: Code.fromAsset("/Users/balakondaveeti/Desktop/AWS Project/lambda"),
      handler: "handler.main"
    });

    const lambdaGateway = new HttpApi(this, "Http API", {
      apiName: "Lambda API",
      description: "Invokes Lambda from React App",
      corsPreflight: {
        allowOrigins: ['*'], // Allow all origins
        allowMethods: [CorsHttpMethod.ANY],
        allowHeaders: ['*'], // Allow all headers
      },
    });

    const lambdaAPIIntegration = new HttpLambdaIntegration('Lambda Integration', lambda);
    lambdaGateway.addRoutes({
      path: '/invoke',
      integration: lambdaAPIIntegration,
      methods:[HttpMethod.ANY]
    }
    );

    new HttpStage(this, "Stage-prod", {
      httpApi: lambdaGateway,
      stageName: 'prod',
      autoDeploy: true
    });

    new HttpStage(this, "Stage-dev", {
      httpApi: lambdaGateway,
      stageName: 'dev',
      autoDeploy: true
    });

    const table = new Table(this, "The Table", {
      partitionKey: {name: 'id', type: AttributeType.STRING},
      tableName: 'SaveUserDataInvokeEC2'
    });

    lambda.addToRolePolicy(new PolicyStatement({
      actions: ['dynamodb:*'],
      resources: [table.tableArn]
    }));
  }
}
