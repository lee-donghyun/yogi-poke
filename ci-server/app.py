from flask import Flask, request, jsonify
import requests
import ipaddress
import docker

app = Flask(__name__)
client = docker.from_env()

client.login(username="donghyunlee022", password="s/-D74mVz4gjw#t")


def is_valid_ip(ip):
    def get_github_actions_ip_ranges():
        response = requests.get("https://api.github.com/meta")
        response.raise_for_status()
        return response.json()["actions"]

    for ip_range in get_github_actions_ip_ranges():
        if ipaddress.ip_address(ip) in ipaddress.ip_network(ip_range):
            return True
    return False


def is_valid_token(token):
    SECRET_KEY = "very_secret_key"
    return token == SECRET_KEY


@app.before_request
def before_request():
    client_ip = request.remote_addr
    if not is_valid_ip(client_ip):
        return jsonify({"error": "Invalid IP address"}), 403

    token = request.headers.get("Authorization")
    if token is None or not is_valid_token(token):
        return jsonify({"error": "Invalid or missing token"}), 403


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
