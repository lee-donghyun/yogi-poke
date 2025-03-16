import Dockerode from "dockerode";
import express from "express";
import { config } from "dotenv";

config();

const auth = (req, res, next) => {
  const SECRET_KEY = process.env.SECRET_KEY;
  const isValidToken = (token) => {
    return token === SECRET_KEY;
  };
  const token = req.headers["authorization"];
  if (!token || !isValidToken(token)) {
    return res.status(403).json({ error: "Invalid or missing token" });
  }
  next();
};

const app = express();
app.use(express.json());
app.use(auth);

const docker = new Dockerode();

app.get("/deploy-server-container", async (req, res) => {
  res.status(201).send("Upgrade container");

  const BODY = {
    image_name: "donghyunlee022/yogi-poke:latest",
    container_name: "yogi_poke_server",
    ports: { 8080: [{ HostPort: "8080" }] },
  };
  try {
    console.log("Pulling image");
    await docker.pull(BODY.image_name, {
      authconfig: {
        username: "donghyunlee022",
        password: "s/-D74mVz4gjw#t",
      },
    });

    console.log("Stopping and removing the container");
    await docker
      .getContainer(BODY.container_name)
      .stop()
      .catch(() => {
        console.log("Container not found to stop");
      });
    await docker
      .getContainer(BODY.container_name)
      .remove()
      .catch(() => {
        console.log("Container not found to remove");
      });

    console.log("Creating and starting a new container");
    const newContainer = await docker.createContainer({
      Image: BODY.image_name,
      name: BODY.container_name,
      ExposedPorts: { 8080: {} },
      HostConfig: {
        PortBindings: BODY.ports,
        ExtraHosts: ["host.docker.internal:host-gateway"],
      },
    });

    console.log("Pruning images");
    await docker.pruneImages().then((result) => {
      console.log("Pruned", result);
    });

    await newContainer.start();
    console.log("Container started");
  } catch (error) {
    console.error(error);
  }
});

app.listen(708, () => {
  console.log(`Server is running on port ${708}`);
});
