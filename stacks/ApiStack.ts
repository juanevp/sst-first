import {Api, StackContext, use} from "@serverless-stack/resources";
import {StorageStack} from "./StorageStack";

export function ApiStack({stack}: StackContext) {
    const {table} = use(StorageStack);

    const api = new Api(stack, "Api", {
        cors: true,
        defaults: {
            function: {
                environment: {
                    TABLE_NAME: table.tableName,
                },
            },
            authorizer: "iam"
        },
        routes: {
            "POST   /notes": "functions/create.main",
            "GET    /notes/{id}": "functions/get.main",
            "GET    /notes": "functions/list.main",
            "PUT    /notes/{id}": "functions/update.main",
            "DELETE /notes/{id}": "functions/delete.main",
        },
    });

    api.attachPermissions([table]);
    stack.addOutputs({
        ApiEndpoint: api.url,
    });
    return {api};
}
