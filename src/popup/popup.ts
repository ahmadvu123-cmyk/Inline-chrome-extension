import { showToast } from "../_shared/helpers/show-toast";

document.addEventListener('DOMContentLoaded', () => {
  const syncBtn = document.getElementById('syncBtn') as HTMLButtonElement;
  const connectBtn = document.getElementById('connectBtn') as HTMLButtonElement;
  const resultDiv = document.getElementById('result') as HTMLDivElement;
  const analyzeBtn = document.getElementById('analyzeBtn') as HTMLButtonElement;

  syncBtn.style.display = 'none';
  analyzeBtn.style.display = 'none';

  chrome.storage.local.get(
    ['gmailConnected', 'gmailSynced', 'authUserEmail'],
    (state) => {
      if (!state.gmailConnected) {
        connectBtn.style.display = 'block';
        return;
      }

      connectBtn.style.display = 'none';
      resultDiv.textContent = state.gmailSynced
        ? `Emails already synced for ${state.authUserEmail || 'your Gmail account'}.`
        : `Connected to ${state.authUserEmail || 'Gmail'}`;

      if (state.gmailSynced) {
        analyzeBtn.style.display = 'inline-block';
      } else {
        syncBtn.style.display = 'block';
      }
    }
  );

  connectBtn.addEventListener('click', () => {
    resultDiv.textContent = 'Connecting to Gmail...';
    connectBtn.disabled = true;

    chrome.runtime.sendMessage(
      { Type: 'Connect_Gmail' },
      (response) => {
        connectBtn.disabled = false;

        if (chrome.runtime.lastError) {
          showToast(
            chrome.runtime.lastError.message || 'Connection failed.'
          );
          return;
        }

        if (!response) {
          showToast('No response from Gmail service.');
          return;
        }

        if (!response.success) {
          showToast(
            response.error || 'Failed to connect Gmail.'
          );
          return;
        }

        connectBtn.style.display = 'none';
        syncBtn.style.display = 'block';

        resultDiv.textContent = `Connected to ${response.email}`;
      }
    );
  });

  syncBtn.addEventListener('click', () => {
    resultDiv.textContent = 'Syncing emails...';
    syncBtn.disabled = true;

    chrome.runtime.sendMessage(
      { action: 'START_GMAIL_SYNC' },
      (syncResponse) => {
        syncBtn.disabled = false;

        if (chrome.runtime.lastError) {
          showToast(
            chrome.runtime.lastError.message || 'Sync failed.'
          );
          resultDiv.textContent = '';
          return;
        }

        if (!syncResponse) {
          showToast('No response from Gmail service.');
          resultDiv.textContent = '';
          return;
        }

        if (syncResponse.success === true) {
          showToast(
            syncResponse.data?.message ||
            'Emails synced successfully!',
            'success'
          );

          markEmailsSynced('Emails synced successfully.');

          return;
        }

        const conflictMessages = [
          'Email records for this user already exist in the database, so the requested email data cannot be created again.',
          'The requested resource already exists and cannot be created again with the same identifier or unique values.',
          'The request could not be completed because it conflicts with the current state or existing data.',
          'The requested record already exists and creating another record with the same unique values is not allowed.',
        ];

        const isConflictError =
          typeof syncResponse.error === 'string' &&
          conflictMessages.includes(syncResponse.error);

        if (isConflictError) {
          showToast(
            'Emails are already synced. You can analyze your compose.',
            'success'
          );

          markEmailsSynced('Emails already synced. You can analyze your compose.');

          return;
        }

        showToast(
          syncResponse.error || 'Failed to sync emails.'
        );

        resultDiv.textContent = '';
      }
    );
  });

  analyzeBtn.addEventListener('click', async () => {
    resultDiv.textContent = 'Analyzing open compose...';
    analyzeBtn.disabled = true;

    chrome.runtime.sendMessage(
      { action: 'ANALYZE_ACTIVE_COMPOSE' },
      (response) => {
        analyzeBtn.disabled = false;

        if (chrome.runtime.lastError) {
          showToast(
            chrome.runtime.lastError.message ||
            'Failed to start compose analysis.'
          );

          resultDiv.textContent = '';
          return;
        }

        if (!response?.success) {
          showToast(
            response?.error ||
            'Failed to analyze the open compose.'
          );

          resultDiv.textContent = response?.error || 'Analysis failed.';
          return;
        }

        resultDiv.textContent = JSON.stringify(response.data, null, 2);
        showToast('Compose analysis complete.', 'success');
      }
    );
  });

  function markEmailsSynced(message: string) {
    chrome.storage.local.set(
      { gmailSynced: true, gmailSyncedAt: Date.now() },
      () => {
        if (chrome.runtime.lastError) {
          showToast('Sync completed, but the extension could not save its sync status.');
          return;
        }

        syncBtn.style.display = 'none';
        analyzeBtn.style.display = 'inline-block';
        resultDiv.textContent = message;
      }
    );
  }


});

