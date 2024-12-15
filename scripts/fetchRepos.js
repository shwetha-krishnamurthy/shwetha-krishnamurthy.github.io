const USERNAME = 'shwetha-krishnamurthy'; // Replace with your GitHub username

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

  // Render a short excerpt from the README
  let shortText = readme.trim().split('\n\n')[0] || readme;
  if (shortText.length > 200) {
    shortText = shortText.slice(0, 200) + '...';
  }

  const renderedHTML = marked.parse(shortText);
  const excerpt = document.createElement('div');
  excerpt.innerHTML = renderedHTML;

  // "View Project" links to the GitHub repo by default
  const linkContainer = document.createElement('div');
  linkContainer.style.display = 'flex';
  linkContainer.style.gap = '10px';
  
  const viewProjectLink = document.createElement('a');
  viewProjectLink.href = repo.html_url; 
  viewProjectLink.target = '_blank';
  viewProjectLink.textContent = 'View Project';
  viewProjectLink.className = 'btn-project'; // Add a class if you want different styling

  linkContainer.appendChild(viewProjectLink);

  // If homepage field is present and not empty, add another link
  if (repo.homepage && repo.homepage.trim() !== '') {
    const websiteLink = document.createElement('a');
    websiteLink.href = repo.homepage;
    websiteLink.target = '_blank';
    websiteLink.textContent = 'Visit Website';
    websiteLink.className = 'btn-website'; // Add a class for styling
    linkContainer.appendChild(websiteLink);
  }

  tile.appendChild(title);
  tile.appendChild(excerpt);
  tile.appendChild(linkContainer);

  return tile;
}
