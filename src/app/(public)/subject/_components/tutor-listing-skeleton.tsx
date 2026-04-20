import { Skeleton } from "@/components/ui/skeleton";

/**
 * Fallback rendered inside the Suspense boundary that wraps <TutorListing>.
 * Matches the 3-column grid + sidebar layout so the visual shift after
 * hydration is minimal.
 */
export function TutorListingSkeleton() {
  return (
    <div className="flex flex-col gap-6 lg:flex-row lg:gap-8">
      <div className="hidden lg:block lg:w-72 lg:shrink-0">
        <Skeleton className="h-[560px] rounded-2xl" />
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-4">
        <Skeleton className="h-16 rounded-xl" />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-[420px] rounded-2xl" />
          ))}
        </div>
      </div>
    </div>
  );
}
