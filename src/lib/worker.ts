import { expose } from 'web-worker';
import { analyzeSentiment } from './sentimentAnalysis';

expose({
  analyzeSentiment: (text: string) => analyzeSentiment(text)
});