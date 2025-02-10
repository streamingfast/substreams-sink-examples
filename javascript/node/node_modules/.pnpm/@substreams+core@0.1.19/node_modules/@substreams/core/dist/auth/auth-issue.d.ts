export declare function authIssue(apiKey: string, url?: string): Promise<{
    token: string;
    expires_at: number;
}>;
export declare function parseAuthorization(authorization: string, url?: string): Promise<string>;
//# sourceMappingURL=auth-issue.d.ts.map