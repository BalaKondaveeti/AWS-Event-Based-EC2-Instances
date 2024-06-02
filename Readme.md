
# File-Management-using-AWS-Event-Based-EC2-Instances

## Overview
File-Management-using-AWS-Event-Based-EC2-Instances is an AWS-based system designed to automate file handling and processing using AWS services. This project demonstrates the capability to handle file uploads, storage, processing, and management using an event-driven architecture with AWS services such as S3, DynamoDB, Lambda, API Gateway, and EC2 Instances.

## Features
- **Responsive Web UI**: Built with ReactJS, includes text and file inputs to upload and process files dynamically.
- **AWS S3 Integration**: Direct file uploads to S3 from the browser, avoiding server-side handling for increased efficiency and security.
- **DynamoDB**: Stores metadata including file paths and processed results, enabling scalable and fast access to data.
- **Serverless Backend**: Utilizes AWS Lambda and API Gateway for backend operations, reducing the operational overhead and cost.
- **EC2 Automation**: Automatically creates EC2 instances to run scripts that process files stored in S3 and updates the results back to S3 and DynamoDB.
- **Full Automation**: From file upload to processing and storage, the entire workflow is automated using AWS event triggers and services.

## Architecture
The system consists of the following components:
- **Frontend**: A ReactJS application with inputs for text and files. It sends files directly to S3 and metadata to DynamoDB through API Gateway and Lambda.
- **Backend**: AWS Lambda functions triggered by API Gateway for processing data entries in DynamoDB and coordinating with EC2 for heavy processing.
- **Storage**: Files are stored in AWS S3 and metadata in DynamoDB, leveraging AWS's scalable and secure infrastructure.
- **Processing**: EC2 instances are dynamically created to process files as per events generated from DynamoDB table changes.

## How It Works
1. **User Interaction**: Users input text and select a file in the web UI.
2. **File Upload**: The file is uploaded directly to S3 from the browser.
3. **Metadata Storage**: File path and input text are stored in DynamoDB using Lambda via API Gateway.
4. **File Processing**: Upon metadata insertion in DynamoDB, an EC2 instance is triggered to process the file:
   - Downloads the script and input file from S3.
   - Processes the file by appending the input text.
   - Uploads the processed file back to S3.
   - Stores the output metadata in DynamoDB.
5. **Cleanup**: The EC2 instance is terminated after processing to optimize resource usage.

## Installation and Usage
### Prerequisites
- AWS Account
- Node.js and npm installed
- AWS CLI configured

### Setup
1. **Clone the repository**:
   ```bash
   https://github.com/BalaKondaveeti/File-Mangement-using-AWS-Event-Based-EC2-Instances.git
   ```
2. **Navigate to the project directory**:
   ```bash
   cd File-Management-using-AWS-Event-Based-EC2-Instances
   ```
3. **Install dependencies**:
   ```bash
   npm install
   ```
4. **Deploy the infrastructure**:
   ```bash
   # Deploy using AWS CDK or any other IaC tools you prefer
   aws_cloudformation_deploy.sh
   ```
5. **Start the application**:
   ```bash
   npm start
   ```

## Contributing
Contributions are welcome! For major changes, please open an issue first to discuss what you would like to change.

## License
Distributed under the MIT License. See `LICENSE` for more information.

This project is designed for educational and demonstration purposes, showcasing how AWS can be used to build scalable and efficient cloud-native applications.
