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

type If<T> = (
  condition: boolean,
  value: T
) => { elif: If<T>; _else: (value: T) => T };
export const if_ = <T>(
  condition: Parameters<If<T>>[0],
  value: Parameters<If<T>>[1]
): ReturnType<If<T>> => {
  if (condition) {
    return {
      elif: () => if_(true, value),
      _else: () => value,
    };
  } else {
    return {
      elif: if_,
      _else: (_value) => _value,
    };
  }
};
