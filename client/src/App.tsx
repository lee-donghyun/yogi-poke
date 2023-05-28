import axios from "axios";
import { useState } from "react";

export const App = () => {
  const [token, setToken] = useState("");
  return (
    <div>
      <h1>web push test!</h1>
      <input
        type="text"
        className="border-p-5 text-lg"
        value={token}
        onChange={({ target: { value } }) => {
          setToken(value);
        }}
      />
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
                    applicationServerKey: import.meta.env.VITE_VAPID_PUBLIC_KEY,
                  };
                  return registration.pushManager.subscribe(subscribeOptions);
                })
                .then((pushSubscription) => {
                  axios.patch(
                    `${import.meta.env.VITE_YOGI_POKE_API_URL}/user/my-info`,
                    { pushSubscription },
                    {
                      headers: {
                        Authorization: token,
                      },
                    }
                  );
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
