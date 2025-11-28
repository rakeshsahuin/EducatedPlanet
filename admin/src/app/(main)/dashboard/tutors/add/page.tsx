import { requireRole } from "@/lib/auth-utils";
import { TutorForm } from "../_components/tutor-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default async function AddTutorPage() {
  // Require admin role to access this page
  await requireRole("admin");

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/tutors">
          <Button variant="outline" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Tutors
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-semibold">Add New Tutor</h1>
          <p className="text-muted-foreground">Create a new tutor profile</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tutor Information</CardTitle>
        </CardHeader>
        <CardContent>
          <TutorForm mode="create" />
        </CardContent>
      </Card>
    </div>
  );
}