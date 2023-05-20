import Head from "next/head";
import Link from "next/link";
import { Button } from "~/components/ui/button";

export default function Page() {
  return (
    <>
      <Head>
        <title>Home</title>
        <meta name="description" content="Home" />
      </Head>
      <div className="flex h-screen items-center justify-center">
        <Button asChild>
          <Link href="/dashboard">Go to the dashboard</Link>
        </Button>
      </div>
    </>
  );
}
