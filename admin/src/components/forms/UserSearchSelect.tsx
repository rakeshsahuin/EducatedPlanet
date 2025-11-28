"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { Loader2, Users, X, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// Simple debounce implementation
const debounce = (func: Function, wait: number) => {
  let timeout: NodeJS.Timeout;
  return function executedFunction(...args: any[]) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

interface User {
  id: string;
  name: string;
  email?: string;
  phone: string;
  role: string;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
}

interface UserSearchSelectProps {
  value?: User | null;
  onChange: (user: User | null) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  required?: boolean;
}

export function UserSearchSelect({
  value,
  onChange,
  placeholder = "Search user by name or email...",
  className,
  disabled = false,
  required = false,
}: UserSearchSelectProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Sync internal state with prop value
  useEffect(() => {
    setSelectedUserState(value ?? null);
    if (value) {
      setSearchValue(`${value.name} ${value.email ? `(${value.email})` : ""}`);
    }
  }, [value]);

  // Set selected user state
  const setSelectedUserState = (user: User | null) => {
    if (user) {
      setSearchValue(`${user.name} ${user.email ? `(${user.email})` : ""}`);
    }
  };

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce(async (query: string) => {
      if (!query || query.length < 2) {
        setUsers([]);
        return;
      }

      // Cancel previous request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      // Create new abort controller
      abortControllerRef.current = new AbortController();

      setIsLoading(true);
      try {
        const response = await fetch(
          `/api/users/available?search=${encodeURIComponent(query)}&limit=50`,
          {
            signal: abortControllerRef.current.signal,
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch users");
        }

        const result = await response.json();
        if (result.success) {
          setUsers(result.data || []);
        } else {
          setUsers([]);
        }
      } catch (error) {
        if (error instanceof Error && error.name !== "AbortError") {
          console.error("Error searching users:", error);
        }
        setUsers([]);
      } finally {
        setIsLoading(false);
      }
    }, 300),
    []
  );

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);
    setIsOpen(true);

    // If we clear the input, also clear the selection
    if (!value) {
      onChange(null);
      setUsers([]);
    } else {
      debouncedSearch(value);
    }
  };

  // Handle user selection
  const handleUserSelect = (user: User) => {
    setSearchValue(`${user.name} ${user.email ? `(${user.email})` : ""}`);
    setIsOpen(false);
    setUsers([]);
    onChange(user);
  };

  // Handle clear selection
  const handleClearSelection = () => {
    setSearchValue("");
    setIsOpen(false);
    setUsers([]);
    onChange(null);
    inputRef.current?.focus();
  };

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        !inputRef.current?.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return (
    <div className={cn("relative", className)} ref={dropdownRef}>
      <div className="relative">
        <Input
          ref={inputRef}
          value={searchValue}
          onChange={handleInputChange}
          placeholder={placeholder}
          className={cn(
            "pr-20",
            disabled && "cursor-not-allowed opacity-50"
          )}
          disabled={disabled}
          onFocus={() => !disabled && setIsOpen(true)}
        />

        {/* Loading indicator */}
        {isLoading && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          </div>
        )}

        {/* Clear button */}
        {!isLoading && searchValue && !disabled && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7 p-0 hover:bg-muted"
            onClick={handleClearSelection}
          >
            <X className="h-3 w-3" />
          </Button>
        )}
      </div>

      {/* Dropdown list */}
      {isOpen && (
        <div className="absolute w-full z-50 mt-1 bg-background border rounded-md shadow-md">
          <div className="max-h-60 overflow-auto p-1">
            {searchValue.length < 2 ? (
              <div className="text-center text-sm text-muted-foreground py-4 px-3">
                Type at least 2 characters to search
              </div>
            ) : isLoading ? (
              <div className="flex items-center justify-center py-4 px-3">
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Searching users...
              </div>
            ) : users.length === 0 ? (
              <div className="text-center text-sm text-muted-foreground py-4 px-3">
                No available users found
              </div>
            ) : (
              users.map((user) => (
                <div
                  key={user.id}
                  className={cn(
                    "flex items-center gap-2 p-3 cursor-pointer hover:bg-accent rounded",
                    value?.id === user.id && "bg-accent"
                  )}
                  onClick={() => handleUserSelect(user)}
                >
                  <div className="flex items-center gap-3 flex-1">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <Users className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">{user.name}</div>
                      {user.email && (
                        <div className="text-sm text-muted-foreground truncate">
                          {user.email}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      {user.isEmailVerified && (
                        <Badge variant="green" className="text-xs">
                          Email
                        </Badge>
                      )}
                      {user.isPhoneVerified && (
                        <Badge variant="green" className="text-xs">
                          Phone
                        </Badge>
                      )}
                      {user.role === "tutor" && (
                        <Badge variant="outline" className="text-xs">
                          Tutor
                        </Badge>
                      )}
                    </div>
                  </div>
                  {value?.id === user.id && (
                    <Check className="h-4 w-4 text-primary" />
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Helper text */}
      {value && (
        <p className="text-sm text-muted-foreground mt-1">
          Selected: {value.name}
          {value.email && ` (${value.email})`}
        </p>
      )}
    </div>
  );
}