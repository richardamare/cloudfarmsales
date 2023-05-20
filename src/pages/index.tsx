import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { Button } from "~/components/ui/button";

export default function Page() {
  const { query } = useRouter();

  const errorMessage = query.error as string | undefined;

  return (
    <>
      <Head>
        <title>Home</title>
        <meta name="description" content="Home" />
      </Head>
      <div className="flex h-screen flex-col items-center justify-center">
        <Button asChild>
          <Link href="/dashboard">Go to the dashboard</Link>
        </Button>
        {errorMessage && (
          <p className="mt-4 text-center text-red-500">{errorMessage}</p>
        )}
      </div>
    </>
  );
}
