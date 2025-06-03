import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { marked } from 'marked';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const projectFilesDir = path.resolve(__dirname, 'Project Files');
const publicImagesDir = path.resolve(__dirname, 'public/images');
const outputFilePath = path.resolve(__dirname, 'public/projects.json');

// Ensure the public/images directory exists
if (!fs.existsSync(publicImagesDir)) {
  fs.mkdirSync(publicImagesDir, { recursive: true });
}

function buildProjectsJson() {
  const projects = [];

  fs.readdirSync(projectFilesDir).forEach((projectDir) => {
    const projectPath = path.join(projectFilesDir, projectDir);
    const coverImagePath = path.join(projectPath, 'cover.jpeg');
    const descriptionPath = path.join(projectPath, 'description.md');

    let descriptionHtml = '';
    if (fs.existsSync(descriptionPath)) {
      const descriptionMarkdown = fs.readFileSync(descriptionPath, 'utf-8');

      // Adjust image paths in markdown to be relative to the public directory
      const adjustedMarkdown = descriptionMarkdown.replace(/src="(.*?)"/g, (match, p1) => {
        const adjustedPath = path.join('/Project Files', projectDir, p1);
        return `src="${adjustedPath}"`;
      });

      descriptionHtml = marked(adjustedMarkdown); // Convert markdown to HTML
    }

    // Copy the cover image to the public/images directory
    const publicCoverImagePath = path.join(publicImagesDir, `${projectDir}-cover.jpeg`);
    if (fs.existsSync(coverImagePath)) {
      fs.copyFileSync(coverImagePath, publicCoverImagePath);
    }

    projects.push({
      name: projectDir,
      description: descriptionHtml,
      coverImagePath: path.relative(__dirname, publicCoverImagePath),
    });
  });

  fs.writeFileSync(outputFilePath, JSON.stringify(projects, null, 2));
  console.log('projects.json has been updated successfully.');
}

buildProjectsJson();