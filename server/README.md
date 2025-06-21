# 서버

Nest.js로 만든 서버 앱이다. docker-compose 를 사용하여 배포한다.

**구성 시작 전, 환경변수 .env 를 개발자에게 문의한다.**

## 앱 개발 환경 설정

pnpm 을 패키지 매니저로 사용한다.

### Database, Storage 설정

```sh
docker-compose up database storage
```

### 패키지 설치

```sh
pnpm i
```

### ORM 설정

```sh
npx prisma generate
```

### 앱 실행

```sh
pnpm run start:dev
```

## 배포

서버 앱은 github actions를 통해 자동으로 배포된다.

`/.github/workflows/server.yaml` 참고

github actions가 실행되면 아래 명령어가 실행된다.

```sh
docker-compose up -d
```

### 배포 환경 설정 및 개요

`docker-compose.yaml`과 `.env`를 설정한다.
