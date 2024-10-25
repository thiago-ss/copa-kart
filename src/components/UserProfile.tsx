import { LogIn, User } from "lucide-react";
import { auth } from "../../auth";

export default async function UserProfile() {
  const session = await auth();

  if (!session) {
    return (
      <div className="flex items-center">
        <LogIn />
      </div>
    )
  }

  return (
    <div>
      <User />
      <span className="ml-2 text-sm font-medium text-gray-900">{session?.user?.name}</span>
    </div>
  )
}