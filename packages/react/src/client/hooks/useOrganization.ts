'use client'

import { useQuery } from "convex/react"
import { api } from "../../generated/api";
import { usePatchContext } from "../PatchClientProvider";

export function useOrganization() {
    const { sessionToken } = usePatchContext();
    return useQuery(
        api.sdk.useOrganization,
        sessionToken ? { sessionToken } : "skip"
    );
}


