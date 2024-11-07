import {
  blueBright,
  cyanBright,
  greenBright,
  magenta,
  redBright,
} from 'cli-color';
import { createLogger, format, transports } from 'winston';

const colorMessage = (
  message: string,
  level: string,
  timestamp: string,
  stack?: string
): string => {
  if (level.includes('error')) {
    return `[${redBright(timestamp)}] [${redBright(level)}]: ${magenta(message)} - ${magenta(stack)}`;
  }
  return `[${cyanBright(timestamp)}] [${greenBright(level)}]: ${blueBright(message)}`;
};

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

const fileFormat = format.combine(
  format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss A' }),
  format.align(),
  format.json(),
  format.splat(),
  format.errors({ stack: true }),
  format.prettyPrint()
);

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
