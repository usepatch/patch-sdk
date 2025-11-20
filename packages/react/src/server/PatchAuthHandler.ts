import { SignJWT } from 'jose';

interface PatchAuthHandlerOptions {
    secretKey: string;
    userId: string;
    organizationId: string;
    email: string;
    name: string;
    avatar_url?: string;
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
        
        return new Response(
            JSON.stringify({ jwt, organizationId }),
            {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
            }
        );
    } catch (error: any) {
        return new Response(
            JSON.stringify({ error: error.message || '[PATCH]: Failed to generate JWT' }),
            {
                status: 500,
                headers: { 'Content-Type': 'application/json' },
            }
        );
    }
}


