// ============================================================================
// PATCH SDK - Main Entry Point
// ============================================================================
// This file exports all Patch SDK functionality.
// 
// IMPORT PATTERNS:
// - Client components: import { PatchProvider, useThreads, ... } from '@patch-sdk/react'
// - Server components: import { PatchAuthHandler } from '@patch-sdk/react'
// ============================================================================

// ----------------------------------------------------------------------------
// CLIENT EXPORTS
// ----------------------------------------------------------------------------
// These are safe to use in client components (React components that run in the browser)

// Main provider component - automatically fetches JWT and handles authentication
export { PatchProvider } from "./src/PatchProvider";

// Client infrastructure
export * from "./src/client/PatchClient"
export * from "./src/client/PatchClientProvider"

// Hooks
export * from "./src/client/hooks/useThreads"
export * from "./src/client/hooks/useMessages"
export * from "./src/client/hooks/useOrganization"
export * from "./src/client/hooks/useSendMessage"

// ----------------------------------------------------------------------------
// SERVER EXPORTS
// ----------------------------------------------------------------------------
// These should only be used in server-side code (API routes, server components, etc.)

// Server-side auth handler - generates JWTs for Patch authentication
// Use this in your API route: /api/patch/auth
export { PatchAuthHandler } from "./src/server/PatchAuthHandler"

// Types
export * from "./src/types"


