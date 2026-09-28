import { ChallengeRecipe } from '../types/challenge';

export class SayWiseChallengeEngine {

  // read recipes
  private static readChallenges: ChallengeRecipe[] = [
    {
      topic: 'The unexpected benefit of walking',
      type: 'read',
      prompt:
        'Whenever I get stuck on a difficult problem at work, I step away from my desk and take a brisk walk outside. Moving without looking at any screens completely resets my mental rhythm. Surprisingly, my most creative breakthroughs rarely occur when I am staring intently at a monitor. Instead, as I observe the quiet flow of the street, unexpected connections start to surface naturally. By the time I return to my notebook, the mental fog has lifted, and the next step is clear. Sometimes the most productive thing you can do is simply walk away.',
      focusTarget: 'Clear consonants & gentle breath rhythm',
      whyChosen:
        "Calibrated with multi-clause sentences to help you practice pausing naturally at commas and breathing with a relaxed tempo.",
      difficulty: 'beginner',
      prepSeconds: 5,
      speakingSeconds: 50,
      targets: ['natural_pausing', 'vowel_clarity'],
    },
    {
      topic: 'The five-minute morning rule',
      type: 'read',
      prompt:
        'I make a conscious effort not to touch my phone for the first ten minutes after waking up. Sitting quietly with a warm cup of water creates an intentional boundary for the rest of the day. When you check messages immediately, your mind is thrown into a reactive spiral before your feet even hit the floor. Taking just a few quiet breaths allows you to decide where your attention belongs. It turns the morning from a rushed race into a steady, deliberate start. How you begin the first hour usually shapes the mood of your entire afternoon.',
      focusTarget: 'Crisp consonant endings & calm pacing',
      whyChosen:
        'Focus on crisp final consonants (t, d, s) to give your speaking a sharper, more polished sound.',
      difficulty: 'beginner',
      prepSeconds: 5,
      speakingSeconds: 50,
      targets: ['breathing_control', 'soft_endings'],
    },
    {
      topic: 'Saying no with confidence and warmth',
      type: 'read',
      prompt:
        'Learning how to decline requests gracefully was one of the most liberating habits I ever practiced. Many of us hesitate because we worry about sounding blunt or dismissive. In reality, you do not need an elaborate explanation to justify your boundaries. A sincere, direct response like "Thank you for thinking of me, but I am unable to take this on right now" protects your time without damaging the relationship. People respect clarity far more than reluctant promises that lead to burnout. Saying no to unnecessary demands lets you give your best energy to what truly matters.',
      focusTarget: 'Conversational linking & confident pitch',
      whyChosen:
        'Practicing conversational sentence linking helps your spoken English sound effortless and approachable.',
      difficulty: 'beginner',
      prepSeconds: 5,
      speakingSeconds: 55,
      targets: ['sentence_linking', 'conversational_tone'],
    },
    {
      topic: 'Why small habits compound over time',
      type: 'read',
      prompt:
        'We often overestimate what we can achieve in a single frantic weekend, but drastically underestimate what daily repetition creates over several months. Practicing spoken English for just one focused minute every morning might feel inconsequential on any individual day. Yet, consistent daily practice conditions your mouth muscles, refines your breath control, and removes hesitation when speaking spontaneously. Real fluency is not built during occasional marathon study sessions. It is the natural compound interest of showing up every single day, keeping your promise, and letting the quiet momentum carry you forward.',
      focusTarget: 'Rhythmic stress on key verbs & nouns',
      whyChosen:
        "Today's focus is stressing important words to make your voice more dynamic and engaging.",
      difficulty: 'intermediate',
      prepSeconds: 5,
      speakingSeconds: 55,
      targets: ['emphasis', 'cadence_flow'],
    },
    {
      topic: 'Delivering constructive feedback',
      type: 'read',
      prompt:
        'When you need to deliver critical feedback to a colleague, the atmosphere you set in the opening moments determines how well your message is received. Begin by highlighting the tangible value they have already contributed. Then, frame the area for improvement around a shared objective rather than personal shortcoming. When conversations focus on solving a challenge together, people listen without becoming defensive. Be specific with your examples, offer practical suggestions, and pause to invite their perspective. Constructive critique is not about pointing out errors; it is about building the foundation for collective excellence.',
      focusTarget: 'Smooth sentence transitions & professional cadence',
      whyChosen:
        'This scenario tests professional vocal cadence and smooth clause connections.',
      difficulty: 'intermediate',
      prepSeconds: 5,
      speakingSeconds: 55,
      targets: ['intonation_variation', 'thought_groups'],
    },
    {
      topic: 'Navigating high-stakes disagreements',
      type: 'read',
      prompt:
        'During intense disagreements, our instinct is often to speak louder, interrupt, or push our counterarguments before the other person has finished. However, the fastest way to de-escalate tension is to summarize their point of view accurately before offering your own. When people feel genuinely understood, their defenses drop, making them far more willing to consider alternative perspectives. Lower your vocal volume, introduce intentional pauses between your sentences, and ask open-ended questions. True conversational power does not come from dominating the discussion, but from maintaining calm authority while guiding conflicting viewpoints toward common ground.',
      focusTarget: 'Measured tempo & articulate consonant clusters',
      whyChosen:
        'Longer, complex sentence structures to train steady tempo under cognitive load.',
      difficulty: 'advanced',
      prepSeconds: 5,
      speakingSeconds: 60,
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
}
