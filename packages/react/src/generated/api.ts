import { anyApi } from "convex/server";
import type { FunctionReference } from "convex/server";

export type Thread = {
    _id: string;
    _creationTime: number;
    userId: string;
    organizationId: string;
    status: string;
    lastMessage: {
      content: string;
      contentType: string;
      userName: string;
      userAvatar: string | null;
      createdAt: number;
    } | null;
  };
  
export type Message = {
    _id: string;
    _creationTime: number;
    threadId: string;
    userName: string;
    userEmail: string;
    avatar_url: string | null;
    userType: "user" | "agent";
    content: string;
    contentType: "text" | "file";
    fileUrl?: string | null;
  };
  
export type Organization = {
    name: string;
    slug: string;
    logo: string | null;
    members: Array<{
      name: string | null;
      image: string | null;
    }>;
  };

  export const api = anyApi as any as {
    sdk: {
        useThreads: FunctionReference<"query", "public", { sessionToken: string }, Thread[] | null>;
        useMessages: FunctionReference<"query", "public", { sessionToken: string; threadId: string }, Message[] | null>;
        useOrganization: FunctionReference<"query", "public", { sessionToken: string }, Organization | null>;
        sendMessage: FunctionReference<"action", "public", { sessionToken: string; threadId?: string; content: string; contentType: "text" | "file"; userType: "user" | "agent" }, string>;
        generateUploadUrl: FunctionReference<"mutation", "public", { sessionToken: string }, string>;
    };
};


