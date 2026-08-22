import { AudioModule } from 'expo-audio';
import { File } from 'expo-file-system';

export type PermissionStatus = 'granted' | 'denied' | 'undetermined';

export const recordingService = {
  /**
   * Check current microphone permission status
   */
  async getPermissionStatus(): Promise<PermissionStatus> {
    try {
      const response = await AudioModule.getRecordingPermissionsAsync();
      if (response.granted) return 'granted';
      if (response.canAskAgain) return 'undetermined';
      return 'denied';
    } catch (err) {
      console.warn('Error checking microphone permission:', err);
      return 'undetermined';
    }
  },

  /**
   * Request microphone permission from user
   */
  async requestPermission(): Promise<boolean> {
    try {
      const response = await AudioModule.requestRecordingPermissionsAsync();
      return response.granted;
    } catch (err) {
      console.warn('Error requesting microphone permission:', err);
      return false;
    }
  },

  /**
   * Safely delete a temporary audio file from cache/filesystem
   */
  async deleteTemporaryAudio(audioPath: string | null | undefined): Promise<void> {
    if (!audioPath) return;
    try {
      if (typeof File !== 'undefined') {
        const file = new File(audioPath);
        if (file && typeof file.delete === 'function') {
          file.delete();
          return;
        }
      }
    } catch {
      // Safe fallback
    }

    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const LegacyFileSystem = require('expo-file-system/legacy');
      if (LegacyFileSystem && typeof LegacyFileSystem.deleteAsync === 'function') {
        await LegacyFileSystem.deleteAsync(audioPath, { idempotent: true });
      }
    } catch {
      // Safe silent fallback for temporary cache
    }
  },
};
