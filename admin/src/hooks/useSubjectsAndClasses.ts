"use client";

import { useState, useEffect } from "react";
import { SubjectOption, SubjectsResponse } from "@educatedplanet/models";

export function useSubjectsAndClasses(): SubjectsResponse {
  const [subjects, setSubjects] = useState<SubjectOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | undefined>();

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setError(undefined);

        // Fetch subjects
        const subjectsResponse = await fetch("/api/subjects?limit=100&isActive=true");
        if (!subjectsResponse.ok) {
          throw new Error("Failed to fetch subjects");
        }
        const subjectsData = await subjectsResponse.json();
        console.log('Fetched Subjects:', subjectsData.data);
        setSubjects(subjectsData.data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  return {
    subjects,
    loading,
    error,
  };
}