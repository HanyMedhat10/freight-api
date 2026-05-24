/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ConflictException,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
  NotFoundException,
  ServiceUnavailableException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { FastifyReply, FastifyRequest } from 'fastify';

// ─────────────────────────────────────────────────────────────────────────────
//  Consistent error response shape
// ─────────────────────────────────────────────────────────────────────────────
interface ErrorResponse {
  success: false;
  statusCode: number;
  error: string;
  message: string | string[];
  path: string;
  method: string;
  timestamp: string;
  requestId?: string;
  details?: unknown;
}

// ─────────────────────────────────────────────────────────────────────────────
//  Custom domain exceptions
// ─────────────────────────────────────────────────────────────────────────────
export class ValidationException extends BadRequestException {
  constructor(errors: string[]) {
    super({ message: errors, error: 'Validation Failed' });
  }
}

export class ResourceNotFoundException extends NotFoundException {
  constructor(resource: string, id?: string | number) {
    super({
      message: id
        ? `${resource} with id "${id}" not found`
        : `${resource} not found`,
      error: 'Resource Not Found',
    });
  }
}

export class DuplicateResourceException extends ConflictException {
  constructor(resource: string, field?: string) {
    super({
      message: field
        ? `${resource} with this ${field} already exists`
        : `${resource} already exists`,
      error: 'Duplicate Resource',
    });
  }
}

export class BusinessRuleException extends UnprocessableEntityException {
  constructor(
    message: string,
    public readonly rule?: string,
  ) {
    super({ message, error: 'Business Rule Violation', rule });
  }
}

export class ExternalServiceException extends ServiceUnavailableException {
  constructor(service: string, originalError?: string) {
    super({
      message: `External service "${service}" is unavailable`,
      error: 'External Service Error',
      originalError,
    });
  }
}

// ─────────────────────────────────────────────────────────────────────────────
//  Global catch-all exception filter  (Fastify adapter)
// ─────────────────────────────────────────────────────────────────────────────
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const reply = ctx.getResponse<FastifyReply>();
    const request = ctx.getRequest<FastifyRequest>();

    const { statusCode, message, error, details } =
      this.resolveException(exception);

    const requestId = request.headers['x-request-id'] as string | undefined;

    const body: ErrorResponse = {
      success: false,
      statusCode,
      error,
      message,
      path: request.url,
      method: request.method,
      timestamp: new Date().toISOString(),
      ...(requestId && { requestId }),
      ...(details !== undefined && { details }),
    };

    if (statusCode >= 500) {
      this.logger.error(
        `[${request.method}] ${request.url} -> ${statusCode}`,
        exception instanceof Error ? exception.stack : String(exception),
      );
    } else {
      this.logger.warn(
        `[${request.method}] ${request.url} -> ${statusCode} | ${JSON.stringify(message)}`,
      );
    }

    // Fastify uses reply.code().send() — NOT response.status().json()
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    reply.code(statusCode).send(body);
  }

  // ─── Resolve exception to status + message ───────────────────────────────
  private resolveException(exception: unknown): {
    statusCode: number;
    message: string | string[];
    error: string;
    details?: unknown;
  } {
    // 1. Any NestJS HttpException (includes all built-ins)
    if (exception instanceof HttpException) {
      return this.handleHttpException(exception);
    }

    // 3. Native JS errors
    if (exception instanceof SyntaxError) {
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Invalid JSON or syntax error in request',
        error: 'Bad Request',
      };
    }
    if (exception instanceof TypeError) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'An unexpected type error occurred',
        error: 'Internal Server Error',
        details:
          process.env.NODE_ENV !== 'production' ? exception.message : undefined,
      };
    }

    // 4. Unknown / unhandled
    return {
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'An unexpected error occurred. Please try again later.',
      error: 'Internal Server Error',
    };
  }

  // ─── HttpException ────────────────────────────────────────────────────────
  private handleHttpException(exception: HttpException): {
    statusCode: number;
    message: string | string[];
    error: string;
    details?: unknown;
  } {
    const statusCode = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
      const resp = exceptionResponse as Record<string, unknown>;
      return {
        statusCode,
        message: (resp.message as string | string[]) ?? exception.message,
        error: (resp.error as string) ?? this.statusToError(statusCode),
        details: resp.details,
      };
    }

    return {
      statusCode,
      message:
        typeof exceptionResponse === 'string'
          ? exceptionResponse
          : exception.message,
      error: this.statusToError(statusCode),
    };
  }

  // ─── HTTP status code -> readable error string ────────────────────────────
  private statusToError(status: number): string {
    const map: Record<number, string> = {
      400: 'Bad Request',
      401: 'Unauthorized',
      403: 'Forbidden',
      404: 'Not Found',
      405: 'Method Not Allowed',
      408: 'Request Timeout',
      409: 'Conflict',
      410: 'Gone',
      422: 'Unprocessable Entity',
      429: 'Too Many Requests',
      500: 'Internal Server Error',
      501: 'Not Implemented',
      502: 'Bad Gateway',
      503: 'Service Unavailable',
      504: 'Gateway Timeout',
    };
    return map[status] ?? 'Unknown Error';
  }
}
