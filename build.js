import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { marked } from 'marked';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const projectFilesDir = path.resolve(__dirname, 'Project Files');
const outputFilePath = path.resolve(__dirname, 'public/projects.json');

function buildProjectsJson() {
  const projects = [];

  fs.readdirSync(projectFilesDir).forEach((projectDir) => {
    const projectPath = path.join(projectFilesDir, projectDir);
    const coverImagePath = path.join('images', `${projectDir}-Image.jpeg`);
    const descriptionPath = path.join(projectPath, 'description.md');

    let descriptionHtml = '';
    if (fs.existsSync(descriptionPath)) {
      const descriptionMarkdown = fs.readFileSync(descriptionPath, 'utf-8');
      descriptionHtml = marked(descriptionMarkdown); // Convert markdown to HTML
    }

    projects.push({
      name: projectDir,
      description: descriptionHtml,
      coverImagePath,
    });
  });

  fs.writeFileSync(outputFilePath, JSON.stringify(projects, null, 2));
  console.log('projects.json has been updated successfully.');
}

buildProjectsJson();