import { NextAuthConfig, User } from 'next-auth';
import { AdapterUser } from 'next-auth/adapters';
import CredentialProvider from 'next-auth/providers/credentials';

// import { createSession } from './lib/session';

const API_URL = `${process.env.AUTH_SERVICE}`;

// Session durations
const SESSION_MAX_AGE_REMEMBER = 7 * 24 * 60 * 60; // 7 days when "Remember Me" checked
const SESSION_MAX_AGE_DEFAULT = 24 * 60 * 60; // 24 hours when "Remember Me" unchecked

const authConfig = {
  trustHost: true, // Important for production behind proxy
  secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt',
    maxAge: SESSION_MAX_AGE_REMEMBER // Max possible, actual expiry controlled in JWT callback
  },
  cookies: {
    sessionToken: {
      name:
        process.env.NODE_ENV === 'production'
          ? '__Secure-next-auth.session-token'
          : 'next-auth.session-token',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production'
      }
    }
  },
  providers: [
    CredentialProvider({
      id: 'credentials',
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
        rememberMe: { label: 'Remember Me', type: 'text' }
      },
      async authorize(credentials, req) {
        try {
          const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: credentials?.email,
              password: credentials?.password
            })
          });

          if (!response.ok) {
            return null;
          }

          const data = await response.json();

          if (data?.user && data?.token) {
            const rememberMe = credentials?.rememberMe === 'true';
            const sessionDuration = rememberMe
              ? SESSION_MAX_AGE_REMEMBER
              : SESSION_MAX_AGE_DEFAULT;

            // Store tokens, sessionId, and rememberMe preference in user object for JWT callback
            return {
              ...data.user,
              accessToken: data.token.accessToken,
              refreshToken: data.token.refreshToken,
              sessionId: data.sessionId, // Store Redis session ID for activity tracking
              tokenExpiry: Math.floor(Date.now() / 1000) + sessionDuration,
              rememberMe
            };
          }

          return null;
        } catch (error) {
          return null;
        }
      }
    })
  ],
  pages: {
    signIn: '/'
  },
  callbacks: {
    async jwt({ token, user, trigger }) {
      const now = Math.floor(Date.now() / 1000);

      // Initial sign in - store tokens
      if (user) {
        token.user = user;
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
        token.sessionId = user.sessionId; // Redis session ID for activity tracking
        token.tokenExpiry = user.tokenExpiry;
        token.rememberMe = user.rememberMe;
      }

      // Handle legacy sessions without accessToken
      if (!token.accessToken && token.user) {
        return null;
      }

      // Check if session has expired (based on rememberMe setting)
      const timeUntilExpiry = (token.tokenExpiry as number) - now;
      if (timeUntilExpiry <= 0) {
        // Session expired - force logout
        return null;
      }

      // Check if access token needs refresh (refresh 5 minutes before expiry)
      // Only refresh if we have more than 5 minutes left on session
      const shouldRefresh = timeUntilExpiry < 300 && timeUntilExpiry > 0;

      if (shouldRefresh && token.refreshToken) {
        try {
          const response = await fetch(`${API_URL}auth/refresh`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refreshToken: token.refreshToken })
          });

          if (response.ok) {
            const data = await response.json();
            // Keep original session expiry based on rememberMe, just refresh access token
            token.accessToken = data.token.accessToken;
            token.refreshToken = data.token.refreshToken;
            // Extend expiry based on rememberMe preference
            const sessionDuration = token.rememberMe
              ? SESSION_MAX_AGE_REMEMBER
              : SESSION_MAX_AGE_DEFAULT;
            token.tokenExpiry = Math.floor(Date.now() / 1000) + sessionDuration;
          } else {
            return null;
          }
        } catch (error) {
          return null;
        }
      } else if (shouldRefresh && !token.refreshToken) {
        return null;
      }

      return token;
    },
    async session({ session, token }) {
      session.user = token.user as AdapterUser & User;
      session.accessToken = token.accessToken as string;
      session.refreshToken = token.refreshToken as string;
      session.sessionId = token.sessionId as string; // Redis session ID for activity tracking
      session.tokenExpiry = token.tokenExpiry as number;
      session.rememberMe = token.rememberMe as boolean;

      return session;
    }
  }
  // debug: process.env.NODE_ENV === 'development'
} satisfies NextAuthConfig;

export default authConfig;
