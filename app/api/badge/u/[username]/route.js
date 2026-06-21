import config from '../../../../../config.json';

const ROAST_SIGNAL_PATTERNS = [
  {
    test: /fork|forks?/i,
    roastLevel: 'Fork Collector 🔥',
    color: '#ff4500'
  },
  {
    test: /stack overflow|copy|paste|tutorial|copy-paste/i,
    roastLevel: 'StackOverflow Addict 🧠',
    color: '#f48024'
  },
  {
    test: /commit|push|message|history/i,
    roastLevel: 'Commit Chaos 🌪️',
    color: '#9b59b6'
  },
  {
    test: /deploy|production|hotfix|crash/i,
    roastLevel: 'Production Crasher 💣',
    color: '#e74c3c'
  },
  {
    test: /readme|docs?|documentation/i,
    roastLevel: 'Documentation Evader 🙈',
    color: '#34495e'
  },
  {
    test: /ai|chatgpt|prompt|gpt/i,
    roastLevel: 'Prompt Engineer 🤖',
    color: '#1abc9c'
  },
  {
    test: /todo|task|list/i,
    roastLevel: 'Todo Overlord 📝',
    color: '#f1c40f'
  }
];

function getRoastSignal(roastText = '') {
  return ROAST_SIGNAL_PATTERNS.find((signal) => signal.test.test(roastText)) || {
    roastLevel: 'GitHub Menace 💀',
    color: '#2c3e50'
  };
}

export async function GET(req, { params }) {
  const resolvedParams = await params;
  let username = resolvedParams.username || '';
  
  // Strip .svg extension if present
  username = username.replace(/\.svg$/i, '').toLowerCase();

  let roastLevel = 'Not Roasted ❓';
  let badgeColor = '#7f8c8d';

  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || config.url;
    const res = await fetch(`${apiUrl}/api/roast/${encodeURIComponent(username)}`);
    
    if (res.ok) {
      const data = await res.json();
      if (data.success && data.type === 'summaries' && data.data?.aiSummaries?.detailedRoast) {
        const roastText = data.data.aiSummaries.detailedRoast;
        const signal = getRoastSignal(roastText);
        roastLevel = signal.roastLevel;
        badgeColor = signal.color;
      }
    }
  } catch (error) {
    console.error('Error fetching roast for badge:', error);
  }

  // Calculate text widths roughly
  const leftText = 'DevDestroyed';
  const rightText = roastLevel;
  
  const leftWidth = 95;
  const rightWidth = Math.max(100, rightText.length * 7.5 + 15);
  const totalWidth = leftWidth + rightWidth;

  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${totalWidth}" height="20" role="img" aria-label="${leftText}: ${rightText}">
  <linearGradient id="s" x2="0" y2="100%">
    <stop offset="0" stop-color="#bbb" stop-opacity=".1"/>
    <stop offset="1" stop-opacity=".1"/>
  </linearGradient>
  <clipPath id="r">
    <rect width="${totalWidth}" height="20" rx="4" fill="#fff"/>
  </clipPath>
  <g clip-path="url(#r)">
    <rect width="${leftWidth}" height="20" fill="#202224"/>
    <rect x="${leftWidth}" width="${rightWidth}" height="20" fill="${badgeColor}"/>
    <rect width="${totalWidth}" height="20" fill="url(#s)"/>
  </g>
  <g fill="#fff" text-anchor="middle" font-family="Verdana,Geneva,DejaVu Sans,sans-serif" text-rendering="geometricPrecision" font-size="110">
    <text aria-hidden="true" x="${(leftWidth / 2) * 10}" y="150" fill="#010101" fill-opacity=".3" transform="scale(.1)" textLength="${(leftWidth - 15) * 10}">${leftText}</text>
    <text x="${(leftWidth / 2) * 10}" y="140" transform="scale(.1)" fill="#fff" textLength="${(leftWidth - 15) * 10}">${leftText}</text>
    <text aria-hidden="true" x="${(leftWidth + rightWidth / 2) * 10}" y="150" fill="#010101" fill-opacity=".3" transform="scale(.1)" textLength="${(rightWidth - 20) * 10}">${rightText}</text>
    <text x="${(leftWidth + rightWidth / 2) * 10}" y="140" transform="scale(.1)" fill="#fff" textLength="${(rightWidth - 20) * 10}">${rightText}</text>
  </g>
</svg>
`.trim();

  return new Response(svg, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
    },
  });
}
