"use client";

import { useState, useEffect } from 'react';
import zxcvbn from 'zxcvbn';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

export interface PasswordStrengthResult {
  score: number;
  feedback: {
    warning: string;
    suggestions: string[];
  };
  crackTimes: {
    offlineSlowHashing1e4PerSecond: string;
    onlineNoThrottling10perSecond: string;
    onlineThrottling10perHour: string;
  };
}

export interface PasswordStrengthProps {
  password: string;
  showFeedback?: boolean;
  showCrackTime?: boolean;
  className?: string;
}

export function PasswordStrength({
  password,
  showFeedback = true,
  showCrackTime = false,
  className
}: PasswordStrengthProps) {
  const [result, setResult] = useState<zxcvbn.ZxcvbnResult | null>(null);

  useEffect(() => {
    if (password) {
      const zxcvbnResult = zxcvbn(password);
      setResult(zxcvbnResult);
    } else {
      setResult(null);
    }
  }, [password]);

  if (!password || !result) {
    return null;
  }

  const score = result.score;
  const strengthLabels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];
  const strengthColors = [
    'bg-red-500',
    'bg-orange-500',
    'bg-yellow-500',
    'bg-blue-500',
    'bg-green-500'
  ];

  const progressPercentage = (score / 4) * 100;

  const formatCrackTime = (time: string): string => {
    if (time === 'less than a second') return 'Instant';
    if (time.includes('centuries')) return 'Centuries';
    if (time.includes('years')) return time;
    if (time.includes('months')) return time;
    if (time.includes('days')) return time;
    if (time.includes('hours')) return time;
    if (time.includes('minutes')) return time;
    return time;
  };

  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">Password Strength</span>
        <span className={cn(
          'text-sm font-medium',
          score <= 2 ? 'text-red-500' : score === 3 ? 'text-yellow-500' : 'text-green-500'
        )}>
          {strengthLabels[score]}
        </span>
      </div>

      <Progress
        value={progressPercentage}
        className={cn('h-2', strengthColors[score])}
      />

      {showFeedback && (result.feedback.warning || result.feedback.suggestions.length > 0) && (
        <div className="space-y-1">
          {result.feedback.warning && (
            <p className="text-xs text-red-500">
              {result.feedback.warning}
            </p>
          )}
          {result.feedback.suggestions.map((suggestion, index) => (
            <p key={index} className="text-xs text-gray-500">
              • {suggestion}
            </p>
          ))}
        </div>
      )}

      {showCrackTime && (
        <div className="text-xs text-gray-500 space-y-1">
          <p>Time to crack:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Offline: {formatCrackTime(result.crack_times_seconds.offline_slow_hashing_1e4_per_second)}</li>
            <li>Online: {formatCrackTime(result.crack_times_seconds.online_no_throttling_10_per_second)}</li>
          </ul>
        </div>
      )}
    </div>
  );
}

export default PasswordStrength;