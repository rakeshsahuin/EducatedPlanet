"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Edit2, X, BookOpen, Hash, Calendar, Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";

import { ClassCategory, ClassForm, classFormSchema } from "./schema";

interface ClassModalProps {
  children?: React.ReactNode;
  mode: "create" | "edit";
  class?: any;
  onSubmit?: (data: ClassForm) => void;
  onClose?: () => void;
}

export function ClassModal({ children, mode, class: classItem, onSubmit, onClose }: ClassModalProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [subClasses, setSubClasses] = useState<string[]>(classItem?.subClasses || []);
  const [newSubClass, setNewSubClass] = useState("");
  const [newSubClassName, setNewSubClassName] = useState("");
  const [subjects, setSubjects] = useState<string[]>(classItem?.metadata?.subjects || []);
  const [newSubject, setNewSubject] = useState("");
  const [prerequisites, setPrerequisites] = useState<string[]>(classItem?.metadata?.prerequisites || []);
  const [newPrerequisite, setNewPrerequisite] = useState("");

  // Auto-open modal in edit mode when class is provided
  useEffect(() => {
    if (mode === "edit" && classItem) {
      setOpen(true);
    }
  }, [mode, classItem]);

  const form = useForm<ClassForm>({
    resolver: zodResolver(classFormSchema as any),
    defaultValues: {
      name: classItem?.name || "",
      code: classItem?.code || "",
      category: classItem?.category || ClassCategory.SCHOOL,
      description: classItem?.description || "",
      isActive: classItem?.isActive !== undefined ? classItem.isActive : true,
      sortOrder: classItem?.sortOrder || 0,
      metadata: {
        minAge: classItem?.metadata?.minAge || undefined,
        maxAge: classItem?.metadata?.maxAge || undefined,
        duration: classItem?.metadata?.duration || "",
        subjects: classItem?.metadata?.subjects || [],
        prerequisites: classItem?.metadata?.prerequisites || [],
      },
      subClasses: classItem?.subClasses || [],
    },
  });

  const handleSubmit = async (data: ClassForm) => {
    setIsLoading(true);
    try {
      // Include subClasses, subjects, and prerequisites in the form data
      const submitData = {
        ...data,
        subClasses,
        metadata: {
          ...data.metadata,
          subjects,
          prerequisites,
        },
      };

      if (onSubmit) {
        await onSubmit(submitData);
        setOpen(false);
        form.reset();
      }
    } catch (error) {
      toast.error("An error occurred while saving the class");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddSubClass = () => {
    if (newSubClass && newSubClassName) {
      if (!subClasses.includes(newSubClass)) {
        setSubClasses([...subClasses, newSubClass]);
        setNewSubClass("");
        setNewSubClassName("");
        toast.success("Sub-class added");
      } else {
        toast.error("Sub-class code already exists");
      }
    }
  };

  const handleRemoveSubClass = (code: string) => {
    setSubClasses(subClasses.filter(sc => sc !== code));
    toast.success("Sub-class removed");
  };

  const handleAddSubject = () => {
    if (newSubject && !subjects.includes(newSubject)) {
      setSubjects([...subjects, newSubject]);
      setNewSubject("");
    }
  };

  const handleRemoveSubject = (subject: string) => {
    setSubjects(subjects.filter(s => s !== subject));
  };

  const handleAddPrerequisite = () => {
    if (newPrerequisite && !prerequisites.includes(newPrerequisite)) {
      setPrerequisites([...prerequisites, newPrerequisite]);
      setNewPrerequisite("");
    }
  };

  const handleRemovePrerequisite = (prerequisite: string) => {
    setPrerequisites(prerequisites.filter(p => p !== prerequisite));
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      form.reset();
      setSubClasses([]);
      setSubjects([]);
      setPrerequisites([]);
      if (onClose) onClose();
    }
    setOpen(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      {children && (
        <DialogTrigger asChild>
          {children}
        </DialogTrigger>
      )}
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {mode === "create" ? (
              <>
                <Plus className="h-5 w-5" />
                Create New Class
              </>
            ) : (
              <>
                <Edit2 className="h-5 w-5" />
                Edit Class
              </>
            )}
          </DialogTitle>
          <DialogDescription>
            {mode === "create"
              ? "Add a new educational class to the platform"
              : "Update the class information"
            }
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Basic Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Class Name *</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Class 10" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="code"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Class Code *</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., CLASS-10" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {Object.values(ClassCategory).map((category) => (
                              <SelectItem key={category} value={category}>
                                {category.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="sortOrder"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Sort Order</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="0" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter class description..."
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
                  name="isActive"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="font-normal">
                        Active Class
                      </FormLabel>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Metadata */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Hash className="h-5 w-5" />
                  Additional Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="metadata.minAge"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Minimum Age</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="e.g., 6"
                            {...field}
                            onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="metadata.maxAge"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Maximum Age</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="e.g., 17"
                            {...field}
                            onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="metadata.duration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Duration</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., 1 year, 6 months" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Sub-classes */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Sub-classes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Sub-class code (e.g., MATH-1)"
                    value={newSubClass}
                    onChange={(e) => setNewSubClass(e.target.value.toUpperCase())}
                  />
                  <Input
                    placeholder="Sub-class name (e.g., Mathematics I)"
                    value={newSubClassName}
                    onChange={(e) => setNewSubClassName(e.target.value)}
                    className="flex-1"
                  />
                  <Button type="button" onClick={handleAddSubClass}>
                    Add
                  </Button>
                </div>

                {subClasses.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {subClasses.map((subClass) => (
                      <Badge key={subClass} variant="secondary" className="pr-1">
                        {subClass}
                        <button
                          type="button"
                          onClick={() => handleRemoveSubClass(subClass)}
                          className="ml-2 text-muted-foreground hover:text-destructive"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Subjects */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Subjects</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Add subject"
                    value={newSubject}
                    onChange={(e) => setNewSubject(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSubject())}
                  />
                  <Button type="button" onClick={handleAddSubject}>
                    Add
                  </Button>
                </div>

                {subjects.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {subjects.map((subject) => (
                      <Badge key={subject} variant="outline" className="pr-1">
                        {subject}
                        <button
                          type="button"
                          onClick={() => handleRemoveSubject(subject)}
                          className="ml-2 text-muted-foreground hover:text-destructive"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Prerequisites */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Prerequisites
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Add prerequisite"
                    value={newPrerequisite}
                    onChange={(e) => setNewPrerequisite(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddPrerequisite())}
                  />
                  <Button type="button" onClick={handleAddPrerequisite}>
                    Add
                  </Button>
                </div>

                {prerequisites.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {prerequisites.map((prerequisite) => (
                      <Badge key={prerequisite} variant="outline" className="pr-1">
                        {prerequisite}
                        <button
                          type="button"
                          onClick={() => handleRemovePrerequisite(prerequisite)}
                          className="ml-2 text-muted-foreground hover:text-destructive"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Saving..." : mode === "create" ? "Create Class" : "Update Class"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}