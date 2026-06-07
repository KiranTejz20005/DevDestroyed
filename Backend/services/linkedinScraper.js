import axios from 'axios';
import * as cheerio from 'cheerio';

/**
 * Fetches basic public LinkedIn profile data using a simple scraper.
 * Note: LinkedIn has strict scraping protections. For a production app,
 * consider using an API like Proxycurl or RapidAPI.
 * @param {string} profileUrl 
 * @returns {Promise<Object>}
 */
export async function scrapeLinkedInProfile(profileUrl) {
  const url = profileUrl.startsWith('http') ? profileUrl : `https://www.linkedin.com/in/${profileUrl}`;

  // If RAPIDAPI_KEY is available, use Fresh LinkedIn Profile Data API (Free Tier Available)
  if (process.env.RAPIDAPI_KEY && process.env.RAPIDAPI_KEY !== 'YOUR_RAPIDAPI_KEY_HERE') {
    try {
      const response = await axios.get('https://fresh-linkedin-profile-data.p.rapidapi.com/get-linkedin-profile', {
        params: { linkedin_url: url, include_skills: 'true' },
        headers: {
          'x-rapidapi-key': process.env.RAPIDAPI_KEY,
          'x-rapidapi-host': 'fresh-linkedin-profile-data.p.rapidapi.com'
        },
        timeout: 20000,
      });
      
      const profile = response.data?.data || response.data;
      
      // Analyze only the last 10 posts/activities to save on LLM token credits
      const activities = profile.activities || profile.posts || profile.recent_activity || [];
      const recentPosts = activities
        .slice(0, 10)
        .map(a => a.title || a.text || a.body || JSON.stringify(a))
        .filter(Boolean)
        .join('\n\n---\n\n');
        
      const rawText = `
Experiences: ${JSON.stringify(profile.experiences || profile.experience || [])}
Education: ${JSON.stringify(profile.education || [])}
Skills: ${JSON.stringify(profile.skills || [])}

Recent Posts (Last 10):
${recentPosts || 'No recent posts found.'}
      `.substring(0, 8000); // Keep it within token limits

      return {
        success: true,
        data: {
          profileUrl: url,
          name: profile.full_name || profile.name || 'Unknown User',
          headline: profile.headline || profile.job_title || '',
          summary: profile.summary || profile.about || '',
          avatar_url: profile.profile_pic_url || profile.profile_picture || '',
          raw_text: rawText,
        }
      };
    } catch (error) {
      console.error('RapidAPI Error:', error.response?.data || error.message);
      return {
        success: false,
        message: 'RapidAPI failed to fetch profile: ' + (error.response?.data?.message || error.message),
        error: error.message
      };
    }
  }

  // Fallback: If no API key is provided, return an error
  return {
    success: false,
    message: 'RapidAPI key is missing. Basic scraping is blocked by LinkedIn. Please add RAPIDAPI_KEY to your .env file.',
    error: 'MISSING_API_KEY'
  };
}
