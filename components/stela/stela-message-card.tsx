'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, X, RefreshCw, ThumbsDown } from 'lucide-react';

interface StelaMessageCardProps {
  message: string;
  category: string;
  onDismiss: (reason?: 'not-relevant' | 'done' | 'later') => void;
  onRegenerate: () => void;
  loading?: boolean;
}

const CATEGORY_ICONS: Record<string, string> = {
  family: '👨‍👩‍👧',
  nature: '🌿',
  creativity: '🎨',
  rest: '😴',
  connection: '🤝',
  mindfulness: '🧘',
  play: '🎈',
};

export function StelaMessageCard({ message, category, onDismiss, onRegenerate, loading }: StelaMessageCardProps) {
  const [showDismissOptions, setShowDismissOptions] = useState(false);

  return (
    <Card className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 border-amber-200 dark:border-amber-800">
      <CardContent className="pt-6">
        <div className="flex items-start gap-4">
          {/* Icon */}
          <div className="text-4xl flex-shrink-0">
            {CATEGORY_ICONS[category] || '✨'}
          </div>

          {/* Message Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-3">
              <h3 className="text-sm font-medium text-amber-900 dark:text-amber-100 flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                A Gentle Reminder from Stela
              </h3>
              {!showDismissOptions && (
                <button
                  onClick={() => setShowDismissOptions(true)}
                  className="text-amber-600 hover:text-amber-700 dark:text-amber-400 dark:hover:text-amber-300"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            <p className="text-base text-amber-950 dark:text-amber-50 leading-relaxed mb-4">
              {message}
            </p>

            {/* Actions */}
            {showDismissOptions ? (
              <div className="space-y-2">
                <p className="text-xs text-amber-800 dark:text-amber-200">
                  How would you like to respond?
                </p>
                <div className="flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onDismiss('done')}
                    className="text-xs"
                  >
                    ✓ I'll honor this today
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onDismiss('later')}
                    className="text-xs"
                  >
                    Remind me later
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onDismiss('not-relevant')}
                    className="text-xs flex items-center gap-1"
                  >
                    <ThumbsDown className="h-3 w-3" />
                    Not relevant
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setShowDismissOptions(false)}
                    className="text-xs"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={onRegenerate}
                  disabled={loading}
                  className="text-xs flex items-center gap-1"
                >
                  <RefreshCw className={`h-3 w-3 ${loading ? 'animate-spin' : ''}`} />
                  {loading ? 'Generating...' : 'Generate Another'}
                </Button>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
