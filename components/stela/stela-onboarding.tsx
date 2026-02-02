'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { X, Plus, Sparkles } from 'lucide-react';

interface StelaOnboardingProps {
  onComplete: (values: string[]) => void;
  onSkip: () => void;
}

const SUGGESTED_VALUES = [
  'Time with family',
  'Quality time with kids',
  'Playing with pets',
  'Calling parents',
  'Connecting with friends',
  'Watering plants',
  'Time in nature',
  'Creative projects',
  'Rest and sleep',
  'Quiet moments',
  'Being present',
  'Mindful breaks',
];

export function StelaOnboarding({ onComplete, onSkip }: StelaOnboardingProps) {
  const [values, setValues] = useState<string[]>([]);
  const [customValue, setCustomValue] = useState('');

  const addValue = (value: string) => {
    if (value.trim() && !values.includes(value.trim())) {
      setValues([...values, value.trim()]);
      setCustomValue('');
    }
  };

  const removeValue = (value: string) => {
    setValues(values.filter((v) => v !== value));
  };

  const handleSubmit = () => {
    if (values.length > 0) {
      // Save to localStorage for persistence
      localStorage.setItem('stela-values', JSON.stringify(values));
      onComplete(values);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-amber-500" />
            What Truly Matters to You?
          </CardTitle>
          <CardDescription>
            Stela will gently remind you to honor these values throughout your journey.
            These aren't tasks to complete—they're moments of life to notice and cherish.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Selected Values */}
          {values.length > 0 && (
            <div>
              <Label className="text-sm font-medium mb-2 block">Your Values</Label>
              <div className="flex flex-wrap gap-2">
                {values.map((value) => (
                  <div
                    key={value}
                    className="bg-amber-100 dark:bg-amber-900/30 text-amber-900 dark:text-amber-100 px-3 py-1.5 rounded-full text-sm flex items-center gap-2"
                  >
                    {value}
                    <button
                      onClick={() => removeValue(value)}
                      className="hover:bg-amber-200 dark:hover:bg-amber-800 rounded-full p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Add Custom Value */}
          <div>
            <Label htmlFor="custom-value">Add Your Own</Label>
            <div className="flex gap-2 mt-1">
              <Input
                id="custom-value"
                placeholder="e.g., Evening walks, Reading to kids..."
                value={customValue}
                onChange={(e) => setCustomValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addValue(customValue);
                  }
                }}
              />
              <Button
                onClick={() => addValue(customValue)}
                disabled={!customValue.trim()}
                size="icon"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Suggested Values */}
          <div>
            <Label className="text-sm font-medium mb-2 block">Quick Suggestions</Label>
            <div className="flex flex-wrap gap-2">
              {SUGGESTED_VALUES.filter((v) => !values.includes(v)).map((value) => (
                <button
                  key={value}
                  onClick={() => addValue(value)}
                  className="bg-zinc-100 dark:bg-zinc-800 hover:bg-amber-100 dark:hover:bg-amber-900/30 px-3 py-1.5 rounded-full text-sm transition-colors"
                >
                  {value}
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              onClick={handleSubmit}
              disabled={values.length === 0}
              className="flex-1"
            >
              <Sparkles className="h-4 w-4 mr-2" />
              Start Receiving Gentle Reminders
            </Button>
            <Button variant="outline" onClick={onSkip}>
              Skip for Now
            </Button>
          </div>

          {/* Info */}
          <p className="text-xs text-muted-foreground text-center">
            You can update these values anytime in Settings. Stela will generate personalized messages based on what you choose.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
