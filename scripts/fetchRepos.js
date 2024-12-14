// Replace with your GitHub username
const USERNAME = 'shwetha-krishnamurthy';

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
  // Attempt to fetch raw README from the main branch
  const rawUrl = `https://raw.githubusercontent.com/${USERNAME}/${repoName}/main/README.md`;
  
  const response = await fetch(rawUrl);
  if (!response.ok) {
    // Try 'master' branch if 'main' not available or no README
    const altUrl = `https://raw.githubusercontent.com/${USERNAME}/${repoName}/master/README.md`;
    const altResponse = await fetch(altUrl);
    if (altResponse.ok) {
      return altResponse.text();
    } else {
      return ""; // No README found
    }
  }
  return response.text();
}

function categorizeRepo(readme) {
  const text = readme.toLowerCase();

  // Check GenAI
  if (text.includes('rag') || text.includes('langchain') || text.includes('generative ai')) {
    return 'genai-projects';
  }

  // Check Computer Vision
  if (text.includes('vision') || text.includes('opencv')) {
    return 'cv-projects';
  }

  // Check Deep Learning
  if (text.includes('deep learning') || text.includes('lstms')) {
    return 'dl-projects';
  }

  // Check Parallel Programming
  if (text.includes('cuda') || text.includes('openmp')) {
    return 'pp-projects';
  }

  // If no category matched, return null (or handle a "Misc" category)
  return null;
}

function createRepoTile(repo, readme) {
  const tile = document.createElement('div');
  tile.className = 'project-tile';

  const title = document.createElement('h3');
  title.textContent = repo.name;

  const excerpt = document.createElement('p');
  excerpt.textContent = readme.slice(0, 150) + '...';

  const link = document.createElement('a');
  // If repo has a homepage set, link to that. Otherwise link to GitHub
  link.href = repo.homepage ? repo.homepage : repo.html_url;
  link.target = '_blank';
  link.textContent = 'View Project';

  tile.appendChild(title);
  tile.appendChild(excerpt);
  tile.appendChild(link);

  return tile;
}
