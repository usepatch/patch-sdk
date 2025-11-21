import { SignJWT } from 'jose';

interface PatchAuthHandlerOptions {
    secretKey: string;
    userId: string;
    organizationId: string;
    email: string;
    name: string;
    avatar_url?: string;
}

/**
 * Verifies JWT with Patch's endpoint (server-side only, no CORS issues)
 */
async function verifyJWT(organizationId: string, token: string): Promise<string> {
    const response = await fetch('https://elegant-starling-928.convex.site/verifyjwt', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ organizationId, token }),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '[PATCH]: JWT validation failed');
    }

    const data = await response.json();
    return data.sessionToken;
}

export async function PatchAuthHandler(
    request: Request,
    options: PatchAuthHandlerOptions
): Promise<Response> {
    try {
        const { secretKey, userId, organizationId, email, name, avatar_url } = options;
        
        if (!userId) {
            return new Response(
                JSON.stringify({ error: '[PATCH]: Missing userId. This can be any unique identifier you use to distinguish users.' }),
                {
                    status: 400,
                    headers: { 'Content-Type': 'application/json' },
                }
            );
        }

        if (!organizationId) {
            return new Response(
                JSON.stringify({ error: '[PATCH]: Missing organizationId. Please refer to https://docs.patch.bot/installation' }),
                {
                    status: 400,
                    headers: { 'Content-Type': 'application/json' },
                }
            );
        }

        if (!email) {
            return new Response(
                JSON.stringify({ error: '[PATCH]: Missing email. Please refer to https://docs.patch.bot/installation' }),
                {
                    status: 400,
                    headers: { 'Content-Type': 'application/json' },
                }
            );
        }

        if (!name) {
            return new Response(
                JSON.stringify({ error: '[PATCH]: Missing name. Please refer to https://docs.patch.bot/installation' }),
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
        
        // Verify JWT with Patch's endpoint (server-side, no CORS)
        const sessionToken = await verifyJWT(organizationId, jwt);
        
        // Return sessionToken directly - users don't need to know about JWT/verification
        return new Response(
            JSON.stringify({ sessionToken }),
            {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
            }
        );
    } catch (error: any) {
        return new Response(
            JSON.stringify({ error: error.message || '[PATCH]: Failed to generate session token' }),
            {
                status: 500,
                headers: { 'Content-Type': 'application/json' },
            }
        );
    }
}


