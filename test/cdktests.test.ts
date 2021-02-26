import { expect as expectCDK, haveResource, haveResourceLike } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import * as Cdktests from '../lib/cdktests-stack';

test('ECR Resource is present', () => {
    const app = new cdk.App();

    const stack = new Cdktests.CdktestsStack(app, 'MyTestStack');

    expectCDK(stack).to(haveResource("AWS::ECR::Repository",{
        RepositoryName: 'test'
    }));
});

test('Fargate service is using the default values', () => {
    const app = new cdk.App();

    const stack = new Cdktests.CdktestsStack(app, 'MyTestStack');

    expectCDK(stack).to(haveResource("AWS::ECS::Service",{
        LaunchType: 'FARGATE',
        DesiredCount: 1,
        HealthCheckGracePeriodSeconds: 60
    }));
});

test('Fargate is using the latest image in ECR', () => {
    const app = new cdk.App();

    const stack = new Cdktests.CdktestsStack(app, 'MyTestStack');

    expectCDK(stack).to(haveResourceLike("AWS::ECS::TaskDefinition",{
        ContainerDefinitions: [{
            Image: {
                "Fn::Join": [
                    "",
                    [
                        {
                            "Fn::Select": [
                                4,
                                {
                                    "Fn::Split": [
                                        ":",
                                        {
                                            "Fn::GetAtt": [
                                                "testrepository3CFC24EC",
                                                "Arn"
                                            ]
                                        }
                                    ]
                                }
                            ]
                        },
                        ".dkr.ecr.",
                        {
                            "Fn::Select": [
                                3,
                                {
                                    "Fn::Split": [
                                        ":",
                                        {
                                            "Fn::GetAtt": [
                                                "testrepository3CFC24EC",
                                                "Arn"
                                            ]
                                        }
                                    ]
                                }
                            ]
                        },
                        ".",
                        {
                            "Ref": "AWS::URLSuffix"
                        },
                        "/",
                        {
                            "Ref": "testrepository3CFC24EC"
                        },
                        ":latest"
                    ]
                ]
            }
        }]
    }));
});

test('ELB health check path is using Spring Boot endpoint', () => {
    const app = new cdk.App();

    const stack = new Cdktests.CdktestsStack(app, 'MyTestStack');

    expectCDK(stack).to(haveResource("AWS::ElasticLoadBalancingV2::TargetGroup",{
        HealthCheckPath: '/actuator/health'
    }));
});
