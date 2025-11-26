"use client";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface TravelRadiusProps {
  value?: {
    value: number;
    unit: 'km' | 'miles';
  };
  onChange: (value: { value: number; unit: 'km' | 'miles' }) => void;
  className?: string;
  error?: string;
}

const PRESET_VALUES = [
  { label: "1 km", value: 1, unit: 'km' as const },
  { label: "2 km", value: 2, unit: 'km' as const },
  { label: "5 km", value: 5, unit: 'km' as const },
  { label: "10 km", value: 10, unit: 'km' as const },
  { label: "1 mile", value: 1, unit: 'miles' as const },
  { label: "2 miles", value: 2, unit: 'miles' as const },
  { label: "5 miles", value: 5, unit: 'miles' as const },
];

export function TravelRadius({
  value = { value: 5, unit: 'km' },
  onChange,
  className,
  error,
}: TravelRadiusProps) {
  const [customValue, setCustomValue] = useState(value.value.toString());

  // Handle preset selection
  const handlePresetClick = (presetValue: number, presetUnit: 'km' | 'miles') => {
    onChange({ value: presetValue, unit: presetUnit });
    setCustomValue(presetValue.toString());
  };

  // Handle unit change
  const handleUnitChange = (newUnit: 'km' | 'miles') => {
    // Convert the current value to the new unit
    const kmValue = value.unit === 'km' ? value.value : value.value * 1.60934;
    const newValue = newUnit === 'km' ? kmValue : kmValue * 0.621371;

    onChange({ value: Math.round(newValue * 10) / 10, unit: newUnit });
    setCustomValue((Math.round(newValue * 10) / 10).toString());
  };

  // Handle custom value input
  const handleCustomValueChange = (inputValue: string) => {
    setCustomValue(inputValue);

    const numValue = parseFloat(inputValue);
    if (!isNaN(numValue) && numValue > 0 && numValue <= 100) {
      onChange({ value: numValue, unit: value.unit });
    }
  };

  // Format value for display
  const formatValue = (val: number) => {
    if (val < 1) {
      // Convert to smaller units for very small values
      const smaller = value.unit === 'km' ? `${Math.round(val * 1000)} meters` : `${Math.round(val * 1760)} yards`;
      return smaller;
    }
    return `${val} ${value.unit}`;
  };

  return (
    <div className={cn("space-y-3", className)}>
      <Label className="text-base font-medium">
        Availability Range
        <span className="text-sm font-normal text-muted-foreground ml-2">
          Maximum distance you can travel
        </span>
      </Label>

      {/* Current Selection Display */}
      <div className="flex items-center gap-2">
        <Badge variant="outline" className="text-sm">
          {formatValue(value.value)}
        </Badge>
        <span className="text-xs text-muted-foreground">
          from your location
        </span>
      </div>

      {/* Preset Options */}
      <div>
        <Label className="text-sm mb-2 block">Quick Select</Label>
        <div className="flex flex-wrap gap-2">
          {PRESET_VALUES.map((preset) => (
            <Button
              key={`${preset.value}-${preset.unit}`}
              type="button"
              variant={
                value.value === preset.value && value.unit === preset.unit
                  ? "default"
                  : "outline"
              }
              size="sm"
              onClick={() => handlePresetClick(preset.value, preset.unit)}
              className="h-8 px-3 text-xs"
            >
              {preset.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Custom Value Input */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label className="text-sm mb-2 block">Custom Distance</Label>
          <Input
            type="number"
            value={customValue}
            onChange={(e) => handleCustomValueChange(e.target.value)}
            min="0.1"
            max="100"
            step="0.1"
            placeholder="Enter distance"
            className={cn(error && "border-destructive")}
          />
        </div>
        <div>
          <Label className="text-sm mb-2 block">Unit</Label>
          <Select value={value.unit} onValueChange={handleUnitChange}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="km">Kilometers</SelectItem>
              <SelectItem value="miles">Miles</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Conversion Helper */}
      {value.value > 0 && (
        <div className="text-xs text-muted-foreground bg-muted/50 p-2 rounded">
          <span>≈ </span>
          {value.unit === 'km'
            ? `${(value.value * 0.621371).toFixed(1)} miles`
            : `${(value.value * 1.60934).toFixed(1)} km`
          }
        </div>
      )}

      {/* Error Message */}
      {error && (
        <p className="text-xs text-destructive">{error}</p>
      )}
    </div>
  );
}