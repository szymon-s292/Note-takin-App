import { NextAuthOptions, User } from "next-auth";

import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
// import GithubProvider from "next-auth/providers/github";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials) {
        if(!credentials || !credentials.email || !credentials.password)
          throw new Error("Email and password are required")

        const user: User = {id: ''}
        const response = await fetch('http://localhost/note-app/api/v2/login.php', {
            method: "POST",
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password
            })
          })

        if(response.ok)
        {
          const json = await response.json();

          if(json.status === 'success')
          {
            user.id = json.id
            user.email = json.email
            user.name = json.name
            return user
          }
          else
          {
            throw new Error("Invalid email or password")
          }
        }

        return null;
      }
    })
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },

    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },

  session: {
    strategy: "jwt", 
  },

  pages: {
    signIn: '/login',
  },
};