#!/usr/bin/env node

import * as cdk from "aws-cdk-lib";
import { GitGuardianStack } from "../lib/gitguardian-stack.js";

const app = new cdk.App();

new GitGuardianStack(app, "GitGuardianStack");