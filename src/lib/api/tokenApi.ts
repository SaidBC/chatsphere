/**
 * API utilities for token management
 * This can be used by client applications to generate tokens programmatically
 */

/**
 * Generate a user token via API
 * @param name Token name
 * @param permissions Token permissions
 * @param expiresAt Optional expiration date
 * @param targetUserId Optional target user ID (admin only)
 */
export async function generateUserToken(
  name: string,
  permissions?: {
    read?: boolean;
    write?: boolean;
    delete?: boolean;
    rooms?: string[];
  },
  expiresAt?: string,
  targetUserId?: string
) {
  const response = await fetch('/api/tokens/generate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name,
      type: 'USER',
      permissions,
      expiresAt,
      targetUserId,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to generate token');
  }

  return response.json();
}

/**
 * Generate a client token via API (admin only)
 * @param name Token name
 * @param permissions Token permissions
 * @param expiresAt Optional expiration date
 * @param targetUserId Optional target user ID
 */
export async function generateClientToken(
  name: string,
  permissions?: {
    read?: boolean;
    write?: boolean;
    delete?: boolean;
    rooms?: string[];
  },
  expiresAt?: string,
  targetUserId?: string
) {
  const response = await fetch('/api/tokens/generate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name,
      type: 'CLIENT',
      permissions,
      expiresAt,
      targetUserId,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to generate token');
  }

  return response.json();
}

/**
 * Revoke a token
 * @param tokenId Token ID to revoke
 */
export async function revokeToken(tokenId: string) {
  const response = await fetch(`/api/tokens/${tokenId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      isRevoked: true,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to revoke token');
  }

  return response.json();
}

/**
 * Delete a token
 * @param tokenId Token ID to delete
 */
export async function deleteToken(tokenId: string) {
  const response = await fetch(`/api/tokens/${tokenId}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to delete token');
  }

  return response.json();
}
