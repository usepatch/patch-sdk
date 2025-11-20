'use client'

import { useQuery } from "convex/react"
import { api } from "../../generated/api";
import { usePatchContext } from "../PatchClientProvider";

export function useMessages(threadId: any) {
    const { sessionToken } = usePatchContext();

    return useQuery(
        api.sdk.useMessages, 
        threadId ? { sessionToken, threadId } : "skip"
    );
}


