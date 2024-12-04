export function initializeGoogleAnalytics() {
  // Create script elements
  const script1 = document.createElement('script');
  script1.src = 'https://www.googletagmanager.com/gtag/js?id=G-G0LE5N9RV5';
  script1.async = true;

  const script2 = document.createElement('script');
  script2.textContent = `
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-G0LE5N9RV5');
  `;

  // Append scripts to document head
  document.head.appendChild(script1);
  document.head.appendChild(script2);
}