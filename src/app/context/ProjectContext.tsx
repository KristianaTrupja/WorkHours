"use client";
import { createContext, useContext, useState, ReactNode } from "react";
// import { useWorkHours } from "./WorkHoursContext";
import { ProjectData } from "@/types/project";

type ProjectContextType = {
  sidebarProjects: ProjectData[];
  setSidebarProjects: (projects: ProjectData[]) => void;
  allProjectKeys: string[];
};

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const ProjectProvider = ({ children }: { children: ReactNode }) => {
  const [sidebarProjects, setSidebarProjects] = useState<ProjectData[]>([]);

  // Extract unique projectKeys from sidebarProjects
  const allProjectKeys = sidebarProjects.flatMap((p) =>
    p.projects.map((proj) => proj.projectKey)
  );
  
  return (
    <ProjectContext.Provider
      value={{
        sidebarProjects,
        setSidebarProjects,
        allProjectKeys,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};

export const useProjects = (): ProjectContextType => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error("useProjects must be used within a ProjectProvider");
  }
  return context;
};