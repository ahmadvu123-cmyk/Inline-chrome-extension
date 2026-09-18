import { SUPABASE_SECRET_KEY, SYNC_GMAIL_URL, CONNECT_GMAIL } from "../constants";

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.Type === 'Connect_Gmail') {
        connectToGmail().then(result => {
            sendResponse({
                success: true,
                ...result
            })
        }).catch((error: any) => {
            sendResponse({
                success: false,
                error: error.message || 'Unknown error'
            })
        })
    }
    return true;
})

async function connectToGmail() {
    const tokenResult = await chrome.identity.getAuthToken({ interactive: true });
    const accessToken = tokenResult?.token;
    if (!accessToken) {
        throw new Error('Failed to get access token');
    }
    const response = await fetch(CONNECT_GMAIL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${SUPABASE_SECRET_KEY}`,
            'ApiKey': SUPABASE_SECRET_KEY || ''
        },
        body: JSON.stringify({
            gmailAccessToken: accessToken
        })
    })

    if (!response.ok) {
        const errorData = await response.json();

        throw new Error(
            errorData?.error?.message ||
            'Failed to connect Gmail.'
        );
    }
    const profile = await response.json();
    console.log("User profile response:", profile);

    await chrome.storage.local.set({
        gmailConnected: true,
        gmailAccessToken: accessToken,
        authUserEmail: profile.profile.emailAddress

    })
    return {
        connected: true,
        email: profile.profile.emailAddress
    }
}
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    if (message.action === 'START_GMAIL_SYNC') {
        handleSyncGmail()
            .then((data) => sendResponse({ success: true, data }))
            .catch((err) => sendResponse({ success: false, error: err.message }));
        return true;
    }
});
async function handleSyncGmail() {
    const { gmailAccessToken } = await chrome.storage.local.get('gmailAccessToken');
    if (!gmailAccessToken) {
        throw new Error('Gmail access token not found. Please connect to Gmail first.')
    }
    const { authUserEmail } = await chrome.storage.local.get('authUserEmail');
    console.log("user email service worker", authUserEmail);

    if (!authUserEmail) {
        throw new Error('Auth user email not found.')
    }
    const response = await fetch(SYNC_GMAIL_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${SUPABASE_SECRET_KEY}`,
            'ApiKey': SUPABASE_SECRET_KEY || ''
        },
        body: JSON.stringify({
            gmailAccessToken: gmailAccessToken,
            userEmail: authUserEmail
        })
    })
    if (!response.ok) {
        const errorData = await response.json();

        throw new Error(
            errorData?.error?.message ||
            'Failed to sync Gmail.'
        );
    }

    const finalResponse = await response.json();
    return finalResponse;
}