'use client'

import { ConvexProvider } from "convex/react"
import type { ReactNode } from "react"
import { PatchClient } from "./PatchClient"
import { createContext, useContext, useMemo } from "react";

interface PatchClientProviderProps {
    children: ReactNode;
    sessionToken: string | null;
}

interface PatchContextValue {
    sessionToken: string | null;
}

const PatchContext = createContext<PatchContextValue | null>(null);

export function PatchClientProvider({ children, sessionToken }: PatchClientProviderProps) {
    const contextValue = useMemo(() => ({ sessionToken }), [sessionToken]);
    
    return (
        <PatchContext.Provider value={contextValue}>
            <ConvexProvider client={PatchClient}>
                {children}
            </ConvexProvider>
        </PatchContext.Provider>
    );
}

export function usePatchContext() {
    const context = useContext(PatchContext);
    if (!context) {
        throw new Error('[PATCH]: Missing <PatchProvider>. Please refer to https://docs.patch.bot/installation');
    }
    return context;
}


