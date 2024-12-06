import { currentUser } from "@clerk/nextjs/server";
import { LucideUser2 } from "lucide-react";

async function UserIcon() {
  const user = await currentUser();
  const profileImage = user?.imageUrl;

  if (profileImage) {
    return (
      // eslint-disable-next-line jsx-a11y/alt-text, @next/next/no-img-element
      <img src={profileImage} className="w-6 h-6 rounded-full object-cover" />
    );
  }
  return (
    <LucideUser2 className="rounded-full w-10 h-10 text-white bg-blue-500" />
  );
}

export default UserIcon;
