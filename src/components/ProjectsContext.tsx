'use client'
import React, { createContext, useContext, useState, ReactNode, useRef } from 'react';

interface ProjectsContextType {
  projects: DesignItem[];
  setProjects: React.Dispatch<React.SetStateAction<DesignItem[]>>;
  isCreatingProjectRef: React.RefObject<boolean>;
}


const ProjectsContext = createContext<ProjectsContextType | undefined>(undefined);

export const ProjectsProvider = ({ children }: { children: ReactNode }) => {
  const [projects, setProjects] = useState<DesignItem[]>([]);
  const isCreatingProjectRef = useRef<boolean>(false);

  return (
      <ProjectsContext.Provider value={{ projects, setProjects , isCreatingProjectRef }}>
      {children}
    </ProjectsContext.Provider>
  );
};

export const useProjects = () => {
  const context = useContext(ProjectsContext);
  if (!context) {
    throw new Error('useProjects must be used within a ProjectsProvider');
  }
  return context;
};
