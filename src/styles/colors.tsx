export type Colors =
  | 'neutral50'
  | 'neutral100'
  | 'neutral200'
  | 'neutral300'
  | 'neutral400'
  | 'neutral500'
  | 'neutral600'
  | 'neutral700'
  | 'neutral800'
  | 'neutral900'
  | 'amber50'
  | 'amber100'
  | 'amber200'
  | 'amber300'
  | 'amber400'
  | 'amber500'
  | 'amber600'
  | 'amber700'
  | 'amber800'
  | 'amber900'
  | 'blue50'
  | 'blue100'
  | 'blue200'
  | 'blue300'
  | 'blue400'
  | 'blue500'
  | 'blue600'
  | 'blue700'
  | 'blue800'
  | 'blue900'
  | 'cyan50'
  | 'cyan100'
  | 'cyan200'
  | 'cyan300'
  | 'cyan400'
  | 'cyan500'
  | 'cyan600'
  | 'cyan700'
  | 'cyan800'
  | 'cyan900'
  | 'emerald50'
  | 'emerald100'
  | 'emerald200'
  | 'emerald300'
  | 'emerald400'
  | 'emerald500'
  | 'emerald600'
  | 'emerald700'
  | 'emerald800'
  | 'emerald900'
  | 'fuchsia50'
  | 'fuchsia100'
  | 'fuchsia200'
  | 'fuchsia300'
  | 'fuchsia400'
  | 'fuchsia500'
  | 'fuchsia600'
  | 'fuchsia700'
  | 'fuchsia800'
  | 'fuchsia900'
  | 'gray50'
  | 'gray100'
  | 'gray200'
  | 'gray300'
  | 'gray400'
  | 'gray500'
  | 'gray600'
  | 'gray700'
  | 'gray800'
  | 'gray900'
  | 'green50'
  | 'green100'
  | 'green200'
  | 'green300'
  | 'green400'
  | 'green500'
  | 'green600'
  | 'green700'
  | 'green800'
  | 'green900'
  | 'greenChip'
  | 'indigo50'
  | 'indigo100'
  | 'indigo200'
  | 'indigo300'
  | 'indigo400'
  | 'indigo500'
  | 'indigo600'
  | 'indigo700'
  | 'indigo800'
  | 'indigo900'
  | 'orange50'
  | 'orange100'
  | 'orange200'
  | 'orange300'
  | 'orange400'
  | 'orange500'
  | 'orange600'
  | 'orange700'
  | 'orange800'
  | 'orange900'
  | 'red50'
  | 'red100'
  | 'red200'
  | 'red300'
  | 'red400'
  | 'red500'
  | 'red600'
  | 'red700'
  | 'red800'
  | 'red900'
  | 'yellow50'
  | 'yellow100'
  | 'yellow200'
  | 'yellow300'
  | 'yellow400'
  | 'yellow500'
  | 'yellow600'
  | 'yellow700'
  | 'yellow800'
  | 'yellow900'
  | 'backgroundGradiant'
  | 'white'
  | 'black'
  | 'sky800'
  | 'slate500'
  | 'lightPurple100'
  | 'lightPurple900'
  | 'darkCharcoal'
  | 'transparent'
    | 'primary50'
  | 'primary'
    | 'primary600';
  
  

// Color variables light theme:
export const lightThemeColors: Record<Colors, string> = {
  white: '#ffffff',
  black: '#000000',
  transparent: 'rgba(0, 0, 0, 0.6)',
  
  /* amber */
  amber50: '#fffbeb',
  amber100: '#fef3c7',
  amber200: '#fde68a',
  amber300: '#fcd34d',
  amber400: '#fbbf24',
  amber500: '#f59e0b',
  amber600: '#d97706',
  amber700: '#b45309',
  amber800: '#92400e',
  amber900: '#78350f',

  /* blue */
  blue50: '#eff6ff',
  blue100: '#dbeafe',
  blue200: '#bfdbfe',
  blue300: '#93c5fd',
  blue400: '#60a5fa',
  blue500: '#3b82f6',
  blue600: '#2563eb',
  blue700: '#1d4ed8',
  blue800: '#1e40af',
  blue900: '#1e3a8a',

  /* cyan */
  cyan50: '#ecfeff',
  cyan100: '#cffafe',
  cyan200: '#a5f3fc',
  cyan300: '#67e8f9',
  cyan400: '#22d3ee',
  cyan500: '#06b6d4',
  cyan600: '#0891b2',
  cyan700: '#0e7490',
  cyan800: '#155e75',
  cyan900: '#164e63',

  /* emerald */
  emerald50: '#ecfdf5',
  emerald100: '#d1fae5',
  emerald200: '#a7f3d0',
  emerald300: '#6ee7b7',
  emerald400: '#34d399',
  emerald500: '#10b981',
  emerald600: '#059669',
  emerald700: '#047857',
  emerald800: '#065f46',
  emerald900: '#064e3b',

  /* fuchsia */
  fuchsia50: '#fdf4ff',
  fuchsia100: '#fae8ff',
  fuchsia200: '#f5d0fe',
  fuchsia300: '#f0abfc',
  fuchsia400: '#e879f9',
  fuchsia500: '#d946ef',
  fuchsia600: '#c026d3',
  fuchsia700: '#a21caf',
  fuchsia800: '#86198f',
  fuchsia900: '#701a75',

  /* gray */
  gray50: '#f9fafb',
  gray100: '#f3f4f6',
  gray200: '#e5e7eb',
  gray300: '#d1d5db',
  gray400: '#9ca3af',
  gray500: '#6b7280',
  gray600: '#4b5563',
  gray700: '#374151',
  gray800: '#1f2937',
  gray900: '#111827',

  /* green */
  green50: '#f0fdf4',
  green100: '#dcfce7',
  green200: '#bbf7d0',
  green300: '#86efac',
  green400: '#4ade80',
  green500: '#22c55e',
  green600: '#16a34a',
  green700: '#15803d',
  green800: '#166534',
  green900: '#14532d',
  greenChip: '#D6F1DF',

  /* indigo */
  indigo50: '#eef2ff',
  indigo100: '#e0e7ff',
  indigo200: '#c7d2fe',
  indigo300: '#a5b4fc',
  indigo400: '#818cf8',
  indigo500: '#6366f1',
  indigo600: '#4f46e5',
  indigo700: '#4338ca',
  indigo800: '#3730a3',
  indigo900: '#312e81',

  /* orange */
  orange50: '#fff7ed',
  orange100: '#ffedd5',
  orange200: '#fed7aa',
  orange300: '#fdba74',
  orange400: '#fb923c',
  orange500: '#f97316',
  orange600: '#ea580c',
  orange700: '#c2410c',
  orange800: '#9a3412',
  orange900: '#7c2d12',

  /* red */
  red50: '#fef2f2',
  red100: '#fee2e2',
  red200: '#fecaca',
  red300: '#fca5a5',
  red400: '#f87171',
  red500: '#ef4444',
  red600: '#dc2626',
  red700: '#b91c1c',
  red800: '#991b1b',
  red900: '#7f1d1d',

  /* yellow */
  yellow50: '#fefce8',
  yellow100: '#fef9c3',
  yellow200: '#fef08a',
  yellow300: '#fde047',
  yellow400: '#facc15',
  yellow500: '#eab308',
  yellow600: '#ca8a04',
  yellow700: '#a16207',
  yellow800: '#854d0e',
  yellow900: '#713f12',

  /* neutral */
  neutral50: '#fafafa',
  neutral100: '#f5f5f5',
  neutral200: '#e5e5e5',
  neutral300: '#d4d4d4',
  neutral400: '#a3a3a3',
  neutral500: '#737373',
  neutral600: '#525252',
  neutral700: '#404040',
  neutral800: '#262626',
  neutral900: '#171717',

  /* sky */
  sky800: '#075985',

  /* darkCharcoal */
  darkCharcoal: '#1C2024',
  
  /* slate */
  slate500: '#80838D',

  backgroundGradiant: 'rgba(0, 0, 0, 0.26)',

  /* purple */
  lightPurple100: '#f3e8ff',
  lightPurple900: '#581c87',
  
  /* primary */
  primary: '#3b82f6',
   primary50: '#eff6ff', 
     primary600: '#2563eb',
};

export const darkThemeColors: Record<Colors, string> = {
  white: '#ffffff',
  black: '#000000',
  transparent: 'rgba(0, 0, 0, 0.08)',
  
  /* amber */
  amber50: '#fffbeb',
  amber100: '#fef3c7',
  amber200: '#fde68a',
  amber300: '#fcd34d',
  amber400: '#fbbf24',
  amber500: '#f59e0b',
  amber600: '#d97706',
  amber700: '#b45309',
  amber800: '#92400e',
  amber900: '#78350f',

  /* blue */
  blue50: '#eff6ff',
  blue100: '#dbeafe',
  blue200: '#bfdbfe',
  blue300: '#93c5fd',
  blue400: '#60a5fa',
  blue500: '#3b82f6',
  blue600: '#2563eb',
  blue700: '#1d4ed8',
  blue800: '#1e40af',
  blue900: '#1e3a8a',

  /* cyan */
  cyan50: '#ecfeff',
  cyan100: '#cffafe',
  cyan200: '#a5f3fc',
  cyan300: '#67e8f9',
  cyan400: '#22d3ee',
  cyan500: '#06b6d4',
  cyan600: '#0891b2',
  cyan700: '#0e7490',
  cyan800: '#155e75',
  cyan900: '#164e63',

  /* emerald */
  emerald50: '#ecfdf5',
  emerald100: '#d1fae5',
  emerald200: '#a7f3d0',
  emerald300: '#6ee7b7',
  emerald400: '#34d399',
  emerald500: '#10b981',
  emerald600: '#059669',
  emerald700: '#047857',
  emerald800: '#065f46',
  emerald900: '#064e3b',

  /* fuchsia */
  fuchsia50: '#fdf4ff',
  fuchsia100: '#fae8ff',
  fuchsia200: '#f5d0fe',
  fuchsia300: '#f0abfc',
  fuchsia400: '#e879f9',
  fuchsia500: '#d946ef',
  fuchsia600: '#c026d3',
  fuchsia700: '#a21caf',
  fuchsia800: '#86198f',
  fuchsia900: '#701a75',

  /* gray */
  gray50: '#f9fafb',
  gray100: '#f3f4f6',
  gray200: '#e5e7eb',
  gray300: '#d1d5db',
  gray400: '#9ca3af',
  gray500: '#6b7280',
  gray600: '#4b5563',
  gray700: '#374151',
  gray800: '#1f2937',
  gray900: '#111827',

  /* green */
  green50: '#f0fdf4',
  green100: '#dcfce7',
  green200: '#bbf7d0',
  green300: '#86efac',
  green400: '#4ade80',
  green500: '#22c55e',
  green600: '#16a34a',
  green700: '#15803d',
  green800: '#166534',
  green900: '#14532d',
  greenChip: '#D6F1DF',

  /* indigo */
  indigo50: '#eef2ff',
  indigo100: '#e0e7ff',
  indigo200: '#c7d2fe',
  indigo300: '#a5b4fc',
  indigo400: '#818cf8',
  indigo500: '#6366f1',
  indigo600: '#4f46e5',
  indigo700: '#4338ca',
  indigo800: '#3730a3',
  indigo900: '#312e81',

  /* orange */
  orange50: '#fff7ed',
  orange100: '#ffedd5',
  orange200: '#fed7aa',
  orange300: '#fdba74',
  orange400: '#fb923c',
  orange500: '#f97316',
  orange600: '#ea580c',
  orange700: '#c2410c',
  orange800: '#9a3412',
  orange900: '#7c2d12',

  /* red */
  red50: '#fef2f2',
  red100: '#fee2e2',
  red200: '#fecaca',
  red300: '#fca5a5',
  red400: '#f87171',
  red500: '#ef4444',
  red600: '#dc2626',
  red700: '#b91c1c',
  red800: '#991b1b',
  red900: '#7f1d1d',

  /* yellow */
  yellow50: '#fefce8',
  yellow100: '#fef9c3',
  yellow200: '#fef08a',
  yellow300: '#fde047',
  yellow400: '#facc15',
  yellow500: '#eab308',
  yellow600: '#ca8a04',
  yellow700: '#a16207',
  yellow800: '#854d0e',
  yellow900: '#713f12',

  /* neutral */
  neutral50: '#fafafa',
  neutral100: '#f5f5f5',
  neutral200: '#e5e5e5',
  neutral300: '#d4d4d4',
  neutral400: '#a3a3a3',
  neutral500: '#737373',
  neutral600: '#525252',
  neutral700: '#404040',
  neutral800: '#262626',
  neutral900: '#171717',

  /* sky */
  sky800: '#075985',

  /* darkCharcoal */
  darkCharcoal: '#1C2024',

  /* slate */
  slate500: '#80838D',

  backgroundGradiant: 'rgba(0, 0, 0, 0.26)',

  /* purple */
  lightPurple100: '#f3e8ff',
  lightPurple900: '#581c87',
  
  /* primary */
  primary: '#3b82f6',
   primary50: '#eff6ff', 
     primary600: '#2563eb',
};

type Primary =
  | 'brand'
  | 'accent'
  | 'background'
  | 'surface'
  | 'text'
  | 'disabled'
  | 'placeholder'
  | 'backdrop'
  | 'border'
  | 'label';

export const primary: Record<Primary, string> = {
  brand: '#171717',
  accent: '#03c0ac',
  background: '#1763b1',
  surface: '#1763b1',
  text: '#444',
  disabled: '#1763b1',
  placeholder: '#1763b1',
  backdrop: '#1763b1',
  border: '#ddd',
  label: '#999',
};

export type Status =
  | 'normal'
  | 'info'
  | 'important'
  | 'warning'
  | 'success'
  | 'critical'
  | 'inverse'
  | 'error'
  | 'GREAT'
  | 'GOOD'
  | 'AVERAGE'
  | 'POOR'
  | 'NEW'
  | 'WAS_USING'
  | 'NO_USAGE'
  | 'NONE'
  | 'confirmed'
  | 'aborted';

export const status: Record<Status, string> = {
  normal: '#dfe3e8',
  info: '#b4e1fa',
  important: '#ffea8a',
  warning: '#ffc58b',
  success: '#bbe5b3',
  critical: '#fead9a',
  inverse: '#576675',
  error: '#FF0000',
  GREAT: '#0E3F22',
  GOOD: '#7aa645',
  AVERAGE: '#ffea8a',
  POOR: '#fe4a49',
  NEW: '#3e95cd',
  WAS_USING: '#2ab7ca',
  NO_USAGE: '#f19c65',
  NONE: '#fff',
  confirmed: '#22aa00',
  aborted: '#c91c1f',
};
