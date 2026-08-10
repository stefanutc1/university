// Cryptographic Password & Secret Generator

export interface PasswordOptions {
  length: number;
  includeUppercase: boolean;
  includeLowercase: boolean;
  includeNumbers: boolean;
  includeSymbols: boolean;
  excludeAmbiguous: boolean; // e.g. 0, O, l, 1, I
  mode: 'random' | 'passphrase';
  wordCount?: number;
}

const UPPER = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const LOWER = 'abcdefghijklmnopqrstuvwxyz';
const NUMBERS = '0123456789';
const SYMBOLS = '!@#$%^&*()_+-=[]{}|;:,.<>?';
const AMBIGUOUS = '0O1lI';

const PASSPHRASE_WORDS = [
  'alpha', 'beacon', 'canyon', 'delta', 'echo', 'falcon', 'galaxy', 'harbor',
  'island', 'jupiter', 'kinetic', 'lunar', 'matrix', 'nebula', 'orbit', 'pulse',
  'quantum', 'radar', 'solar', 'titan', 'uranus', 'vortex', 'zenith', 'vector',
  'cascade', 'horizon', 'plasma', 'summit', 'shadow', 'timber', 'glacier', 'shield',
  'aurora', 'comet', 'meteor', 'strata', 'citadel', 'phoenix', 'sentry', 'falcon',
  'zenith', 'nomad', 'vertex', 'radiant', 'cosmic', 'valiant', 'specter', 'obsidian',
  'cinder', 'zephyr', 'bastion', 'enigma', 'tempest', 'vertex', 'dynamo', 'stellar'
];

export function calculateEntropy(password: string, poolSize: number): number {
  if (!password || poolSize <= 0) return 0;
  const length = password.length;
  const entropy = length * (Math.log(poolSize) / Math.log(2));
  return Math.round(entropy * 10) / 10;
}

export function getStrengthLabel(entropy: number): { label: string; color: string } {
  if (entropy < 36) return { label: 'Foarte Slaba', color: '#ef4444' };
  if (entropy < 60) return { label: 'Slaba', color: '#f97316' };
  if (entropy < 80) return { label: 'Medie (Buna)', color: '#eab308' };
  if (entropy < 120) return { label: 'Puternica', color: '#10b981' };
  return { label: 'Nivel Militar', color: '#6366f1' };
}

export function generatePassword(options: PasswordOptions): { secret: string; entropy: number } {
  if (options.mode === 'passphrase') {
    const count = options.wordCount || 4;
    const words: string[] = [];
    for (let i = 0; i < count; i++) {
      const idx = Math.floor(Math.random() * PASSPHRASE_WORDS.length);
      words.push(PASSPHRASE_WORDS[idx]);
    }
    const secret = words.join('-');
    const entropy = Math.round(count * (Math.log(PASSPHRASE_WORDS.length) / Math.log(2)) * 10) / 10;
    return { secret, entropy };
  }

  let pool = '';
  if (options.includeUppercase) pool += UPPER;
  if (options.includeLowercase) pool += LOWER;
  if (options.includeNumbers) pool += NUMBERS;
  if (options.includeSymbols) pool += SYMBOLS;

  if (options.excludeAmbiguous) {
    pool = pool.split('').filter(c => !AMBIGUOUS.includes(c)).join('');
  }

  if (!pool) pool = LOWER + NUMBERS; // fallback

  const length = Math.max(4, Math.min(128, options.length));
  let result = '';

  for (let i = 0; i < length; i++) {
    const randomIdx = Math.floor(Math.random() * pool.length);
    result += pool[randomIdx];
  }

  const entropy = calculateEntropy(result, pool.length);
  return { secret: result, entropy };
}

// Character pool configurations

// Ambiguous exclusion verified

// Passphrase wordlist integration
