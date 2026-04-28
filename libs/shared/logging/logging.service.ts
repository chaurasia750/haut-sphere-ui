import { Injectable } from '@angular/core';

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  timestamp: Date;
  level: LogLevel;
  message: string;
  context?: any;
}

/**
 * Central Logging Service
 * Shared across Shell and all remote applications
 *
 * Provides:
 * - Structured logging with levels
 * - Context attachment
 * - Log history for debugging
 */
@Injectable({
  providedIn: 'root'
})
export class LoggingService {
  private logs: LogEntry[] = [];
  private readonly maxLogs = 500;
  private isDevelopment = !this.isProd();

  constructor() {}

  // ========================================================================
  // Public API
  // ========================================================================

  debug(message: string, context?: any): void {
    this.log('debug', message, context);
  }

  info(message: string, context?: any): void {
    this.log('info', message, context);
  }

  warn(message: string, context?: any): void {
    this.log('warn', message, context);
  }

  error(message: string, context?: any): void {
    this.log('error', message, context);
  }

  /**
   * Get all logs (useful for debugging)
   */
  getLogs(): LogEntry[] {
    return [...this.logs];
  }

  /**
   * Get logs filtered by level
   */
  getLogsByLevel(level: LogLevel): LogEntry[] {
    return this.logs.filter(log => log.level === level);
  }

  /**
   * Clear all logs
   */
  clearLogs(): void {
    this.logs = [];
  }

  /**
   * Export logs as JSON
   */
  exportLogs(): string {
    return JSON.stringify(this.logs, null, 2);
  }

  // ========================================================================
  // Private Methods
  // ========================================================================

  private log(level: LogLevel, message: string, context?: any): void {
    const entry: LogEntry = {
      timestamp: new Date(),
      level,
      message,
      context
    };

    this.logs.push(entry);

    // Keep history size manageable
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }

    // Also log to console in development
    if (this.isDevelopment) {
      this.logToConsole(level, message, context);
    }

    // Send to monitoring in production
    if (!this.isDevelopment && level === 'error') {
      this.sendToMonitoring(entry);
    }
  }

  private logToConsole(level: LogLevel, message: string, context?: any): void {
    const prefix = `[${level.toUpperCase()}]`;
    const timestamp = new Date().toISOString();

    switch (level) {
      case 'debug':
        console.debug(`${prefix} [${timestamp}] ${message}`, context);
        break;
      case 'info':
        console.info(`${prefix} [${timestamp}] ${message}`, context);
        break;
      case 'warn':
        console.warn(`${prefix} [${timestamp}] ${message}`, context);
        break;
      case 'error':
        console.error(`${prefix} [${timestamp}] ${message}`, context);
        break;
    }
  }

  private sendToMonitoring(entry: LogEntry): void {
    // TODO: Implement monitoring service integration
    // This would send logs to a service like CloudWatch, DataDog, etc.
  }

  private isProd(): boolean {
    return typeof window !== 'undefined' && window.location.hostname !== 'localhost';
  }
}
