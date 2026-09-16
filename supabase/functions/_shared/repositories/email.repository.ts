import { supabase } from "../supabase-client.ts";

interface EmailInput {
    user_id: string,
    sender: string,
    receiver: string,
    subject: string,
    date: string,
    labels: string[],
    thread_Id: string,
    email_history_id: string,
    email_message: string
}

export async function existingEmails(receiverEmail: string) {
    const { data, error } = await supabase
        .from('emails')
        .select('*')
        .eq('receiver', receiverEmail);

    if (error) {
        throw new Error(`Error while finding emails: ${error.message}`);
    }

    return data;
}

export async function saveEmails(emails: EmailInput[]){
    if (!emails) {
        throw new Error('Emails data is required');
    }
    const { data, error } = await supabase.from('emails').insert(emails).select();

    if (error) {
        throw new Error(`Error while inserting user profile`);
    }

    return data;
   
}

export async function saveEmailPatterns(emailPatterns: unknown) {
    if (!emailPatterns) {
        throw new Error("Email patterns are required");
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
        throw new Error("Sender email is required");
    }

    if (!patterns.receiver?.email) {
        throw new Error("Receiver email is required");
    }

    if (!patterns.response) {
        throw new Error("Email pattern response is required");
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
        throw error;
    }

    return data;
}
