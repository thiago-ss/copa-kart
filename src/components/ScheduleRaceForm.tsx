'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useToast } from '@/hooks/use-toast'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { scheduleRace } from '@/app/actions/raceActions'
import { motion, AnimatePresence } from 'framer-motion'
import { Loader2 } from 'lucide-react'
import { Stepper } from './ui/stepper'

const formSchema = z.object({
  name: z.string().min(2, {
    message: "O nome da corrida deve ter pelo menos 2 caracteres.",
  }),
  location: z.string().min(2, {
    message: "O local deve ter pelo menos 2 caracteres.",
  }),
  raceDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Data inválida.",
  }),
  raceTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: "Formato de hora inválido. Use HH:MM.",
  }),
  pixKey: z.string().min(1, {
    message: "A chave PIX é obrigatória.",
  }),
  pricePerPerson: z.number().min(0, {
    message: "O preço por pessoa deve ser um número positivo.",
  }),
  maxParticipants: z.number().int().min(1, {
    message: "O número máximo de participantes deve ser pelo menos 1.",
  }),
  notificationEmails: z.array(z.string().email({
    message: "E-mail inválido.",
  })),
})

export function ScheduleRaceForm() {
  const [step, setStep] = useState(0)
  const [emails, setEmails] = useState<string[]>([])
  const [newEmail, setNewEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      location: "",
      raceDate: "",
      raceTime: "",
      pixKey: "",
      pricePerPerson: 0,
      maxParticipants: 1,
      notificationEmails: [],
    },
  })

  const steps = ["Detalhes da corrida", "Informações financeiras"]

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)
    const formData = new FormData()
    Object.entries(values).forEach(([key, value]) => {
      if (key === 'notificationEmails') {
        formData.append(key, JSON.stringify(value))
      } else {
        formData.append(key, value.toString())
      }
    })

    const result = await scheduleRace(formData)

    console.log(formData.get('notificationEmails'));


    setIsSubmitting(false)

    if (result.error) {
      toast({
        title: "Erro ao agendar a corrida",
        description: result.error,
        variant: "destructive",
      })
    } else {
      toast({
        title: "Corrida agendada com sucesso!",
        description: "Todos os participantes serão notificados por e-mail.",
      })
      router.refresh()
      form.reset()
      setEmails([])
      setStep(0)
    }
  }

  const addEmail = () => {
    if (newEmail && !emails.includes(newEmail)) {
      setEmails([...emails, newEmail])
      form.setValue('notificationEmails', [...emails, newEmail])
      setNewEmail('')
    }
  }

  const removeEmail = (email: string) => {
    const updatedEmails = emails.filter(e => e !== email)
    setEmails(updatedEmails)
    form.setValue('notificationEmails', updatedEmails)
  }

  const nextStep = () => {
    if (step === 0) {
      form.trigger(['name', 'location', 'raceDate', 'raceTime']).then((isValid) => {
        if (isValid) setStep(1)
      })
    }
  }

  const prevStep = () => {
    if (step === 1) setStep(0)
  }

  return (
    <div className='flex justify-center items-center min-h-[90vh] mx-10'>
      <Card className="w-full mx-auto">
        <CardHeader>
          <CardTitle>Agendar nova corrida</CardTitle>
          <CardDescription>Preencha os detalhes para agendar uma nova corrida.</CardDescription>
        </CardHeader>
        <CardContent>
          <Stepper steps={steps} activeStep={step} />
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <AnimatePresence mode="wait">
                {step === 0 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nome da corrida</FormLabel>
                          <FormControl>
                            <Input placeholder="Grande Prêmio de Kart" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="location"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Local</FormLabel>
                          <FormControl>
                            <Input placeholder="Kartódromo Internacional" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="raceDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Data da corrida</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="raceTime"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Horário da corrida</FormLabel>
                          <FormControl>
                            <Input type="time" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </motion.div>
                )}
                {step === 1 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <FormField
                      control={form.control}
                      name="pixKey"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Chave PIX</FormLabel>
                          <FormControl>
                            <Input placeholder="Sua chave PIX" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="pricePerPerson"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Valor por pessoa</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="maxParticipants"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Número máximo de participantes</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value))} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="notificationEmails"
                      render={() => (
                        <FormItem>
                          <FormLabel>E-mails para notificação</FormLabel>
                          <FormControl>
                            <div className="flex space-x-2">
                              <Input
                                type="email"
                                value={newEmail}
                                onChange={(e) => setNewEmail(e.target.value)}
                                placeholder="exemplo@email.com"
                              />
                              <Button type="button" onClick={addEmail}>Adicionar</Button>
                            </div>
                          </FormControl>
                          <FormDescription>
                            Adicione os e-mails que receberão notificações sobre esta corrida.
                          </FormDescription>
                          <FormMessage />
                          {emails.length > 0 && (
                            <ul className="space-y-2 flex gap-2 items-center justify-center">
                              {emails.map((email) => (
                                <li key={email} className="flex justify-between min-w-6xl gap-4 bg-secondary items-center p-2 rounded-md">
                                  <span>{email}</span>
                                  <Button variant="ghost" size="sm" onClick={() => removeEmail(email)}>Remover</Button>
                                </li>
                              ))}
                            </ul>
                          )}
                        </FormItem>
                      )}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-between">
          {step === 1 && (
            <Button onClick={prevStep} variant="outline">
              Voltar
            </Button>
          )}
          {step === 0 ? (
            <Button onClick={nextStep} className="ml-auto">
              Próximo
            </Button>
          ) : (
            <Button onClick={form.handleSubmit(onSubmit)} disabled={isSubmitting} className="ml-auto">
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Agendando...
                </>
              ) : (
                'Agendar corrida'
              )}
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>

  )
}