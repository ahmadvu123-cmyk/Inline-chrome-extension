export interface ComposeData {
    composeId: string;
    sender: string;
    recipients: string | string[];
    ccRecipients: string[];
    bccRecipients: string[];
    subject: string;
    body: string
}

export type CoachingTypes = 
    | "VAGUE_REQUEST"
    | "EXCESSIVE_LENGTH"
    | "MISSING_CONTEXT"
    | "RECIPIENT_SUGGESTION";

export interface CoachingIssue {
    type: CoachingTypes;
    title: string;
    message: string;
    
    suggestion: string;

    action: 
    {
        label: string;
        replacement?: string;
        addTo?: string[];
        removeTo?: string[];
        addCc?: string[];
        removeCc?: string[];
        addBcc?: string[];
        removeBcc?: string[]
    }
}

export interface CoachingAnalysis {
  composeId: string;
  shouldShow: boolean;
  issues: CoachingIssue[];
}

export interface AnalyzeComposeMessage {
    type: "ANALYZE_COMPOSE";
    payload: ComposeData;
}

