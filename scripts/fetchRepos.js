const USERNAME = 'shwewtha-krishnamurthy'; // Replace with your GitHub username

document.addEventListener('DOMContentLoaded', fetchAndDisplayProjects);

async function fetchAndDisplayProjects() {
  const repos = await fetchRepos();
  for (const repo of repos) {
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
  const mainUrl = `https://raw.githubusercontent.com/${USERNAME}/${repoName}/main/README.md`;
  let response = await fetch(mainUrl);
  if (!response.ok) {
    const masterUrl = `https://raw.githubusercontent.com/${USERNAME}/${repoName}/master/README.md`;
    response = await fetch(masterUrl);
    if (!response.ok) {
      return "";
    }
  }
  return response.text();
}

function categorizeRepo(readme) {
  const text = readme.toLowerCase();

  if (text.includes('rag') || text.includes('langchain') || text.includes('generative ai')) {
    return 'genai-projects';
  }

  if (text.includes('vision') || text.includes('opencv')) {
    return 'cv-projects';
  }

  if (text.includes('deep learning') || text.includes('lstms')) {
    return 'dl-projects';
  }

  if (text.includes('cuda') || text.includes('openmp')) {
    return 'pp-projects';
  }

  return null;
}

function formatRepoTitle(name) {
  // Remove hyphens and underscores, capitalize each word
  return name
    .replace(/[-_]+/g, ' ')           // Replace hyphens/underscores with spaces
    .split(' ')                       // Split into words
    .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize first letter of each word
    .join(' ');
}

function createRepoTile(repo, readme) {
  const tile = document.createElement('div');
  tile.className = 'project-tile';

  const title = document.createElement('h3');
  title.textContent = formatRepoTitle(repo.name);

  const excerpt = document.createElement('div');
  // Extract the first paragraph or first ~200 chars from the README
  // Then render as Markdown
  let shortText = readme.trim().split('\n\n')[0] || readme;
  // Limit length to prevent huge content
  if (shortText.length > 200) {
    shortText = shortText.slice(0, 200) + '...';
  }
  
  // Render Markdown to HTML using marked
  const renderedHTML = marked.parse(shortText);
  excerpt.innerHTML = renderedHTML;

  const link = document.createElement('a');
  link.href = repo.homepage && repo.homepage !== '' ? repo.homepage : repo.html_url;
  link.target = '_blank';
  link.textContent = 'View Project';

  tile.appendChild(title);
  tile.appendChild(excerpt);
  tile.appendChild(link);

  return tile;
}
