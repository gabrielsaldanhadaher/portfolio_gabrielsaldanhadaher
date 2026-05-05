/**
 * Logger estruturado para toda a aplicação
 * Facilita debugging e monitoramento
 */

type LogLevel = "debug" | "info" | "warn" | "error";

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  module: string;
  message: string;
  data?: any;
  error?: Error;
}

class Logger {
  private isDev = __DEV__;
  private logs: LogEntry[] = [];
  private maxLogs = 100;

  private formatTimestamp(): string {
    return new Date().toISOString();
  }

  private createEntry(
    level: LogLevel,
    module: string,
    message: string,
    data?: any,
    error?: Error
  ): LogEntry {
    return {
      timestamp: this.formatTimestamp(),
      level,
      module,
      message,
      data,
      error,
    };
  }

  private log(entry: LogEntry) {
    // Adicionar ao histórico
    this.logs.push(entry);
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }

    // Log no console em desenvolvimento
    if (this.isDev) {
      const prefix = `[${entry.module}]`;
      const message = `${prefix} ${entry.message}`;

      switch (entry.level) {
        case "debug":
          console.debug(message, entry.data);
          break;
        case "info":
          console.info(message, entry.data);
          break;
        case "warn":
          console.warn(message, entry.data);
          break;
        case "error":
          console.error(message, entry.error || entry.data);
          break;
      }
    }
  }

  debug(module: string, message: string, data?: any) {
    this.log(this.createEntry("debug", module, message, data));
  }

  info(module: string, message: string, data?: any) {
    this.log(this.createEntry("info", module, message, data));
  }

  warn(module: string, message: string, data?: any) {
    this.log(this.createEntry("warn", module, message, data));
  }

  error(module: string, message: string, error?: Error | any, data?: any) {
    const err = error instanceof Error ? error : new Error(String(error));
    this.log(this.createEntry("error", module, message, data, err));
  }

  getLogs(level?: LogLevel): LogEntry[] {
    if (!level) return this.logs;
    return this.logs.filter((log) => log.level === level);
  }

  clearLogs() {
    this.logs = [];
  }

  exportLogs(): string {
    return JSON.stringify(this.logs, null, 2);
  }
}

export const logger = new Logger();
