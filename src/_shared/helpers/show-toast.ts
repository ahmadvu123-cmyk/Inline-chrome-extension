export function showToast(message: string, type: 'success' | 'error' = 'error') {
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