import { Link } from "wouter";

export const Home = () => {
  return (
    <div className="min-h-screen">
      <div className="p-20 text-center text-4xl font-extrabold">
        <p className="-rotate-12">요기콕콕!👉</p>
      </div>
      <div className="p-5">
        <p className="text-xl">
          👋 지금 이 순간, 새로운 소셜 미디어 혁신이 시작됩니다.
        </p>
        <p className="mt-5">
          우리의 새로운 서비스,{" "}
          <span className="text-lg font-medium">&quot;요기콕콕!👉&quot;</span>이
          찾아왔습니다! 요기콕콕!은 친구들과의 소통을 더욱 편리하고 재미있게
          만들어주는 기능입니다. 언제든지 당신의 친구에게 간단하고 빠르게
          &quot;콕 찌르기&quot;를 보낼 수 있습니다.
        </p>
        <p className="mt-5">
          그저 한 번의 클릭으로 당신의 존재를 알려주고, 관심과 애정을 전달할 수
          있습니다. 친구가 멀리 떨어져 있을 때도 요기콕콕!은 그들에게 가까움을
          전달합니다. 새로운 소식, 축하의 메시지, 또는 그냥 인사를 보내고 싶을
          때, 당신은 콕 찌르기로 간편하게 소통할 수 있습니다.
        </p>
        <p className="mt-5">함께 더 가까워지는 소통의 즐거움을 경험하세요!</p>
      </div>
      <div className="flex flex-col gap-5 p-5">
        <Link href="/register">
          <button className="block w-full rounded bg-black p-4 text-white duration-300 active:opacity-60">
            회원가입
          </button>
        </Link>
        <Link href="/sign-in">
          <button className="block w-full rounded border p-4 duration-300 active:bg-zinc-200 disabled:bg-zinc-300">
            로그인
          </button>
        </Link>
      </div>
    </div>
  );
};
