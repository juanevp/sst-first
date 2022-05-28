var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// stacks/index.ts
var stacks_exports = {};
__export(stacks_exports, {
  default: () => stacks_default
});
module.exports = __toCommonJS(stacks_exports);

// stacks/ApiStack.ts
var import_resources2 = require("@serverless-stack/resources");

// stacks/StorageStack.ts
var import_resources = require("@serverless-stack/resources");
function StorageStack({ stack }) {
  const table = new import_resources.Table(stack, "Notes", {
    fields: {
      userId: "string",
      noteId: "string"
    },
    primaryIndex: {
      partitionKey: "userId",
      sortKey: "noteId"
    }
  });
  const bucket = new import_resources.Bucket(stack, "Uploads", {
    cors: [
      {
        maxAge: "1 day",
        allowedOrigins: ["*"],
        allowedHeaders: ["*"],
        allowedMethods: ["GET", "PUT", "POST", "DELETE", "HEAD"]
      }
    ]
  });
  return {
    bucket,
    table
  };
}
__name(StorageStack, "StorageStack");

// stacks/ApiStack.ts
function ApiStack({ stack }) {
  const { table } = (0, import_resources2.use)(StorageStack);
  const api = new import_resources2.Api(stack, "Api", {
    cors: true,
    defaults: {
      function: {
        environment: {
          TABLE_NAME: table.tableName
        }
      },
      authorizer: "iam"
    },
    routes: {
      "POST   /notes": "functions/create.main",
      "GET    /notes/{id}": "functions/get.main",
      "GET    /notes": "functions/list.main",
      "PUT    /notes/{id}": "functions/update.main",
      "DELETE /notes/{id}": "functions/delete.main"
    }
  });
  api.attachPermissions([table]);
  stack.addOutputs({
    ApiEndpoint: api.url
  });
  return { api };
}
__name(ApiStack, "ApiStack");

// stacks/AuthStack.ts
var import_aws_iam = require("aws-cdk-lib/aws-iam");
var import_resources3 = require("@serverless-stack/resources");
function AuthStack({ stack }) {
  const { bucket } = (0, import_resources3.use)(StorageStack);
  const { api } = (0, import_resources3.use)(ApiStack);
  const auth = new import_resources3.Auth(stack, "Auth", {
    cdk: {
      userPool: {
        signInAliases: {
          email: true
        }
      }
    }
  });
  auth.attachPermissionsForAuthUsers([
    api,
    new import_aws_iam.PolicyStatement({
      actions: ["s3:*"],
      effect: import_aws_iam.Effect.ALLOW,
      resources: [bucket.bucketArn + "/private/${cognito-identity.amazonaws.com:sub}/*"]
    })
  ]);
  stack.addOutputs({
    Region: stack.region,
    UserPoolId: auth.userPoolId,
    IdentityPoolId: auth.cognitoIdentityPoolId ?? "",
    UserPoolClientId: auth.userPoolClientId
  });
  return { auth };
}
__name(AuthStack, "AuthStack");

// stacks/FrontendStack.ts
var import_resources4 = require("@serverless-stack/resources");
function FrontendStack({ stack, app }) {
  const { api } = (0, import_resources4.use)(ApiStack);
  const { auth } = (0, import_resources4.use)(AuthStack);
  const { bucket } = (0, import_resources4.use)(StorageStack);
  const site = new import_resources4.ReactStaticSite(stack, "ReactSite", {
    path: "frontend",
    environment: {
      REACT_APP_API_URL: api.customDomainUrl || api.url,
      REACT_APP_REGION: app.region,
      REACT_APP_BUCKET: bucket.bucketName,
      REACT_APP_USER_POOL_ID: auth.userPoolId,
      REACT_APP_IDENTITY_POOL_ID: auth.cognitoIdentityPoolId ?? "",
      REACT_APP_USER_POOL_CLIENT_ID: auth.userPoolClientId
    }
  });
  stack.addOutputs({
    SiteUrl: site.url
  });
}
__name(FrontendStack, "FrontendStack");

// stacks/index.ts
function stacks_default(app) {
  app.setDefaultFunctionProps({
    runtime: "nodejs16.x",
    srcPath: "backend",
    bundle: {
      format: "esm"
    }
  });
  app.stack(StorageStack, { id: "storage" }).stack(ApiStack, { id: "api" }).stack(AuthStack, { id: "auth" }).stack(FrontendStack);
}
__name(stacks_default, "default");
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
//# sourceMappingURL=index.js.map
