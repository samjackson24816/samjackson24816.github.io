export interface Project {
  name: string;
  description: string;
  coverImage: string;
}

export async function loadProjects(): Promise<Project[]> {
  const projects = await fetch('/projects.json').then((res) => res.json());
  return projects.map((project: { name: string; description: string; coverImagePath: string; }) => {
    console.log(`Loaded project: ${project.name}`);
    console.log(`Description: ${project.description}`);
    console.log(`Cover Image Path: ${project.coverImagePath}`);

    return {
      name: project.name,
      description: project.description,
      coverImage: project.coverImagePath,
    };
  });
}

