import express, { type Express, type Request, type Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import morgan from 'morgan';

export interface ServerConfig {
  port: number;
  corsOrigin: string | string[];
  rateLimit: { windowMs: number; max: number };
  env?: string;
  nodeEnv?: string;
}

export interface CreateServerOptions {
  serviceName: string;
  config: ServerConfig;
  /** Router mounted at /health. */
  health: RequestHandlerLike;
  /** Route tables mounted under /api. */
  routes: Array<{ path: string; handler: RequestHandlerLike }>;
  /** Express router (or handler) used for the 404 + error middleware. */
  notFoundHandler: RequestHandlerLike;
  errorHandler: RequestHandlerLike & ((
    err: unknown,
    req: Request,
    res: Response,
    next: (err?: unknown) => void
  ) => void);
  /** Optional extra middleware applied before the routes. */
  requestLogger?: RequestHandlerLike;
}

export interface CreatedServer {
  app: Express;
  serviceName: string;
}

type RequestHandlerLike = (
  req: Request,
  res: Response,
  next: (err?: unknown) => void
) => void;

/**
 * Builds an Express app with the shared middleware stack used by every
 * AquaLink backend service (security, compression, parsing, rate limiting,
 * logging, health check, routes, 404 and error handling).
 */
export function createServer(options: CreateServerOptions): CreatedServer {
  const {
    serviceName,
    config,
    health,
    routes,
    notFoundHandler,
    errorHandler,
    requestLogger,
  } = options;

  const app = express();

  // Security middleware
  app.use(helmet());
  app.use(cors({ origin: config.corsOrigin, credentials: true }));

  // Compression
  app.use(compression());

  // Body parsing
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Request logging
  const env = config.env ?? config.nodeEnv ?? 'development';
  if (requestLogger) app.use(requestLogger);
  app.use(morgan(env === 'development' ? 'dev' : 'combined'));

  // Rate limiting
  app.use(
    '/api',
    rateLimit({
      windowMs: config.rateLimit.windowMs,
      max: config.rateLimit.max,
      standardHeaders: true,
      legacyHeaders: false,
      message: 'Too many requests, please try again later.',
    })
  );

  // Health check
  app.use('/health', health);

  // Service routes
  for (const route of routes) {
    app.use(route.path, route.handler);
  }

  // 404 + global error handling
  app.use(notFoundHandler);
  app.use(errorHandler);

  return { app, serviceName };
}

export default createServer;
