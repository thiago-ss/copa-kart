import { Skeleton } from "@/components/ui/skeleton"
import BlurFade from '@/components/ui/blur-fade'

export default function RaceListSkeleton() {
  return (
    <div className="container mx-auto p-4 space-y-8">
      <BlurFade delay={0.2} className='flex justify-between items-center'>
        <div className="relative w-full max-w-md">
          <Skeleton className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 rounded-full" />
          <Skeleton className="w-full h-10 rounded-md" />
        </div>
        <Skeleton className="w-40 h-10 rounded-md" />
      </BlurFade>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, index) => (
          <BlurFade key={index} delay={0.1 * index}>
            <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <div className="flex justify-between items-center">
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-4 w-1/4" />
              </div>
              <Skeleton className="h-10 w-full" />
            </div>
          </BlurFade>
        ))}
      </div>
    </div>
  )
}