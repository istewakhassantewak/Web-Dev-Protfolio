// Vercel Speed Insights Initialization
// This script initializes the Speed Insights tracking for the page

(function() {
  // Initialize the queue
  window.si = window.si || function() {
    (window.siq = window.siq || []).push(arguments);
  };

  // Create and inject the Speed Insights script
  const script = document.createElement('script');
  script.src = '/_vercel/speed-insights/script.js';
  script.defer = true;
  script.dataset.sdkn = '@vercel/speed-insights';
  script.dataset.sdkv = '2.0.0';
  
  script.onerror = function() {
    console.log('[Vercel Speed Insights] Failed to load script. Please check if any content blockers are enabled and try again.');
  };

  document.head.appendChild(script);
})();
