import RaceList from '@/components/layout/RaceList'
import Loading from '@/components/loading'
import { Suspense } from 'react'
import { auth } from '../../auth'

export default async function HomePage() {
  const session = await auth();

  if (!session) {
    return (
      <div className="flex items-center justify-center mt-10">
        <p>Você precisa estar autenticado para visualizar essa página.</p>
      </div>
    )
  }

  return (
    <Suspense fallback={<Loading gifSrc="/loading.gif" />}>
      <main className="container mx-auto px-4 py-8">
        <RaceList />
      </main>
    </Suspense>
  )
}