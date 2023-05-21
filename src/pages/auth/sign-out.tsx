import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/router";
import { useEffect } from "react";
import toast from "react-hot-toast";

export default function Page() {
  const { signOut } = useAuth();
  const router = useRouter();

  useEffect(() => {
    signOut()
      .then(() => {
        router.push("/").catch(toast.error);
      })
      .catch(toast.error);
  }, [signOut, router]);

  return (
    <>
      <p>Signing out...</p>
    </>
  );
}
