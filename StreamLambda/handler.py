import json
import boto3
import base64

def main(event, context):
    ec2_client = boto3.client('ec2')

    for record in event['Records']:
        # Only process insert events
        if record['eventName'] == 'INSERT':
            new_image = record['dynamodb']['NewImage']
            bucket_name = new_image['inputFileBucket']['S']
            s3_path = new_image['inputFileKey']['S']
            string_to_append = new_image['userText']['S']

            # Construct the user data script
            user_data_script = f"""#!/bin/bash
            yum update -y
            aws s3 cp s3://{bucket_name}/{s3_path} /tmp/file_to_process.txt
            echo "{string_to_append}" >> /tmp/file_to_process.txt
            aws s3 cp /tmp/file_to_process.txt s3://{bucket_name}/Output/{s3_path}
            shutdown -h now
            """
            print(user_data_script)
            # Encode user data script to Base64
            user_data_encoded = base64.b64encode(user_data_script.encode('utf-8')).decode('utf-8')

            # Launch an EC2 instance
            response = ec2_client.run_instances(
                ImageId='ami-0c101f26f147fa7fd',
                InstanceType='t2.micro',
                MinCount=1,
                MaxCount=1,
                UserData=user_data_encoded,
                IamInstanceProfile={
                    'Name': 'EC2RoleWithS3Access'
                },
                InstanceInitiatedShutdownBehavior='terminate'
            )

            print(f"Launched EC2 Instance {response['Instances'][0]['InstanceId']}")

    return 'Successfully processed DynamoDB Stream records.'
