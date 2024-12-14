const USERNAME = 'shwetha-krishnamurthy'; // Replace with your GitHub username

document.addEventListener('DOMContentLoaded', fetchAndDisplayProjects);

async function fetchAndDisplayProjects() {
  const repos = await fetchRepos();
  for (const repo of repos) {
    // Skip forks
    if (repo.fork) continue;

    const readmeText = await fetchReadme(repo.name);
    const category = categorizeRepo(readmeText);
    if (category) {
      const repoTile = createRepoTile(repo, readmeText);
      document.getElementById(category).appendChild(repoTile);
    }
  }
}

async function fetchRepos() {
  const response = await fetch(`https://api.github.com/users/${USERNAME}/repos?per_page=100`);
  return response.json();
}

async function fetchReadme(repoName) {
  // Try main branch
  const mainUrl = `https://raw.githubusercontent.com/${USERNAME}/${repoName}/main/README.md`;
  let response = await fetch(mainUrl);
  if (!response.ok) {
    // Try master branch if main not found
    const masterUrl = `https://raw.githubusercontent.com/${USERNAME}/${repoName}/master/README.md`;
    response = await fetch(masterUrl);
    if (!response.ok) {
      return ""; // No README found
    }
  }
  return response.text();
}

function categorizeRepo(readme) {
  const text = readme.toLowerCase();

  // GenAI keywords
  if (text.includes('rag') || text.includes('langchain') || text.includes('generative ai')) {
    return 'genai-projects';
  }

  // Computer Vision keywords
  if (text.includes('vision') || text.includes('opencv')) {
    return 'cv-projects';
  }

  // Deep Learning keywords
  if (text.includes('deep learning') || text.includes('lstms')) {
    return 'dl-projects';
  }

  // Parallel Programming keywords
  if (text.includes('cuda') || text.includes('openmp')) {
    return 'pp-projects';
  }

  // No match, return null
  return null;
}

function createRepoTile(repo, readme) {
  const tile = document.createElement('div');
  tile.className = 'project-tile';

  const title = document.createElement('h3');
  title.textContent = repo.name;

  const excerpt = document.createElement('p');
  excerpt.textContent = readme.slice(0, 150).trim() + (readme.length > 150 ? '...' : '');

  const link = document.createElement('a');
  link.href = repo.homepage && repo.homepage !== '' ? repo.homepage : repo.html_url;
  link.target = '_blank';
  link.textContent = 'View Project';

  tile.appendChild(title);
  tile.appendChild(excerpt);
  tile.appendChild(link);

  return tile;
}
