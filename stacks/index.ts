import {App} from "@serverless-stack/resources";
import {ApiStack} from "./ApiStack";
import {AuthStack} from "./AuthStack";
import {FrontendStack} from "./FrontendStack";
import {StorageStack} from "./StorageStack";

export default function (app: App) {
    console.log(process.env);
    if (process.env.DELETE_RESOURCES === "true") {
        if (process.env.STAGE !== "prod") {
            app.setDefaultRemovalPolicy("destroy");
            console.log("Destroying all resources");
        } else {
            console.log("Cannot automatically delete all resources of a production environment. Please do it manually");
        }
    }
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
