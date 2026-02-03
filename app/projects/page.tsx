'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Plus, FolderKanban, Clock, CheckCircle2, Circle, Sparkles, X, Trash2 } from 'lucide-react';
import { eventStore } from '@/lib/events/store';
import { Project, type ProjectState } from '@/lib/aggregates/project';
import { v4 as uuidv4 } from 'uuid';

export default function ProjectsPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<ProjectState[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAIForm, setShowAIForm] = useState(false);
  const [aiDescription, setAiDescription] = useState('');
  const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    setLoading(true);
    try {
      const events = await eventStore.getAllEvents();
      const projectEvents = events.filter((e) => e.aggregateType === 'project');
      
      // Get unique project IDs
      const projectIds = Array.from(new Set(projectEvents.map((e) => e.aggregateId)));
      
      // Load each project
      const loadedProjects = await Promise.all(
        projectIds.map(async (id) => {
          const project = new Project(id);
          return await project.load();
        })
      );

      // Filter out archived projects
      setProjects(loadedProjects.filter((p) => !p.archived));
    } catch (error) {
      console.error('Error loading projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProjectWithAI = async () => {
    setAiLoading(true);
    try {
      const response = await fetch('/api/ai/suggest-project', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description: aiDescription }),
      });

      if (!response.ok) {
        throw new Error('Failed to get AI suggestion');
      }

      const data = await response.json();
      const suggestion = data.suggestion;

      // Create project with AI suggestion
      const projectId = uuidv4();
      const project = new Project(projectId);
      
      await project.create({
        title: suggestion.title,
        description: suggestion.description,
        category: suggestion.category,
      });

      // Add all suggested phases
      await project.load();
      for (const phaseName of suggestion.phases) {
        await project.addPhase(phaseName);
      }

      // Reset form and navigate
      setShowAIForm(false);
      setAiDescription('');
      router.push(`/projects/${projectId}`);
    } catch (error) {
      console.error('Error creating project with AI:', error);
      alert('Failed to create project. Please try again.');
    } finally {
      setAiLoading(false);
    }
  };

  const handleCreateProject = async () => {
    const projectId = uuidv4();
    const project = new Project(projectId);
    
    await project.create({
      title: 'New Project',
      description: 'Click to edit and add details',
      category: 'home-improvement',
    });

    router.push(`/projects/${projectId}`);
  };

  const handleDeleteProject = async (projectId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!confirm('Are you sure you want to delete this project? This cannot be undone.')) {
      return;
    }

    try {
      const project = new Project(projectId);
      await project.load();
      await project.archive();
      await loadProjects();
    } catch (error) {
      console.error('Error deleting project:', error);
      alert('Failed to delete project. Please try again.');
    }
  };

  const getPhaseStats = (project: ProjectState) => {
    const total = project.phases.length;
    const completed = project.phases.filter((p) => p.status === 'complete').length;
    const inProgress = project.phases.filter((p) => p.status === 'in-progress').length;
    
    return { total, completed, inProgress };
  };

  if (loading) {
    return (
      <div className="container mx-auto max-w-4xl py-8">
        <div className="flex items-center justify-center py-12">
          <p className="text-muted-foreground">Loading projects...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-4xl py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Projects</h1>
          <p className="text-muted-foreground">
            Track progress on meaningful projects with phases and photos
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setShowAIForm(true)} variant="default">
            <Sparkles className="h-4 w-4 mr-2" />
            AI Project
          </Button>
          <Button onClick={handleCreateProject} variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            Manual
          </Button>
        </div>
      </div>

      {/* AI Project Form */}
      {showAIForm && (
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-amber-500" />
                  AI Project Assistant
                </CardTitle>
                <CardDescription>
                  Describe your project in any way - spelling errors OK! AI will organize it.
                </CardDescription>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setShowAIForm(false);
                  setAiDescription('');
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Describe your project</Label>
              <Textarea
                value={aiDescription}
                onChange={(e) => setAiDescription(e.target.value)}
                placeholder="Example: i need remove all spackle and mold, respackle, fix cracks, respackle around windows, repaint everything with primer, paint wall, remove and apply cauck around sink, and bathtub and toulet"
                rows={4}
                className="mt-2"
              />
              <p className="text-xs text-muted-foreground mt-2">
                AI will fix spelling, extract phases, and create your project ready to go!
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleCreateProjectWithAI}
                disabled={aiLoading || !aiDescription.trim()}
              >
                {aiLoading ? (
                  <>
                    <span className="animate-spin mr-2">⏳</span>
                    Creating Project...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Create Project with AI
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setShowAIForm(false);
                  setAiDescription('');
                }}
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Projects List */}
      {projects.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <FolderKanban className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">No projects yet</h3>
            <p className="text-muted-foreground mb-4">
              Create your first project to track progress with phases and photos
            </p>
            <Button onClick={handleCreateProject}>
              <Plus className="h-4 w-4 mr-2" />
              Create Project
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {projects.map((project) => {
            const stats = getPhaseStats(project);
            
            // Weighted average progress
            const phaseProgressSum = project.phases.reduce((sum, p) => sum + (p.progress || 0), 0);
            const avgProgress = stats.total > 0 ? phaseProgressSum / stats.total : 0;
            
            // Total time
            const totalMinutes = project.phases.reduce((sum, p) => sum + (p.timeSpentMinutes || 0), 0);
            const totalHours = Math.floor(totalMinutes / 60);
            const remainingMins = totalMinutes % 60;
            
            // Get up to 5 photos chronologically (avoid duplicates)
            const allPhotos = project.phases.flatMap(p => p.photos).sort((a, b) => a.addedAt - b.addedAt);
            const photosToShow = allPhotos.slice(0, 5); // Just take first 5

            return (
              <Card
                key={project.id}
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => router.push(`/projects/${project.id}`)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="flex items-center gap-2">
                        <FolderKanban className="h-5 w-5 text-blue-500" />
                        {project.title}
                      </CardTitle>
                      {project.description && (
                        <CardDescription className="mt-1">
                          {project.description}
                        </CardDescription>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => handleDeleteProject(project.id, e)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>

                <CardContent>
                  {/* Photos with dates */}
                  {photosToShow.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {photosToShow.map((photo, idx) => (
                        <div key={idx} className="relative">
                          <img
                            src={photo.data}
                            alt={`Photo ${idx + 1}`}
                            className="w-24 h-24 object-cover rounded-lg"
                          />
                          <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs text-center py-1 rounded-b-lg">
                            {format(new Date(photo.addedAt), "MMM d, ''yy")}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {/* Progress Bar */}
                  {stats.total > 0 && (
                    <div className="mb-4">
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span className="text-muted-foreground">Overall Progress</span>
                        <span className="font-medium">{Math.round(avgProgress)}%</span>
                      </div>
                      <div className="h-2 bg-secondary rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-500 transition-all"
                          style={{ width: `${avgProgress}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Stats */}
                  <div className="flex items-center gap-4 text-sm flex-wrap">
                    {totalMinutes > 0 && (
                      <div className="flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium">
                        <Clock className="h-4 w-4" />
                        <span>
                          {totalHours > 0 ? `${totalHours}h${remainingMins > 0 ? ` ${remainingMins}m` : ''}` : `${remainingMins}m`}
                        </span>
                      </div>
                    )}
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <span>{stats.total} phases</span>
                    </div>
                    {stats.inProgress > 0 && (
                      <div className="flex items-center gap-1 text-amber-600">
                        <Circle className="h-4 w-4 fill-current" />
                        <span>{stats.inProgress} in progress</span>
                      </div>
                    )}
                    {stats.completed > 0 && (
                      <div className="flex items-center gap-1 text-green-600">
                        <CheckCircle2 className="h-4 w-4" />
                        <span>{stats.completed} complete</span>
                      </div>
                    )}
                  </div>

                  {/* Category Badge */}
                  {project.category && (
                    <div className="mt-3">
                      <span className="text-xs px-2 py-1 bg-secondary rounded-full">
                        {project.category.replace(/-/g, ' ')}
                      </span>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
