export interface TranscriptLine {
  id: string;
  speaker: 'Interviewer' | 'Candidate';
  timestamp: string;
  text: string;
}

export interface SessionAnalysis {
  bugError?: string;
  optimalApproach?: string;
  correctCode?: string;
  language?: string;
  screenshotUrl?: string;
  problemTitle?: string;
  timeComplexity?: string;
  spaceComplexity?: string;
}

export interface CallSession {
  id: string;
  title: string;
  platform: 'Zoom' | 'Google Meet' | 'Microsoft Teams' | 'HackerRank' | 'LeetCode';
  date: string;
  duration: string;
  transcriptCount: number;
  status: 'Completed' | 'Live' | 'Saved';
  solvedProblems: number;
  latencyMs: number;
  audioDurationSec: number;
  transcripts: TranscriptLine[];
  analysis: SessionAnalysis;
}

const INITIAL_MOCK_SESSIONS: CallSession[] = [
  {
    id: 'ses-1092',
    title: 'Google L5 SWE - Distributed Cache & Subarray Sum',
    platform: 'Google Meet',
    date: 'Today, 2:30 PM',
    duration: '45m 12s',
    transcriptCount: 38,
    status: 'Completed',
    solvedProblems: 2,
    latencyMs: 640,
    audioDurationSec: 2712,
    transcripts: [
      { id: 't-1', speaker: 'Interviewer', timestamp: '00:15', text: "Welcome Peter! Let's start with a problem on continuous subarrays. We need to find the number of subarrays having a sum divisible by k." },
      { id: 't-2', speaker: 'Candidate', timestamp: '00:38', text: "Sounds great! My first thought is prefix sum and modulo arithmetic. If prefix[j] % k == prefix[i] % k, then the subarray between them is divisible by k." },
      { id: 't-3', speaker: 'Interviewer', timestamp: '01:05', text: "Exactly right. Be mindful of negative numbers in the array when taking mod in languages like Python or Java." },
      { id: 't-4', speaker: 'Candidate', timestamp: '01:22', text: "Good point! For negative remainders, adding k before modulo normalizes it to a positive value between 0 and k-1." },
      { id: 't-5', speaker: 'Interviewer', timestamp: '02:10', text: "Let's see the implementation. Make sure to handle space complexity appropriately." }
    ],
    analysis: {
      problemTitle: 'Subarray Sums Divisible by K',
      bugError: 'Modulo operation on negative prefix sum in standard C++/Python can yield negative remainder, corrupting the hashmap lookup key.',
      optimalApproach: 'Normalized prefix sum modulo with frequency hash map. Time Complexity: O(N), Space Complexity: O(K).',
      timeComplexity: 'O(N)',
      spaceComplexity: 'O(K)',
      language: 'python',
      screenshotUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1000&auto=format&fit=crop',
      correctCode: `class Solution:
    def subarraysDivByK(self, nums: list[int], k: int) -> int:
        remainder_count = {0: 1}
        current_sum = 0
        total_subarrays = 0
        
        for num in nums:
            current_sum += num
            remainder = ((current_sum % k) + k) % k
            
            if remainder in remainder_count:
                total_subarrays += remainder_count[remainder]
                remainder_count[remainder] += 1
            else:
                remainder_count[remainder] = 1
                
        return total_subarrays`
    }
  },
  {
    id: 'ses-1091',
    title: 'Meta Senior Engineer - Graph Word Ladder II',
    platform: 'Zoom',
    date: 'Yesterday, 11:00 AM',
    duration: '52m 40s',
    transcriptCount: 46,
    status: 'Completed',
    solvedProblems: 1,
    latencyMs: 780,
    audioDurationSec: 3160,
    transcripts: [
      { id: 't-1', speaker: 'Interviewer', timestamp: '00:20', text: "Hello! Today we will tackle shortest transformation sequences from beginWord to endWord." },
      { id: 't-2', speaker: 'Candidate', timestamp: '00:45', text: "This maps to an unweighted graph where each word is a vertex, and an edge exists if words differ by one letter. We can use bidirectional BFS." },
      { id: 't-3', speaker: 'Interviewer', timestamp: '01:15', text: "How would you reconstruct all shortest paths without hitting Memory Limit Exceeded?" },
      { id: 't-4', speaker: 'Candidate', timestamp: '01:50', text: "I can run BFS to build an adjacency level-graph of parent pointers, then backtrack with DFS only along the shortest depth levels." }
    ],
    analysis: {
      problemTitle: 'Word Ladder II (Shortest Transformation Sequences)',
      bugError: 'Standard BFS queue storing full paths consumes O(B^D * L) memory resulting in Memory Limit Exceeded on large word dictionaries.',
      optimalApproach: 'Layered BFS with level-wise word set pruning followed by backtracking DFS reconstruction. Time: O(N * L * 26 + Paths), Space: O(N * L).',
      timeComplexity: 'O(N * L)',
      spaceComplexity: 'O(N * L)',
      language: 'typescript',
      screenshotUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=1000&auto=format&fit=crop',
      correctCode: `function findLadders(beginWord: string, endWord: string, wordList: string[]): string[][] {
  const wordSet = new Set(wordList);
  if (!wordSet.has(endWord)) return [];

  const parents = new Map<string, string[]>();
  let currentLevel = new Set<string>([beginWord]);
  let found = false;

  while (currentLevel.size > 0 && !found) {
    currentLevel.forEach(w => wordSet.delete(w));
    const nextLevel = new Set<string>();

    for (const word of currentLevel) {
      for (let i = 0; i < word.length; i++) {
        for (let c = 97; c <= 122; c++) {
          const nextWord = word.slice(0, i) + String.fromCharCode(c) + word.slice(i + 1);
          if (wordSet.has(nextWord)) {
            if (nextWord === endWord) found = true;
            nextLevel.add(nextWord);
            if (!parents.has(nextWord)) parents.set(nextWord, []);
            parents.get(nextWord)!.push(word);
          }
        }
      }
    }
    currentLevel = nextLevel;
  }

  const results: string[][] = [];
  function backtrack(curr: string, path: string[]) {
    if (curr === beginWord) {
      results.push([beginWord, ...path.slice().reverse()]);
      return;
    }
    for (const p of parents.get(curr) || []) {
      path.push(curr);
      backtrack(p, path);
      path.pop();
    }
  }
  backtrack(endWord, []);
  return results;
}`
    }
  },
  {
    id: 'ses-1090',
    title: 'Uber Systems - Concurrent LRU Cache with TTL',
    platform: 'HackerRank',
    date: 'Sep 5, 2024 • 4:15 PM',
    duration: '38m 05s',
    transcriptCount: 29,
    status: 'Saved',
    solvedProblems: 1,
    latencyMs: 590,
    audioDurationSec: 2285,
    transcripts: [
      { id: 't-1', speaker: 'Interviewer', timestamp: '00:10', text: "Design a thread-safe LRU cache supporting eviction after a time-to-live duration." },
      { id: 't-2', speaker: 'Candidate', timestamp: '00:30', text: "We combine a doubly-linked list for O(1) recency reordering, a hash map for O(1) key lookups, and a min-heap or priority queue for expiration times." }
    ],
    analysis: {
      problemTitle: 'Thread-Safe LRU Cache with Expiration',
      bugError: 'Lazy eviction on get() leaves expired keys in memory indefinitely if those keys are never queried again.',
      optimalApproach: 'Doubly linked list + Hash Map + ReadWriteLock with background cleanup loop. Time: O(1) get/put, Space: O(Capacity).',
      timeComplexity: 'O(1) amortized',
      spaceComplexity: 'O(Capacity)',
      language: 'go',
      screenshotUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=1000&auto=format&fit=crop',
      correctCode: `type LRUCache struct {
    capacity int
    mu       sync.RWMutex
    items    map[string]*list.Element
    evictList *list.List
}

type entry struct {
    key       string
    value     interface{}
    expiresAt time.Time
}

func (c *LRUCache) Get(key string) (interface{}, bool) {
    c.mu.Lock()
    defer c.mu.Unlock()

    if elem, ok := c.items[key]; ok {
        ent := elem.Value.(*entry)
        if time.Now().After(ent.expiresAt) {
            c.evictList.Remove(elem)
            delete(c.items, key)
            return nil, false
        }
        c.evictList.MoveToFront(elem)
        return ent.value, true
    }
    return nil, false
}`
    }
  },
  {
    id: 'ses-1089',
    title: 'Amazon Principal Mock - Median of Two Sorted Arrays',
    platform: 'Microsoft Teams',
    date: 'Sep 3, 2024 • 10:00 AM',
    duration: '40m 18s',
    transcriptCount: 33,
    status: 'Completed',
    solvedProblems: 1,
    latencyMs: 610,
    audioDurationSec: 2418,
    transcripts: [
      { id: 't-1', speaker: 'Interviewer', timestamp: '00:15', text: "Let's find the median of two sorted arrays nums1 and nums2 in O(log(min(m, n))) time." },
      { id: 't-2', speaker: 'Candidate', timestamp: '00:40', text: "We perform binary search on the partition index of the smaller array so that left and right halves have equal elements." }
    ],
    analysis: {
      problemTitle: 'Median of Two Sorted Arrays',
      bugError: 'Off-by-one error when partition falls at boundary index 0 or length N causes IndexOutOfBounds without INT_MIN/INT_MAX guards.',
      optimalApproach: 'Binary search partition on smaller array. Time: O(log(min(M, N))), Space: O(1).',
      timeComplexity: 'O(log(min(M, N)))',
      spaceComplexity: 'O(1)',
      language: 'python',
      correctCode: `def findMedianSortedArrays(nums1: list[int], nums2: list[int]) -> float:
    if len(nums1) > len(nums2):
        nums1, nums2 = nums2, nums1
    m, n = len(nums1), len(nums2)
    low, high = 0, m

    while low <= high:
        p1 = (low + high) // 2
        p2 = (m + n + 1) // 2 - p1

        maxLeft1 = float('-inf') if p1 == 0 else nums1[p1 - 1]
        minRight1 = float('inf') if p1 == m else nums1[p1]

        maxLeft2 = float('-inf') if p2 == 0 else nums2[p2 - 1]
        minRight2 = float('inf') if p2 == n else nums2[p2]

        if maxLeft1 <= minRight2 and maxLeft2 <= minRight1:
            if (m + n) % 2 == 1:
                return float(max(maxLeft1, maxLeft2))
            return (max(maxLeft1, maxLeft2) + min(minRight1, minRight2)) / 2.0
        elif maxLeft1 > minRight2:
            high = p1 - 1
        else:
            low = p1 + 1
    return 0.0`
    }
  }
];

const STORAGE_KEY = 'zeroprep_call_sessions';
const LEGACY_STORAGE_KEY = 'parakeet_call_sessions';

export function getStoredSessions(): CallSession[] {
  if (typeof window === 'undefined') return INITIAL_MOCK_SESSIONS;
  try {
    let raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      // Check legacy key for migration
      const legacyRaw = localStorage.getItem(LEGACY_STORAGE_KEY);
      if (legacyRaw) {
        raw = legacyRaw;
        try {
          localStorage.setItem(STORAGE_KEY, legacyRaw);
        } catch {}
      }
    }
    if (!raw) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_MOCK_SESSIONS));
      } catch {}
      return INITIAL_MOCK_SESSIONS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_MOCK_SESSIONS;
  }
}

export function saveStoredSessions(sessions: CallSession[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
  } catch (err) {
    console.error('Failed to save sessions to localStorage', err);
  }
}

export function addStoredSession(session: CallSession) {
  const sessions = getStoredSessions();
  const updated = [session, ...sessions];
  saveStoredSessions(updated);
  return updated;
}

export function deleteStoredSession(id: string) {
  const sessions = getStoredSessions();
  const updated = sessions.filter(s => s.id !== id);
  saveStoredSessions(updated);
  return updated;
}
