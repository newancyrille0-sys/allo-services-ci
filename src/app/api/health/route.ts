import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

// Application version (can be read from package.json in production)
const APP_VERSION = '1.0.0';

export async function GET() {
  const startTime = Date.now();
  const checks: Record<string, { status: 'ok' | 'error'; latency?: number; message?: string }> = {};

  try {
    // Check database connectivity
    const dbStart = Date.now();
    await db.$queryRaw`SELECT 1`;
    const dbLatency = Date.now() - dbStart;
    checks.database = {
      status: 'ok',
      latency: dbLatency,
    };
  } catch (error) {
    checks.database = {
      status: 'error',
      message: error instanceof Error ? error.message : 'Database connection failed',
    };
  }

  // Overall status
  const allHealthy = Object.values(checks).every((check) => check.status === 'ok');
  const totalLatency = Date.now() - startTime;

  const response = {
    status: allHealthy ? 'healthy' : 'unhealthy',
    version: APP_VERSION,
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    latency: totalLatency,
    checks,
    environment: process.env.NODE_ENV,
  };

  return NextResponse.json(response, {
    status: allHealthy ? 200 : 503,
    headers: {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
    },
  });
}
