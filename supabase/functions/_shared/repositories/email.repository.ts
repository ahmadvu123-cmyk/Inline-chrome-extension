import { ERROR_CODES } from "../errors/error-codes.ts";
import { supabase } from "../supabase-client.ts";

export async function existingEmails(receiverEmail: string) {
    const { data, error } = await supabase
        .from('emails')
        .select('*')
        .eq('receiver', receiverEmail);

    if (error) {
        throw new Error(ERROR_CODES.SUPABASE_QUERY_FAILED);
    }

    return data;
}

export async function saveEmails(emails: unknown){
    if (!emails) {
        throw new Error('Emails data is required');
    }
    const { data, error } = await supabase.from('emails').insert(emails).select();

    if (error) {
        throw new Error(ERROR_CODES.SUPABASE_INSERT_FAILED);
    }

    return data;
   
}

export async function existingEmailPatterns(sender: string, receiver: string) {
    const { data, error } = await supabase
        .from('email_patterns')
        .select('*')
        .eq('sender', sender)
        .eq('receiver', receiver);

    if (error) {
        throw new Error(ERROR_CODES.SUPABASE_QUERY_FAILED);
    }

    return data;
}

export async function saveEmailPatterns(emailPatterns: unknown) {
    if (!emailPatterns) {
        throw new Error(ERROR_CODES.MISSING_REQUIRED_FIELD);
    }

    const patterns = emailPatterns as {
        sender?: {
            email?: string;
        };
        receiver?: {
            email?: string;
        };
        response?: unknown;
    };

    if (!patterns.sender?.email) {
        throw new Error(ERROR_CODES.MISSING_REQUIRED_FIELD);
    }

    if (!patterns.receiver?.email) {
        throw new Error(ERROR_CODES.MISSING_REQUIRED_FIELD);
    }

    if (!patterns.response) {
        throw new Error(ERROR_CODES.MISSING_REQUIRED_FIELD);
    }

    const { data, error } = await supabase
        .from("email_patterns")
        .insert({
            sender: patterns.sender.email,
            receiver: patterns.receiver.email,
            pattern: JSON.stringify(patterns.response),
        })
        .select()
        .single();

    if (error) {
        console.error("Failed to save email patterns:", error);
        throw new Error(ERROR_CODES.SUPABASE_INSERT_FAILED);
    }

    return data;
}
