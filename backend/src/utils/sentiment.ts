import Sentiment from 'sentiment';
const s = new Sentiment();

export function triSentiment(text: string): -1 | 0 | 1 {
  if (!text) return 0;
  const score = s.analyze(text).score;
  return score > 0 ? 1 : score < 0 ? -1 : 0;
}
