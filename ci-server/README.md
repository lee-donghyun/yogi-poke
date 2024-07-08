# ci-server

github actions 과 통합을 위한 api 서버입니다.

## 사용법

```sh
docker create \
   -p 708:5000 \
   --name ci-server \
   -v /var/run/docker.sock:/var/run/docker.sock
```
