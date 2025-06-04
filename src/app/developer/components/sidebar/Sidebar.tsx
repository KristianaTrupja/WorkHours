'use client';

import { useState, useEffect, useCallback } from 'react';
import { useProjects } from '@/app/context/ProjectContext';
import { useCalendar } from '@/app/context/CalendarContext';
import SidebarContent from './SidebarContent';
import ProjectModalContainer from './ProjectModalContainer';
import { ProjectData, ProjectEntry } from '@/types/project';

export default function Sidebar() {
  const { setSidebarProjects, sidebarProjects } = useProjects();
  const { month, year } = useCalendar();

  const [projectsData, setProjectsData] = useState<ProjectData[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProjects, setSelectedProjects] = useState<string[]>([]);

  const getStorageKey = useCallback(() => `sidebar-projects-${year}-${month}`, [year, month]);

  const getStoredProjects = (key: string): ProjectData[] => {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error('Failed to parse localStorage data:', e);
      return [];
    }
  };

  const storeProjects = (key: string, projects: ProjectData[]) => {
    localStorage.setItem(key, JSON.stringify(projects));
  };

  const groupProjects = (entries: ProjectEntry[]): ProjectData[] => {
    const grouped = entries.reduce((acc, { id, company, project }) => {
      if (!acc[company]) acc[company] = [];
      acc[company].push({ title: project, projectKey: `PID-${id}` });
      return acc;
    }, {} as Record<string, { title: string; projectKey: string }[]>);

    return Object.entries(grouped).map(([company, projects]) => ({ company, projects }));
  };

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch('/api/projectList');
        const data: ProjectEntry[] = await res.json();
        setProjectsData(groupProjects(data));
      } catch (err) {
        console.error('Failed to fetch projects:', err);
      }
    };

    fetchProjects();
  }, []);

  useEffect(() => {
    const key = getStorageKey();
    const saved = getStoredProjects(key);
    if (JSON.stringify(saved) !== JSON.stringify(sidebarProjects)) {
      setSidebarProjects(saved);
    }
  }, [getStorageKey, sidebarProjects, setSidebarProjects]);

  const toggleProjectSelection = (company: string, projectKey: string) => {
    const key = `${company}-${projectKey}`;
    setSelectedProjects((prev) =>
      prev.includes(key) ? prev.filter((p) => p !== key) : [...prev, key]
    );
  };

  const handleSubmit = () => {
    const selected: ProjectData[] = projectsData
      .map(({ company, projects }) => {
        const filtered = projects.filter(p =>
          selectedProjects.includes(`${company}-${p.projectKey}`)
        );
        return filtered.length ? { company, projects: filtered } : null;
      })
      .filter(Boolean) as ProjectData[];

    const mergedMap: Record<string, Map<string, string>> = {};

    [...sidebarProjects, ...selected].forEach(({ company, projects }) => {
      if (!mergedMap[company]) mergedMap[company] = new Map();
      projects.forEach(({ projectKey, title }: { projectKey: string; title: string }) =>
        mergedMap[company].set(projectKey, title)
      );
    });

    const mergedProjects: ProjectData[] = Object.entries(mergedMap).map(
      ([company, map]) => ({
        company,
        projects: Array.from(map.entries()).map(([projectKey, title]) => ({
          title,
          projectKey,
        })),
      })
    );

    const key = getStorageKey();
    storeProjects(key, mergedProjects);
    setSidebarProjects(mergedProjects);
    setSelectedProjects([]);
    setIsModalOpen(false);
  };

  return (
    <>
      <SidebarContent
        sidebarProjects={sidebarProjects}
        openModal={() => setIsModalOpen(true)}
      />
      <ProjectModalContainer
        isModalOpen={isModalOpen}
        closeModal={() => {
          setSelectedProjects([]);
          setIsModalOpen(false);
        }}
        projectsData={projectsData}
        selectedProjects={selectedProjects}
        sidebarProjects={sidebarProjects}
        toggleSelection={toggleProjectSelection}
        handleSubmit={handleSubmit}
      />
    </>
  );
}
