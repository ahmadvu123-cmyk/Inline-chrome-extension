export interface UserProfileInput {
    emailAddress: string;
    historyId: string;
    messagesTotal?: number;
    threadsTotal?: number;
}

export interface EmailInput {
    user_id: string;
    sender: string;
    receiver: string;
    subject: string;
    date: string;
    labels: string[];
    thread_Id: string;
    email_history_id: string;
    email_message: string;
}

export interface ComposeRequest {
    composeId: string;
    sender: string;
    recipients: string[];
    ccRecipients: string[];
    bccRecipients: string[];
    subject: string;
    body: string;
}

export type CoachingIssueType =
    | "VAGUE_REQUEST"
    | "EXCESSIVE_LENGTH"
    | "MISSING_CONTEXT"
    | "RECIPIENT_SUGGESTION";

export interface CoachingIssue {
    type: CoachingIssueType;
    title: string;
    message: string;
    suggestion: string;
    action: {
        label: string;
        replacement?: string;
        addTo?: string[];
        removeTo?: string[];
        addCc?: string[];
        removeCc?: string[];
        addBcc?: string[];
        removeBcc?: string[]
    };
}

export interface CoachingResponse {
    composeId: string;
    shouldShow: boolean;
    issues: CoachingIssue[];
}
