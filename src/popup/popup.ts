function showToast(message: string, type: 'success' | 'error' = 'error') {
  const toast = document.getElementById('toast');

  if (!toast) return;

  toast.textContent = message;
  toast.classList.remove('toast-success', 'toast-error'); // reset previous state
  toast.classList.add(type === 'success' ? 'toast-success' : 'toast-error');
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 10000);
}

document.addEventListener('DOMContentLoaded', () => {
  const syncBtn = document.getElementById('syncBtn') as HTMLButtonElement;
  const connectBtn = document.getElementById('connectBtn') as HTMLButtonElement;
  const resultDiv = document.getElementById('result') as HTMLDivElement;

  syncBtn.style.display = 'none';

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

        if (!syncResponse.success) {
          showToast(
            syncResponse.error || 'Failed to sync emails.'
          );
          resultDiv.textContent = '';

          return;
        }

        showToast(
          syncResponse.data?.message ||
          'Emails synced successfully!',
          'success'
        );
        resultDiv.textContent = '';


        console.log(
          'Response Of Emails',
          syncResponse.data
        );
      }
    );
  });
});

