from flask import Flask, request, jsonify

import docker

app = Flask(__name__)
client = docker.from_env()

client.login(username="donghyunlee022", password="s/-D74mVz4gjw#t")


@app.route("/remove-container", methods=["POST"])
def remove_container():
    data = request.get_json()
    container_id = data.get("container_id")

    try:
        container = client.containers.get(container_id)
        container.stop()
        container.remove()
        return jsonify(
            {
                "status": "success",
                "message": f"Container {container_id} removed successfully.",
            }
        )
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500


@app.route("/start-container", methods=["POST"])
def start_container():
    data = request.get_json()
    image_name = data.get("image_name")
    container_name = data.get("container_name")
    ports = data.get("ports", {})

    try:
        client.images.pull(image_name)
        container = client.containers.run(
            image_name, name=container_name, ports=ports, detach=True
        )
        return jsonify(
            {
                "status": "success",
                "message": f"Container {container_name} started successfully.",
                "container_id": container.id,
            }
        )
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
