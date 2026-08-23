import React, { useState } from 'react';
import { View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { AnalysisScreen } from '../screens/AnalysisScreen';
import { ChallengeScreen } from '../screens/ChallengeScreen';
import { CompletionScreen } from '../screens/CompletionScreen';
import { DifficultyScreen } from '../screens/DifficultyScreen';
import { ResultScreen } from '../screens/ResultScreen';
import { WelcomeScreen } from '../screens/WelcomeScreen';
import { Challenge, Difficulty } from '../types/challenge';
import { AnalysisResult, ChallengeResult } from '../types/result';

type ScreenState =
  | { name: 'Welcome' }
  | { name: 'Difficulty' }
  | { name: 'Challenge'; difficulty: Difficulty; challenge: Challenge }
  | { name: 'Analysis'; challenge: Challenge; audioPath: string; durationSec: number }
  | { name: 'Result'; challenge: Challenge; audioPath: string; result: AnalysisResult }
  | { name: 'Completion'; result: ChallengeResult };

export const AppNavigator: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<ScreenState>({ name: 'Welcome' });

  // Instant direct navigation actions
  const goToWelcome = () => setCurrentScreen({ name: 'Welcome' });
  const goToDifficulty = () => setCurrentScreen({ name: 'Difficulty' });
  const goToChallenge = (difficulty: Difficulty, challenge: Challenge) =>
    setCurrentScreen({ name: 'Challenge', difficulty, challenge });
  const goToAnalysis = (challenge: Challenge, audioPath: string, durationSec: number) =>
    setCurrentScreen({ name: 'Analysis', challenge, audioPath, durationSec });
  const goToResult = (challenge: Challenge, audioPath: string, result: AnalysisResult) =>
    setCurrentScreen({ name: 'Result', challenge, audioPath, result });
  const goToCompletion = (result: ChallengeResult) =>
    setCurrentScreen({ name: 'Completion', result });

  const renderScreen = () => {
    switch (currentScreen.name) {
      case 'Welcome':
        return (
          <WelcomeScreen
            onStartChallenge={goToDifficulty}
            onViewCompletedResult={(res) => goToCompletion(res)}
          />
        );

      case 'Difficulty':
        return (
          <DifficultyScreen
            onBack={goToWelcome}
            onSelectDifficulty={goToChallenge}
          />
        );

      case 'Challenge':
        return (
          <ChallengeScreen
            challenge={currentScreen.challenge}
            onBack={goToDifficulty}
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
        return <WelcomeScreen onStartChallenge={goToDifficulty} />;
    }
  };

  return (
    <View className="flex-1 bg-slate-50">
      <StatusBar style="dark" backgroundColor="#F8FAFC" />
      {renderScreen()}
    </View>
  );
};
