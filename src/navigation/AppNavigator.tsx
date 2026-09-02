import React, { useState } from 'react';
import { View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { AnalysisScreen } from '../screens/AnalysisScreen';
import { ChallengeScreen } from '../screens/ChallengeScreen';
import { CompletionScreen } from '../screens/CompletionScreen';
import { JourneyScreen } from '../screens/JourneyScreen';
import { ResultScreen } from '../screens/ResultScreen';
import { WelcomeScreen } from '../screens/WelcomeScreen';
import { challengeService } from '../services/challengeService';
import { challengeStorage } from '../storage/challengeStorage';
import { Challenge, Difficulty } from '../types/challenge';
import { AnalysisResult, ChallengeResult } from '../types/result';

// types
type ScreenState =
  | { name: 'Welcome' }
  | { name: 'Journey' }
  | { name: 'Challenge'; difficulty: Difficulty; challenge: Challenge }
  | { name: 'Analysis'; challenge: Challenge; audioPath: string; durationSec: number }
  | { name: 'Result'; challenge: Challenge; audioPath: string; result: AnalysisResult }
  | { name: 'Completion'; result: ChallengeResult };

export const AppNavigator: React.FC = () => {
  // state
  const [currentScreen, setCurrentScreen] = useState<ScreenState>({ name: 'Welcome' });

  // handlers
  const goToWelcome = () => setCurrentScreen({ name: 'Welcome' });
  const goToJourney = () => setCurrentScreen({ name: 'Journey' });
  const goToChallenge = (difficulty: Difficulty, challenge: Challenge) =>
    setCurrentScreen({ name: 'Challenge', difficulty, challenge });
  const goToAnalysis = (challenge: Challenge, audioPath: string, durationSec: number) =>
    setCurrentScreen({ name: 'Analysis', challenge, audioPath, durationSec });
  const goToResult = (challenge: Challenge, audioPath: string, result: AnalysisResult) =>
    setCurrentScreen({ name: 'Result', challenge, audioPath, result });
  const goToCompletion = (result: ChallengeResult) =>
    setCurrentScreen({ name: 'Completion', result });

  const handleDirectStartChallenge = (existingChallenge?: Challenge) => {
    const activeDiff = challengeStorage.getSelectedDifficulty();
    const challenge = existingChallenge || challengeService.getTodayChallenge(activeDiff);
    goToChallenge(activeDiff, challenge);
  };

  // render
  const renderScreen = () => {
    switch (currentScreen.name) {
      case 'Welcome':
        return (
          <WelcomeScreen
            onStartChallenge={handleDirectStartChallenge}
            onOpenProfile={goToJourney}
            onViewCompletedResult={(res) =>
              goToResult(
                challengeService.getTodayChallenge(
                  undefined,
                  res.challengeType === 'talk' ? 'talk' : 'read'
                ),
                '',
                {
                  overallScore: res.overallScore,
                  pronunciationScore: res.pronunciationScore,
                  accuracyScore: res.accuracyScore,
                  fluencyScore: res.fluencyScore,
                  pacingScore: res.pacingScore,
                  expressionScore: res.expressionScore,
                  headline: res.headline,
                  tomorrowFocus: res.tomorrowFocus,
                  feedback: res.feedback,
                  wpm: res.wpm,
                  speakingSeconds: res.speakingSeconds,
                  strengths: ['Consistent speech', 'Good pacing'],
                  improvements: ['Keep regular daily practice'],
                }
              )
            }
          />
        );


      case 'Journey':
        return <JourneyScreen onBack={goToWelcome} />;

      case 'Challenge':
        return (
          <ChallengeScreen
            challenge={currentScreen.challenge}
            onBack={goToWelcome}
            onFinishRecording={(audioPath, durationSec) =>
              goToAnalysis(currentScreen.challenge, audioPath, durationSec)
            }
          />
        );

      case 'Analysis':
        return (
          <AnalysisScreen
            challenge={currentScreen.challenge}
            audioPath={currentScreen.audioPath}
            durationSec={currentScreen.durationSec}
            onAnalysisSuccess={(res) =>
              goToResult(currentScreen.challenge, currentScreen.audioPath, res)
            }
            onCancel={() =>
              goToChallenge(currentScreen.challenge.difficulty, currentScreen.challenge)
            }
          />
        );

      case 'Result':
        return (
          <ResultScreen
            challenge={currentScreen.challenge}
            audioPath={currentScreen.audioPath}
            result={currentScreen.result}
            onComplete={goToCompletion}
            onBackToHome={goToWelcome}
          />
        );

      case 'Completion':
        return (
          <CompletionScreen
            result={currentScreen.result}
            onComeAgain={goToWelcome}
          />
        );

      default:
        return (
          <WelcomeScreen
            onStartChallenge={handleDirectStartChallenge}
            onOpenProfile={goToJourney}
          />
        );
    }
  };

  return (
    <View className="flex-1 bg-slate-50">
      <StatusBar style="dark" backgroundColor="#F8FAFC" />
      {renderScreen()}
    </View>
  );
};
