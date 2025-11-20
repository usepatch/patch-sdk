export interface PatchMetadata {
    organization: string;
    plan: string;
}

export interface ApiKeyValidationResponse {
    valid: boolean,
    error: { message: string; code: string } | null;
    key: {
        metadata: PatchMetadata;
    } | null;
}


