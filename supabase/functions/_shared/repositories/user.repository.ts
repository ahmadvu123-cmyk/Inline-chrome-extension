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
        throw new Error(`Error while finding user: ${error.message}`);
    }

    return data;
}

export async function saveUsers(userProfile: userProfileInput) {
    if (!userProfile || !userProfile.emailAddress) {
        throw new Error('Invalid User Profile: email is required');
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
        throw new Error(`Error while inserting user profile: ${error.message}`);
    }

    return data?.[0] ?? null;
}