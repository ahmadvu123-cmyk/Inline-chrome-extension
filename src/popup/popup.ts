document.addEventListener('DOMContentLoaded', () => {
  const syncBtn = document.getElementById('syncBtn') as HTMLButtonElement;
  if (syncBtn) {
    syncBtn.style.display = 'none';
  }
  const connectBtn = document.getElementById('connectBtn') as HTMLButtonElement;
  const resultDiv = document.getElementById('result') as HTMLDivElement;
  connectBtn.addEventListener('click', () => {
    resultDiv.textContent = 'Connecting to Gmail...';
    connectBtn.disabled = true;
    chrome.runtime.sendMessage({ Type: 'Connect_Gmail' }, (response) => {
      connectBtn.disabled = false;
      if (chrome.runtime.lastError) {
        resultDiv.textContent = `Error: ${chrome.runtime.lastError.message}`;
      } else if (!response) {
        resultDiv.textContent = 'Error: Gmail background service is not running. Reload the extension from the dist folder.';
      } else if (response.error) {
        resultDiv.textContent = `Error: ${response.error}`;
      } else {
        connectBtn.style.display = 'none';
        syncBtn.style.display = 'block';
        resultDiv.textContent = `Connected to ${response.email}`;
        syncBtn.addEventListener('click', () => {
          resultDiv.textContent = 'Syncing emails...';
          chrome.runtime.sendMessage({ action: 'START_GMAIL_SYNC' }, (syncResponse) => {
            if (chrome.runtime.lastError) {
              resultDiv.textContent = `Error: ${chrome.runtime.lastError.message}`;
            } else if (!syncResponse.success) {
              resultDiv.textContent = `Error: ${syncResponse.error || 'Failed to sync emails.'}`;
            } else {
              resultDiv.textContent = syncResponse.data?.message || 'Emails synced successfully!';
              console.log('Response Of Emails', syncResponse.data);
              
            }
          });
        });
      }
    })
  });
});

