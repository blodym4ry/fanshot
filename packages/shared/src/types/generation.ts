export type GenerationStatus = 'pending' | 'processing' | 'completed' | 'failed';

export type SceneType =
  | 'stadium_pitch'
  | 'locker_room'
  | 'celebration'
  | 'corner_flag'
  | 'tunnel'
  | 'press_conference'
  | 'trophy';

export type PlayerStyle =
  | 'striker'
  | 'playmaker'
  | 'goalkeeper'
  | 'defender'
  | 'young_talent';

export type GenerationQuality = 'standard' | 'hd';

export interface Generation {
  id: string;
  userId: string;
  inputImageUrl: string;
  outputImageUrl: string | null;
  sceneType: SceneType;
  playerStyle: PlayerStyle;
  teamColor: string | null;
  promptUsed: string;
  status: GenerationStatus;
  quality: GenerationQuality;
  isFree: boolean;
  processingTimeMs: number | null;
  createdAt: string;
}
