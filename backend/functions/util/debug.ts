import util from "util";
import AWS from "aws-sdk";

interface LogEntry {
    date: Date;
    string: string;
}

let logs: LogEntry[];

// Log AWS SDK calls
AWS.config.logger = {log: debug};

export default function debug(...params: any[]) {
    logs.push({
        date: new Date(),
        string: util.format.apply(null, params),
    });
}

export function init(event: any) {
    logs = [];

    // Log API event
    debug("API event", {
        body: event.body,
        pathParameters: event.pathParameters,
        queryStringParameters: event.queryStringParameters,
    });
}

export function flush(e: any) {
    logs.forEach(({date, string}) => console.debug(date, string));
    console.error(e);
}