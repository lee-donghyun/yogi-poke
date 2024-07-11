# ci-server

```
docker build . -t ci-server
docker run -p 708:708 -v /var/run/docker.sock:/var/run/docker.sock --name ci-server ci-server
```
