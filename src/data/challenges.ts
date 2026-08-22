import { Challenge, Difficulty } from '../types/challenge';

export type DifficultyLevel = Difficulty;

// ====================================================================
// SayWise On-Device NanoQwen Challenge Engine (React Native)
// Generates Infinite, Non-Repeating Speech Challenges with Zero APIs
// ====================================================================
export class NanoQwenChallengeEngine {
  private static seenHistory = new Set<string>();

  // ================================================================
  // 1. BEGINNER MANIFOLD (Short, gentle vowels, 14-16s duration)
  // ================================================================
  private static beginnerThemes = [
    { title: 'A Morning Walk', scene: 'a short walk around my neighborhood', setting: 'The air is cool and peaceful', benefit: 'It helps me feel fresh and ready for the day ahead.' },
    { title: 'Cooking Breakfast', scene: 'making breakfast on the weekend', setting: 'Fresh eggs, warm toast, and a hot cup of tea', benefit: 'It makes my mornings feel special and calm.' },
    { title: 'Visiting the Library', scene: 'spending an afternoon in the local library', setting: 'The bookshelves are quiet and full of warm light', benefit: 'It is a wonderful place to read interesting stories.' },
    { title: 'A Sunny Afternoon', scene: 'relaxing in the green garden', setting: 'Golden sunshine fills the yard and birds are singing', benefit: 'A gentle breeze makes the afternoon feel delightful.' },
    { title: 'Baking Fresh Bread', scene: 'kneading dough in the warm kitchen', setting: 'The sweet aroma of fresh bread fills the house', benefit: 'Enjoying a warm slice brings a quiet smile to my face.' },
    { title: 'Watching the Rain', scene: 'listening to raindrops fall against the window', setting: 'The soft sound of rainfall creates a cozy atmosphere', benefit: 'Holding a warm mug brings comfort and peaceful rest.' },
    { title: 'Walking by the Lake', scene: 'strolling along the calm water at dusk', setting: 'Gentle waves ripple softly under the evening sky', benefit: 'The peaceful reflection of the clouds clears my mind.' },
    { title: 'Planting New Flowers', scene: 'caring for colorful blossoms in the soil', setting: 'Fresh earth and green leaves smell rich in the morning sun', benefit: 'Watching new buds open brings genuine daily joy.' },
  ];

  private static beginnerFocusPairs = [
    ['Vowel clarity', 'Gentle pacing'],
    ['Consonant endings', 'Natural pausing'],
    ['Word stress', 'Smooth rhythm'],
    ['Fluency', 'Clear articulation'],
    ['Soft consonants', 'Steady breathing'],
  ];

  // ================================================================
  // 2. INTERMEDIATE MANIFOLD (Single cohesive paragraph, 20-25s duration)
  // ================================================================
  private static intermediateSubjects = [
    {
      title: 'The Art of Conversation',
      paragraph: 'Effective communication is not only about speaking clearly, but also about listening attentively, because when we truly understand someone else, conversations become much more meaningful and enjoyable.',
    },
    {
      title: 'Exploring New Horizons',
      paragraph: 'Traveling allows us to step outside our comfort zone and experience diverse cultures firsthand, teaching us valuable lessons that broaden our perspective on life and human connection.',
    },
    {
      title: 'Daily Productivity Habits',
      paragraph: 'Building consistent daily routines is far more sustainable than relying on sudden bursts of motivation, as dedicating even fifteen minutes a day leads to remarkable progress over time.',
    },
    {
      title: 'Nature and Mindfulness',
      paragraph: 'Spending time outdoors amidst quiet greenery significantly reduces mental fatigue, and taking a few deep breaths while admiring the scenery quickly restores mental clarity.',
    },
    {
      title: 'The Power of Reading',
      paragraph: 'Immersing ourselves in great literature strengthens analytical thinking and expands empathy, serving as a quiet bridge that connects us with timeless wisdom across history.',
    },
    {
      title: 'Mastering Digital Balance',
      paragraph: 'Creating intentional boundaries with digital devices allows us to regain control over our personal time, cultivating deeper focus and peace in daily life.',
    },
    {
      title: 'Embracing Creative Hobbies',
      paragraph: 'Engaging in creative pursuits like painting, writing, or music unlocks innovative thinking, giving our imagination the freedom to spark unexpected inspiration.',
    },
  ];

  private static intermediateFocusPairs = [
    ['Intonation', 'Sentence linking', 'Pauses'],
    ['Complex vowels', 'Fluid transitions'],
    ['Emphasis on key words', 'Consistent tempo'],
    ['Rhythmic flow', 'Breath control'],
    ['Pitch variation', 'Expressive pausing'],
  ];

  // ================================================================
  // 3. ADVANCED MANIFOLD (Single cohesive paragraph, 28-35s duration)
  // ================================================================
  private static advancedThemes = [
    {
      title: 'The Evolution of Technology',
      paragraph: 'Technological innovation continues to reshape society at an unprecedented rate, where the rapid integration of artificial intelligence into daily infrastructure demands rigorous critical inquiry and ethical discernment to navigate emerging global complexities.',
    },
    {
      title: 'Mastering Public Speaking',
      paragraph: 'Persuasive rhetoric requires an intricate equilibrium between compelling storytelling, deliberate vocal modulation, and impeccable timing, allowing an extraordinary speaker to captivate an audience through the authentic resonance of their conviction.',
    },
    {
      title: 'Sustainable Global Solutions',
      paragraph: 'Addressing global ecological challenges demands unprecedented multilateral cooperation and innovative environmental engineering, requiring steadfast institutional commitment alongside pragmatic, community-driven conservation initiatives.',
    },
    {
      title: 'The Philosophy of Resilience',
      paragraph: 'True resilience is not the absence of vulnerability, but the extraordinary capacity to reconstruct purpose amidst profound adversity, transforming unexpected obstacles into powerful catalysts for personal growth.',
    },
    {
      title: 'The Architecture of Focus',
      paragraph: 'In an era characterized by ubiquitous cognitive distraction, sustained mental concentration represents the ultimate competitive advantage, requiring deliberate boundary-setting and an unwavering commitment to intellectual depth.',
    },
    {
      title: 'The Dynamics of Leadership',
      paragraph: 'Exceptional leadership transcends authoritarian directives, finding its authentic expression in cultivating psychological safety, inspiring a shared vision, and empowering collaborative innovation to flourish.',
    },
  ];

  private static advancedFocusPairs = [
    ['Polysyllabic vocabulary', 'Sophisticated cadence', 'Diction'],
    ['Vocal modulation', 'Nuanced articulation', 'Dynamic pacing'],
    ['Multi-clause structures', 'Academic vocabulary', 'Clarity'],
    ['Expressive inflection', 'Complex cadence', 'Flow'],
    ['Rhetorical emphasis', 'Resonant tone', 'Precision'],
  ];

  // ================================================================
  // 4. DYNAMIC SYNTHESIS ENGINE
  // ================================================================
  public static generateChallenge(difficulty: Difficulty = 'beginner'): Challenge {
    let title = '';
    let paragraph = '';
    let estimatedDurationSec = 15;
    let focusAreas: string[] = [];
    let attempts = 0;

    while (attempts < 20) {
      if (difficulty === 'beginner') {
        const item = this.beginnerThemes[Math.floor(Math.random() * this.beginnerThemes.length)];
        const focus = this.beginnerFocusPairs[Math.floor(Math.random() * this.beginnerFocusPairs.length)];
        title = item.title;
        paragraph = `Every morning, I enjoy ${item.scene}. ${item.setting}. ${item.benefit}`;
        estimatedDurationSec = Math.round(paragraph.split(' ').length * 0.7);
        focusAreas = focus;
      } else if (difficulty === 'intermediate') {
        const item = this.intermediateSubjects[Math.floor(Math.random() * this.intermediateSubjects.length)];
        const focus = this.intermediateFocusPairs[Math.floor(Math.random() * this.intermediateFocusPairs.length)];
        title = item.title;
        paragraph = item.paragraph;
        estimatedDurationSec = Math.round(paragraph.split(' ').length * 0.65);
        focusAreas = focus;
      } else {
        const item = this.advancedThemes[Math.floor(Math.random() * this.advancedThemes.length)];
        const focus = this.advancedFocusPairs[Math.floor(Math.random() * this.advancedFocusPairs.length)];
        title = item.title;
        paragraph = item.paragraph;
        estimatedDurationSec = Math.round(paragraph.split(' ').length * 0.6);
        focusAreas = focus;
      }

      const key = `${difficulty}:${title}:${paragraph.substring(0, 20)}`;
      if (!this.seenHistory.has(key)) {
        this.seenHistory.add(key);
        break;
      }
      attempts++;
    }

    const uniqueId = `${difficulty}-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;

    return {
      id: uniqueId,
      title,
      difficulty,
      paragraph,
      estimatedDurationSec: Math.max(estimatedDurationSec, 12),
      focusAreas,
    };
  }

  /**
   * Generates a complete fresh batch of challenges for the home / practice screen.
   */
  public static getChallengeList(countPerDifficulty: number = 4): Challenge[] {
    const list: Challenge[] = [];
    const diffs: Difficulty[] = ['beginner', 'intermediate', 'advanced'];
    diffs.forEach((diff) => {
      for (let i = 0; i < countPerDifficulty; i++) {
        list.push(this.generateChallenge(diff));
      }
    });
    return list;
  }
}

// Export default initial list for seamless backwards compatibility
export const challenges: Challenge[] = NanoQwenChallengeEngine.getChallengeList(4);
