export class Logger {
  static info(message: string) {
    console.log(`[INFO] ${message}`);
  }

  static error(message: string, error?: unknown) {
    console.error(`[ERROR] ${message}`);
    if (error) {
      console.error(error);
    }
  }
}