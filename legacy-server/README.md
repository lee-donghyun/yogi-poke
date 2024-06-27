## 서버

fastify로 만든 서버 앱

## 로컬 디비 구성

postgres latest (16)을 도커로 실행한다.
`POSTGRES_PASSWORD` 는 `local` 으로 설정한다.
**참고 : postgres 의 기본 유저 네임은 `postgres` 이다.**

```sh
# 알 수 없는 오류가 나온다면, 우선 디비 초기화 npx prisma migrate reset
npx prisma migrate dev
```

```sh
npm i
npm run build
npm run dev # 또는 npm run start
```
