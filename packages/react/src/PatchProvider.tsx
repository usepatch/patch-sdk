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
        throw new Error(errorData.error || '[PATCH]: JWT validation failed');
    }

    const data = await response.json();
    return data.sessionToken;
}

export function PatchProvider({ children, authEndpoint = '/api/patch/auth' }: PatchProviderProps) {
    const [sessionToken, setSessionToken] = useState<string | null>(null);
    const [error, setError] = useState<Error | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isMounted, setIsMounted] = useState(false);

    // Ensure we're on the client before fetching
    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        // Only fetch when mounted (client-side only)
        if (!isMounted) return;

        fetch(authEndpoint, {
            method: 'POST',
            credentials: 'include', // Include auth cookies
        })
            .then(async (response) => {
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || '[PATCH]: Failed to get JWT');
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
    }, [authEndpoint, isMounted]);

    if (error) {
        // Throw error to be caught by Error Boundary
        throw error;
    }

    if (!isMounted || isLoading || !sessionToken) {
        // Return null while loading - children can use Suspense for loading states
        return null;
    }

    return (
        <PatchClientProvider sessionToken={sessionToken}>
            {children}
        </PatchClientProvider>
    );
}