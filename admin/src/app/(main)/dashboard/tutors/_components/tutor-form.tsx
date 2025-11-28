"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { TutorForm as TutorFormValues, tutorFormSchema } from "./schema";
import { TeachingMode, TutorSubject } from "@educatedplanet/models";
import { useSubjectsAndClasses } from "@/hooks/useSubjectsAndClasses";
import { SubjectSection } from "@/components/forms/SubjectSection";
import { ExperienceEntry } from "@/components/forms/ExperienceEntry";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { FormProvider as RHFFormProvider } from "react-hook-form";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Loader2, Plus, X, Upload, Info, Globe, Twitter, Facebook, Instagram, Github, GraduationCap, Youtube } from "lucide-react";
import { LocationForm } from "@/components/forms/LocationForm";
import { TutorPhotoUpload } from "@/components/forms/TutorPhotoUpload";
import { UserSearchSelect } from "@/components/forms/UserSearchSelect";
import { RoleChangeDialog } from "@/components/dialogs/RoleChangeDialog";
import { PhotoData } from "@educatedplanet/models";
import { uploadTutorPhoto } from "@/lib/image-upload";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface TutorFormProps {
  initialData?: Partial<TutorFormValues>;
  tutorId?: string;
  mode: "create" | "edit";
}

// Common options
const SUBJECT_OPTIONS = [
  "Mathematics", "Physics", "Chemistry", "Biology", "English", "Hindi",
  "Computer Science", "History", "Geography", "Economics", "Accountancy",
  "Business Studies", "Political Science", "Sociology", "Psychology"
];

const CLASS_OPTIONS = [
  "Class 1-5", "Class 6-8", "Class 9-10", "Class 11-12",
  "NEET", "JEE", "CUET", "GATE", "CAT", "IELTS", "TOEFL"
];

const CITY_OPTIONS = [
  "Bhubaneswar", "Cuttack", "Rourkela", "Puri", "Sambalpur",
  "Berhampur", "Balasore", "Bhawanipatna", "Jharsuguda"
];

const BHUBANESWAR_AREAS = [
  "Patia", "Saheed Nagar", "Forest Park", "Nayapalli", "Old Town",
  "Bapuji Nagar", "Ashok Nagar", "Master Canteen", "Rasulgarh",
  "Acharya Vihar", "Sailashree Vihar", "IRC Village"
];

const TEACHING_MODES: { value: TeachingMode; label: string }[] = [
  { value: "online", label: "Online Only" },
  { value: "offline", label: "Offline Only" },
  { value: "both", label: "Both Online & Offline" }
];

const PREFERRED_TIMES = [
  "Morning (6AM - 9AM)",
  "Forenoon (9AM - 12PM)",
  "Afternoon (12PM - 3PM)",
  "Evening (3PM - 6PM)",
  "Late Evening (6PM - 9PM)",
  "Night (9PM - 11PM)"
];


export function TutorForm({ initialData, tutorId, mode }: TutorFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTimes, setSelectedTimes] = useState<string[]>(initialData?.availability?.preferredTimes || []);
    const [selectedTeachingMode, setSelectedTeachingMode] = useState<TeachingMode>(
    initialData?.teachingModes?.[0] || "offline"
  );
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreviewUrl, setPhotoPreviewUrl] = useState<string>('');
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [showRoleChangeDialog, setShowRoleChangeDialog] = useState(false);
  const [isChangingRole, setIsChangingRole] = useState(false);

  // Fetch subjects from API
  const { subjects, loading: dataLoading } = useSubjectsAndClasses();

  // Initialize selectedUser for edit mode
  useEffect(() => {
    if (mode === "edit" && initialData?.userId) {
      // For edit mode, we'll create a minimal user object with the existing data
      const existingUser = {
        id: initialData.userId,
        name: initialData.name || "",
        email: initialData.email || "",
        phone: initialData.phone || ""
      };
      setSelectedUser(existingUser);
    }
  }, [mode, initialData]);

  const form = useForm<z.infer<typeof tutorFormSchema>>({
    resolver: zodResolver(tutorFormSchema as any),
    defaultValues: {
      userId: initialData?.userId || "",
      name: initialData?.name || "",
      email: initialData?.email || "",
      phone: initialData?.phone || "",
      title: initialData?.title || "",
      shortDescription: initialData?.shortDescription || "",
      longDescription: initialData?.longDescription || "",
      subjects: initialData?.subjects || [{
        subjectId: "",
        subjectName: "",
        isAcademic: true,
        ageFrom: 5,
        ageTo: 18
      }],
      teachingModes: initialData?.teachingModes || ["offline"],
      location: {
        // New structured address
        address: initialData?.location?.address || {
          locality: "",
          city: "",
          state: "",
          coordinates: { lat: 0, lng: 0 },
        },
        // Availability range
        availabilityRange: initialData?.location?.availabilityRange || {
          value: 5,
          unit: "km",
        },
        // Legacy fields for backward compatibility
        city: initialData?.location?.city || "",
        areas: initialData?.location?.areas || [],
      },
      pricing: {
        oneToOne: {
          hourlyRate: initialData?.pricing?.oneToOne?.hourlyRate || 0,
        },
        group: {
          hourlyRate: initialData?.pricing?.group?.hourlyRate || 0,
          maxStudents: initialData?.pricing?.group?.maxStudents || 0,
        },
        online: {
          hourlyRate: initialData?.pricing?.online?.hourlyRate || 0,
        },
      },
      education: initialData?.education || [],
      experience: initialData?.experience || [],
      certifications: initialData?.certifications || [],
      languages: initialData?.languages || [],
      availability: {
        weekdays: initialData?.availability?.weekdays ?? true,
        weekends: initialData?.availability?.weekends ?? true,
        preferredTimes: initialData?.availability?.preferredTimes || [],
      },
        resumeLink: initialData?.resumeLink || "",
      socialLinks: {
        linkedin: initialData?.socialLinks?.linkedin || "",
        youtube: initialData?.socialLinks?.youtube || "",
        website: initialData?.socialLinks?.website || "",
        onlineCourses: initialData?.socialLinks?.onlineCourses || "",
        twitter: initialData?.socialLinks?.twitter || "",
        facebook: initialData?.socialLinks?.facebook || "",
        instagram: initialData?.socialLinks?.instagram || "",
        github: initialData?.socialLinks?.github || "",
      },
      bankDetails: {
        accountNumber: initialData?.bankDetails?.accountNumber || "",
        ifsc: initialData?.bankDetails?.ifsc || "",
        accountName: initialData?.bankDetails?.accountName || "",
      },
    },
  });

  const {
    fields: subjectFields,
    append: appendSubject,
    remove: removeSubject,
  } = useFieldArray({
    control: form.control,
    name: "subjects",
  });

  const {
    fields: experienceFields,
    append: appendExperience,
    remove: removeExperience,
  } = useFieldArray({
    control: form.control,
    name: "experience",
  });

  const watchedTeachingModes = form.watch("teachingModes");

  // Update derived states when form values change
  useEffect(() => {
    if (watchedTeachingModes.length > 0) {
      setSelectedTeachingMode(watchedTeachingModes[0]);
    }
  }, [watchedTeachingModes]);

  // Handle subject field updates
  const handleSubjectChange = (index: number, value: TutorSubject) => {
    form.setValue(`subjects.${index}`, value);
  };

  // Add new subject section
  const addSubjectSection = () => {
    appendSubject({
      subjectId: "",
      subjectName: "",
      isAcademic: true,
      ageFrom: 5,
      ageTo: 18
    });
  };

  // Remove subject section
  const removeSubjectSection = (index: number) => {
    removeSubject(index);
  };

  // Add new experience
  const addExperience = () => {
    const currentYear = new Date();
    appendExperience({
      title: "",
      institution: "",
      yearFrom: new Date(currentYear.getFullYear() - 1, 0, 1), // Jan 1 of last year
      yearTo: undefined,
      isPresent: false,
      description: ""
    });
  };

  // Handle the actual form submission
  const handleFormSubmit = async (data: z.infer<typeof tutorFormSchema>, changeUserRole: boolean = false) => {
    setIsLoading(true);
    try {
      // Upload photo first if selected
      let photoData;
      if (photoFile && !data.photo?.metadata?.isTemporary) {
        const uploadResult = await uploadTutorPhoto(photoFile, tutorId);
        if (!uploadResult.success) {
          toast.error(uploadResult.error || 'Failed to upload photo');
          setIsLoading(false);
          return;
        }
        photoData = uploadResult.data;
      } else if (data.photo && !data.photo.metadata?.isTemporary) {
        // Use existing photo
        photoData = data.photo;
      }

      // Transform form data for API
      const transformedData = {
        ...data,
        teachingModes: [selectedTeachingMode],
        location: {
          ...data.location,
          // New location structure is already in data.location
          address: data.location.address,
          availabilityRange: data.location.availabilityRange,
          // Update coordinates for geospatial queries from address
          coordinates: data.location.address?.coordinates
            ? {
                type: "Point" as const,
                coordinates: [
                  data.location.address.coordinates.lng,
                  data.location.address.coordinates.lat,
                ],
              }
            : undefined,
        },
        availability: {
          ...data.availability,
          preferredTimes: selectedTimes,
        },
          // Add photo data if available
        ...(photoData && { photo: photoData }),
        // Include user role change flag
        changeUserRole: mode === "create" && changeUserRole && selectedUser?.role === "user"
      };

      const payload = transformedData;

      const url = mode === "edit" ? `/api/tutors/${tutorId}` : "/api/tutors";
      const method = mode === "edit" ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success(`Tutor ${mode === "edit" ? "updated" : "created"} successfully`);
        router.push("/dashboard/tutors");
      } else {
        toast.error(result.error || `Failed to ${mode} tutor`);
      }
    } catch (error) {
      toast.error(`An error occurred while ${mode === "edit" ? "updating" : "creating"} the tutor`);
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data: z.infer<typeof tutorFormSchema>) => {
    // Check if we need to change user role (only for new tutors)
    if (mode === "create" && selectedUser && selectedUser.role === "user") {
      setShowRoleChangeDialog(true);
      return;
    }

    // Otherwise, submit directly
    await handleFormSubmit(data);
  };

  // Handle role change confirmation
  const handleRoleChangeConfirm = async () => {
    if (!selectedUser) return;

    setIsChangingRole(true);
    const data = form.getValues();
    await handleFormSubmit(data, true);
    setShowRoleChangeDialog(false);
    setIsChangingRole(false);
  };

  const addTime = (time: string) => {
    if (time && !selectedTimes.includes(time)) {
      setSelectedTimes([...selectedTimes, time]);
    }
  };

  const removeTime = (time: string) => {
    setSelectedTimes(selectedTimes.filter(t => t !== time));
  };

  
  // Handle user selection
  const handleUserSelect = (user: any) => {
    setSelectedUser(user);
    if (user) {
      // Auto-populate form fields with user data
      form.setValue("name", user.name);
      form.setValue("email", user.email || "");
      form.setValue("phone", user.phone);
      form.setValue("userId", user.id);
    } else {
      // Clear fields when user is deselected
      form.setValue("name", "");
      form.setValue("email", "");
      form.setValue("phone", "");
      form.setValue("userId", "");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Description and User Selection */}
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Fill in the details to create a new tutor profile. All fields marked with * are required.
          </p>

          {/* User Selection */}
          <FormField
            control={form.control}
            name="userId"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center gap-2">
                  <FormLabel>Select User *</FormLabel>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          type="button"
                          onClick={(e) => e.preventDefault()}
                          className="inline-flex"
                        >
                          <Info className="h-4 w-4 text-muted-foreground" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs">
                          Once a tutor profile is linked to a user, this association cannot be changed.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <FormControl>
                  <UserSearchSelect
                    value={selectedUser}
                    onChange={(user) => {
                      field.onChange(user?.id || "");
                      handleUserSelect(user);
                    }}
                    disabled={mode === "edit"}
                    required={true}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Tabs defaultValue="basic" className="w-full" suppressHydrationWarning>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="teaching">Teaching Details</TabsTrigger>
            <TabsTrigger value="pricing">Pricing</TabsTrigger>
            <TabsTrigger value="additional">Additional</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>Basic details about the tutor</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Profile Photo Section */}
                <div className="flex flex-col items-center">
                  <FormField
                    control={form.control}
                    name="photo"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <TutorPhotoUpload
                            value={field.value}
                            onChange={(photo) => {
                              field.onChange(photo);
                              // Store the actual file for upload
                              if (photo?.metadata?.originalFile) {
                                setPhotoFile(photo.metadata.originalFile);
                                setPhotoPreviewUrl(photo.url);
                              } else {
                                setPhotoFile(null);
                                setPhotoPreviewUrl('');
                              }
                            }}
                            disabled={isLoading}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Separator />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter full name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter phone number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="Enter email address" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Professional Title</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Mathematics Expert" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="shortDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Short Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Brief description about yourself (50-150 characters)"
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="longDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Detailed Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Detailed description about your teaching experience, methodology, etc."
                          className="resize-none min-h-[120px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Location Information */}
            <RHFFormProvider {...form}>
              <LocationForm />
            </RHFFormProvider>
          </TabsContent>

          <TabsContent value="teaching" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Teaching Information</CardTitle>
                <CardDescription>Details about teaching subjects and preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Dynamic Subjects */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <Label className="text-base font-medium">Subjects & Classes</Label>
                      <p className="text-sm text-muted-foreground">
                        Add subjects with class selections or age ranges
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addSubjectSection}
                      className="gap-2"
                    >
                      <Plus className="h-4 w-4" />
                      Add Subject
                    </Button>
                  </div>

                  {dataLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin" />
                      <span className="ml-2">Loading subjects...</span>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {subjectFields.map((field, index) => (
                        <SubjectSection
                          key={field.id}
                          index={index}
                          value={form.watch(`subjects.${index}`)}
                          onChange={handleSubjectChange}
                          onRemove={removeSubjectSection}
                          subjectOptions={subjects}
                          control={form.control}
                          register={form.register}
                          errors={form.formState.errors}
                          showRemove={subjectFields.length > 1}
                        />
                      ))}
                    </div>
                  )}

                  {form.formState.errors.subjects?.root && (
                    <p className="text-sm text-destructive mt-2">
                      {form.formState.errors.subjects.root.message}
                    </p>
                  )}
                </div>

                {/* Teaching Mode */}
                <div>
                  <Label className="text-base font-medium">Teaching Mode</Label>
                  <p className="text-sm text-muted-foreground mb-2">
                    Select preferred teaching mode
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {TEACHING_MODES.map((mode) => (
                      <label
                        key={mode.value}
                        className={`flex items-center space-x-2 rounded-lg border p-3 cursor-pointer transition-colors ${selectedTeachingMode === mode.value
                            ? "border-primary bg-primary/10"
                            : "border-border hover:bg-accent"
                          }`}
                      >
                        <input
                          type="radio"
                          name="teachingMode"
                          value={mode.value}
                          checked={selectedTeachingMode === mode.value}
                          onChange={() => setSelectedTeachingMode(mode.value)}
                          className="sr-only"
                        />
                        <span className="text-sm font-medium">{mode.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                              {/* Experience - Dynamic */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <Label className="text-base font-medium">Work Experience</Label>
                      <p className="text-sm text-muted-foreground">
                        Add your teaching and work experience
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addExperience}
                      className="gap-2"
                    >
                      <Plus className="h-4 w-4" />
                      Add Experience
                    </Button>
                  </div>

                  <div className="space-y-4">
                    {experienceFields.map((field, index) => (
                      <ExperienceEntry
                        key={field.id}
                        index={index}
                        control={form.control}
                        register={form.register}
                        errors={form.formState.errors}
                        onRemove={experienceFields.length > 1 ? () => removeExperience(index) : undefined}
                      />
                    ))}
                  </div>

                  {form.formState.errors.experience?.root && (
                    <p className="text-sm text-destructive mt-2">
                      {form.formState.errors.experience.root.message}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pricing" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Pricing Details</CardTitle>
                <CardDescription>Set hourly rates for different teaching modes</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="pricing.oneToOne.hourlyRate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>1-on-1 Rate (₹/hour)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="0"
                            placeholder="500"
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="pricing.online.hourlyRate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Online Rate (₹/hour)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="0"
                            placeholder="400"
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="pricing.group.hourlyRate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Group Rate (₹/hour/student)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="0"
                            placeholder="300"
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="pricing.group.maxStudents"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Maximum Students per Group</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="1"
                          max="50"
                          placeholder="10"
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="additional" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Additional Information</CardTitle>
                <CardDescription>Extra details about availability, age groups, etc.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Availability */}
                <div>
                  <Label className="text-base font-medium">Availability</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                    <FormField
                      control={form.control}
                      name="availability.weekdays"
                      render={({ field }) => (
                        <FormItem className="flex items-center space-x-2">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <FormLabel className="text-sm font-normal">
                            Available on Weekdays
                          </FormLabel>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="availability.weekends"
                      render={({ field }) => (
                        <FormItem className="flex items-center space-x-2">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <FormLabel className="text-sm font-normal">
                            Available on Weekends
                          </FormLabel>
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="mt-3">
                    <Label className="text-sm">Preferred Time Slots</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {selectedTimes.map((time) => (
                        <Badge key={time} variant="secondary" className="gap-1">
                          <span>{time}</span>
                          <button
                            type="button"
                            onClick={() => removeTime(time)}
                            className="ml-1 hover:bg-secondary-foreground/20 rounded-full p-0.5"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                    <Select onValueChange={addTime}>
                      <SelectTrigger className="w-full mt-2">
                        <SelectValue placeholder="Add time slots" />
                      </SelectTrigger>
                      <SelectContent>
                        {PREFERRED_TIMES.filter(
                          (time) => !selectedTimes.includes(time)
                        ).map((time) => (
                          <SelectItem key={time} value={time}>
                            {time}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

  
                {/* Social Links */}
                <div>
                  <Label className="text-base font-medium">Social Links (Optional)</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                    {/* Professional Networks */}
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-muted-foreground">Professional Networks</Label>
                      <FormField
                        control={form.control}
                        name="socialLinks.linkedin"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2">
                              <Globe className="h-4 w-4" />
                              LinkedIn Profile
                            </FormLabel>
                            <FormControl>
                              <Input placeholder="https://linkedin.com/in/..." {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Video Platforms */}
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-muted-foreground">Video Platforms</Label>
                      <FormField
                        control={form.control}
                        name="socialLinks.youtube"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2">
                              <Youtube className="h-4 w-4 text-red-600" />
                              YouTube Channel
                            </FormLabel>
                            <FormControl>
                              <Input placeholder="https://youtube.com/..." {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Online Courses */}
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-muted-foreground">Educational Platforms</Label>
                      <FormField
                        control={form.control}
                        name="socialLinks.onlineCourses"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2">
                              <GraduationCap className="h-4 w-4 text-blue-600" />
                              Online Courses
                            </FormLabel>
                            <FormControl>
                              <Input placeholder="https://udemy.com/..." {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Personal Website */}
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-muted-foreground">Personal</Label>
                      <FormField
                        control={form.control}
                        name="socialLinks.website"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2">
                              <Globe className="h-4 w-4" />
                              Personal Website
                            </FormLabel>
                            <FormControl>
                              <Input placeholder="https://yourwebsite.com" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Social Media */}
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-muted-foreground">Social Media</Label>
                      <FormField
                        control={form.control}
                        name="socialLinks.twitter"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2">
                              <Twitter className="h-4 w-4 text-blue-400" />
                              Twitter/X
                            </FormLabel>
                            <FormControl>
                              <Input placeholder="https://x.com/..." {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-muted-foreground">&nbsp;</Label>
                      <FormField
                        control={form.control}
                        name="socialLinks.facebook"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2">
                              <Facebook className="h-4 w-4 text-blue-600" />
                              Facebook
                            </FormLabel>
                            <FormControl>
                              <Input placeholder="https://facebook.com/..." {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-muted-foreground">&nbsp;</Label>
                      <FormField
                        control={form.control}
                        name="socialLinks.instagram"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2">
                              <Instagram className="h-4 w-4 text-pink-600" />
                              Instagram
                            </FormLabel>
                            <FormControl>
                              <Input placeholder="https://instagram.com/..." {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Development */}
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-muted-foreground">Development</Label>
                      <FormField
                        control={form.control}
                        name="socialLinks.github"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2">
                              <Github className="h-4 w-4" />
                              GitHub
                            </FormLabel>
                            <FormControl>
                              <Input placeholder="https://github.com/..." {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Form Actions */}
        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {mode === "edit" ? "Update Tutor" : "Create Tutor"}
          </Button>
        </div>
      </form>

      {/* Role Change Dialog */}
      <RoleChangeDialog
        open={showRoleChangeDialog}
        onOpenChange={setShowRoleChangeDialog}
        userName={selectedUser?.name || ""}
        userEmail={selectedUser?.email}
        onConfirm={handleRoleChangeConfirm}
        isLoading={isChangingRole}
      />
    </Form>
  );
}