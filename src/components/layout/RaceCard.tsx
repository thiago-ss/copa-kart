'use client'

import React from 'react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Calendar, Clock, Users, DollarSign } from 'lucide-react'
import { motion } from 'framer-motion'
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogSubtitle, DialogClose, DialogContainer } from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'
import BlurFade from '../ui/blur-fade'

type RaceProps = {
  id: number
  name: string
  location: string
  raceDate: Date
  raceTime: Date
  pricePerPerson: number
  maxParticipants: number
}

export default function RaceCard({ race }: { race: RaceProps }) {
  return (
    <BlurFade>
      <Dialog>
        <DialogTrigger className="w-full">
          <motion.div
            className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300"
            whileHover={{ scale: 1.02 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-900">{race.name}</h3>
              <p className="text-sm text-gray-600 mt-1">{race.location}</p>
              <div className="mt-2 flex items-center text-sm text-gray-500">
                <Calendar className="mr-2 h-4 w-4" />
                {format(new Date(race.raceDate), "dd 'de' MMMM", { locale: ptBR })}
              </div>
            </div>
            <div className="bg-gradient-to-r from-red-500 to-red-600 px-4 py-2 text-white text-sm font-medium">
              Ver detalhes
            </div>
          </motion.div>
        </DialogTrigger>
        <DialogContainer>
          <DialogContent className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <ScrollArea className="h-[80vh]">
              <div className="p-6">
                <DialogTitle className="text-2xl font-bold text-gray-900 mb-2">
                  {race.name}
                </DialogTitle>
                <DialogSubtitle className="text-lg text-gray-600 mb-4">
                  {race.location}
                </DialogSubtitle>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <Calendar className="text-red-500 mr-2" />
                    <span>{format(new Date(race.raceDate), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="text-red-500 mr-2" />
                    <span>{format(new Date(race.raceTime), 'HH:mm')}</span>
                  </div>
                  <div className="flex items-center">
                    <Users className="text-red-500 mr-2" />
                    <span>Máximo de {race.maxParticipants} participantes</span>
                  </div>
                  <div className="flex items-center">
                    <DollarSign className="text-red-500 mr-2" />
                    <span>R$ {race.pricePerPerson.toFixed(2)} por pessoa</span>
                  </div>
                </div>
                <Button className="w-full mt-6 bg-red-500 hover:bg-red-600 text-white">
                  Inscrever-se
                </Button>
              </div>
            </ScrollArea>
            <DialogClose className="absolute right-4 top-4 text-gray-400 hover:text-gray-600" />
          </DialogContent>
        </DialogContainer>
      </Dialog>
    </BlurFade>
  )
}