export class Logger {
  constructor(private context: string) {}

  info(message: string, data?: Record<string, any>) {
    console.log(`[${this.context}] INFO: ${message}`, data || '');
  }

  warn(message: string, data?: Record<string, any>) {
    console.warn(`[${this.context}] WARN: ${message}`, data || '');
  }

  error(message: string, data?: Record<string, any>) {
    console.error(`[${this.context}] ERROR: ${message}`, data || '');
  }

  debug(message: string, data?: Record<string, any>) {
    console.debug(`[${this.context}] DEBUG: ${message}`, data || '');
  }
}
