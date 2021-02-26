import * as cdk from '@aws-cdk/core';
import * as ecr from '@aws-cdk/aws-ecr';
import * as ecs from '@aws-cdk/aws-ecs';
import {ApplicationLoadBalancedFargateService} from "@aws-cdk/aws-ecs-patterns";

export class CdktestsStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const repository = new ecr.Repository(this, 'test-repository', {
      repositoryName: `test`
    });

    const albfs = new ApplicationLoadBalancedFargateService(this, 'test-fargate', {
      taskImageOptions: {
        image: ecs.ContainerImage.fromEcrRepository(repository, 'latest')
      }
    })

    albfs.targetGroup.configureHealthCheck({
      path: '/actuator/health',
    });
  }
}
