"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, Edit2, X } from "lucide-react";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";

import type { User, UserRole } from "@educatedplanet/models";

const userFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
  phone: z.string().min(1, "Phone is required"),
  role: z.enum(["user", "tutor", "sub-admin", "admin"]),
  avatar: z.string().optional(),
  isVerified: z.boolean(),
});

type UserFormData = z.infer<typeof userFormSchema>;

interface UserModalProps {
  children?: React.ReactNode;
  user?: User;
  mode: "create" | "edit";
  onSubmit?: (data: UserFormData) => void;
  onClose?: () => void;
}

export function UserModal({ children, user, mode, onSubmit, onClose }: UserModalProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<UserFormData>({
    resolver: zodResolver(userFormSchema as any),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
      role: user?.role || "user",
      avatar: user?.avatar || "",
      isVerified: user?.isVerified || false,
    },
  });

  // Auto-open modal in edit mode when user data is provided
  useEffect(() => {
    if (mode === "edit" && user) {
      setOpen(true);
      // Reset form with user data
      form.reset({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        role: user.role || "user",
        avatar: user.avatar || "",
        isVerified: user.isVerified || false,
      });
    }
  }, [mode, user, form]);

  const handleSubmit = async (data: UserFormData) => {
    setIsLoading(true);
    try {
      await onSubmit?.(data);
      if (mode === "create") {
        form.reset();
      }
      setOpen(false);
      onClose?.();
    } catch (error) {
      // Error handling is done in the parent component
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      onClose?.();
    }
  };

  const title = mode === "create" ? "Create New User" : "Edit User";
  const description = mode === "create"
    ? "Add a new user to the platform"
    : "Update user information and settings";

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      {mode === "create" && (
        <DialogTrigger asChild>
          {children || (
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add User
            </Button>
          )}
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {mode === "create" ? (
              <Plus className="h-5 w-5" />
            ) : (
              <Edit2 className="h-5 w-5" />
            )}
            {title}
          </DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            {/* Avatar Preview */}
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={form.watch("avatar")} />
                <AvatarFallback className="text-lg">
                  {form.watch("name").split(" ").map(n => n[0]).join("").toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <FormField
                  control={form.control}
                  name="avatar"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Avatar URL</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="https://example.com/avatar.jpg"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="john.doe@example.com"
                      {...field}
                    />
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
                  <FormLabel>Phone</FormLabel>
                  <FormControl>
                    <Input placeholder="+1 (555) 123-4567" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="user">User</SelectItem>
                      <SelectItem value="tutor">Tutor</SelectItem>
                      <SelectItem value="sub-admin">Sub-Admin</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isVerified"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Verified User</FormLabel>
                    <p className="text-sm text-muted-foreground">
                      Mark this user as verified
                    </p>
                  </div>
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <X className="mr-2 h-4 w-4 animate-spin" />}
                {mode === "create" ? "Create User" : "Update User"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}