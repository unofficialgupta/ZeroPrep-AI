export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  readTime: string;
  category: string;
  author: string;
  content: string;
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: 'how-to-get-free-gemini-api-key',
    title: 'How to Get a Free Google Gemini API Key in 2 Minutes',
    description:
      'Step-by-step tutorial on generating your official Google Gemini 2.5 Flash API key via Google AI Studio at zero cost.',
    date: 'September 2026',
    readTime: '2 min read',
    category: 'Guides',
    author: 'ZeroPrep AI Team',
    content: `
### Why Gemini 2.5 Flash is the King of Interview Copilots

Google Gemini 2.5 Flash combines sub-600ms latency, massive 2,000,000-token context windows, and unmatched algorithm problem-solving abilities. Best of all, Google offers every developer and Google account a **free tier** of up to 15 requests per minute.

---

### Step 1: Visit Google AI Studio

1. Open your browser and navigate to [aistudio.google.com](https://aistudio.google.com).
2. Sign in with your standard Google account.
3. Accept the Google APIs terms of service.

---

### Step 2: Generate Your API Key

1. Click the blue **"Get API key"** button in the top navigation or sidebar.
2. Click **"Create API key in new project"** (or choose an existing Google Cloud project).
3. Google will instantly display a string starting with \`AIzaSy...\`.
4. Click the copy icon to copy your secret key to your clipboard.

---

### Step 3: Paste into ZeroPrep AI

1. Open the ZeroPrep AI desktop app or web dashboard.
2. Click **"API Key"** in the top header (or use shortcut \`Cmd + K\`).
3. Paste your Gemini key into the input field and click **"Save & Verify"**.
4. The key status will immediately turn green: **Connected • Gemini 2.5 Flash Active**.

Your key is stored strictly on your local device. Enjoy unlimited, zero-cost AI coding guidance!
`,
  },
  {
    slug: 'byok-ai-interview-tools-explained',
    title: 'BYOK AI Tools Explained: Why Bring-Your-Own-Key is Better than Subscriptions',
    description:
      'Why subscription AI tools charge 10x markups, and how the Bring-Your-Own-Key (BYOK) model saves job seekers hundreds of dollars.',
    date: 'September 2026',
    readTime: '4 min read',
    category: 'Architecture',
    author: 'ZeroPrep AI Team',
    content: `
### The $50/Month Trap in Tech Interview Prep

Over the last two years, numerous "AI interview assistants" have emerged. Almost all of them charge $39 to $149 every single month.

Yet under the hood, 99% of these services are simply forwarding your audio or prompt to standard LLM endpoints (like OpenAI or Google Gemini) that cost fractions of a cent per query.

### What is Bring-Your-Own-Key (BYOK)?

BYOK is a modern architectural model where software provides the user interface, system integrations, and audio drivers, while you connect your own developer API key.

#### 1. Zero Markup on Intelligence
With BYOK, you pay nothing to the tool vendor for AI compute. When you use Google Gemini 2.5 Flash, the first 15 requests every minute are completely free on Google AI Studio.

#### 2. Ultimate Data Privacy
When using subscription tools, your interview questions and voice data are transmitted through their intermediate web servers, where they can be logged, stored, or reviewed. With ZeroPrep AI's BYOK model, the desktop app speaks directly to Google's API endpoints. No intermediate proxy intercepts your code.

#### 3. No Zombie Subscriptions
Job hunts typically last 3 to 8 weeks. Subscription tools count on you forgetting to cancel. With BYOK, when you land your dream offer, there are zero monthly recurring charges to cancel.
`,
  },
  {
    slug: 'one-time-vs-subscription-ai-tools',
    title: 'One-Time vs Recurring: Which AI Tool Model Actually Saves You Money?',
    description:
      'A financial and technical breakdown comparing recurring SaaS interview copilots against client-side apps.',
    date: 'September 2026',
    readTime: '3 min read',
    category: 'Economics',
    author: 'ZeroPrep AI Team',
    content: `
### The True Cost of Technical Job Hunting

Job hunting in software engineering is stressful enough without paying recurring $60/month subscriptions for 4 different platforms (LeetCode Premium, Mock interview tools, Resume scanners, AI copilots).

### The Math: Subscription vs BYOK

Let's look at the financial reality over a typical 3-month interview cycle:

| Service Type | Monthly Cost | 3-Month Total | What You Actually Get |
| :--- | :--- | :--- | :--- |
| **Subscription Copilots (e.g. Final Round AI)** | $49 - $120/mo | **$147 - $360** | Fixed rate limits, proxy server lag, recurring billing |
| **ZeroPrep AI (BYOK)** | **$0 / mo** | **$0** | Direct Gemini 2.5 Flash, 0ms proxy lag, zero recurring bills |

### Why We Built ZeroPrep AI on BYOK

We believe essential career tools should be accessible to all candidates regardless of their financial situation. By pairing open client-side native desktop technology with free provider keys, every developer gets elite assistance on equal ground.
`,
  },
];

export function getPostBySlug(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug);
}
