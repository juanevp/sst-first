import {test} from "vitest";
import {Template} from "aws-cdk-lib/assertions";
import {StorageStack} from "../stacks/StorageStack";
import {App, getStack} from "@serverless-stack/resources";

test("Test StorageStack", () => {
    const app = new App().stack(StorageStack);
    // WHEN
    const stack = getStack(StorageStack);
    // THEN
    const template = Template.fromStack(stack);
    template.hasResourceProperties("AWS::DynamoDB::Table", {
        BillingMode: "PAY_PER_REQUEST",
    });
});
