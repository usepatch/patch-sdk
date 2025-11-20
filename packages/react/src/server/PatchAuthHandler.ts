import { SignJWT } from 'jose';

interface PatchAuthHandlerOptions {
    secretKey: string;
    userId: string;
    organizationId: string;
    email: string;
    name: string;
    avatar_url: string;
}

/**
 * Creates a request handler for generating Patch JWTs.
 * 
 * Uses Web API standard (Request/Response) and works with any framework that supports
 * standard Request/Response objects: Next.js, Nuxt, SvelteKit, Remix, Solid-Start,
 * Tanstack Start, Hono, Elysia, etc.
 * 
 * @example Next.js App Router
 * ```tsx
 * // app/api/patch/auth/route.ts
 * import { PatchAuthHandler } from '@patch-sdk/react';
 * import { getAuthenticatedUser, getActiveOrganization } from '@/lib/auth';
 * 
 * export const POST = async (request: Request) => {
 *   const user = await getAuthenticatedUser(request);
 *   const org = await getActiveOrganization(request);
 *   
 *   return PatchAuthHandler(request, {
 *     secretKey: process.env.PATCH_SECRET_KEY,
 *     userId: user.id,
 *     organizationId: org.id,
 *     email: user.email,
 *     name: user.name,
 *     avatar_url: user.avatar,
 *   });
 * };
 * ```
 */
export async function PatchAuthHandler(
    request: Request,
    options: PatchAuthHandlerOptions
): Promise<Response> {
    try {
        const { secretKey, userId, organizationId, email, name, avatar_url } = options;
        
        if (!userId || !organizationId || !email || !name || !avatar_url) {
            return new Response(
                JSON.stringify({ error: 'userId, organizationId, email, name, and avatar_url are required' }),
                {
                    status: 400,
                    headers: { 'Content-Type': 'application/json' },
                }
            );
        }
        
        // Generate JWT
        const jwt = await new SignJWT({
            userId,
            organizationId,
            email,
            name,
            avatar_url,
        })
            .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
            .setIssuedAt()
            .setExpirationTime('15m')
            .sign(new TextEncoder().encode(secretKey));
        
        return new Response(
            JSON.stringify({ jwt, organizationId }),
            {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
            }
        );
    } catch (error: any) {
        return new Response(
            JSON.stringify({ error: error.message || 'Failed to generate JWT' }),
            {
                status: 500,
                headers: { 'Content-Type': 'application/json' },
            }
        );
    }
}


