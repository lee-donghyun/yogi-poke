const cx = {
  formItem: "flex flex-col gap-2 pb-5",
  label: "text-lg",
  input: "border rounded text-zinc-800 p-2 invalid:border-red-500",
};

export const Register = () => {
  return (
    <div className="min-h-screen">
      <div className="text-4xl font-extrabold p-20 text-center">
        <p className="-rotate-12">요기콕콕!</p>
      </div>
      <form
        className="flex flex-col gap-5 p-5"
        onSubmit={(e) => {
          e.preventDefault();
          const form = new FormData(e.currentTarget);
          console.table(Object.fromEntries([...form.entries()]));
        }}
      >
        <div className={cx.formItem}>
          <label className={cx.label} htmlFor="username">
            아이디
          </label>
          <input
            className={cx.input}
            pattern="^[a-z]+$"
            type="text"
            id="username"
            name="username"
            required
          />
        </div>
        <div className={cx.formItem}>
          <label className={cx.label} htmlFor="name">
            이름
          </label>
          <input
            className={cx.input}
            type="text"
            id="name"
            name="name"
            required
          />
        </div>
        <div className={cx.formItem}>
          <label className={cx.label} htmlFor="password">
            비밀번호
          </label>
          <input
            required
            className={cx.input}
            type="password"
            id="password"
            name="password"
          />
        </div>
        <div className="fixed inset-0 top-auto p-5 bg-gradient-to-b from-transparent to-white">
          <button className="block w-full bg-black rounded text-white p-4">
            회원가입
          </button>
        </div>
      </form>
    </div>
  );
};
