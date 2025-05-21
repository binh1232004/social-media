// Simple toast notification utility
export function showToast(message, type = 'info', duration = 3000) {
  // Create toast element
  const toast = document.createElement('div');
  
  // Set appropriate styling based on type
  toast.className = `fixed bottom-4 right-4 rounded-lg shadow-lg px-4 py-2 transform transition-all duration-500 z-50 opacity-0 translate-y-2`;
  
  switch (type) {
    case 'success':
      toast.classList.add('bg-green-500', 'text-white');
      break;
    case 'error':
      toast.classList.add('bg-red-500', 'text-white');
      break;
    case 'warning':
      toast.classList.add('bg-yellow-500', 'text-white');
      break;
    default:
      toast.classList.add('bg-blue-500', 'text-white');
  }
  
  // Set message content
  toast.textContent = message;
  
  // Add to DOM
  document.body.appendChild(toast);
  
  // Animate in
  setTimeout(() => {
    toast.classList.remove('opacity-0', 'translate-y-2');
    toast.classList.add('opacity-100', 'translate-y-0');
  }, 10);
  
  // Animate out and remove after duration
  setTimeout(() => {
    toast.classList.add('opacity-0', 'translate-y-2');
    setTimeout(() => {
      document.body.removeChild(toast);
    }, 500);
  }, duration);
}
