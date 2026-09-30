import { SUPABASE_SECRET_KEY, SYNC_GMAIL_URL, ANALYZE_COMPOSE_URL, CONNECT_GMAIL_URL } from "../constants";

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
    const response = await fetch(CONNECT_GMAIL_URL, {
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

    const previousState = await chrome.storage.local.get('authUserEmail');
    await chrome.storage.local.set({
        gmailConnected: true,
        gmailAccessToken: accessToken,
        authUserEmail: profile.profile.emailAddress,
        ...(previousState.authUserEmail !== profile.profile.emailAddress
            ? { gmailSynced: false, gmailSyncedAt: null }
            : {})
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
    const { gmailAccessToken, gmailConnected, gmailSynced, authUserEmail } =
        await chrome.storage.local.get([
            'gmailAccessToken',
            'gmailConnected',
            'gmailSynced',
            'authUserEmail'
        ]);

    if (gmailSynced) {
        throw new Error('Gmail emails have already been synced for this account.');
    }

    if (!gmailConnected) {
        throw new Error('Please connect your Gmail account first.');
    }

    if (!gmailAccessToken) {
        throw new Error('Gmail access token not found. Please connect to Gmail first.')
    }
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
    await chrome.storage.local.set({
        gmailSynced: true,
        gmailSyncedAt: Date.now()
    });
    return finalResponse;
}
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'ANALYZE_COMPOSE') {
        analyzeCompose(message.payload).then(result => {
            sendResponse({
                success: true,
                data: result
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

async function analyzeCompose(payload: unknown) {
    const response = await fetch(
        ANALYZE_COMPOSE_URL,
        {
            method: "POST",

            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${SUPABASE_SECRET_KEY}`,
                "apikey": SUPABASE_SECRET_KEY || '',
            },

            body: JSON.stringify(payload),
        }
    );

    const result = await response.json();

    if (!response.ok || !result.success) {
        throw new Error(
            result?.error?.message ??
            "Compose analysis failed"
        );
    }

    return result.data;
}

chrome.runtime.onMessage.addListener(
    (message, sender, sendResponse) => {

        if (message.action === 'ANALYZE_ACTIVE_COMPOSE') {
            analyzeActiveCompose()
                .then((data) => {
                    sendResponse({ success: true, data });
                })
                .catch((error: any) => {
                    sendResponse({
                        success: false,
                        error: error.message || 'Failed to analyze the Gmail compose.'
                    });
                });

            return true;
        }
    }
);

async function analyzeActiveCompose(): Promise<unknown> {
    const tabs = await chrome.tabs.query({
        url: 'https://mail.google.com/*'
    });

    if (!tabs.length) {
        throw new Error(
            'Please open Gmail before analyzing.'
        );
    }

    const gmailTab = tabs[0];

    if (!gmailTab.id) {
        throw new Error('Gmail tab ID not found.');
    }

    let result: any;
    try {
        result = await chrome.tabs.sendMessage(gmailTab.id, {
            action: 'ANALYZE_CURRENT_COMPOSE'
        });
    } catch {
        await chrome.scripting.executeScript({
            target: { tabId: gmailTab.id },
            files: ['content/content-script.js']
        });

        result = await chrome.tabs.sendMessage(gmailTab.id, {
            action: 'ANALYZE_CURRENT_COMPOSE'
        });
    }

    return unwrapComposeResult(result);
}

function unwrapComposeResult(result: any): unknown {
    if (!result?.success) {
        throw new Error(result?.error || 'Compose analysis failed.');
    }

    return result.data;
}