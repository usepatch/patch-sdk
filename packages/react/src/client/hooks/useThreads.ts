'use client'

import { useQuery } from "convex/react"
import { api } from "../../generated/api";
import { usePatchContext } from "../PatchClientProvider";

export function useThreads() {
    const { sessionToken } = usePatchContext();

    return useQuery(api.sdk.useThreads, { sessionToken });
}


