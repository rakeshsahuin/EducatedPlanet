import { requireRole } from "@/lib/auth-utils";
import { SubjectsTable } from "./_components/subjects-table";

export default async function SubjectsPage() {
  // Require admin role to access this page
  await requireRole("admin");

  return (
    <div className="flex flex-col gap-6">
      <SubjectsTable />
    </div>
  );
}