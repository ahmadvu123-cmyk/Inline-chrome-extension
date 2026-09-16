import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { existingEmails, saveEmailPatterns, saveEmails } from "../_shared/repositories/email.repository.ts";
import { GMAIL_API_URL } from "../_shared/constants.ts";
import { existingUser } from "../_shared/repositories/user.repository.ts";
import { generateEmailPatterns } from "../_shared/services/email-service.ts";
import { errorResponse } from "../_shared/errors/error-response.ts";


const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

function getHeader(
  headers: { name: string; value: string }[],
  name: string
) {
  return headers.find(
    header => header.name.toLowerCase() === name.toLowerCase()
  )?.value || '';
}

serve(async (req: any) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { gmailAccessToken, userEmail } = await req.json();
    const existingEmailsList = await existingEmails(userEmail);
    if (existingEmailsList && existingEmailsList.length > 0) {
      throw new Error('Emails already exists for this user');
    }
    console.log("User Email sync-gmail", userEmail);

    console.log('Received gmailAccessToken:', gmailAccessToken);
    if (!gmailAccessToken) {
      throw new Error('Gmail access token is missing')
    }

    const authenticatedUser = await existingUser(userEmail);
    console.log("Authenticated User:", authenticatedUser);
    if (!authenticatedUser) {
      throw new Error("Authenticated user not found");
    }

    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
    const dateQuery = `${ninetyDaysAgo.getFullYear()}/${ninetyDaysAgo.getMonth() + 1}/${ninetyDaysAgo.getDate()}`;

    const query = encodeURIComponent(`after:${dateQuery} category:primary`);

    const threadsListRes = await fetch(
      `${GMAIL_API_URL}/users/me/threads?q=${query}&maxResults=500`,
      {
        headers: { Authorization: `Bearer ${gmailAccessToken}` },
      }
    );
    const threadsListData = await threadsListRes.json();
    const threads = threadsListData.threads || [];
    console.log("All threads list:", threads);

    if (threads.length === 0) {
      return new Response(JSON.stringify({ success: true, count: 0, threads: [] }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    const fullThreads = await Promise.all(
      threads.map(async (thread: { id: string }) => {
        const detailRes = await fetch(
            `${GMAIL_API_URL}/users/me/threads/${thread.id}?format=metadata&metadataHeaders=Subject&metadataHeaders=From&metadataHeaders=To&metadataHeaders=CC&metadataHeaders=BCC&metadataHeaders=Date`,
          {
            headers: { Authorization: `Bearer ${gmailAccessToken}` },
          }
        );
        return detailRes.json();
      })
    );

    const emails = fullThreads.flatMap(thread =>
      thread.messages.map((message: any) => {
        const headers = message.payload?.headers || [];

        return {
          user_id: authenticatedUser.id,
          sender: getHeader(headers, 'From'),
          receiver: getHeader(headers, 'To'),
          cc: getHeader(headers, 'CC'),
          bcc: getHeader(headers, 'BCC'),
          subject: getHeader(headers, 'Subject'),
          date: getHeader(headers, 'Date'),
          labels: message.labelIds || [],
          thread_id: thread.id,
          email_history_id: message.historyId,
          email_message: message.snippet || ''
        };
      })
    );
    console.log("All emails:", emails);

    const emailPatternResponseFromLLM = await generateEmailPatterns(emails);
    await saveEmails(emails);
    return new Response(JSON.stringify({
      success: true,
      threads: emails,
      patterns: emailPatternResponseFromLLM
    }), {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      }
    });
  } catch (error: any) {
    return errorResponse(error, corsHeaders);
  }
});