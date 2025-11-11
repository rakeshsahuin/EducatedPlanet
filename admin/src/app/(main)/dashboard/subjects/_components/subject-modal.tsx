"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Edit2, X, Hash, BookOpen, GraduationCap, Star, Target, Users, Clock, Award } from "lucide-react";

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
import { Slider } from "@/components/ui/slider";

import { SubjectForm, subjectFormSchema } from "./schema";
import { NewSubject } from "@educatedplanet/models";

interface SubjectModalProps {
  children?: React.ReactNode;
  mode: "create" | "edit";
  subject?: NewSubject;
  onSubmit?: (data: SubjectForm) => void;
  onClose?: () => void;
}

// Mock classes data - in real app, this would come from API
const mockClasses = [
  { id: "1", name: "Class 1", code: "CLASS-1" },
  { id: "2", name: "Class 2", code: "CLASS-2" },
  { id: "3", name: "Class 3", code: "CLASS-3" },
  { id: "4", name: "Class 4", code: "CLASS-4" },
  { id: "5", name: "Class 5", code: "CLASS-5" },
  { id: "6", name: "Class 6", code: "CLASS-6" },
  { id: "7", name: "Class 7", code: "CLASS-7" },
  { id: "8", name: "Class 8", code: "CLASS-8" },
  { id: "9", name: "Class 9", code: "CLASS-9" },
  { id: "10", name: "Class 10", code: "CLASS-10" },
  { id: "11", name: "Class 11", code: "CLASS-11" },
  { id: "12", name: "Class 12", code: "CLASS-12" },
];

export function SubjectModal({ children, mode, subject, onSubmit, onClose }: SubjectModalProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [keywords, setKeywords] = useState<string[]>(subject?.keywords || []);
  const [newKeyword, setNewKeyword] = useState("");
  const [selectedClasses, setSelectedClasses] = useState<string[]>(subject?.classIds || []);
  const [topics, setTopics] = useState<string[]>(subject?.metadata?.topics || []);
  const [newTopic, setNewTopic] = useState("");
  const [skills, setSkills] = useState<string[]>(subject?.metadata?.skills || []);
  const [newSkill, setNewSkill] = useState("");
  const [careerPaths, setCareerPaths] = useState<string[]>(subject?.metadata?.careerPaths || []);
  const [newCareerPath, setNewCareerPath] = useState("");
  const [exams, setExams] = useState<string[]>(subject?.metadata?.examPreparation || []);
  const [newExam, setNewExam] = useState("");
  const [prerequisites, setPrerequisites] = useState<string[]>(subject?.metadata?.prerequisites || []);
  const [newPrerequisite, setNewPrerequisite] = useState("");

  const form = useForm<SubjectForm>({
    resolver: zodResolver(subjectFormSchema as any),
    defaultValues: {
      name: subject?.name || "",
      code: subject?.code || "",
      description: subject?.description || "",
      keywords: subject?.keywords || [],
      isActive: subject?.isActive !== undefined ? subject.isActive : true,
      isAcademic: subject?.isAcademic !== undefined ? subject.isAcademic : true,
      sortOrder: subject?.sortOrder || 0,
      classIds: subject?.classIds || [],
      metadata: {
        difficulty: subject?.metadata?.difficulty || undefined,
        duration: subject?.metadata?.duration || "",
        prerequisites: subject?.metadata?.prerequisites || [],
        topics: subject?.metadata?.topics || [],
        skills: subject?.metadata?.skills || [],
        careerPaths: subject?.metadata?.careerPaths || [],
        examPreparation: subject?.metadata?.examPreparation || [],
        minAge: subject?.metadata?.minAge || undefined,
        maxAge: subject?.metadata?.maxAge || undefined,
        popular: subject?.metadata?.popular || false,
        icon: subject?.metadata?.icon || "",
        color: subject?.metadata?.color || "#3B82F6",
      },
    },
  });

  const handleSubmit = async (data: SubjectForm) => {
    setIsLoading(true);
    try {
      // Include arrays in the form data
      const submitData = {
        ...data,
        keywords,
        classIds: selectedClasses,
        metadata: {
          ...data.metadata,
          prerequisites,
          topics,
          skills,
          careerPaths,
          examPreparation: exams,
        },
      };

      if (onSubmit) {
        await onSubmit(submitData);
        setOpen(false);
        form.reset();
        setKeywords([]);
        setSelectedClasses([]);
        setTopics([]);
        setSkills([]);
        setCareerPaths([]);
        setExams([]);
        setPrerequisites([]);
      }
    } catch (error) {
      toast.error("An error occurred while saving the subject");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddKeyword = () => {
    if (newKeyword && !keywords.includes(newKeyword)) {
      setKeywords([...keywords, newKeyword]);
      setNewKeyword("");
    }
  };

  const handleRemoveKeyword = (keyword: string) => {
    setKeywords(keywords.filter(k => k !== keyword));
  };

  const handleAddTopic = () => {
    if (newTopic && !topics.includes(newTopic)) {
      setTopics([...topics, newTopic]);
      setNewTopic("");
    }
  };

  const handleRemoveTopic = (topic: string) => {
    setTopics(topics.filter(t => t !== topic));
  };

  const handleAddSkill = () => {
    if (newSkill && !skills.includes(newSkill)) {
      setSkills([...skills, newSkill]);
      setNewSkill("");
    }
  };

  const handleRemoveSkill = (skill: string) => {
    setSkills(skills.filter(s => s !== skill));
  };

  const handleAddCareerPath = () => {
    if (newCareerPath && !careerPaths.includes(newCareerPath)) {
      setCareerPaths([...careerPaths, newCareerPath]);
      setNewCareerPath("");
    }
  };

  const handleRemoveCareerPath = (path: string) => {
    setCareerPaths(careerPaths.filter(c => c !== path));
  };

  const handleAddExam = () => {
    if (newExam && !exams.includes(newExam)) {
      setExams([...exams, newExam]);
      setNewExam("");
    }
  };

  const handleRemoveExam = (exam: string) => {
    setExams(exams.filter(e => e !== exam));
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
      setKeywords([]);
      setSelectedClasses([]);
      setTopics([]);
      setSkills([]);
      setCareerPaths([]);
      setExams([]);
      setPrerequisites([]);
      if (onClose) onClose();
    }
    setOpen(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {children || (
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Subject
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5" />
            {mode === "create" ? "Create New Subject" : "Edit Subject"}
          </DialogTitle>
          <DialogDescription>
            {mode === "create"
              ? "Add a new subject to the system. Fill in all the required information."
              : "Update the subject information. Make changes as needed."
            }
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Basic Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name *</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Mathematics" {...field} />
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
                        <FormLabel>Code</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., MATH (auto-generated if empty)" {...field} />
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
                      <FormLabel>Description *</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Brief description of the subject..."
                          className="resize-none"
                          rows={3}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex flex-wrap gap-4">
                  <FormField
                    control={form.control}
                    name="isAcademic"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-2">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel>Academic Subject</FormLabel>
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
                        <FormLabel>Active</FormLabel>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="metadata.popular"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-2">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel>Popular Subject</FormLabel>
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="sortOrder"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sort Order</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="0"
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

            {/* Keywords */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Hash className="h-5 w-5" />
                  Keywords
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Add a keyword..."
                    value={newKeyword}
                    onChange={(e) => setNewKeyword(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddKeyword())}
                  />
                  <Button type="button" onClick={handleAddKeyword}>
                    Add
                  </Button>
                </div>
                {keywords.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {keywords.map((keyword, index) => (
                      <Badge key={index} variant="secondary" className="cursor-pointer">
                        {keyword}
                        <X
                          className="ml-1 h-3 w-3"
                          onClick={() => handleRemoveKeyword(keyword)}
                        />
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Class Associations */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Class Associations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                  {mockClasses.map((cls) => (
                    <label key={cls.id} className="flex items-center space-x-2 cursor-pointer">
                      <Checkbox
                        checked={selectedClasses.includes(cls.id)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedClasses([...selectedClasses, cls.id]);
                          } else {
                            setSelectedClasses(selectedClasses.filter(id => id !== cls.id));
                          }
                        }}
                      />
                      <span className="text-sm">{cls.name}</span>
                    </label>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Metadata */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Additional Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="metadata.difficulty"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Difficulty Level</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select difficulty" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="beginner">Beginner</SelectItem>
                            <SelectItem value="intermediate">Intermediate</SelectItem>
                            <SelectItem value="advanced">Advanced</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="metadata.duration"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Duration</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., 6 months, 1 year" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="metadata.icon"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Icon (Emoji)</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., 🔢" maxLength={10} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                            onChange={(e) => field.onChange(parseInt(e.target.value) || undefined)}
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
                            placeholder="e.g., 18"
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value) || undefined)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="metadata.color"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Color</FormLabel>
                      <FormControl>
                        <div className="flex items-center gap-2">
                          <Input
                            type="color"
                            className="w-16 h-10 p-1 border rounded cursor-pointer"
                            {...field}
                          />
                          <Input
                            placeholder="#3B82F6"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Topics */}
            <Card>
              <CardHeader>
                <CardTitle>Topics Covered</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Add a topic..."
                    value={newTopic}
                    onChange={(e) => setNewTopic(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTopic())}
                  />
                  <Button type="button" onClick={handleAddTopic}>
                    Add
                  </Button>
                </div>
                {topics.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {topics.map((topic, index) => (
                      <Badge key={index} variant="outline">
                        {topic}
                        <X
                          className="ml-1 h-3 w-3"
                          onClick={() => handleRemoveTopic(topic)}
                        />
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Skills */}
            <Card>
              <CardHeader>
                <CardTitle>Skills Gained</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Add a skill..."
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
                  />
                  <Button type="button" onClick={handleAddSkill}>
                    Add
                  </Button>
                </div>
                {skills.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {skills.map((skill, index) => (
                      <Badge key={index} variant="outline">
                        {skill}
                        <X
                          className="ml-1 h-3 w-3"
                          onClick={() => handleRemoveSkill(skill)}
                        />
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Saving..." : mode === "create" ? "Create Subject" : "Update Subject"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}