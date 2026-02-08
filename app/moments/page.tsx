'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Camera, X, Edit2, Check, Trash2 } from 'lucide-react';
import { Moment, type MomentState } from '@/lib/aggregates/moment';
import { StelaMessage, type StelaMessageState } from '@/lib/aggregates/stela-message';
import { StelaOnboarding } from '@/components/stela/stela-onboarding';
import { StelaMessageCard } from '@/components/stela/stela-message-card';
import { eventStore } from '@/lib/events/store';
import { v4 as uuidv4 } from 'uuid';
import { format } from 'date-fns';
import { compressImage } from '@/lib/image-utils';

export default function MomentsPage() {
  const [moments, setMoments] = useState<MomentState[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editCaption, setEditCaption] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Moments Message State (formerly Stela)
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [momentsMessage, setMomentsMessage] = useState<StelaMessageState | null>(null);
  const [generatingMessage, setGeneratingMessage] = useState(false);

  useEffect(() => {
    loadMoments();
    checkAndLoadTodaysMessage();
  }, []);

  const loadMoments = async () => {
    setLoading(true);
    try {
      const events = await eventStore.getAllEvents();
      const momentEvents = events.filter((e) => e.aggregateType === 'moment');

      // Get unique moment IDs
      const momentIds = Array.from(new Set(momentEvents.map((e) => e.aggregateId)));

      // Load each moment
      const loadedMoments = await Promise.all(
        momentIds.map(async (id) => {
          const moment = new Moment(id);
          return await moment.load();
        })
      );

      // Filter out deleted moments and sort by creation time (newest first)
      const activeMoments = loadedMoments.filter(m => !m.deleted);
      activeMoments.sort((a, b) => b.createdAt - a.createdAt);
      setMoments(activeMoments);
    } catch (error) {
      console.error('Error loading moments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      // Compress image
      const compressedBase64 = await compressImage(file, {
        maxWidth: 800,
        maxHeight: 800,
        quality: 0.8,
        maxSizeKB: 200,
      });

      // Create moment
      const momentId = uuidv4();
      const moment = new Moment(momentId);
      await moment.create({
        photoData: compressedBase64,
      });

      await loadMoments();
    } catch (error) {
      console.error('Error creating moment:', error);
      alert('Failed to create moment. Please try again.');
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleStartEdit = (moment: MomentState) => {
    setEditingId(moment.id);
    setEditCaption(moment.caption || '');
  };

  const handleSaveCaption = async (momentId: string) => {
    try {
      const moment = new Moment(momentId);
      await moment.load();
      await moment.updateCaption(editCaption);
      await loadMoments();
      setEditingId(null);
      setEditCaption('');
    } catch (error) {
      console.error('Error updating caption:', error);
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditCaption('');
  };

  const handleDelete = async (momentId: string) => {
    if (!confirm('Delete this moment? This cannot be undone.')) {
      return;
    }

    try {
      const moment = new Moment(momentId);
      await moment.load();
      await moment.delete();
      await loadMoments();
    } catch (error) {
      console.error('Error deleting moment:', error);
      alert('Failed to delete moment. Please try again.');
    }
  };

  const checkAndLoadTodaysMessage = async () => {
    const savedValues = localStorage.getItem('stela-values');
    if (!savedValues) return;

    const events = await eventStore.getAllEvents();
    const messageEvents = events.filter((e) => e.aggregateType === 'StelaMessage');
    const messageIds = [...new Set(messageEvents.map((e) => e.aggregateId))];

    // Find today's message (not dismissed)
    const today = new Date().toDateString();
    for (const messageId of messageIds) {
      const message = new StelaMessage(messageId);
      await message.load();
      const state = message.getState();
      
      if (state && !state.dismissed) {
        const messageDate = new Date(state.generatedAt).toDateString();
        if (messageDate === today) {
          setMomentsMessage(state);
          return;
        }
      }
    }

    // No message for today - generate one
    await generateMessage();
  };

  const generateMessage = async (customValues?: string[]) => {
    setGeneratingMessage(true);
    try {
      const savedValues = customValues || JSON.parse(localStorage.getItem('stela-values') || '[]');
      
      if (savedValues.length === 0) {
        setShowOnboarding(true);
        return;
      }

      const response = await fetch('/api/ai/generate-stela-message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userValues: savedValues }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate message');
      }

      const { message, category } = await response.json();

      // Save as new StelaMessage
      const messageId = `stela-${Date.now()}`;
      const stelaMessage = new StelaMessage(messageId);
      await stelaMessage.create(message, category);

      const state = stelaMessage.getState();
      if (state) {
        setMomentsMessage(state);
      }
    } catch (error) {
      console.error('Error generating message:', error);
      alert('Failed to generate message. Please try again.');
    } finally {
      setGeneratingMessage(false);
    }
  };

  const handleDismissMessage = async (reason?: 'not-relevant' | 'done' | 'later') => {
    if (!momentsMessage) return;

    const message = new StelaMessage(momentsMessage.id);
    await message.load();
    await message.dismiss(reason);

    setMomentsMessage(null);

    if (reason === 'not-relevant') {
      const shouldRegenerate = confirm('Would you like to generate a different message?');
      if (shouldRegenerate) {
        await generateMessage();
      }
    }
  };

  const handleOnboardingComplete = async (values: string[]) => {
    setShowOnboarding(false);
    await generateMessage(values);
  };

  const handleOnboardingSkip = () => {
    setShowOnboarding(false);
    localStorage.setItem('stela-onboarding-dismissed', 'true');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading moments...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Moments</h1>
            <p className="text-muted-foreground mt-1">
              Life's spontaneous captures
            </p>
          </div>
          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleFileSelect}
              className="hidden"
            />
            <Button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              size="lg"
            >
              <Camera className="h-5 w-5 mr-2" />
              {uploading ? 'Uploading...' : 'Capture Moment'}
            </Button>
          </div>
        </div>

        {/* Moments Message (Daily Message) */}
        {momentsMessage && (
          <div className="mb-8">
            <StelaMessageCard
              message={momentsMessage.message}
              category={momentsMessage.category}
              onDismiss={handleDismissMessage}
              onRegenerate={() => generateMessage()}
              onSettings={() => setShowOnboarding(true)}
              loading={generatingMessage}
            />
          </div>
        )}

        {/* Moments Grid */}
        {moments.length === 0 ? (
          <Card className="p-12 text-center">
            <Camera className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">
              No moments yet
            </h3>
            <p className="text-muted-foreground mb-6">
              Start capturing spontaneous moments from your journey
            </p>
            <Button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
            >
              <Camera className="h-4 w-4 mr-2" />
              Capture Your First Moment
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {moments.map((moment) => (
              <Card key={moment.id} className="overflow-hidden group">
                {/* Photo */}
                <div className="aspect-[4/3] relative bg-muted">
                  <img
                    src={moment.photoData}
                    alt={moment.caption || 'Moment'}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    {editingId !== moment.id && (
                      <>
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => handleStartEdit(moment)}
                        >
                          <Edit2 className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(moment.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>

                {/* Caption */}
                <div className="p-4">
                  <p className="text-xs text-muted-foreground mb-2">
                    {format(new Date(moment.createdAt), "MMM d, ''yy")}
                  </p>
                  
                  {editingId === moment.id ? (
                    <div className="space-y-2">
                      <Input
                        value={editCaption}
                        onChange={(e) => setEditCaption(e.target.value)}
                        placeholder="Add a caption..."
                        className="text-sm"
                        autoFocus
                      />
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleSaveCaption(moment.id)}
                        >
                          <Check className="h-3 w-3 mr-1" />
                          Save
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={handleCancelEdit}
                        >
                          <X className="h-3 w-3 mr-1" />
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-foreground">
                      {moment.caption || (
                        <span className="text-muted-foreground italic">
                          No caption
                        </span>
                      )}
                    </p>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Onboarding Modal */}
      {showOnboarding && (
        <StelaOnboarding
          onComplete={handleOnboardingComplete}
          onSkip={handleOnboardingSkip}
        />
      )}
    </div>
  );
}
