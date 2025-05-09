importScripts("./ngsw-worker.js");

const delayedNotifications = new Map();

self.addEventListener("notificationclick", (event) => {
  console.log("notification clicked!");
});

self.addEventListener("message", (event) => {
  if (event.data.type) {
    switch (event.data.type) {
      case "delayed":
        if (!delayedNotifications.has(event.data.notificationId)) {
          console.log("SENDING DELAYED NOTIFICATION FROM SERVICE WORKER");
          const timeout = self.setTimeout(() => {
            console.log("DELAYED NOTIFICATION SENDED");
            delayedNotifications.delete(event.data.notificationId);
            self.registration.showNotification(event.data.text);
          }, event.data.timeout);
          delayedNotifications.set(event.data.notificationId, timeout);
        } else {
          console.log("DELAYED NOTIFICATION ALREADY EXIST IN SERVICE WORKER");
        }
        break;
      case "immediate":
        console.log("NOTIFICATION SENDED");
        self.registration.showNotification(event.data.text);
        break;
      case "abort":
        console.log("ABORTING DELAYED NOTIFICATION");
        clearTimeout(delayedNotifications.get(event.data.notificationId));
        delayedNotifications.delete(event.data.notificationId);
        break;
    }
  }
});
