import { randomBytes } from 'crypto';

export const OAUTH_ERRORS = {
  'access_denied': 'User denied access to their Google account',
  'invalid_state': 'Security verification failed',
  'invalid_request': 'Invalid authentication request',
  'unauthorized_client': 'Application not authorized',
  'invalid_grant': 'Authentication code expired or already used',
  'server_error': 'Authentication server error',
  'temporarily_unavailable': 'Authentication service temporarily unavailable'
};

export function generateSessionToken() {
  return randomBytes(32).toString('hex');
}

export function validateSession(token) {
  // TODO: Implement session validation against database
  return true;
}

export function handleOAuthError(error) {
  return OAUTH_ERRORS[error] || 'An unknown authentication error occurred';
}

export function parseError(error) {
  const errorMessages = {
    'google_auth_failed': 'Google authentication failed',
    'no_code': 'No authorization code received',
    'auth_failed': 'Authentication failed',
    'invalid_session': 'Session is invalid or expired'
  };

  return errorMessages[error] || 'An unknown error occurred';
} 