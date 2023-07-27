import type { NextPage } from "next";
import Head from "next/head";
import { trpc } from "../utils/trpc";
import type { inferProcedureOutput } from "@trpc/server";
import type { AppRouter } from "@acme/api";
import { useAuth, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { useRouter } from "next/router";

const PostCard: React.FC<{
  post: inferProcedureOutput<AppRouter["post"]["all"]>[number];
}> = ({ post }) => {
  return (
    <div className="border-navy max-w-2xl rounded-lg border-2 p-4 transition-all hover:scale-[101%]">
      <h2 className="text-lilac text-2xl font-bold">{post.authorUsername}</h2>
      <p>{post.content}</p>
    </div>
  );
};

const Home: NextPage = () => {
  const postQuery = trpc.post.all.useQuery();

  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex h-screen justify-center">
        <div className="border-red h-full w-full border-x md:max-w-2xl">
          {/* <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
            Create <span className="text-lilac">T3</span> Turbo
          </h1> */}
          <SpotifyAuth />
          <AuthShowcase />

          <div className="flex h-[60vh] justify-center overflow-y-scroll px-4 text-2xl">
            {postQuery.data ? (
              <div className="flex flex-col gap-4">
                {postQuery.data?.map((p) => {
                  return <PostCard key={p.id} post={p} />;
                })}
              </div>
            ) : (
              <p>Loading..</p>
            )}
          </div>
        </div>
      </main>
    </>
  );
};

export default Home;

const SpotifyAuth: React.FC = () => {
  const router = useRouter();
  // fetch authorize URL
  const { data: authUrl } = trpc.spotifyAuth.getAuthUrl.useQuery();

  return (
    <button
      onClick={() => {
        if (authUrl !== undefined) {
          router.push(authUrl);
        }
      }}
    >
      Login with Spotify
    </button>
  );
};

const AuthShowcase: React.FC = () => {
  const { isSignedIn } = useAuth();
  const { data: secretMessage } = trpc.auth.getSecretMessage.useQuery(
    undefined,
    { enabled: !!isSignedIn },
  );

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      {isSignedIn && (
        <>
          <p className="text-offwhite text-center text-2xl">
            {secretMessage && (
              <span>
                {" "}
                {secretMessage} click the user button!
                <br />
              </span>
            )}
          </p>
          <div className="flex items-center justify-center">
            <UserButton
              appearance={{
                elements: {
                  userButtonAvatarBox: {
                    width: "3rem",
                    height: "3rem",
                  },
                },
              }}
            />
          </div>
        </>
      )}
      {!isSignedIn && (
        <p className="text-offwhite text-center text-2xl">
          <Link href="/sign-in">Sign In</Link>
        </p>
      )}
    </div>
  );
};
