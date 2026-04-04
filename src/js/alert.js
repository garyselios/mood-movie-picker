// Alert message system
export function alertMessage(message, scroll = true) {
  // Create alert element
  const alert = document.createElement('div');
  alert.classList.add('alert');
  alert.innerHTML = `
    <span class="alert-message">${message}</span>
    <button class="alert-close">✖</button>
  `;
  
  // Add close button functionality
  const closeBtn = alert.querySelector('.alert-close');
  closeBtn.addEventListener('click', () => {
    alert.remove();
  });
  
  // Auto-remove after 5 seconds
  setTimeout(() => {
    if (alert.parentElement) {
      alert.remove();
    }
  }, 5000);
  
  // Insert alert at the top of main content
  const main = document.querySelector('main');
  if (main) {
    main.insertBefore(alert, main.firstChild);
  } else {
    document.body.insertBefore(alert, document.body.firstChild);
  }
  
  // Scroll to top to show alert
  if (scroll) {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

// Clear all alerts
export function clearAlerts() {
  const alerts = document.querySelectorAll('.alert');
  alerts.forEach(alert => alert.remove());
}

// Show success message
export function alertSuccess(message, scroll = true) {
  const alert = document.createElement('div');
  alert.classList.add('alert', 'alert-success');
  alert.innerHTML = `
    <span class="alert-message">✅ ${message}</span>
    <button class="alert-close">✖</button>
  `;
  
  const closeBtn = alert.querySelector('.alert-close');
  closeBtn.addEventListener('click', () => {
    alert.remove();
  });
  
  setTimeout(() => {
    if (alert.parentElement) alert.remove();
  }, 4000);
  
  const main = document.querySelector('main');
  if (main) {
    main.insertBefore(alert, main.firstChild);
  }
  
  if (scroll) window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Show error message
export function alertError(message, scroll = true) {
  const alert = document.createElement('div');
  alert.classList.add('alert', 'alert-error');
  alert.innerHTML = `
    <span class="alert-message">❌ ${message}</span>
    <button class="alert-close">✖</button>
  `;
  
  const closeBtn = alert.querySelector('.alert-close');
  closeBtn.addEventListener('click', () => {
    alert.remove();
  });
  
  setTimeout(() => {
    if (alert.parentElement) alert.remove();
  }, 6000);
  
  const main = document.querySelector('main');
  if (main) {
    main.insertBefore(alert, main.firstChild);
  }
  
  if (scroll) window.scrollTo({ top: 0, behavior: 'smooth' });
}