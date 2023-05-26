import axios from "axios";

export const App = () => {
  return (
    <div>
      <h1>web push test!</h1>
      <button
        onClick={() => {
          Notification.requestPermission().then((status) => {
            console.log("Notification 상태", status);

            if (status === "denied") {
              alert("Notification 거부됨");
            } else if (navigator.serviceWorker) {
              navigator.serviceWorker
                .register("worker.js") // serviceworker 등록
                .then((registration) => {
                  const subscribeOptions = {
                    userVisibleOnly: true,
                    applicationServerKey:
                      "BLOxNEo_0Vvvi5v2UUEnJF01rXNKNJLha_H26gt0TAlRDHAj6VAIUVTqz-CNjaVTVGkUlTn8vD-9zK9a_NSx0qo", // 발급받은 vapid public key
                  };
                  return registration.pushManager.subscribe(subscribeOptions);
                })
                .then((pushSubscription) => {
                  axios.patch(
                    `http://localhost:3000/user/my-info`,
                    { pushSubscription },
                    {
                      headers: {
                        Authorization:
                          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJAay1iaWxsIiwibmFtZSI6IktvcmVhbiBCaWxsIEdhdGVzIiwiaWF0IjoxNjg1MTAzODY0fQ.Sx92qw7wcmR_GGtr3mSh2-Hk_LZFfGC_GNqVRD2NJbQ",
                      },
                    }
                  );
                  console.log(pushSubscription);
                });
            }
          });
        }}
      >
        register!
      </button>
    </div>
  );
};
