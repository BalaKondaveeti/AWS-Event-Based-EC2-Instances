import * as cdk from 'aws-cdk-lib';
import { Bucket, HttpMethods } from 'aws-cdk-lib/aws-s3';
import { Construct } from 'constructs';
import { Function, Runtime, Code, StartingPosition } from 'aws-cdk-lib/aws-lambda';
import { Integration, LambdaIntegration, RestApi } from 'aws-cdk-lib/aws-apigateway';
import { CorsHttpMethod, HttpApi, HttpMethod, HttpStage } from 'aws-cdk-lib/aws-apigatewayv2';
import { HttpLambdaIntegration  } from 'aws-cdk-lib/aws-apigatewayv2-integrations';
import { AttributeType, StreamViewType, Table } from 'aws-cdk-lib/aws-dynamodb';
import { ManagedPolicy, PolicyStatement, Role, ServicePrincipal } from 'aws-cdk-lib/aws-iam';
import { DynamoEventSource, SqsDlq } from 'aws-cdk-lib/aws-lambda-event-sources';

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
      tableName: 'SaveUserDataInvokeEC2',
      stream: StreamViewType.NEW_IMAGE
    });

    lambda.addToRolePolicy(new PolicyStatement({
      actions: ['dynamodb:*'],
      resources: [table.tableArn]
    }));


    const streamLambda = new Function(this, 'The Stream Lambda Function', {
      runtime: Runtime.PYTHON_3_10, 
      code: Code.fromAsset("/Users/balakondaveeti/Desktop/AWS Project/StreamLambda"),
      handler: "handler.main"
    });

    streamLambda.addEnvironment('TABLENAME', table.tableName);

    streamLambda.addEventSource(new DynamoEventSource(
      table, {
        startingPosition: StartingPosition.LATEST,
      batchSize: 5,
      bisectBatchOnError: true,
      retryAttempts: 2
    }));

    streamLambda.addToRolePolicy(new PolicyStatement({
      actions: ['dynamodb:*'],
      resources: [table.tableArn]
    }));

    streamLambda.addToRolePolicy(new PolicyStatement(
      {
        actions: ['ec2:*'],
        resources: ['*']
      }
    ));

    const ec2Role = new Role(this, 'EC2Role', {
      assumedBy: new ServicePrincipal('ec2.amazonaws.com'),
    });

    ec2Role.addManagedPolicy(ManagedPolicy.fromAwsManagedPolicyName('AmazonS3FullAccess'));
  }
}
