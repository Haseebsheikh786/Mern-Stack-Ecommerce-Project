// Check if the environment is production and if the service worker is supported
export function register() {
  if (process.env.NODE_ENV === "production" && "serviceWorker" in navigator) {
    // Set the URL for the service worker
    const swUrl = `${process.env.PUBLIC_URL}/service-worker.js`;
    // Register the service worker
    navigator.serviceWorker
      .register(swUrl)
      .then((registration) => {
        console.log("Service Worker registered:", registration);
      })
      .catch((error) => {
        console.error("Error during service worker registration:", error);
      });
  }
}
export function unregister() {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.ready
      .then((registration) => {
        registration.unregister();
      })
      .catch((error) => {
        console.error("Error during service worker unregistration:", error);
      });
  }
}
