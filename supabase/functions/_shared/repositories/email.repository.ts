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

export async function existingEmailPatterns(
    sender: string,
    receiver: string
) {
    const { data, error } = await supabase
        .from("email_patterns")
        .select("id, sender, receiver")
        .eq("sender", sender.trim().toLowerCase())
        .eq("receiver", receiver.trim().toLowerCase())
        .maybeSingle();

    if (error) {
        console.error("Failed to check existing email pattern:", {
            message: error.message,
            details: error.details,
            hint: error.hint,
            code: error.code,
        });

        throw new Error(ERROR_CODES.SUPABASE_QUERY_FAILED);
    }

    return data;
}

export async function saveEmailPatterns(emailPatterns: unknown) {
    if (!emailPatterns || typeof emailPatterns !== "object") {
        throw new Error(ERROR_CODES.MISSING_REQUIRED_FIELD);
    }

    const patterns = emailPatterns as {
        sender?: string;
        receiver?: string;
        response?: unknown;
    };

    const sender = patterns.sender?.trim().toLowerCase();
    const receiver = patterns.receiver?.trim().toLowerCase();
    const response = patterns.response;

    if (!sender) {
        throw new Error(ERROR_CODES.MISSING_REQUIRED_FIELD);
    }

    if (!receiver) {
        throw new Error(ERROR_CODES.MISSING_REQUIRED_FIELD);
    }

    if (response === undefined || response === null) {
        throw new Error(ERROR_CODES.MISSING_REQUIRED_FIELD);
    }

    const { data, error } = await supabase
        .from("email_patterns")
        .insert({
            sender,
            receiver,
            pattern: JSON.stringify(response),
        })
        .select()
        .single();

    if (error) {
        console.error("Failed to save email pattern:", {
            message: error.message,
            details: error.details,
            hint: error.hint,
            code: error.code,
        });

        throw new Error(ERROR_CODES.SUPABASE_INSERT_FAILED);
    }

    return data;
}
