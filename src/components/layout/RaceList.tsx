'use client'

import { useState } from 'react'
import { Search } from 'lucide-react'
import { Input } from "@/components/ui/input"
import BlurFade from '@/components/ui/blur-fade'
import RaceCard from './RaceCard'
import { getRaces } from '@/app/actions/raceActions'
import { useQuery } from '@tanstack/react-query'
import RaceListSkeleton from './RaceListSkeleton'
import { Button } from '../ui/button'
import Link from 'next/link'

export default function RaceList() {
  const [searchTerm, setSearchTerm] = useState('')
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["races"],
    queryFn: getRaces,
  })

  const filteredRaces = data?.races?.filter(race =>
    race.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    race.location.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (isLoading) {
    return (
      <RaceListSkeleton />
    )
  }

  if (isError) {
    return (
      <div>
        <p>Ocorreu um erro ao carregar as corridas. {error.message}</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4 space-y-8">
      <BlurFade delay={0.2} className='flex justify-between items-center'>
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Buscar corridas..."
            className="pl-10 pr-4 py-2 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Link href="/cadastrar-corrida" prefetch>
          <Button>Cadastrar corrida</Button>
        </Link>
      </BlurFade>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRaces?.map((race, index) => (
          <BlurFade key={race.id} delay={0.1 * index}>
            <RaceCard race={race} />
          </BlurFade>
        ))}
      </div>
      {filteredRaces?.length === 0 && (
        <BlurFade>
          <p className="text-center text-muted-foreground">Nenhuma corrida encontrada.</p>
        </BlurFade>
      )}
    </div>
  )
}