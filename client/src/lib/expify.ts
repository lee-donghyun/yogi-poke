type Callback<T> = () => T;

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

class Switch<V, T> {
  private value: V;
  private result?: T;
  constructor(value: V) {
    this.value = value;
  }
  case(condition: V, callback: Callback<T>): this {
    if (this.value === condition) {
      this.result = callback();
    }
    return this;
  }
  default(callback: Callback<T>): T {
    return this.result ?? callback();
  }
}

export const switch_ = <V, T>(value: V) => new Switch<V, T>(value);
