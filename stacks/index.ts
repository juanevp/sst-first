import {App} from "@serverless-stack/resources";
import {ApiStack} from "./ApiStack";
import {AuthStack} from "./AuthStack";
import {FrontendStack} from "./FrontendStack";
import {StorageStack} from "./StorageStack";

export default function (app: App) {
    app.setDefaultFunctionProps({
        runtime: "nodejs16.x",
        srcPath: "backend",
        bundle: {
            format: "esm",
        },
    });
    app.stack(StorageStack, {id: "storage"})
        .stack(ApiStack, {id: "api"})
        .stack(AuthStack, {id: "auth"})
        .stack(FrontendStack);
}
