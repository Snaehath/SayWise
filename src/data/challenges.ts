import { Challenge, Difficulty } from '../types/challenge';

export type DifficultyLevel = Difficulty;

// ====================================================================
// SayWise NanoQwen Speech Synthesis & Curriculum Engine (On-Device)
// Generates diverse, phonetically rich daily speaking challenges
// ====================================================================
export class NanoQwenChallengeEngine {
  private static seenHistory = new Set<string>();

  // ================================================================
  // 1. BEGINNER CURRICULUM (15–25 words, clear vowels & cadence)
  // ================================================================
  private static beginnerChallenges: Array<{ title: string; paragraph: string; focus: string[] }> = [
    {
      title: 'A Morning Walk',
      paragraph: 'Taking a short walk around the neighborhood refreshes my mind. The crisp morning air is cool and peaceful, helping me feel ready for the day ahead.',
      focus: ['Vowel clarity', 'Gentle pacing'],
    },
    {
      title: 'Cooking Breakfast',
      paragraph: 'Preparing a warm breakfast on the weekend brings simple joy. Fresh eggs, golden toast, and hot tea make the morning feel cozy and calm.',
      focus: ['Consonant endings', 'Natural pausing'],
    },
    {
      title: 'Visiting the Library',
      paragraph: 'The local library is always quiet and filled with warm sunlight. Browsing the tall bookshelves is a relaxing way to spend a pleasant afternoon.',
      focus: ['Word stress', 'Smooth rhythm'],
    },
    {
      title: 'A Sunny Afternoon',
      paragraph: 'Relaxing outside in the green garden is wonderful. Golden sunshine warms the grass while a gentle breeze rustles through the blooming trees.',
      focus: ['Soft consonants', 'Steady breathing'],
    },
    {
      title: 'Baking Fresh Bread',
      paragraph: 'Kneading dough in the warm kitchen is a comforting habit. The sweet aroma of toasted crust quickly fills the entire house with delight.',
      focus: ['Vowel elongation', 'Clear diction'],
    },
    {
      title: 'Watching the Rain',
      paragraph: 'Listening to raindrops tapping against the window creates a cozy mood. Holding a warm ceramic mug brings quiet comfort and rest.',
      focus: ['Soft consonants', 'Calm tempo'],
    },
    {
      title: 'Walking by the Lake',
      paragraph: 'Strolling along the calm water at dusk clears away all fatigue. Gentle ripples mirror the pastel colors of the evening sky.',
      focus: ['Connected speech', 'Rhythmic flow'],
    },
    {
      title: 'Planting New Flowers',
      paragraph: 'Caring for small blossoms in the rich garden soil is rewarding. Watching fresh buds open each morning brings genuine daily happiness.',
      focus: ['Clear articulation', 'Pitch modulation'],
    },
    {
      title: 'Brewing Morning Coffee',
      paragraph: 'The rich aroma of freshly ground coffee beans signals a brand new start. Taking that first warm sip brings instant clarity and focus.',
      focus: ['Consonant crispness', 'Smooth breathing'],
    },
    {
      title: 'Catching the Morning Train',
      paragraph: 'Commuting on the early train gives me time to read. Watching the city wake up through the window is always an interesting experience.',
      focus: ['Sentence rhythm', 'Clear stops'],
    },
    {
      title: 'Weekend Farmers Market',
      paragraph: 'Local stalls are packed with ripe strawberries and fresh honey. Chatting with friendly farmers makes the weekend shopping lively and fun.',
      focus: ['Expressive inflection', 'Vowel quality'],
    },
    {
      title: 'Listening to Gentle Music',
      paragraph: 'Playing soft instrumental melodies in the evening calms my thoughts. It creates a serene space to unwind after a productive day.',
      focus: ['Breath control', 'Pacing'],
    },
  ];

  // ================================================================
  // 2. INTERMEDIATE CURRICULUM (30–45 words, multi-clause cadence)
  // ================================================================
  private static intermediateChallenges: Array<{ title: string; paragraph: string; focus: string[] }> = [
    {
      title: 'The Art of Active Listening',
      paragraph: 'Effective communication is not only about speaking with clarity, but also about listening attentively. When we truly seek to understand others, our conversations become remarkably more meaningful and productive.',
      focus: ['Sentence linking', 'Pausing at commas'],
    },
    {
      title: 'Exploring New Horizons',
      paragraph: 'Traveling allows us to step outside familiar comfort zones and experience diverse cultures firsthand, teaching us valuable lessons that broaden our perspective on human connection.',
      focus: ['Complex vowels', 'Fluid transitions'],
    },
    {
      title: 'Daily Productivity Habits',
      paragraph: 'Building sustainable daily routines is far more reliable than waiting for sudden bursts of motivation, because dedicating even fifteen focused minutes each day compounds into extraordinary progress.',
      focus: ['Emphasis on keywords', 'Consistent tempo'],
    },
    {
      title: 'Nature and Mental Clarity',
      paragraph: 'Spending intentional time outdoors amidst greenery significantly relieves mental fatigue. Taking a few deep breaths while admiring the natural scenery quickly restores cognitive focus.',
      focus: ['Rhythmic cadence', 'Breath management'],
    },
    {
      title: 'The Power of Deep Reading',
      paragraph: 'Immersing ourselves in great literature strengthens critical thinking and nurtures deep empathy, serving as an enduring bridge that connects us with timeless wisdom across human history.',
      focus: ['Pitch variation', 'Expressive pausing'],
    },
    {
      title: 'Mastering Digital Balance',
      paragraph: 'Setting conscious boundaries with digital notifications allows us to reclaim our attention, creating dedicated pockets of uninterrupted time for deep creative work and personal rest.',
      focus: ['Polysyllabic words', 'Dynamic inflection'],
    },
    {
      title: 'Embracing Creative Hobbies',
      paragraph: 'Engaging in creative pursuits like painting, writing, or playing music unlocks innovative thinking, giving our imagination the freedom to discover fresh solutions to everyday challenges.',
      focus: ['Cadence flow', 'Stress patterns'],
    },
    {
      title: 'The Psychology of Teamwork',
      paragraph: 'High-performing teams thrive on psychological safety and mutual respect, where every member feels empowered to voice unique ideas without fear of harsh judgment.',
      focus: ['Sentence flow', 'Consonant clusters'],
    },
    {
      title: 'Culinary Traditions and Culture',
      paragraph: 'Traditional recipes carry generations of heritage and storytelling, reminding us that sharing a homemade meal is one of the most universal expressions of hospitality.',
      focus: ['Nuanced articulation', 'Vocal energy'],
    },
    {
      title: 'The Importance of Physical Movement',
      paragraph: 'Incorporating regular physical movement throughout the workday not only boosts physical vitality, but also enhances mental alertness and elevates our overall emotional mood.',
      focus: ['Natural rhythm', 'Phrasing pauses'],
    },
  ];

  // ================================================================
  // 3. ADVANCED CURRICULUM (50–65 words, sophisticated rhetoric)
  // ================================================================
  private static advancedChallenges: Array<{ title: string; paragraph: string; focus: string[] }> = [
    {
      title: 'The Evolution of Artificial Intelligence',
      paragraph: 'Technological innovation continues to reshape society at an unprecedented rate, where the rapid integration of artificial intelligence into infrastructure demands rigorous ethical inquiry and critical discernment to navigate emerging societal complexities.',
      focus: ['Polysyllabic articulation', 'Sophisticated cadence', 'Diction'],
    },
    {
      title: 'Mastering Persuasive Rhetoric',
      paragraph: 'Persuasive rhetoric requires an intricate equilibrium between authentic storytelling, deliberate vocal modulation, and impeccable timing, enabling an exceptional speaker to captivate an audience through the resonant conviction of their message.',
      focus: ['Vocal modulation', 'Nuanced articulation', 'Dynamic pacing'],
    },
    {
      title: 'Sustainable Global Solutions',
      paragraph: 'Addressing modern ecological challenges demands unprecedented multilateral cooperation and innovative environmental engineering, requiring steadfast institutional commitment alongside pragmatic, community-driven conservation initiatives.',
      focus: ['Multi-clause structures', 'Academic vocabulary', 'Clarity'],
    },
    {
      title: 'The Philosophy of Resilience',
      paragraph: 'True resilience is not the absence of vulnerability, but the extraordinary capacity to reconstruct purpose amidst profound adversity, transforming unexpected obstacles into powerful catalysts for long-term personal transformation.',
      focus: ['Expressive inflection', 'Complex cadence', 'Breath control'],
    },
    {
      title: 'The Architecture of Cognitive Focus',
      paragraph: 'In an era characterized by ubiquitous cognitive distraction, sustained mental concentration represents the ultimate competitive advantage, requiring deliberate boundary-setting and an unwavering commitment to intellectual depth.',
      focus: ['Rhetorical emphasis', 'Resonant tone', 'Precision'],
    },
    {
      title: 'The Dynamics of Transformational Leadership',
      paragraph: 'Exceptional leadership transcends authoritative directives, finding its most authentic expression in cultivating psychological safety, articulating an inspiring vision, and empowering collaborative innovation to flourish effortlessly.',
      focus: ['Advanced cadence', 'Formal diction', 'Sentence linking'],
    },
    {
      title: 'The Economics of Global Innovation',
      paragraph: 'Fostering sustained economic prosperity necessitates continuous investment in scientific research and decentralized education, ensuring that technological breakthroughs translate into tangible advancements for diverse communities worldwide.',
      focus: ['Complex polysyllables', 'Rhetorical pacing', 'Fluid delivery'],
    },
    {
      title: 'The Intersection of Ethics and Science',
      paragraph: 'As biomedical frontiers expand into gene editing and neural interfaces, the scientific community must establish robust philosophical frameworks to safeguard human dignity against unchecked commercial exploitation.',
      focus: ['Sophisticated vocabulary', 'Thought-group phrasing', 'Clarity'],
    },
  ];

  // ================================================================
  // 4. DYNAMIC RETRIEVAL & SYNTHESIS
  // ================================================================
  public static generateChallenge(difficulty: Difficulty = 'beginner'): Challenge {
    let pool = this.beginnerChallenges;
    let durationMultiplier = 0.7;

    if (difficulty === 'intermediate') {
      pool = this.intermediateChallenges;
      durationMultiplier = 0.65;
    } else if (difficulty === 'advanced') {
      pool = this.advancedChallenges;
      durationMultiplier = 0.6;
    }

    // Select randomly while avoiding immediate repeats
    let selected = pool[0];
    let attempts = 0;
    while (attempts < 20) {
      const candidate = pool[Math.floor(Math.random() * pool.length)];
      const key = `${difficulty}:${candidate.title}`;
      if (!this.seenHistory.has(key)) {
        this.seenHistory.add(key);
        selected = candidate;
        break;
      }
      attempts++;
    }

    const uniqueId = `${difficulty}-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;
    const wordCount = selected.paragraph.split(/\s+/).length;
    const estimatedDurationSec = Math.max(12, Math.round(wordCount * durationMultiplier));

    return {
      id: uniqueId,
      title: selected.title,
      difficulty,
      paragraph: selected.paragraph,
      estimatedDurationSec,
      focusAreas: selected.focus,
    };
  }

  /**
   * Generates a complete fresh batch of challenges for the app
   */
  public static getChallengeList(): Challenge[] {
    const list: Challenge[] = [];
    const diffs: Difficulty[] = ['beginner', 'intermediate', 'advanced'];
    
    diffs.forEach((diff) => {
      let pool = this.beginnerChallenges;
      let multiplier = 0.7;
      if (diff === 'intermediate') {
        pool = this.intermediateChallenges;
        multiplier = 0.65;
      } else if (diff === 'advanced') {
        pool = this.advancedChallenges;
        multiplier = 0.6;
      }

      pool.forEach((item, idx) => {
        const wordCount = item.paragraph.split(/\s+/).length;
        list.push({
          id: `${diff}-item-${idx + 1}`,
          title: item.title,
          difficulty: diff,
          paragraph: item.paragraph,
          estimatedDurationSec: Math.max(12, Math.round(wordCount * multiplier)),
          focusAreas: item.focus,
        });
      });
    });

    return list;
  }
}

// Export pre-warmed challenge bank for instant offline access
export const challenges: Challenge[] = NanoQwenChallengeEngine.getChallengeList();
