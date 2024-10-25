'use server'

import { db } from '@/db'
import { races } from '@/db/schema'
import { desc } from 'drizzle-orm'
import { Resend } from 'resend'
import { z } from 'zod'
import { config } from "dotenv";

config({ path: ".env.local" });

const resend = new Resend(process.env.RESEND_API_KEY!)

const formSchema = z.object({
  name: z.string().min(2),
  location: z.string().min(2),
  raceDate: z.string(),
  raceTime: z.string(),
  pixKey: z.string().min(1),
  pricePerPerson: z.number().min(0),
  maxParticipants: z.number().int().min(1),
  notificationEmails: z.array(z.string().email()),
})

export async function scheduleRace(formData: FormData) {
  const result = formSchema.safeParse({
    name: formData.get('name'),
    location: formData.get('location'),
    raceDate: formData.get('raceDate'),
    raceTime: formData.get('raceTime'),
    pixKey: formData.get('pixKey'),
    pricePerPerson: parseFloat(formData.get('pricePerPerson') as string),
    maxParticipants: parseInt(formData.get('maxParticipants') as string),
    notificationEmails: JSON.parse(formData.get('notificationEmails') as string),
  })

  if (!result.success) {
    return { error: 'Dados inválidos', details: result.error.flatten() }
  }

  const { name, location, raceDate, raceTime, pixKey, pricePerPerson, maxParticipants, notificationEmails } = result.data

  const raceDateTimeString = `${raceDate}T${raceTime}:00`
  const raceDateTime = new Date(raceDateTimeString)

  if (isNaN(raceDateTime.getTime())) {
    return { error: 'Data ou hora inválida' }
  }

  try {    
    const [data] = await db.insert(races).values({
      name,
      location,
      raceTime: raceDateTime,
      pixKey,
      pricePerPerson,
      maxParticipants,
      raceDate: raceDateTime,
      notificationEmails,
    }).returning()

    return { success: true, result: data }
  } catch (error) {
    console.error('Error scheduling race:', error)
    return { error: 'Falha ao agendar a corrida' }
  }
}

export async function sendRaceCreatedEmail(race: typeof races.$inferSelect) {
  const { notificationEmails, name, location, raceDate, raceTime } = race

  try {
    console.log(notificationEmails);
    await resend.emails.send({
      from: 'Copa Big Churras de Kart <noreply@copabigchurrasdekart.com>',
      to: notificationEmails as string[],
      subject: `Nova corrida agendada: ${name}`,
      html: `
        <h1>Nova corrida agendada</h1>
        <p>Uma nova corrida foi agendada:</p>
        <ul>
          <li>Nome: ${name}</li>
          <li>Local: ${location}</li>
          <li>Data: ${raceDate.toLocaleDateString()}</li>
          <li>Horário: ${raceTime.toLocaleTimeString()}</li>
        </ul>
      `,
    })
    console.log('Race created email sent successfully')
  } catch (error) {
    console.error('Error sending race created email:', error)
  }
}

export async function scheduleRaceReminderEmail(race: typeof races.$inferSelect) {
  const reminderDate = new Date(race.raceDate)
  reminderDate.setDate(reminderDate.getDate() - 1)

  const now = new Date()
  const delay = reminderDate.getTime() - now.getTime()

  if (delay > 0) {
    setTimeout(async () => {
      await sendRaceReminderEmail(race)
    }, delay)
  }
}

export async function sendRaceReminderEmail(race: typeof races.$inferSelect) {
  const { notificationEmails, name, location, raceDate, raceTime } = race

  try {
    await resend.emails.send({
      from: 'Copa Big Churras de Kart <noreply@copabigchurrasdekart.com>',
      to: notificationEmails as string[],
      subject: `Lembrete: corrida amanhã - ${name}`,
      html: `
        <h1>Lembrete de corrida</h1>
        <p>Não se esqueça da corrida amanhã:</p>
        <ul>
          <li>Nome: ${name}</li>
          <li>Local: ${location}</li>
          <li>Data: ${raceDate.toLocaleDateString()}</li>
          <li>Horário: ${raceTime.toLocaleTimeString()}</li>
        </ul>
      `,
    })
    console.log('Race reminder email sent successfully')
  } catch (error) {
    console.error('Error sending race reminder email:', error)
  }
}

export async function getRaces() {
  try {
    const allRaces = await db.select().from(races).orderBy(desc(races.raceDate))
    return { success: true, races: allRaces }
  } catch (error) {
    console.error('Error fetching races:', error)
    return { error: 'Falha ao buscar as corridas' }
  }
}