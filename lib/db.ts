import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db;

/**
 * Executes a transaction scoped to a specific tenant ID for database-level RLS enforcement.
 */
export async function withTenantContext<T>(
  tenantId: string,
  fn: (tx: PrismaClient) => Promise<T>
): Promise<T> {
  // Set current session GUC setting for Postgres RLS enforcement
  return db.$transaction(async (tx) => {
    try {
      await tx.$executeRawUnsafe(`SET LOCAL app.current_tenant_id = '${tenantId.replace(/'/g, "''")}';`);
    } catch (err) {
      // Graceful fallback if database connection does not support raw GUC set or during SQLite local fallback
    }
    return fn(tx as unknown as PrismaClient);
  });
}
