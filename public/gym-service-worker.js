importScripts("./ngsw-worker.js");

const timers = new Map();

let communicationPort;

self.addEventListener("message", (event) => {
  if (event.data.type) {
    switch (event.data.type) {
      case "PORT_INITIALIZATION":
        console.log("STARTING COMMUNICATION WITH SERVICE WORKER");
        communicationPort = event.ports[0];
        break;
      case "play":
        if (!timers.has(event.data.timerId)) {
          const startTime = Date.now();
          console.log("STARTING TIMER IN SERVICE WORKER");
          const interval = self.setInterval(() => {
            const remainingMilliseconds = Math.max(
              event.data.milliseconds - (Date.now() - startTime),
              0,
            );
            communicationPort.postMessage({
              timerId: event.data.timerId,
              remainingMilliseconds,
            });
            if (remainingMilliseconds === 0) {
              console.log(
                "TIMER ENDED, SENDING NOTIFICATION FROM SERVICE WORKER",
              );
              clearInterval(interval);
              timers.delete(event.data.timerId);
              self.registration
                .getNotifications({
                  tag: event.data.timerId,
                })
                .then((notifications) => {
                  for (const notification of notifications) {
                    notification.close();
                  }
                  self.registration.showNotification("Gym", {
                    body: event.data.text,
                    icon: "icons/favicon.png",
                    badge: "icons/favicon.png",
                    silent: false,
                    tag: event.data.timerId,
                  });
                });
            }
          }, 10);
          timers.set(event.data.timerId, interval);
        } else {
          console.log("TIMER ALREADY EXIST IN SERVICE WORKER");
        }
        break;
      case "stop":
        console.log("STOPPING TIMER IN SERVICE WORKER");
        clearInterval(timers.get(event.data.timerId));
        timers.delete(event.data.timerId);
        break;
    }
  }
});
