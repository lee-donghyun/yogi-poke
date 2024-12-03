export class Task {
  private promise = Promise.resolve();
  pipe(callback: () => Promise<void> | void, ...debug: string[]) {
    this.promise = this.promise.then(callback, (error) =>
      console.error(debug, error),
    );
  }
}
