'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, FolderKanban, Clock, CheckCircle2, Circle } from 'lucide-react';
import { eventStore } from '@/lib/events/store';
import { Project, type ProjectState } from '@/lib/aggregates/project';
import { v4 as uuidv4 } from 'uuid';

export default function ProjectsPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<ProjectState[]>([]);
  const [loading, setLoading] = useState(true);

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

  const getPhaseStats = (project: ProjectState) => {
    const total = project.phases.length;
    const completed = project.phases.filter((p) => p.status === 'complete').length;
    const inProgress = project.phases.filter((p) => p.status === 'in-progress').length;
    
    return { total, completed, inProgress };
  };

  if (loading) {
    return (
      <div className="container max-w-4xl py-8">
        <div className="flex items-center justify-center py-12">
          <p className="text-muted-foreground">Loading projects...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Projects</h1>
          <p className="text-muted-foreground">
            Track progress on meaningful projects with phases and photos
          </p>
        </div>
        <Button onClick={handleCreateProject}>
          <Plus className="h-4 w-4 mr-2" />
          New Project
        </Button>
      </div>

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
            const progress = stats.total > 0 ? (stats.completed / stats.total) * 100 : 0;

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
                  </div>
                </CardHeader>

                <CardContent>
                  {/* Progress Bar */}
                  {stats.total > 0 && (
                    <div className="mb-4">
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-medium">{Math.round(progress)}%</span>
                      </div>
                      <div className="h-2 bg-secondary rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-500 transition-all"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Phase Stats */}
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Clock className="h-4 w-4" />
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
