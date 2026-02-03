'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  ArrowLeft,
  Plus,
  Edit2,
  Check,
  X,
  Circle,
  CircleDot,
  CheckCircle2,
  Image as ImageIcon,
  Calendar,
  Trash2,
} from 'lucide-react';
import { Project, type ProjectState, type Phase, type PhaseStatus } from '@/lib/aggregates/project';
import { compressImage, formatFileSize, getBase64Size } from '@/lib/image-utils';
import { format } from 'date-fns';

export default function ProjectDetailPage() {
  const router = useRouter();
  const params = useParams();
  const projectId = params.id as string;

  const [project, setProject] = useState<ProjectState | null>(null);
  const [loading, setLoading] = useState(true);
  const [editingProject, setEditingProject] = useState(false);
  const [editingPhase, setEditingPhase] = useState<string | null>(null);
  
  const [projectTitle, setProjectTitle] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  
  const [phaseName, setPhaseName] = useState('');
  const [phaseNotes, setPhaseNotes] = useState('');
  const [phaseProgress, setPhaseProgress] = useState(0);
  const [phaseTimeHours, setPhaseTimeHours] = useState(0);
  const [phaseTimeMinutes, setPhaseTimeMinutes] = useState(0);

  useEffect(() => {
    loadProject();
  }, [projectId]);

  const loadProject = async () => {
    setLoading(true);
    try {
      const proj = new Project(projectId);
      const state = await proj.load();
      setProject(state);
      setProjectTitle(state.title);
      setProjectDescription(state.description || '');
    } catch (error) {
      console.error('Error loading project:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProject = async () => {
    if (!confirm('Are you sure you want to delete this project? This cannot be undone.')) {
      return;
    }

    try {
      const proj = new Project(projectId);
      await proj.load();
      await proj.archive();
      router.push('/projects');
    } catch (error) {
      console.error('Error deleting project:', error);
      alert('Failed to delete project. Please try again.');
    }
  };

  const handleSaveProject = async () => {
    const proj = new Project(projectId);
    await proj.update({
      title: projectTitle,
      description: projectDescription,
    });
    setEditingProject(false);
    await loadProject();
  };

  const handleAddPhase = async () => {
    const name = prompt('Phase name (e.g., "Demo", "Plumbing", "Tiling"):');
    if (!name) return;

    const proj = new Project(projectId);
    await proj.load();
    await proj.addPhase(name);
    await loadProject();
  };

  const handleChangePhaseStatus = async (phaseId: string, status: PhaseStatus) => {
    const proj = new Project(projectId);
    await proj.load();
    await proj.changePhaseStatus(phaseId, status);
    await loadProject();
  };

  const handleSavePhaseDetails = async (phaseId: string) => {
    const proj = new Project(projectId);
    await proj.load();
    
    const totalMinutes = (phaseTimeHours * 60) + phaseTimeMinutes;
    
    await proj.updatePhase(phaseId, { 
      notes: phaseNotes,
      progress: phaseProgress,
      timeSpentMinutes: totalMinutes > 0 ? totalMinutes : undefined,
    });
    setEditingPhase(null);
    await loadProject();
  };

  const handleUploadPhoto = async (phaseId: string) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      // Check file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }

      try {
        // Show original size
        const originalSize = formatFileSize(file.size);
        
        // Compress image
        const compressedData = await compressImage(file, {
          maxWidth: 800,
          maxHeight: 800,
          quality: 0.8,
          maxSizeKB: 200,
        });

        const compressedSize = formatFileSize(getBase64Size(compressedData));
        console.log(`Photo compressed: ${originalSize} → ${compressedSize}`);

        const caption = prompt('Photo caption (optional):');

        const proj = new Project(projectId);
        await proj.load();
        await proj.addPhotoToPhase(phaseId, compressedData, caption || undefined);
        await loadProject();
      } catch (error) {
        console.error('Error uploading photo:', error);
        alert('Failed to upload photo. Please try again with a different image.');
      }
    };

    input.click();
  };

  const getStatusIcon = (status: PhaseStatus) => {
    switch (status) {
      case 'not-started':
        return <Circle className="h-5 w-5 text-gray-400" />;
      case 'in-progress':
        return <CircleDot className="h-5 w-5 text-amber-500" />;
      case 'complete':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
    }
  };

  const getStatusLabel = (status: PhaseStatus) => {
    return status.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  };

  const formatTimeSpent = (minutes?: number) => {
    if (!minutes) return 'No time logged';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours === 0) return `${mins}m`;
    if (mins === 0) return `${hours}h`;
    return `${hours}h ${mins}m`;
  };

  if (loading) {
    return (
      <div className="container mx-auto max-w-4xl py-8">
        <div className="flex items-center justify-center py-12">
          <p className="text-muted-foreground">Loading project...</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="container mx-auto max-w-4xl py-8">
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">Project not found</p>
            <Button onClick={() => router.push('/projects')} className="mt-4">
              Back to Projects
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-4xl py-8">
      {/* Back Button */}
      <Button
        variant="ghost"
        onClick={() => router.push('/projects')}
        className="mb-4"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Projects
      </Button>

      {/* Project Header */}
      <Card className="mb-6">
        <CardHeader>
          {editingProject ? (
            <div className="space-y-4">
              <div>
                <Label>Project Title</Label>
                <Input
                  value={projectTitle}
                  onChange={(e) => setProjectTitle(e.target.value)}
                  placeholder="e.g., Bathroom Remodel"
                />
              </div>
              <div>
                <Label>Description</Label>
                <Textarea
                  value={projectDescription}
                  onChange={(e) => setProjectDescription(e.target.value)}
                  placeholder="What's this project about?"
                  rows={3}
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleSaveProject}>
                  <Check className="h-4 w-4 mr-2" />
                  Save
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setProjectTitle(project.title);
                    setProjectDescription(project.description || '');
                    setEditingProject(false);
                  }}
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-2xl">{project.title}</CardTitle>
                {project.description && (
                  <CardDescription className="mt-2">
                    {project.description}
                  </CardDescription>
                )}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setEditingProject(true)}
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDeleteProject}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardHeader>
      </Card>

      {/* Phases */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Phases</h2>
        <Button onClick={handleAddPhase} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Phase
        </Button>
      </div>

      {project.phases.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Circle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">No phases yet</h3>
            <p className="text-muted-foreground mb-4">
              Break your project into phases to track progress
            </p>
            <Button onClick={handleAddPhase}>
              <Plus className="h-4 w-4 mr-2" />
              Add First Phase
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {project.phases.map((phase) => (
            <Card key={phase.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    {getStatusIcon(phase.status)}
                    <div>
                      <CardTitle className="text-lg">{phase.name}</CardTitle>
                      <CardDescription className="text-sm">
                        {getStatusLabel(phase.status)}
                      </CardDescription>
                    </div>
                  </div>
                  
                  {/* Status Change Buttons */}
                  <div className="flex gap-2">
                    {phase.status !== 'not-started' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleChangePhaseStatus(phase.id, 'not-started')}
                      >
                        Not Started
                      </Button>
                    )}
                    {phase.status !== 'in-progress' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleChangePhaseStatus(phase.id, 'in-progress')}
                      >
                        In Progress
                      </Button>
                    )}
                    {phase.status !== 'complete' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleChangePhaseStatus(phase.id, 'complete')}
                      >
                        Complete
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                {/* Edit Form */}
                {editingPhase === phase.id ? (
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium">Notes</Label>
                      <Textarea
                        value={phaseNotes}
                        onChange={(e) => setPhaseNotes(e.target.value)}
                        placeholder="Add notes about this phase..."
                        rows={3}
                        className="mt-1"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-medium">Progress %</Label>
                        <Input
                          type="number"
                          min="0"
                          max="100"
                          value={phaseProgress}
                          onChange={(e) => setPhaseProgress(Math.min(100, Math.max(0, parseInt(e.target.value) || 0)))}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Time Spent</Label>
                        <div className="flex gap-2 mt-1">
                          <Input
                            type="number"
                            min="0"
                            value={phaseTimeHours}
                            onChange={(e) => setPhaseTimeHours(Math.max(0, parseInt(e.target.value) || 0))}
                            placeholder="Hours"
                          />
                          <Input
                            type="number"
                            min="0"
                            max="59"
                            value={phaseTimeMinutes}
                            onChange={(e) => setPhaseTimeMinutes(Math.min(59, Math.max(0, parseInt(e.target.value) || 0)))}
                            placeholder="Mins"
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleSavePhaseDetails(phase.id)}
                      >
                        <Check className="h-4 w-4 mr-2" />
                        Save
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setEditingPhase(null)}
                      >
                        <X className="h-4 w-4 mr-2" />
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* Notes */}
                    <div 
                      className="mb-4 cursor-pointer hover:bg-secondary p-3 rounded-lg transition-colors"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setEditingPhase(phase.id);
                        setPhaseNotes(phase.notes || '');
                        setPhaseProgress(phase.progress || 0);
                        const totalMins = phase.timeSpentMinutes || 0;
                        setPhaseTimeHours(Math.floor(totalMins / 60));
                        setPhaseTimeMinutes(totalMins % 60);
                      }}
                    >
                      <Label className="text-sm font-medium mb-2 block">Notes</Label>
                      <p className="text-sm text-muted-foreground min-h-[40px]">
                        {phase.notes || 'Click anywhere to add notes, update progress, and log time...'}
                      </p>
                    </div>

                    {/* Progress & Time Stats - Clickable to edit */}
                    <div 
                      className="grid grid-cols-2 gap-4 mb-4 cursor-pointer hover:bg-secondary p-3 rounded-lg transition-colors"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setEditingPhase(phase.id);
                        setPhaseNotes(phase.notes || '');
                        setPhaseProgress(phase.progress || 0);
                        const totalMins = phase.timeSpentMinutes || 0;
                        setPhaseTimeHours(Math.floor(totalMins / 60));
                        setPhaseTimeMinutes(totalMins % 60);
                      }}
                    >
                      <div>
                        <Label className="text-sm font-medium mb-2 block">Progress</Label>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                            <div
                              className="h-full bg-blue-500 transition-all"
                              style={{ width: `${phase.progress || 0}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium">{phase.progress || 0}%</span>
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm font-medium mb-2 block">Time Spent</Label>
                        <p className="text-sm font-medium">{formatTimeSpent(phase.timeSpentMinutes)}</p>
                      </div>
                    </div>
                  </>
                )}

                {/* Photos */}
                <div className="mb-4 p-3">
                  <div className="flex items-center justify-between mb-2">
                    <Label className="text-sm font-medium">Photos</Label>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleUploadPhoto(phase.id)}
                    >
                      <ImageIcon className="h-4 w-4 mr-2" />
                      Upload Photo
                    </Button>
                  </div>
                  
                  {phase.photos.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {phase.photos.map((photo) => (
                        <div key={photo.id} className="space-y-1">
                          <img
                            src={photo.data}
                            alt={photo.caption || 'Phase photo'}
                            className="w-full h-40 object-cover rounded-lg"
                          />
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            <span>{format(new Date(photo.addedAt), 'MMM d, yyyy')}</span>
                          </div>
                          {photo.caption && (
                            <p className="text-xs text-muted-foreground">
                              {photo.caption}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      No photos yet. Click "Upload Photo" to add before/during/after photos.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
