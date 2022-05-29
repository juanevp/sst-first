const config = {
    // Backend config
    s3: {
        REGION: process.env.REACT_APP_REGION,
        BUCKET: process.env.REACT_APP_BUCKET,
    },
    apiGateway: {
        REGION: process.env.REACT_APP_REGION,
        URL: process.env.REACT_APP_API_URL,
    },
    cognito: {
        REGION: process.env.REACT_APP_REGION,
        USER_POOL_ID: process.env.REACT_APP_USER_POOL_ID,
        APP_CLIENT_ID: process.env.REACT_APP_USER_POOL_CLIENT_ID,
        IDENTITY_POOL_ID: process.env.REACT_APP_IDENTITY_POOL_ID,
    },
    MAX_ATTACHMENT_SIZE: 5000000,
    STRIPE_KEY: "YOUR_STRIPE_PUBLIC_KEY",
    SENTRY_DSN: "https://e5f576e45c3845fea8cfec262be44f97@o1266236.ingest.sentry.io/6450818"
};

export default config;
