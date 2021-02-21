import { expect as expectCDK, haveResource } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import * as Cdktests from '../lib/cdktests-stack';

test('ECR Resource is present', () => {
    const app = new cdk.App();

    const stack = new Cdktests.CdktestsStack(app, 'MyTestStack');

    expectCDK(stack).to(haveResource("AWS::ECR::Repository",{
        RepositoryName: 'test-repository'
    }));
});
