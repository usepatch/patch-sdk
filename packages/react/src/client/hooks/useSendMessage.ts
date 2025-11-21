'use client'

import { PatchClient } from "../PatchClient";
import { api } from "../../generated/api";
import { usePatchContext } from "../PatchClientProvider";

/**
 * Hook for sending messages in Patch threads.
 * 
 * @returns A function that can be called to send a message
 * 
 * @example
 * ```tsx
 * const send = useSendMessage();
 * 
 * await send({
 *   threadId: 'thread123',
 *   content: 'Hello!',
 *   userType: 'user'
 * });
 * ```
 */
export function useSendMessage() {
    const { sessionToken } = usePatchContext();

    return async (params: {
        threadId?: any;
        content?: string;
        file?: File;
        userType?: "user" | "agent";
    }) => {
        if (!sessionToken) {
            throw new Error('[PATCH]: Session token not available. Please wait for authentication to complete.');
        }

        let finalContent: string | any;
        let contentType: "text" | "file";

        if (params.file) {
            const uploadUrl = await PatchClient.mutation(api.sdk.generateUploadUrl, {
                sessionToken
            });

            const result = await fetch(uploadUrl, {
                method: "POST",
                headers: { "Content-Type": params.file.type },
                body: params.file,
            });

            const { storageId } = await result.json();
            finalContent = storageId;
            contentType = "file";
        } else {
            finalContent = params.content || "";
            contentType = "text"
        }

        return await PatchClient.mutation(api.sdk.sendMessage, {
            sessionToken,
            threadId: params.threadId,
            content: finalContent,
            contentType,
            userType: params.userType || "user"
        });
    };
}


