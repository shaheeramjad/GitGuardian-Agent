import * as path from "path";
import { fileURLToPath } from "url";

import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";

import * as lambda from "aws-cdk-lib/aws-lambda";
import * as nodeLambda from "aws-cdk-lib/aws-lambda-nodejs";
import * as iam from "aws-cdk-lib/aws-iam";

import * as events from "aws-cdk-lib/aws-events";
import * as targets from "aws-cdk-lib/aws-events-targets";

export class GitGuardianStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    const fn = new nodeLambda.NodejsFunction(this, "GitGuardianFunction", {
      runtime: lambda.Runtime.NODEJS_22_X,

      entry: path.join(
        __dirname,
        "../src/handlers/dailyReport.handler.ts"
      ),

      handler: "handler",

      memorySize: 1024,

      timeout: cdk.Duration.minutes(5),

      bundling: {
        minify: true,
        sourceMap: true,
      },

      // Do not set AWS_REGION (reserved by the Lambda runtime). Set other env vars as needed.
      environment: {},
    });

    fn.addToRolePolicy(
      new iam.PolicyStatement({
        actions: [
          "bedrock:Converse",
          "bedrock:InvokeModel",
          "ses:SendEmail",
          "ssm:GetParameter",
          "ssm:GetParameters",
        ],
        resources: ["*"],
      })
    );

    const rule = new events.Rule(this, "DailyGitGuardianRule", {
      schedule: events.Schedule.cron({
        minute: "0",
        hour: "8",
      }),
    });

    rule.addTarget(new targets.LambdaFunction(fn));
  }
}