import './App.css'
import React, { useEffect, useState } from 'react';
import ProjectCard from './Views/ProjectCard';
import { loadProjects, type Project } from './Model/ProjectData';
import FrontPage from './Views/FrontPage';

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

      <FrontPage />

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
