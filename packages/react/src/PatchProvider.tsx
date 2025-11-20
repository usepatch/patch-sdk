'use client'

import { useState, useEffect, type ReactNode } from "react";
import { PatchClientProvider } from "./client/PatchClientProvider";

interface PatchProviderProps {
    children: ReactNode;
    authEndpoint?: string; // Optional: defaults to '/api/patch/auth'
}

/**
 * Verifies JWT and gets sessionToken from Patch.
 */
async function verifyJWT(organizationId: string, token: string): Promise<string> {
    const response = await fetch('https://elegant-starling-928.convex.site/verifyjwt', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ organizationId, token }),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'JWT validation failed');
    }

    const data = await response.json();
    return data.sessionToken;
}

/**
 * Unified PatchProvider that works in both server and client component contexts.
 * 
 * Automatically fetches JWT from your auth endpoint and handles verification.
 * No props needed - just wrap your app!
 * 
 * @example Next.js App Router
 * ```tsx
 * // app/layout.tsx
 * 'use client';
 * 
 * import { PatchProvider } from '@patch-sdk/react';
 * 
 * export default function Layout({ children }) {
 *   return (
 *     <PatchProvider>
 *       {children}
 *     </PatchProvider>
 *   );
 * }
 * ```
 * 
 * @example With custom endpoint
 * ```tsx
 * <PatchProvider authEndpoint="/custom/patch-auth">
 *   {children}
 * </PatchProvider>
 * ```
 * 
 * **Setup required (one-time):**
 * Create an API endpoint using `PatchAuthHandler`:
 * 
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
export function PatchProvider({ children, authEndpoint = '/api/patch/auth' }: PatchProviderProps) {
    const [sessionToken, setSessionToken] = useState<string | null>(null);
    const [error, setError] = useState<Error | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Fetch JWT from customer's auth endpoint
        fetch(authEndpoint, {
            method: 'POST',
            credentials: 'include', // Include auth cookies
        })
            .then(async (response) => {
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || 'Failed to get JWT');
                }
                return response.json();
            })
            .then(async ({ jwt, organizationId }) => {
                // Verify JWT and get sessionToken
                const token = await verifyJWT(organizationId, jwt);
                setSessionToken(token);
                setIsLoading(false);
            })
            .catch((err) => {
                setError(err);
                setIsLoading(false);
            });
    }, [authEndpoint]);

    if (error) {
        // Throw error to be caught by Error Boundary
        throw error;
    }

    if (isLoading || !sessionToken) {
        // Return null while loading - children can use Suspense for loading states
        return null;
    }

    return (
        <PatchClientProvider sessionToken={sessionToken}>
            {children}
        </PatchClientProvider>
    );
}


