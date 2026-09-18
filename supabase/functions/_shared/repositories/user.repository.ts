import { ERROR_CODES } from "../errors/error-codes.ts";
import { supabase } from "../supabase-client.ts";

interface userProfileInput {
    emailAddress: string;
    historyId: string;
    messagesTotal?: number;
    threadsTotal?: number;
}

export async function existingUser(userEmail: string){
    const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', userEmail)
        .maybeSingle();

    if (error) {
        throw new Error(ERROR_CODES.SUPABASE_QUERY_FAILED);
    }

    return data;
}

export async function saveUsers(userProfile: userProfileInput) {
    if (!userProfile || !userProfile.emailAddress) {
        throw new Error(ERROR_CODES.VALIDATION_ERROR);
    }
    const user = await existingUser(userProfile.emailAddress);
    if (user) {
        console.log("Existing User:", user);
        return user;
    }

    const { data, error } = await supabase.from('users').insert([
        {
            email: userProfile.emailAddress,
            total_messages: userProfile.messagesTotal,
            total_threads: userProfile.threadsTotal,
            history_id: userProfile.historyId
        }
    ]).select();

    if (error) {
        throw new Error(ERROR_CODES.SUPABASE_INSERT_FAILED);
    }

    return data?.[0] ?? null;
}