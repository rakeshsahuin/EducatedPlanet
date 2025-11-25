import { requireRole } from "@/lib/auth-utils";
import { TutorsTable } from "./_components/tutors-table";

export default async function TutorsPage() {
  // Require admin role to access this page
  await requireRole("admin");

  return (
    <div className="flex flex-col gap-6">
      <TutorsTable />
    </div>
  );
}