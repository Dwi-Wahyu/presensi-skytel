import { auth } from "@/config/auth";
import { prisma } from "@/lib/prisma";
import UnauthorizedPage from "../_components/unauthorized-page";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { NavigationButton } from "../_components/navigation-button";

export default async function ProfilePage() {
  const session = await auth();

  if (!session) {
    return <UnauthorizedPage />;
  }

  const user_details = await prisma.user.findFirst({
    where: {
      id: session.user.id,
    },
  });

  if (!user_details) {
    return <UnauthorizedPage />;
  }

  return (
    <div className="flex justify-center items-center p-8 min-h-screen bg-gradient-to-t from-primary to-background">
      <Card className="w-full max-w-lg shadow-lg">
        <CardHeader className="flex flex-col items-center gap-4">
          <Avatar className="w-24 h-24">
            <AvatarImage
              src={
                user_details.avatar || "https://api.dicebear.com/7.x/shapes/svg"
              }
              alt={user_details.name}
            />
            <AvatarFallback>
              <User2 className="w-12 h-12" />
            </AvatarFallback>
          </Avatar>
          <div className="text-center">
            <CardTitle className="text-3xl font-bold">
              {user_details.name}
            </CardTitle>
            <CardDescription className="text-lg mb-3">
              @{user_details.username}
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 text-sm">
            <div className="p-4 border rounded-lg">
              <p className="font-semibold">Bergabung Sejak:</p>
              <p>{user_details.created_at.toLocaleDateString()}</p>
            </div>
            {user_details.last_login && (
              <div className="p-4 border rounded-lg">
                <p className="font-semibold">Terakhir Login:</p>
                <p>{user_details.last_login.toLocaleString()}</p>
              </div>
            )}
          </div>

          <div className="flex justify-center mt-4">
            <NavigationButton url="/home" size="lg" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
