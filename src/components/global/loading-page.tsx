import LoadingSpinner from "~/components/global/loading-spinner";

export default function LoadingPage() {
  return (
    <div className="flex h-screen items-center justify-center">
      <LoadingSpinner />
    </div>
  );
}
