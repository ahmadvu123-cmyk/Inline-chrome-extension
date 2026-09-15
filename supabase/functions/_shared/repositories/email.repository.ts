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
        throw new Error(`Error while inserting user profile: ${error.message}`);
    }

    return data;
   
}
