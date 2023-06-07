import { useState } from "react";
import { useUser } from "../component/Auth";

type Form = {
  name: string;
  profileImageUrl: string | null;
};

export const UpdateMyInfo = ({ close }: { close: () => void }) => {
  const { myInfo } = useUser();
  const [data, setData] = useState<Form>(
    myInfo ?? { name: "", profileImageUrl: null }
  );
  return (
    <div className="min-h-screen">
      <div
        className="z-10 grid bg-white p-5"
        style={{ gridTemplateColumns: "80px 1fr 80px" }}
      >
        <button className="justify-self-start" onClick={close} type="button">
          취소
        </button>
        <p className="text-center font-medium">내 정보 수정</p>
        <button className="justify-self-end" type="button">
          완료
        </button>
      </div>
      <div className="h-full overflow-scroll p-5">
        <div
          className="grid items-center gap-3 text-sm"
          style={{ gridTemplateColumns: "80px 1fr" }}
        >
          <label htmlFor="name">이름</label>
          <input
            className="rounded-none border-b p-2 text-zinc-800 outline-none focus:border-black"
            id="name"
            type="text"
            value={data.name}
            onChange={({ target: { value: name } }) =>
              setData((p) => ({ ...p, name }))
            }
          />
        </div>
      </div>
    </div>
  );
};
