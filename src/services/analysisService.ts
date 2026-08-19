import { Challenge } from '../types/challenge';
import { AnalysisResult } from '../types/result';

/**
 * Isolated speech analysis service.
 * In V1, this delivers realistic, simulated speech evaluation.
 * In future versions, this can be seamlessly swapped with Whisper / on-device ASR / Phoneme analysis.
 */
export const analysisService = {
  async analyzeRecording(
    audioPath: string,
    challenge: Challenge,
    durationSec: number = 10
  ): Promise<AnalysisResult> {
    // Simulate real AI processing latency
    await new Promise((resolve) => setTimeout(resolve, 2600));

    // Calculate realistic scores based on difficulty and reading duration
    const targetDuration = challenge.estimatedDurationSec || 18;
    const durationRatio = durationSec / Math.max(targetDuration, 5);

    // Pacing calculation: optimal pacing is around 0.8x to 1.3x target duration
    let pacingScore = 86;
    if (durationRatio < 0.6) {
      pacingScore = Math.floor(65 + Math.random() * 8); // Too fast
    } else if (durationRatio > 1.6) {
      pacingScore = Math.floor(70 + Math.random() * 10); // Too slow
    } else {
      pacingScore = Math.floor(82 + Math.random() * 14); // Good pace
    }

    // Difficulty-adjusted baseline
    const baseOffset = challenge.difficulty === 'beginner' ? 84 : challenge.difficulty === 'intermediate' ? 80 : 76;
    const pronunciationScore = Math.min(98, Math.max(68, Math.floor(baseOffset + (Math.random() * 12 - 2))));
    const accuracyScore = Math.min(99, Math.max(72, Math.floor(baseOffset + 4 + (Math.random() * 10 - 2))));
    const fluencyScore = Math.min(96, Math.max(70, Math.floor(baseOffset - 2 + (Math.random() * 14 - 3))));

    // Weighted overall score
    const overallScore = Math.round(
      pronunciationScore * 0.35 +
      accuracyScore * 0.25 +
      fluencyScore * 0.25 +
      pacingScore * 0.15
    );

    // Personalized feedback generation
    let feedback = '';
    const strengths: string[] = [];
    const improvements: string[] = [];

    if (overallScore >= 90) {
      feedback = 'Outstanding delivery! Your articulation was exceptionally crisp, and your rhythm felt completely natural and confident.';
      strengths.push('Crystal clear vowel and consonant clarity', 'Excellent rhythm and natural pitch transitions');
      improvements.push('Maintain this relaxed cadence in longer conversational passages');
    } else if (overallScore >= 80) {
      feedback = 'Great job! Your reading was clear and accurate. Try slowing down slightly at sentence boundaries and emphasizing key descriptive words.';
      strengths.push('Strong word accuracy throughout the paragraph', 'Confident voice projection');
      improvements.push('Pause briefly at commas and periods to enhance natural phrasing', 'Pay extra attention to final consonant sounds');
    } else {
      feedback = 'Good effort! Focus on breaking long sentences into smaller breath groups and pronouncing each syllable distinctly.';
      strengths.push('Consistent speaking volume', 'Good effort tackling challenging vocabulary');
      improvements.push('Slow down to avoid rushing through multi-syllable words', 'Practice reading aloud sentence by sentence');
    }

    return {
      overallScore,
      pronunciationScore,
      accuracyScore,
      fluencyScore,
      pacingScore,
      feedback,
      strengths,
      improvements,
    };
  },
};
