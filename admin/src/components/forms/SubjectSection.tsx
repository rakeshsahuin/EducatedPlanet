"use client";

import React, { useState, useEffect } from "react";
import { Controller, useFieldArray, Control, FieldErrors, UseFormRegister } from "react-hook-form";
import { TutorSubject, SubjectOption, ClassOption } from "@educatedplanet/models";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown, Trash2, X } from "lucide-react";

interface SubjectSectionProps {
  index: number;
  value: TutorSubject;
  onChange: (index: number, value: TutorSubject) => void;
  onRemove: (index: number) => void;
  subjectOptions: SubjectOption[];
  control: Control<any>;
  register: UseFormRegister<any>;
  errors: FieldErrors<any>;
  showRemove?: boolean;
}

export function SubjectSection({
  index,
  value,
  onChange,
  onRemove,
  subjectOptions,
  control,
  register,
  errors,
  showRemove = true,
}: SubjectSectionProps) {
  const [subjectOpen, setSubjectOpen] = useState(false);
  const [classOpen, setClassOpen] = useState(false);
  const [activeClasses, setActiveClasses] = useState<ClassOption[]>([]);

  // Filter subjects based on academic flag
  const filteredSubjects = subjectOptions.filter(
    (subject) => subject.isActive && subject.isAcademic === value.isAcademic
  );

  // Get selected subject details
  const selectedSubject = subjectOptions.find(s => s.id === value.subjectId);

  const handleSubjectSelect = (subjectId: string) => {
    const subject = subjectOptions.find(s => s.id === subjectId);
    if (subject) {
      onChange(index, {
        ...value,
        subjectId,
        subjectName: subject.name,
        isAcademic: subject.isAcademic,
        classes: subject.isAcademic ? undefined : [],
        ageFrom: subject.isAcademic ? 5 : undefined,
        ageTo: subject.isAcademic ? 18 : undefined,
      });
      setActiveClasses(!subject.isAcademic ? [] : subject.classIds || []);
    }
  };

  const handleClassToggle = (classId: string) => {
    const classObj = activeClasses.find(c => c._id === classId);
    if (!classObj) return;

    const isSelected = value.classes?.some(cls => cls._id === classId);

    if (isSelected) {
      // Remove class
      onChange(index, {
        ...value,
        classes: value.classes?.filter(cls => cls._id !== classId),
      });
    } else {
      // Add class
      onChange(index, {
        ...value,
        classes: [...(value.classes || []), classObj],
      });
    }
  };

  const handleAcademicToggle = (isAcademic: boolean) => {
    onChange(index, {
      ...value,
      isAcademic,
      subjectId: "",
      subjectName: "",
      classes: !isAcademic ? undefined : [],
      ageFrom: !isAcademic ? 5 : undefined,
      ageTo: !isAcademic ? 18 : undefined,
    });
  };

  const removeClass = (classId: string) => {
    const classObj = activeClasses.find(c => c._id === classId);
    if (classObj) {
      handleClassToggle(classObj._id);
    }
  };

  const legendText = selectedSubject?.name || `Subject ${index + 1}`;

  return (
    <fieldset className="border rounded-lg p-4 space-y-4 relative">
      <legend className="text-sm font-medium px-2">{legendText}</legend>

      {showRemove && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="absolute top-2 right-2 h-8 w-8 p-0"
          onClick={() => onRemove(index)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      )}

      {/* Academic/Non-Academic Toggle */}
      <div className="flex items-center space-x-3">
        <Switch
          id={`academic-${index}`}
          checked={value.isAcademic}
          onCheckedChange={handleAcademicToggle}
        />
        <Label htmlFor={`academic-${index}`}>
          Academic Subject
        </Label>
      </div>

      {/* Subject Selection */}
      <div>
        <Label className="text-sm font-medium">Subject</Label>
        <Popover open={subjectOpen} onOpenChange={setSubjectOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={subjectOpen}
              className="w-full justify-between mt-1"
            >
              {value.subjectName || "Select subject..."}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0">
            <Command>
              <CommandInput placeholder="Search subject..." />
              <CommandList>
                <CommandEmpty>No subject found.</CommandEmpty>
                <CommandGroup>
                  {filteredSubjects.map((subject) => (
                    <CommandItem
                      key={subject.id}
                      value={subject.id}
                      onSelect={() => {
                        handleSubjectSelect(subject.id);
                        setSubjectOpen(false);
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          value.subjectId === subject.id ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {subject.name}
                      <span className="ml-2 text-sm text-muted-foreground">
                        ({subject.code})
                      </span>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
        {errors?.subjects && (errors.subjects as any)[index]?.subjectId && (
          <p className="text-sm text-destructive mt-1">
            {(errors.subjects as any)[index]?.subjectId?.message}
          </p>
        )}
      </div>

      {/* Conditional Fields */}
      {!value.isAcademic ? (
        // Academic: Age Range
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor={`ageFrom-${index}`}>Age From</Label>
            <Input
              id={`ageFrom-${index}`}
              type="number"
              min="1"
              max="100"
              placeholder="From age"
              {...register(`subjects.${index}.ageFrom`, {
                valueAsNumber: true,
                min: { value: 1, message: "Age must be at least 1" },
                max: { value: 100, message: "Age cannot exceed 100" },
              })}
              className="mt-1"
            />
            {errors?.subjects && (errors.subjects as any)[index]?.ageFrom && (
              <p className="text-sm text-destructive mt-1">
                {(errors.subjects as any)[index]?.ageFrom?.message}
              </p>
            )}
          </div>
          <div>
            <Label htmlFor={`ageTo-${index}`}>Age To</Label>
            <Input
              id={`ageTo-${index}`}
              type="number"
              min="1"
              max="100"
              placeholder="To age"
              {...register(`subjects.${index}.ageTo`, {
                valueAsNumber: true,
                min: { value: 1, message: "Age must be at least 1" },
                max: { value: 100, message: "Age cannot exceed 100" },
              })}
              className="mt-1"
            />
            {errors?.subjects && (errors.subjects as any)[index]?.ageTo && (
              <p className="text-sm text-destructive mt-1">
                {(errors.subjects as any)[index]?.ageTo?.message}
              </p>
            )}
          </div>
        </div>
      ) : (
        // Non-Academic: Class Selection
        <div>
          <Label className="text-sm font-medium">Classes</Label>
          <p className="text-xs text-muted-foreground mb-2">
            Select classes for this subject
          </p>

          {/* Selected Classes as Badges */}
          {value.classes && value.classes.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-2">
              {value.classes.map((cls) => (
                <Badge key={cls._id} variant="secondary" className="gap-1">
                  <span>{cls.name}</span>
                  <button
                    type="button"
                    onClick={() => removeClass(cls._id)}
                    className="ml-1 hover:bg-secondary-foreground/20 rounded-full p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}

          {/* Class Dropdown */}
          <DropdownMenu open={classOpen} onOpenChange={setClassOpen}>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-between"
              >
                Add classes
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-full max-h-60 overflow-y-auto">
              {activeClasses
                .filter(cls => !value.classes?.some(c => c._id === cls._id))
                .map((cls) => (
                  <DropdownMenuItem
                    key={cls._id}
                    textValue={cls.name}
                    onSelect={() => handleClassToggle(cls._id)}
                  >
                    {cls.name}
                    <span className="ml-2 text-xs text-muted-foreground">
                      ({cls.category})
                    </span>
                  </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {errors?.subjects && (errors.subjects as any)[index]?.classIds && (
            <p className="text-sm text-destructive mt-1">
              {(errors.subjects as any)[index]?.classIds?.message}
            </p>
          )}
        </div>
      )}

    </fieldset>
  );
}