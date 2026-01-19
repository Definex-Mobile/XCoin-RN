import { TextStyle } from 'react-native';

/**
 * Typography Design System
 * 
 * Font weight mapping:
 * - 100: Thin
 * - 200: ExtraLight
 * - 300: Light
 * - 400: Regular
 * - 500: Medium
 * - 600: SemiBold
 * - 700: Bold
 * - 800: ExtraBold
 * - 900: Black
 */

const WEIGHTS = {
  thin: { weight: 100, family: 'Roboto-Thin' },
  extralight: { weight: 200, family: 'Roboto-ExtraLight' },
  light: { weight: 300, family: 'Roboto-Light' },
  regular: { weight: 400, family: 'Roboto-Regular' },
  medium: { weight: 500, family: 'Roboto-Medium' },
  semibold: { weight: 600, family: 'Roboto-SemiBold' },
  bold: { weight: 700, family: 'Roboto-Bold' },
  extrabold: { weight: 800, family: 'Roboto-ExtraBold' },
  black: { weight: 900, family: 'Roboto-Black' },
} as const;

const SIZES = [10, 12, 14, 16, 18, 20, 24, 28, 32, 48] as const;

type WeightKey = keyof typeof WEIGHTS;
type Size = typeof SIZES[number];

function createToken(weightKey: WeightKey, size: Size, italic: boolean = false): TextStyle {
  const weight = WEIGHTS[weightKey];
  
  let fontFamily: string;
  if (italic) {
    if (weightKey === 'regular') {
      fontFamily = 'Roboto-Italic';
    } else {
      fontFamily = `${weight.family}Italic`;
    }
  } else {
    fontFamily = weight.family;
  }
  
  return {
    fontFamily,
    fontSize: size,
    fontWeight: weight.weight.toString() as any,
  };
}

function generateWeightTokens(weightKey: WeightKey) {
  const tokens: Record<string, TextStyle> = {};
  
  SIZES.forEach(size => {
    const key = `${weightKey}${size}` as const;
    tokens[key] = createToken(weightKey, size, false);
  });
  
  SIZES.forEach(size => {
    const key = `${weightKey}Italic${size}` as const;
    tokens[key] = createToken(weightKey, size, true);
  });
  
  return tokens;
}

const typographyTokens: Record<string, TextStyle> = {};

(Object.keys(WEIGHTS) as WeightKey[]).forEach(weightKey => {
  Object.assign(typographyTokens, generateWeightTokens(weightKey));
});

export const T = typographyTokens as {
  thin10: TextStyle;
  thin12: TextStyle;
  thin14: TextStyle;
  thin16: TextStyle;
  thin18: TextStyle;
  thin20: TextStyle;
  thin24: TextStyle;
  thin28: TextStyle;
  thin32: TextStyle;
  thinItalic10: TextStyle;
  thinItalic12: TextStyle;
  thinItalic14: TextStyle;
  thinItalic16: TextStyle;
  thinItalic18: TextStyle;
  thinItalic20: TextStyle;
  thinItalic24: TextStyle;
  thinItalic28: TextStyle;
  thinItalic32: TextStyle;
  
  extralight10: TextStyle;
  extralight12: TextStyle;
  extralight14: TextStyle;
  extralight16: TextStyle;
  extralight18: TextStyle;
  extralight20: TextStyle;
  extralight24: TextStyle;
  extralight28: TextStyle;
  extralight32: TextStyle;
  extralightItalic10: TextStyle;
  extralightItalic12: TextStyle;
  extralightItalic14: TextStyle;
  extralightItalic16: TextStyle;
  extralightItalic18: TextStyle;
  extralightItalic20: TextStyle;
  extralightItalic24: TextStyle;
  extralightItalic28: TextStyle;
  extralightItalic32: TextStyle;
  
  light10: TextStyle;
  light12: TextStyle;
  light14: TextStyle;
  light16: TextStyle;
  light18: TextStyle;
  light20: TextStyle;
  light24: TextStyle;
  light28: TextStyle;
  light32: TextStyle;
  lightItalic10: TextStyle;
  lightItalic12: TextStyle;
  lightItalic14: TextStyle;
  lightItalic16: TextStyle;
  lightItalic18: TextStyle;
  lightItalic20: TextStyle;
  lightItalic24: TextStyle;
  lightItalic28: TextStyle;
  lightItalic32: TextStyle;
  
  regular10: TextStyle;
  regular12: TextStyle;
  regular14: TextStyle;
  regular16: TextStyle;
  regular18: TextStyle;
  regular20: TextStyle;
  regular24: TextStyle;
  regular28: TextStyle;
  regular32: TextStyle;
  regularItalic10: TextStyle;
  regularItalic12: TextStyle;
  regularItalic14: TextStyle;
  regularItalic16: TextStyle;
  regularItalic18: TextStyle;
  regularItalic20: TextStyle;
  regularItalic24: TextStyle;
  regularItalic28: TextStyle;
  regularItalic32: TextStyle;
  
  medium10: TextStyle;
  medium12: TextStyle;
  medium14: TextStyle;
  medium16: TextStyle;
  medium18: TextStyle;
  medium20: TextStyle;
  medium24: TextStyle;
  medium28: TextStyle;
  medium32: TextStyle;
  mediumItalic10: TextStyle;
  mediumItalic12: TextStyle;
  mediumItalic14: TextStyle;
  mediumItalic16: TextStyle;
  mediumItalic18: TextStyle;
  mediumItalic20: TextStyle;
  mediumItalic24: TextStyle;
  mediumItalic28: TextStyle;
  mediumItalic32: TextStyle;
  
  semibold10: TextStyle;
  semibold12: TextStyle;
  semibold14: TextStyle;
  semibold16: TextStyle;
  semibold18: TextStyle;
  semibold20: TextStyle;
  semibold24: TextStyle;
  semibold28: TextStyle;
  semibold32: TextStyle;
  semiboldItalic10: TextStyle;
  semiboldItalic12: TextStyle;
  semiboldItalic14: TextStyle;
  semiboldItalic16: TextStyle;
  semiboldItalic18: TextStyle;
  semiboldItalic20: TextStyle;
  semiboldItalic24: TextStyle;
  semiboldItalic28: TextStyle;
  semiboldItalic32: TextStyle;
  
  bold10: TextStyle;
  bold12: TextStyle;
  bold14: TextStyle;
  bold16: TextStyle;
  bold18: TextStyle;
  bold20: TextStyle;
  bold24: TextStyle;
  bold28: TextStyle;
  bold32: TextStyle;
  boldItalic10: TextStyle;
  boldItalic12: TextStyle;
  boldItalic14: TextStyle;
  boldItalic16: TextStyle;
  boldItalic18: TextStyle;
  boldItalic20: TextStyle;
  boldItalic24: TextStyle;
  boldItalic28: TextStyle;
  boldItalic32: TextStyle;
  
  extrabold10: TextStyle;
  extrabold12: TextStyle;
  extrabold14: TextStyle;
  extrabold16: TextStyle;
  extrabold18: TextStyle;
  extrabold20: TextStyle;
  extrabold24: TextStyle;
  extrabold28: TextStyle;
  extrabold32: TextStyle;
  extraboldItalic10: TextStyle;
  extraboldItalic12: TextStyle;
  extraboldItalic14: TextStyle;
  extraboldItalic16: TextStyle;
  extraboldItalic18: TextStyle;
  extraboldItalic20: TextStyle;
  extraboldItalic24: TextStyle;
  extraboldItalic28: TextStyle;
  extraboldItalic32: TextStyle;
  
  black10: TextStyle;
  black12: TextStyle;
  black14: TextStyle;
  black16: TextStyle;
  black18: TextStyle;
  black20: TextStyle;
  black24: TextStyle;
  black28: TextStyle;
  black32: TextStyle;
  blackItalic10: TextStyle;
  blackItalic12: TextStyle;
  blackItalic14: TextStyle;
  blackItalic16: TextStyle;
  blackItalic18: TextStyle;
  blackItalic20: TextStyle;
  blackItalic24: TextStyle;
  blackItalic28: TextStyle;
  blackItalic32: TextStyle;
};
