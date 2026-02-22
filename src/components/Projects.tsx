'use client'
import React from 'react';
import { ArrowUpRight, Clock } from 'lucide-react';
import Image from 'next/image';
import { useProjects } from './ProjectsContext';

function Projects() {
  const { projects } = useProjects();

  return (
    <section className="projects">
      <div className="section-inner">
        <div className="section-head">
          <div className="copy">
            <h2>Projects</h2>
            <p>Your Latest work and shared community projects, all in one place</p>
          </div>
        </div>

        <div className="projects-grid">
          {projects.map((project) => (
            <div key={project.id} className="project-card group">
              <div className="preview">
                <Image alt="Project" src={project.renderedImage || project.sourceImage} width={500} height={500} />
                <div className="badge">
                  <span>Private</span>
                </div>
              </div>
              <div className="card-body">
                <div>
                  <h3>{project.name}</h3>
                  <div className="meta">
                    <Clock className="icon" />
                    <span>{new Date(project.timestamp).toLocaleDateString()}</span>
                    <span>By You</span>
                  </div>
                </div>
                <div className="arrow">
                  <ArrowUpRight className="icon" size={18} />
                </div>
              </div>
            </div>
          ))}
          {projects.length === 0 && (
            <p>No projects yet. Upload a floor plan to get started!</p>
          )}
        </div>
      </div>
    </section>
  );
}

export default Projects;