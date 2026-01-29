export interface Logger {
  info(message: string): void;
  error(message: string): void;
}

export class ConsoleLogger implements Logger {
  public info(message: string): void {
    console.log(message);
  }

  public error(message: string): void {
    console.error(message);
  }
}

export class SilentLogger implements Logger {
  public info(_message: string): void {}

  public error(_message: string): void {}
}
