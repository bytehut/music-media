import { protectedProcedure, publicProcedure, router } from "../trpc";
import crypto from "crypto";
import { TRPCError } from "@trpc/server";

function generateCodeVerifier() {
  // Generate random bytes
  const buffer = crypto.randomBytes(32);

  // Convert to base64 representation
  const code = buffer
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");

  return code;
}

// Generate code challenge from verifier
function generateCodeChallenge(verifier: string) {
  const hash = crypto.createHash("sha256");
  hash.update(verifier);
  // Digest hash to get bytes
  const bytes = hash.digest();

  // Base64 URL encode bytes
  const challenge = bytes
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");

  return challenge;
}

export const spotifyAuthRouter = router({
  getAuthUrl: publicProcedure.query(({ ctx }) => {
    const verifier = generateCodeVerifier();
    const challenge = generateCodeChallenge(verifier);
    if (
      ctx.env.SPOTIFY_CLIENT_ID === undefined ||
      ctx.env.SPOTIFY_REDIRECT_URI === undefined
    ) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "missing env vars",
      });
    }
    const args = new URLSearchParams({
      response_type: "code",
      client_id: ctx.env.SPOTIFY_CLIENT_ID,
      scope: "user-read-private",
      redirect_uri: ctx.env.SPOTIFY_REDIRECT_URI,
      state: "state",
      code_challenge_method: "S256",
      code_challenge: challenge,
    });
    const authUrlString = `https://accounts.spotify.com/authorize?${args.toString()}`;
    const authUrl = new URL(authUrlString);
    return authUrl;
  }),
  getSecretMessage: protectedProcedure.query(() => {
    return "you can see this secret message!";
  }),
});
