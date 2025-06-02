import React from 'react';

interface ProjectCardProps {
  name: string;
  description: string;
  coverImage: string;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ name, description, coverImage }) => {
  return (
    <div className="project-card">
      <img
        src={coverImage}
        alt={`${name} cover`}
        className="project-card-image"
        style={{ width: '200px', height: '200px', objectFit: 'cover' }} // Standard size for formatting
      />
      <div className="project-card-content">
        <h2 className="project-card-title">{name}</h2>
        <div
          className="project-card-description"
          dangerouslySetInnerHTML={{ __html: description }} // Render HTML content
        ></div>
      </div>
    </div>
  );
};

export default ProjectCard;