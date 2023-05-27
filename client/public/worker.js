self.addEventListener("push", (event) => {
  let { title, body } = event?.data?.json() ?? {};
  event.waitUntil(self.registration.showNotification(title || "", { body }));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const urlToOpen = "http://localhost:5173";
  event.waitUntil(
    self.clients
      .matchAll({
        type: "window",
        includeUncontrolled: true,
      })
      .then((clientList) => {
        if (clientList.length > 0) {
          return clientList[0]
            .focus()
            .then((client) => client.navigate(urlToOpen));
        }
        return self.clients.openWindow(urlToOpen);
      })
  );
});
