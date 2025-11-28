import { requireRole } from "@/lib/auth-utils";
import { TutorForm } from "../../_components/tutor-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

// Server component to fetch tutor data
async function getTutor(tutorId: string) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001';
    const response = await fetch(`${baseUrl}/api/admin/tutors/${tutorId}`, {
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        notFound();
      }
      throw new Error('Failed to fetch tutor');
    }

    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error('Error fetching tutor:', error);
    throw new Error('Failed to fetch tutor data');
  }
}

export default async function EditTutorPage({
  params,
}: {
  params: { tutorId: string };
}) {
  // Require admin role to access this page
  await requireRole("admin");

  let tutorData;
  try {
    tutorData = await getTutor(params.tutorId);
  } catch (error) {
    notFound();
  }

  // Transform the data to match the form structure
  const transformedData = {
    userId: tutorData.userId || "",
    name: tutorData.approved?.basicInfo?.name || "",
    email: tutorData.approved?.contact?.email || "",
    phone: tutorData.approved?.contact?.phone || "",
    title: tutorData.approved?.basicInfo?.title || "",
    shortDescription: tutorData.approved?.basicInfo?.shortDescription || "",
    longDescription: tutorData.approved?.basicInfo?.longDescription || "",
    subjects: tutorData.approved?.teaching?.subjects || [],
    classes: tutorData.approved?.teaching?.classes || [],
    teachingModes: tutorData.approved?.teaching?.teachingModes || ["offline"],
    location: {
      address: {
        locality: tutorData.approved?.location?.areas?.[0] || "",
        city: tutorData.approved?.location?.city || "",
        state: "",
        coordinates: { lat: 0, lng: 0 },
      },
      availabilityRange: {
        value: 5,
        unit: "km",
      },
      city: tutorData.approved?.location?.city || "",
      areas: tutorData.approved?.location?.areas || [],
    },
    pricing: {
      oneToOne: {
        hourlyRate: tutorData.approved?.pricing?.oneToOne?.hourlyRate || 0,
      },
      group: {
        hourlyRate: tutorData.approved?.pricing?.group?.hourlyRate || 0,
        maxStudents: tutorData.approved?.pricing?.group?.maxStudents || 0,
      },
      online: {
        hourlyRate: tutorData.approved?.pricing?.online?.hourlyRate || 0,
      },
    },
    education: tutorData.approved?.education || [],
    experience: tutorData.approved?.experience || 0,
    certifications: tutorData.approved?.certifications || [],
    languages: tutorData.approved?.languages || [],
    availability: {
      weekdays: tutorData.approved?.availability?.weekdays ?? true,
      weekends: tutorData.approved?.availability?.weekends ?? true,
      preferredTimes: tutorData.approved?.availability?.preferredTimes || [],
    },
    teachingSince: tutorData.approved?.teachingSince || new Date().getFullYear(),
      resumeLink: tutorData.approved?.resumeLink || "",
    socialLinks: {
      linkedin: tutorData.approved?.socialLinks?.linkedin || "",
      youtube: tutorData.approved?.socialLinks?.youtube || "",
      website: tutorData.approved?.socialLinks?.website || "",
      onlineCourses: tutorData.approved?.socialLinks?.onlineCourses || "",
      twitter: tutorData.approved?.socialLinks?.twitter || "",
      facebook: tutorData.approved?.socialLinks?.facebook || "",
      instagram: tutorData.approved?.socialLinks?.instagram || "",
      github: tutorData.approved?.socialLinks?.github || "",
    },
    bankDetails: {
      accountNumber: tutorData.approved?.bankDetails?.accountNumber || "",
      ifsc: tutorData.approved?.bankDetails?.ifsc || "",
      accountName: tutorData.approved?.bankDetails?.accountName || "",
    },
  };

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
          <h1 className="text-2xl font-semibold">Edit Tutor</h1>
          <p className="text-muted-foreground">Update tutor profile information</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Edit Tutor Information</CardTitle>
          <CardDescription>
            Update the tutor's profile information. Fields marked with * are required.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TutorForm
            mode="edit"
            tutorId={params.tutorId}
            initialData={transformedData}
          />
        </CardContent>
      </Card>
    </div>
  );
}