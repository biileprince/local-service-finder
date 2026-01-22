import { NextRequest, NextResponse } from "next/server";
import {
  verifyToken,
  extractTokenFromHeader,
  type JWTPayload,
} from "@/lib/auth";

export interface AuthenticatedRequest extends NextRequest {
  user?: JWTPayload;
}

type RouteHandler = (
  request: AuthenticatedRequest,
  context?: any,
) => Promise<NextResponse>;

/**
 * Middleware wrapper to protect API routes with JWT authentication
 * @param handler - The route handler function to wrap
 * @returns A wrapped handler that checks for valid JWT before executing
 */
export function withAuth(handler: RouteHandler): RouteHandler {
  return async (request: AuthenticatedRequest, context?: any) => {
    const authHeader = request.headers.get("authorization");
    const token = extractTokenFromHeader(authHeader);

    if (!token) {
      return NextResponse.json(
        { error: "Authorization token required" },
        { status: 401 },
      );
    }

    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 401 },
      );
    }

    // Attach user to request
    request.user = payload;

    return handler(request, context);
  };
}

/**
 * Middleware wrapper to check if user has a specific role
 * @param handler - The route handler function to wrap
 * @param allowedRoles - Array of roles that are allowed to access this route
 * @returns A wrapped handler that checks for valid JWT and role before executing
 */
export function withRole(
  handler: RouteHandler,
  allowedRoles: string[],
): RouteHandler {
  return async (request: AuthenticatedRequest, context?: any) => {
    const authHeader = request.headers.get("authorization");
    const token = extractTokenFromHeader(authHeader);

    if (!token) {
      return NextResponse.json(
        { error: "Authorization token required" },
        { status: 401 },
      );
    }

    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 401 },
      );
    }

    if (!allowedRoles.includes(payload.role)) {
      return NextResponse.json(
        { error: "Insufficient permissions" },
        { status: 403 },
      );
    }

    // Attach user to request
    request.user = payload;

    return handler(request, context);
  };
}

/**
 * Optional authentication - attaches user if token is valid, but doesn't require it
 * @param handler - The route handler function to wrap
 * @returns A wrapped handler that optionally attaches user info
 */
export function withOptionalAuth(handler: RouteHandler): RouteHandler {
  return async (request: AuthenticatedRequest, context?: any) => {
    const authHeader = request.headers.get("authorization");
    const token = extractTokenFromHeader(authHeader);

    if (token) {
      const payload = verifyToken(token);
      if (payload) {
        request.user = payload;
      }
    }

    return handler(request, context);
  };
}
