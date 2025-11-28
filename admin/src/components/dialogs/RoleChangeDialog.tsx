"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, UserCheck } from "lucide-react";

interface RoleChangeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userName: string;
  userEmail?: string;
  onConfirm: () => void;
  isLoading?: boolean;
}

export function RoleChangeDialog({
  open,
  onOpenChange,
  userName,
  userEmail,
  onConfirm,
  isLoading = false,
}: RoleChangeDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserCheck className="h-5 w-5" />
            Change User Role
          </DialogTitle>
          <DialogDescription>
            You are about to change this user's role from "user" to "tutor"
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>{userName}</strong>
              {userEmail && ` (${userEmail})`} will have their role changed to "tutor".
              This will give them access to tutor-specific features and permissions.
            </AlertDescription>
          </Alert>

          <div className="text-sm text-muted-foreground space-y-2">
            <p>• The user will be able to manage their tutor profile</p>
            <p>• They will appear in tutor search results</p>
            <p>• This action will be logged for audit purposes</p>
          </div>

          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="text-orange-600">
              This action cannot be undone. The user's role cannot be changed back
              automatically.
            </AlertDescription>
          </Alert>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            disabled={isLoading}
            className="bg-orange-600 hover:bg-orange-700"
          >
            {isLoading ? "Changing..." : "Confirm Role Change"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}