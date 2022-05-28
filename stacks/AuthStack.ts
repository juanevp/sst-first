import {Effect, PolicyStatement} from "aws-cdk-lib/aws-iam";
import {Auth, StackContext, use} from "@serverless-stack/resources";
import {StorageStack} from "./StorageStack";
import {ApiStack} from "./ApiStack";

export function AuthStack({stack}: StackContext) {
    const {bucket} = use(StorageStack);
    const {api} = use(ApiStack);

    // Create a Cognito User Pool and Identity Pool
    const auth = new Auth(stack, "Auth", {
        cdk: {
            userPool: {
                // Users can login with their email and password
                signInAliases: {
                    email: true,
                },
            },
        },
    });

    auth.attachPermissionsForAuthUsers([
        // Allow access to the API
        api,
        // Policy granting access to a specific folder in the bucket
        new PolicyStatement({
            actions: ["s3:*"],
            effect: Effect.ALLOW,
            resources: [bucket.bucketArn + "/private/${cognito-identity.amazonaws.com:sub}/*"],
        }),
    ]);

    // Show the auth resources in the output
    stack.addOutputs({
        Region: stack.region,
        UserPoolId: auth.userPoolId,
        IdentityPoolId: auth.cognitoIdentityPoolId ?? "",
        UserPoolClientId: auth.userPoolClientId,
    });

    return {auth};
}
