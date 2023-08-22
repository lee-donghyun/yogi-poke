type Try<T> = (f: () => T) => {
  _catch: (f: () => T) => T;
};
export const try_ = <T>(f: Parameters<Try<T>>[0]): ReturnType<Try<T>> => {
  try {
    const value = f();
    return { _catch: () => value };
  } catch {
    return { _catch: (f) => f() };
  }
};

class If<T> {
  private value?: T;
  constructor(condition: boolean, callback: Callback<T>) {
    if (condition) {
      this.value = callback();
    }
  }
  elif(condition: boolean, callback: Callback<T>): this {
    if (!condition) {
      callback();
    }
    return this;
  }
  _else(callback: Callback<T>): T {
    return this.value ?? callback();
  }
}

export const if_ = <T>(condition: boolean, value: () => T): If<T> =>
  new If<T>(condition, value);
