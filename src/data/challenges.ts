import {
  Challenge,
  ChallengeRecipe,
  ChallengeType,
  Difficulty,
} from '../types/challenge';

export class SayWiseChallengeEngine {
  private static seenHistory = new Set<string>();

  // read recipes
  private static readChallenges: ChallengeRecipe[] = [
    {
      topic: 'The unexpected benefit of walking',
      type: 'read',
      prompt:
        'Whenever I get stuck on a tricky problem, I leave my desk and take a short walk. Moving without any screens resets my focus, and surprisingly, the best ideas almost always arrive when I am not actively forcing them.',
      focusTarget: 'Clear consonants & gentle breath rhythm',
      whyChosen:
        "Your pacing has been improving, so today's reading gives you slightly longer sentences to practice natural breath pauses.",
      difficulty: 'beginner',
      prepSeconds: 5,
      speakingSeconds: 35,
      targets: ['natural_pausing', 'vowel_clarity'],
    },
    {
      topic: 'The five-minute morning rule',
      type: 'read',
      prompt:
        'I try not to touch my phone for the first five minutes after waking up. Sitting quietly with a glass of water sets a calm rhythm for the entire morning, instead of reacting immediately to urgent notifications.',
      focusTarget: 'Clear consonants & smooth rhythm',
      whyChosen:
        'Focus on crisp final consonants (t, d, s) to give your speaking a sharper, more polished sound.',
      difficulty: 'beginner',
      prepSeconds: 5,
      speakingSeconds: 35,
      targets: ['breathing_control', 'soft_endings'],
    },
    {
      topic: 'Saying no without being rude',
      type: 'read',
      prompt:
        'Learning to say no politely was one of the most useful skills I ever practiced. You do not need a long excuse. A simple, honest response like "I wish I could help, but my plate is full right now" works wonders.',
      focusTarget: 'Short thought groups & relaxed tone',
      whyChosen:
        'Practicing conversational sentence linking helps your spoken English sound effortless and approachable.',
      difficulty: 'beginner',
      prepSeconds: 5,
      speakingSeconds: 35,
      targets: ['sentence_linking', 'conversational_tone'],
    },
    {
      topic: 'Why small habits compound',
      type: 'read',
      prompt:
        'People often overestimate what they can accomplish in a day, but underestimate what they can achieve in a month. Practicing speaking for just two focused minutes every single morning builds genuine, unshakable confidence over time.',
      focusTarget: 'Rhythmic stress on key verbs & nouns',
      whyChosen:
        "Your articulation is solid. Today's focus is stressing important words to make your voice more dynamic and engaging.",
      difficulty: 'intermediate',
      prepSeconds: 5,
      speakingSeconds: 40,
      targets: ['emphasis', 'cadence_flow'],
    },
    {
      topic: 'Giving constructive feedback',
      type: 'read',
      prompt:
        'When giving feedback to a teammate, start with what went exceptionally well. Then, frame the critique around the shared goal rather than the person. It turns a potentially defensive conversation into a collaborative problem-solving session.',
      focusTarget: 'Smooth sentence transitions & professional cadence',
      whyChosen:
        'This scenario tests professional vocal cadence and smooth clause connections.',
      difficulty: 'intermediate',
      prepSeconds: 5,
      speakingSeconds: 45,
      targets: ['intonation_variation', 'thought_groups'],
    },
    {
      topic: 'Navigating high-stakes disagreements',
      type: 'read',
      prompt:
        'In any heated discussion, the quickest way to de-escalate tension is validating the other person’s core concern before presenting your counterpoint. When people feel genuinely heard, they become far more receptive to alternative perspectives.',
      focusTarget: 'Measured tempo & articulate consonant clusters',
      whyChosen:
        'Longer, complex sentence structures to train steady tempo under cognitive load.',
      difficulty: 'advanced',
      prepSeconds: 5,
      speakingSeconds: 50,
      targets: ['advanced_linking', 'pitch_control'],
    },
  ];

  // talk recipes
  private static talkChallenges: ChallengeRecipe[] = [
    {
      topic: 'One habit that improved your life',
      type: 'talk',
      prompt:
        'What is one simple daily habit that has genuinely made your life better or less stressful? Explain why it helps you.',
      context: 'Think about sleep, morning routines, exercise, or reading.',
      focusTarget: 'Natural flow + reduce filler pauses',
      whyChosen:
        'Great pronunciation foundation — today we test transferring that clarity into spontaneous, unscripted speech.',
      difficulty: 'beginner',
      prepSeconds: 10,
      speakingSeconds: 45,
      targets: ['spontaneous_flow', 'clear_reasoning'],
    },
    {
      topic: 'Remote Work vs In-Office Fridays',
      type: 'talk',
      prompt:
        'You have one minute to convince your team lead to let everyone work remotely on Fridays. What are your two strongest arguments?',
      context: 'Focus on productivity, focus time, and team morale.',
      focusTarget: 'Confident opening hook & structured 2-point delivery',
      whyChosen:
        'Builds persuasive structuring and transition phrases (e.g., "First", "Additionally").',
      difficulty: 'intermediate',
      prepSeconds: 10,
      speakingSeconds: 45,
      targets: ['structured_arguments', 'confident_projection'],
    },
    {
      topic: 'Working Alone vs Fast-Paced Team',
      type: 'talk',
      prompt:
        'Would you rather work completely alone on a big project or with a fast-paced team? Explain the trade-offs.',
      context: 'Consider speed, creativity, communication, and independence.',
      focusTarget: 'Natural sentence linking & clear contrast words',
      whyChosen:
        'Practicing comparing two ideas naturally with words like "whereas", "on the other hand", and "personally".',
      difficulty: 'beginner',
      prepSeconds: 10,
      speakingSeconds: 45,
      targets: ['contrast_phrasing', 'steady_cadence'],
    },
    {
      topic: 'Why people love traveling',
      type: 'talk',
      prompt:
        'Explain why traveling to an unfamiliar culture changes the way someone sees their everyday life back home.',
      context: 'Think about food, languages, perspectives, and getting out of comfort zones.',
      focusTarget: 'Descriptive vocabulary & connected storytelling',
      whyChosen:
        'Challenges you to retrieve expressive adjectives and paint vivid descriptions spontaneously.',
      difficulty: 'intermediate',
      prepSeconds: 8,
      speakingSeconds: 45,
      targets: ['expressive_vocabulary', 'narrative_flow'],
    },
    {
      topic: 'Is AI changing human creativity?',
      type: 'talk',
      prompt:
        'A friend claims AI tools will make human creative writing obsolete. Do you agree or disagree? Explain your perspective.',
      context: 'Consider emotional depth, lived human experience, and artistic intention.',
      focusTarget: 'Nuanced expression & deliberate thought pacing',
      whyChosen:
        'Advanced abstract reasoning to test your vocabulary precision under pressure.',
      difficulty: 'advanced',
      prepSeconds: 10,
      speakingSeconds: 50,
      targets: ['abstract_fluency', 'vocal_conviction'],
    },
  ];

  // getters
  public static getReadRecipes(): ChallengeRecipe[] {
    return this.readChallenges;
  }

  public static getTalkRecipes(): ChallengeRecipe[] {
    return this.talkChallenges;
  }

  public static getAllRecipes(): ChallengeRecipe[] {
    return [...this.readChallenges, ...this.talkChallenges];
  }

  public static getReadChallenge(
    difficulty: Difficulty,
    excludedTopics: string[] = []
  ): Challenge {
    return this.getChallengeForUser(difficulty, 'read', excludedTopics);
  }

  public static getTalkChallenge(
    difficulty: Difficulty,
    excludedTopics: string[] = []
  ): Challenge {
    return this.getChallengeForUser(difficulty, 'talk', excludedTopics);
  }

  public static getChallengeForUser(
    difficulty: Difficulty,
    typePreference?: ChallengeType,
    excludedTopics: string[] = []
  ): Challenge {
    let pool =
      typePreference === 'read'
        ? this.getReadRecipes()
        : this.getTalkRecipes();

    const diffPool = pool.filter((r) => r.difficulty === difficulty);
    if (diffPool.length > 0) pool = diffPool;

    const freshPool = pool.filter(
      (r) => !excludedTopics.includes(r.topic) && !this.seenHistory.has(r.topic)
    );

    const selectionPool = freshPool.length > 0 ? freshPool : pool;
    const randomIndex = Math.floor(Math.random() * selectionPool.length);
    const chosen = selectionPool[randomIndex] || this.readChallenges[0];

    this.seenHistory.add(chosen.topic);

    return {
      id: `daily_${chosen.type}_${Date.now()}`,
      title: chosen.topic,
      type: chosen.type,
      difficulty: chosen.difficulty,
      paragraph: chosen.prompt,
      prompt: chosen.prompt,
      context: chosen.context,
      focusTarget: chosen.focusTarget,
      whyChosen: chosen.whyChosen,
      prepSeconds: chosen.prepSeconds || (chosen.type === 'read' ? 5 : 10),
      estimatedDurationSec: chosen.speakingSeconds || (chosen.type === 'read' ? 35 : 45),
      focusAreas: chosen.targets,
    };
  }
}
