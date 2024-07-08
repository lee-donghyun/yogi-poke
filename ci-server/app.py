from flask import Flask, request, jsonify
import docker

app = Flask(__name__)
client = docker.from_env()

client.login(username="donghyunlee022", password="s/-D74mVz4gjw#t")


def is_valid_token(token):
    SECRET_KEY = "very_secret_key"
    return token == SECRET_KEY


@app.before_request
def before_request():
    token = request.headers.get("Authorization")
    if token is None or not is_valid_token(token):
        return jsonify({"error": "Invalid or missing token"}), 403


@app.route("/upgrade-container", methods=["POST"])
def upgrade_container():
    data = request.get_json()
    image_name = data.get("image_name")
    container_name = data.get("container_name")
    ports = data.get("ports", {})

    try:
        client.images.pull(image_name)

        old = client.containers.get(container_name)
        old.stop()
        old.remove()

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
    from waitress import serve

    serve(app, host="0.0.0.0", port=5000)
    print("Server is running on port 5000")
