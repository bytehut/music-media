import { useRouter } from "next/router";
import { trpc } from "../../utils/trpc";
import { TRPCError } from "@trpc/server";
import { LoadingAnimation } from "../../components/loading";

const SpotifyCallback = () => {
  const router = useRouter();
  const { code, state } = router.query;
  if (
    code === undefined ||
    typeof code !== "string" ||
    state === undefined ||
    typeof state !== "string"
  ) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "code or state not a string",
    });
  }
  const { data, isLoading } = trpc.spotifyAuth.handleCallback.useQuery({
    code,
    state,
  });
  if (isLoading) return <LoadingAnimation />;
  if (!data) return <div>Something went wrong</div>;
  return (
    <main className="flex h-screen flex-col items-center">
      <div className="flex flex-col items-center justify-center gap-4">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-8">
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
            Spotify Callback!!
          </h1>
        </div>
      </div>
    </main>
  );
};

export default SpotifyCallback;
