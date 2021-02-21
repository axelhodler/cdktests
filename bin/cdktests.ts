#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { CdktestsStack } from '../lib/cdktests-stack';

const app = new cdk.App();
new CdktestsStack(app, 'CdktestsStack');
