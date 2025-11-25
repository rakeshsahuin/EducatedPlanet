"use client";

import { useState } from "react";
import { Control, Controller, useWatch, useFieldArray, FieldErrors, UseFormRegister } from "react-hook-form";
import { useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trash2, Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface ExperienceEntryProps {
  index: number;
  control: Control<any>;
  register: UseFormRegister<any>;
  errors: FieldErrors<any>;
  onRemove?: () => void;
}

export function ExperienceEntry({
  index,
  control,
  register,
  errors,
  onRemove,
}: ExperienceEntryProps) {
  const form = useFormContext();
  const [fromDateOpen, setFromDateOpen] = useState(false);
  const [toDateOpen, setToDateOpen] = useState(false);

  // Watch values for isPresent toggle
  const isPresent = useWatch({
    control,
    name: `experience.${index}.isPresent`,
  });

  const fromDateValue = useWatch({
    control,
    name: `experience.${index}.yearFrom`,
  });

  const toDateValue = useWatch({
    control,
    name: `experience.${index}.yearTo`,
  });

  // Format date for display
  const formatDate = (date: Date | undefined) => {
    if (!date) return "";
    return format(date, "MMM yyyy");
  };

  // Handle month/year selection for from date
  const handleFromDateSelect = (date: Date | undefined) => {
    if (date) {
      // Set to first day of selected month
      const selectedDate = new Date(date.getFullYear(), date.getMonth(), 1);
      form.setValue(`experience.${index}.yearFrom`, selectedDate);
    }
    setFromDateOpen(false);
  };

  // Handle month/year selection for to date
  const handleToDateSelect = (date: Date | undefined) => {
    if (date) {
      // Set to last day of selected month
      const selectedDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);
      form.setValue(`experience.${index}.yearTo`, selectedDate);
    }
    setToDateOpen(false);
  };

  // Handle isPresent toggle
  const handleIsPresentChange = (checked: boolean) => {
    form.setValue(`experience.${index}.isPresent`, checked);
    if (checked) {
      form.setValue(`experience.${index}.yearTo`, undefined);
    }
  };

  return (
    <Card className="relative">
      <CardContent className="pt-6">
        {onRemove && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute top-2 right-2 h-8 w-8 p-0"
            onClick={onRemove}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Job Title */}
          <div>
            <Label htmlFor={`title-${index}`} className="text-sm font-medium">
              Job Title/Position
            </Label>
            <Input
              id={`title-${index}`}
              placeholder="e.g., Mathematics Teacher"
              maxLength={150}
              {...register(`experience.${index}.title`, {
                required: "Job title is required",
                maxLength: {
                  value: 150,
                  message: "Job title cannot exceed 150 characters",
                },
              })}
              className="mt-1"
            />
            {errors.experience && (errors.experience as any)[index]?.title?.message && (
              <p className="text-sm text-destructive mt-1">
                {(errors.experience as any)[index].title.message}
              </p>
            )}
          </div>

          {/* Institution */}
          <div>
            <Label htmlFor={`institution-${index}`} className="text-sm font-medium">
              Institution/Organization
            </Label>
            <Input
              id={`institution-${index}`}
              placeholder="e.g., Delhi Public School"
              maxLength={150}
              {...register(`experience.${index}.institution`, {
                required: "Institution is required",
                maxLength: {
                  value: 150,
                  message: "Institution name cannot exceed 150 characters",
                },
              })}
              className="mt-1"
            />
            {errors.experience && (errors.experience as any)[index]?.institution?.message && (
              <p className="text-sm text-destructive mt-1">
                {(errors.experience as any)[index].institution.message}
              </p>
            )}
          </div>

          {/* From Date */}
          <div>
            <Label className="text-sm font-medium">Start Date</Label>
            <Popover open={fromDateOpen} onOpenChange={setFromDateOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal mt-1",
                    !fromDateValue && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {fromDateValue ? formatDate(fromDateValue) : "Select month and year"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={fromDateValue}
                  onSelect={handleFromDateSelect}
                  initialFocus
                  fromYear={1950}
                  toYear={new Date().getFullYear()}
                />
              </PopoverContent>
            </Popover>
            {errors.experience && (errors.experience as any)[index]?.yearFrom?.message && (
              <p className="text-sm text-destructive mt-1">
                {(errors.experience as any)[index].yearFrom.message}
              </p>
            )}
          </div>

          {/* To Date */}
          <div>
            <Label className="text-sm font-medium">End Date</Label>
            <Popover open={toDateOpen && !isPresent} onOpenChange={setToDateOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal mt-1",
                    !toDateValue && !isPresent && "text-muted-foreground"
                  )}
                  disabled={isPresent}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {isPresent ? (
                    "Present"
                  ) : toDateValue ? (
                    formatDate(toDateValue)
                  ) : (
                    "Select month and year"
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={toDateValue}
                  onSelect={handleToDateSelect}
                  initialFocus
                  fromYear={1950}
                  toYear={new Date().getFullYear()}
                  disabled={(date) => fromDateValue && date < fromDateValue}
                />
              </PopoverContent>
            </Popover>
            {errors.experience && (errors.experience as any)[index]?.yearTo?.message && (
              <p className="text-sm text-destructive mt-1">
                {(errors.experience as any)[index].yearTo.message}
              </p>
            )}
          </div>

          {/* Currently Working Here */}
          <div className="flex items-center space-x-3 md:col-span-2">
            <Switch
              id={`isPresent-${index}`}
              checked={isPresent}
              onCheckedChange={handleIsPresentChange}
            />
            <Label htmlFor={`isPresent-${index}`} className="text-sm">
              Currently working here
            </Label>
            {isPresent && (
              <Badge variant="secondary" className="ml-2">
                Present
              </Badge>
            )}
          </div>

          {/* Description */}
          <div className="md:col-span-2">
            <Label htmlFor={`description-${index}`} className="text-sm font-medium">
              Description
            </Label>
            <Textarea
              id={`description-${index}`}
              placeholder="Describe your role, responsibilities, and achievements..."
              maxLength={5000}
              rows={4}
              {...register(`experience.${index}.description`, {
                maxLength: {
                  value: 5000,
                  message: "Description cannot exceed 5000 characters",
                },
              })}
              className="mt-1 resize-none"
            />
            <div className="flex justify-between mt-1">
              {errors.experience && (errors.experience as any)[index]?.description?.message && (
                <p className="text-sm text-destructive">
                  {(errors.experience as any)[index].description.message}
                </p>
              )}
              <span className="text-xs text-muted-foreground ml-auto">
                {form.watch(`experience.${index}.description`)?.length || 0}/5000
              </span>
            </div>
          </div>
        </div>

        {/* Date Validation Error */}
        {errors.experience && (errors.experience as any)[index]?.root?.message && (
          <p className="text-sm text-destructive mt-2">
            {(errors.experience as any)[index].root.message}
          </p>
        )}
      </CardContent>
    </Card>
  );
}