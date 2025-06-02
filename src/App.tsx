import './App.css'
import React, { useEffect, useState } from 'react';
import ProjectCard from './ProjectCard';
import { loadProjects, type Project } from './ProjectData';

function App() {
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    const fetchProjects = async () => {
      const loadedProjects = await loadProjects();
      setProjects(loadedProjects);
    };

    fetchProjects();
  }, []);

  return (
    <>
    <div className="App">
      <h1>Sam Jackson</h1>

      <h3>Making things</h3>
      <div className="project-list">
        {projects.map((project) => (
          <ProjectCard
            key={project.name}
            name={project.name}
            description={project.description}
            coverImage={project.coverImage}
          />
        ))}
      </div>
    </div>
    </>
  )
}

export default App
