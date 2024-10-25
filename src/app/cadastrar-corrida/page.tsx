import { ScheduleRaceForm } from "@/components/ScheduleRaceForm";
import { auth } from "../../../auth";

export default async function CreateRacePage() {
  const session = await auth();

  if (!session) {
    return (
      <div className="flex items-center justify-center mt-10">
        <p>Você precisa estar autenticado para visualizar essa página.</p>
      </div>
    )
  }

  return (
    <ScheduleRaceForm />
  )
}