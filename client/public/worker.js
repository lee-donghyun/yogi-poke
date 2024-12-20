self.addEventListener("push", (event) => {
  const { data } = event?.data?.json() ?? {};
  event.waitUntil(
    self.registration
      .showNotification(data.title, data.options)
      .catch(console.error),
  );

  event.waitUntil(
    self.clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clients) => {
        clients.forEach((client) => {
          client.postMessage({ type: "REVALIDATE_RELATED_POKES" });
        });
      })
      .catch(console.error),
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const pageToOpen = "/my-page";
  event.waitUntil(
    self.clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then(([client]) => {
        if (client) {
          client.focus().then((client) =>
            client.postMessage({
              type: "NAVIGATE",
              data: { url: pageToOpen },
            }),
          );
          return;
        }
        return self.clients.openWindow(pageToOpen);
      })
      .catch(console.error),
  );
});
