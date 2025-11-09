import { requireRole } from "@/lib/auth-utils";
import { ClassesTable } from "./_components/classes-table";

export default async function ClassesPage() {
  // Require admin role to access this page
  await requireRole("admin");

  return (
    <div className="flex flex-col gap-6">
      <ClassesTable />
    </div>
  );
}