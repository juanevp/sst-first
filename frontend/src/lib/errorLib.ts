import * as Sentry from "@sentry/browser";
import { Extras } from "@sentry/types";
import config from "../config";

const isLocal = process.env.NODE_ENV === "development";

export function initSentry() {
  if (isLocal) {
    return;
  }

  Sentry.init({ dsn: config.SENTRY_DSN });
}

export function logError(error: any, errorInfo?: Extras) {
  if (isLocal) {
    return;
  }

  Sentry.withScope((scope) => {
    errorInfo && scope.setExtras(errorInfo);
    Sentry.captureException(error);
  });
}

export function onError(error: any) {
    let errorInfo: Extras = {};
    let message = error.toString();
  
    // Auth errors
    if (!(error instanceof Error) && error.message) {
      errorInfo = error;
      message = error.message;
      error = new Error(message);
      // API errors
    } else if (error.config?.url) {
      errorInfo.url = error.config.url;
    }
  
    logError(error, errorInfo);
  
    alert(message);
}
