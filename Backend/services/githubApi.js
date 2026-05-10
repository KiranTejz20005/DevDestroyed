
/**
 * Fetches GitHub user profile data.
 * @param {string} username 
 * @returns {Promise<Object>}
 */
export async function fetchGitHubProfile(username) {
  const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
  const headers = {
    'Accept': 'application/vnd.github.v3+json',
    'User-Agent': 'DevDestroyed-GitHub-Roaster'
  };

  if (GITHUB_TOKEN) {
    headers['Authorization'] = `token ${GITHUB_TOKEN}`;
  }

  const response = await fetch(`https://api.github.com/users/${username}`, { headers });

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('GitHub user not found');
    }
    throw new Error(`GitHub API error: ${response.status}`);
  }

  return response.json();
}

/**
 * Fetches GitHub repositories for a user.
 * @param {string} username 
 * @param {number} maxRepos 
 * @returns {Promise<Array>}
 */
export async function fetchGitHubRepos(username, maxRepos = 100) {
  const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
  const headers = {
    'Accept': 'application/vnd.github.v3+json',
    'User-Agent': 'DevDestroyed-GitHub-Roaster'
  };

  if (GITHUB_TOKEN) {
    headers['Authorization'] = `token ${GITHUB_TOKEN}`;
  }

  const response = await fetch(`https://api.github.com/users/${username}/repos?per_page=${maxRepos}&sort=updated`, { headers });

  if (!response.ok) {
    throw new Error(`GitHub API error: ${response.status}`);
  }

  return response.json();
}
