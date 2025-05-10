export interface SessionData {
  access_token: string;
  refresh_token?: string;
  expires_at?: string;
  expires_in?: number;
  token_type?: string;
}

export interface AuthData {
  code?: string;
}
