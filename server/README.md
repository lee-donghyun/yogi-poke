# 서버

Nest.js로 만든 서버 앱이다. database와 storage는 도커 이미지를 사용해 구성한다. 서버 앱은 이미지로 구워서 배포한다.

**구성 시작 전, 환경변수 .env 를 적절히 설정한다.**

## Database 구성

로컬과 서버에서 같게 구성한다.

### 컨테이너 생성

서버 구성 시 최초 한 번만 실행한다.

```sh
docker create \
    --name yogi_poke_db \
    -p 5432:5432 \
    -e POSTGRES_PASSWORD=환경변수_참고 \
    postgres:latest
```

### 컨테이너 실행

```sh
docker start yogi_poke_db
```

**Database IDE를 위한 팁 : postgres 의 기본 유저 네임은 `postgres` 이다.**

## Storage 구성

로컬과 서버에서 같게 구성한다.

### 컨테이너 생성

서버 구성 시 최초 한 번만 실행한다.

```sh
# 도커 이미지와 별개로 저장할 디렉토리
mkdir ~/yogi_poke_storage/data

docker create \
   -p 9000:9000 \
   -p 9001:9001 \
   --name yogi_poke_storage \
   -v ~/yogi_poke_storage/data:/data \
   -e "MINIO_ROOT_USER=환경변수_참고" \
   -e "MINIO_ROOT_PASSWORD=환경변수_참고" \
   minio/minio:latest server /data --console-address ":9001"
```

### 컨테이너 실행

```sh
docker start yogi_poke_storage
```

## 앱 구성

pnpm 을 패키지 매니저로 사용한다.

### 패키지 설치

```sh
pnpm i
npx prisma generate
npx prisma migrate dev
```

### 앱 실행

```sh
pnpm run start:dev
```

## 배포

Storage와 Database는 상기한 것과 같이 구성한다. 서버 앱은 docker를 이용하여 배포한다.

```sh
docker build . --tag donghyunlee022/yogi-poke:latest --platform linux/amd64
```
