import cliColors from 'cli-color';
import { createLogger, format, transports } from 'winston';

/**
 * Colors and formats a log message based on its level.
 *
 * @param message - The log message to be formatted.
 * @param level - The log level (e.g., 'info', 'error').
 * @param timestamp - The timestamp of the log message.
 * @param stack - Optional stack trace to be included if the level is 'error'.
 * @returns The formatted and colored log message.
 */
const colorMessage = (
  message: string,
  level: string,
  timestamp: string,
  stack?: string
): string => {
  if (level.includes('error')) {
    return `[${cliColors.redBright(timestamp)}] [${cliColors.redBright(level)}]: ${cliColors.magenta(message)} - ${cliColors.magenta(stack)}`;
  }
  return `[${cliColors.cyanBright(timestamp)}] [${cliColors.greenBright(level)}]: ${cliColors.blueBright(message)}`;
};

/**
 * Combines multiple Winston formatters to create a custom console log format.
 * The format includes:
 * - Colorized output
 * - Timestamps in 'YYYY-MM-DD HH:mm:ss A' format
 * - Aligned log messages
 * - Support for splat interpolation
 * - Error stack traces
 * - Custom message formatting using `colorMessage` function
 */
const consoleFormat = format.combine(
  format.colorize(),
  format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss A' }),
  format.align(),
  format.splat(),
  format.errors({ stack: true }),
  format.printf(
    (info: {
      message: string;
      level: string;
      timestamp: string;
      stack: string;
    }) => colorMessage(info.message, info.level, info.timestamp, info.stack)
  )
);

/**
 * Combines multiple Winston format functions to create a custom log format.
 *
 * The combined format includes:
 * - A timestamp in the format 'YYYY-MM-DD HH:mm:ss A'
 * - Alignment of log messages
 * - JSON formatting of log messages
 * - Support for string interpolation with splat
 * - Inclusion of error stack traces
 * - Pretty printing of log messages
 */
const fileFormat = format.combine(
  format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss A' }),
  format.json(),
  format.splat(),
  format.errors({ stack: true })
);

/**
 * A Winston transport configuration for logging to the console.
 *
 * @constant
 * @property {string} level - The logging level for the console transport.
 * @property {Format} format - The format for the console output.
 */
const consoleTransport = new transports.Console({
  level: 'info',
  format: consoleFormat,
});

export const winstonLogger = createLogger({
  transports: [
    consoleTransport,
    new transports.File({
      level: 'error',
      filename: 'logs/error.log',
      format: format.combine(fileFormat),
    }),
    new transports.File({
      level: 'info',
      filename: 'logs/combined.log',
      format: format.combine(fileFormat),
    }),
  ],
  handleExceptions: true,
  handleRejections: true,
  exceptionHandlers: [
    consoleTransport,
    new transports.File({
      filename: 'logs/exceptions.log',
      format: fileFormat,
    }),
  ],
  rejectionHandlers: [
    consoleTransport,
    new transports.File({
      filename: 'logs/rejections.log',
      format: fileFormat,
    }),
  ],
});
