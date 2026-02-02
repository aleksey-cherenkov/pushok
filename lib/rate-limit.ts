// Simple in-memory rate limiter for AI endpoints
// Resets on server restart, good enough for demo protection

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const rateLimitMap = new Map<string, RateLimitEntry>();

// Clean up old entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [ip, entry] of rateLimitMap.entries()) {
    if (now > entry.resetAt) {
      rateLimitMap.delete(ip);
    }
  }
}, 5 * 60 * 1000);

export interface RateLimitResult {
  success: boolean;
  remaining: number;
  resetAt: number;
  message?: string;
}

/**
 * Check if request is within rate limit
 * @param ip - Client IP address
 * @param limit - Max requests per hour (default: 100)
 * @returns RateLimitResult
 */
export function checkRateLimit(ip: string, limit: number = 100): RateLimitResult {
  const now = Date.now();
  const oneHour = 60 * 60 * 1000;

  const entry = rateLimitMap.get(ip);

  // No entry or expired - create new
  if (!entry || now > entry.resetAt) {
    const newEntry: RateLimitEntry = {
      count: 1,
      resetAt: now + oneHour,
    };
    rateLimitMap.set(ip, newEntry);

    return {
      success: true,
      remaining: limit - 1,
      resetAt: newEntry.resetAt,
    };
  }

  // Within limit - increment
  if (entry.count < limit) {
    entry.count++;
    rateLimitMap.set(ip, entry);

    return {
      success: true,
      remaining: limit - entry.count,
      resetAt: entry.resetAt,
    };
  }

  // Exceeded limit
  const minutesUntilReset = Math.ceil((entry.resetAt - now) / (60 * 1000));
  return {
    success: false,
    remaining: 0,
    resetAt: entry.resetAt,
    message: `Rate limit exceeded. You've made ${limit} AI requests in the past hour. Please try again in ${minutesUntilReset} minute${minutesUntilReset === 1 ? '' : 's'}.`,
  };
}

/**
 * Get client IP from request headers
 * Handles various proxy headers (Azure Static Web Apps, Cloudflare, etc.)
 */
export function getClientIP(request: Request): string {
  // Azure Static Web Apps
  const azureClientIP = request.headers.get('x-ms-client-principal-id') 
    || request.headers.get('x-forwarded-for');
  
  // Cloudflare
  const cfConnectingIP = request.headers.get('cf-connecting-ip');
  
  // General proxy
  const xRealIP = request.headers.get('x-real-ip');
  const xForwardedFor = request.headers.get('x-forwarded-for');

  // Use first available IP
  const ip = cfConnectingIP 
    || xRealIP 
    || azureClientIP 
    || xForwardedFor?.split(',')[0] 
    || 'unknown';

  return ip.trim();
}
