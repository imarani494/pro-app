import {TextStyle} from 'react-native';

// Text styles configuration based on design system
export const fontConfig: Record<string, TextStyle> = {
  // -------------------------------
  // XS (11px)
  // -------------------------------
  'text-xxs-normal': {
    fontSize: 11,
    fontFamily: 'Geist-Regular',
    lineHeight: 16,
  },
  'text-xxs-medium': {
    fontSize: 11,
    fontFamily: 'Geist-Medium',
    lineHeight: 16,
  },
  'text-xxs-semibold': {
    fontSize: 11,
    fontFamily: 'Geist-SemiBold',
    lineHeight: 16,
  },
  'text-xxs-bold': {
    fontSize: 11,
    fontFamily: 'Geist-Bold',
    lineHeight: 16,
  },
  // -------------------------------
  // XS (12px)
  // -------------------------------
  'text-xs-normal': {
    fontSize: 12,
    fontFamily: 'Geist-Regular',
    lineHeight: 16,
  },
  'text-xs-medium': {
    fontSize: 12,
    fontFamily: 'Geist-Medium',
    lineHeight: 16,
  },
  'text-xs-semibold': {
    fontSize: 12,
    fontFamily: 'Geist-SemiBold',
    lineHeight: 16,
  },
  'text-xs-bold': {
    fontSize: 12,
    fontFamily: 'Geist-Bold',
    lineHeight: 16,
  },

  // -------------------------------
  // SM (14px)
  // -------------------------------
  'text-sm-normal': {
    fontSize: 14,
    fontFamily: 'Geist-Regular',
    lineHeight: 20,
  },
  'text-sm-medium': {
    fontSize: 14,
    fontFamily: 'Geist-Medium',
    lineHeight: 20,
  },
  'text-sm-semibold': {
    fontSize: 14,
    fontFamily: 'Geist-SemiBold',
    lineHeight: 20,
  },
  'text-sm-bold': {
    fontSize: 14,
    fontFamily: 'Geist-Bold',
    lineHeight: 20,
  },

  // -------------------------------
  // BASE (16px)
  // -------------------------------
  'text-base-normal': {
    fontSize: 16,
    fontFamily: 'Geist-Regular',
    lineHeight: 24,
  },
  'text-base-medium': {
    fontSize: 16,
    fontFamily: 'Geist-Medium',
    lineHeight: 24,
  },
  'text-base-semibold': {
    fontSize: 16,
    fontFamily: 'Geist-SemiBold',
    lineHeight: 24,
  },
  'text-base-bold': {
    fontSize: 16,
    fontFamily: 'Geist-Bold',
    lineHeight: 24,
  },

  // -------------------------------
  // LG (18px)
  // -------------------------------
  'text-lg-normal': {
    fontSize: 18,
    fontFamily: 'Geist-Regular',
    lineHeight: 28,
  },
  'text-lg-medium': {
    fontSize: 18,
    fontFamily: 'Geist-Medium',
    lineHeight: 28,
  },
  'text-lg-semibold': {
    fontSize: 18,
    fontFamily: 'Geist-SemiBold',
    lineHeight: 28,
  },
  'text-lg-bold': {
    fontSize: 18,
    fontFamily: 'Geist-Bold',
    lineHeight: 28,
  },

  // -------------------------------
  // XL (20px)
  // -------------------------------
  'text-xl-normal': {
    fontSize: 20,
    fontFamily: 'Geist-Regular',
    letterSpacing: -0.6,
    lineHeight: 32,
  },
  'text-xl-medium': {
    fontSize: 20,
    fontFamily: 'Geist-Medium',
    letterSpacing: -0.6,
    lineHeight: 32,
  },
  'text-xl-semibold': {
    fontSize: 20,
    fontFamily: 'Geist-SemiBold',
    letterSpacing: -0.6,
    lineHeight: 32,
  },
  'text-xl-bold': {
    fontSize: 20,
    fontFamily: 'Geist-Bold',
    letterSpacing: -0.6,
    lineHeight: 32,
  },

  // -------------------------------
  // 2XL (24px)
  // -------------------------------
  'text-2xl-normal': {
    fontSize: 24,
    fontFamily: 'Geist-Regular',
    letterSpacing: -0.6,
    lineHeight: 36,
  },
  'text-2xl-medium': {
    fontSize: 24,
    fontFamily: 'Geist-Medium',
    letterSpacing: -0.6,
    lineHeight: 36,
  },
  'text-2xl-semibold': {
    fontSize: 24,
    fontFamily: 'Geist-SemiBold',
    letterSpacing: -0.6,
    lineHeight: 36,
  },
  'text-2xl-bold': {
    fontSize: 24,
    fontFamily: 'Geist-Bold',
    letterSpacing: -0.6,
    lineHeight: 36,
  },

  // -------------------------------
  // 3XL (30px)
  // -------------------------------
  'text-3xl-normal': {
    fontSize: 30,
    fontFamily: 'Geist-Regular',
    letterSpacing: -0.025 * 30, // -0.025em converted to pixels
    lineHeight: 40,
  },
  'text-3xl-medium': {
    fontSize: 30,
    fontFamily: 'Geist-Medium',
    letterSpacing: -0.025 * 30,
    lineHeight: 40,
  },
  'text-3xl-semibold': {
    fontSize: 30,
    fontFamily: 'Geist-SemiBold',
    letterSpacing: -0.025 * 30,
    lineHeight: 40,
  },
  'text-3xl-bold': {
    fontSize: 30,
    fontFamily: 'Geist-Bold',
    letterSpacing: -0.025 * 30,
    lineHeight: 40,
  },

  // -------------------------------
  // HEADINGS (4XL–9XL)
  // -------------------------------
  'text-4xl-bold': {
    fontSize: 36,
    fontFamily: 'Geist-Bold',
    letterSpacing: -0.025 * 36,
    lineHeight: 44,
  },
  'text-5xl-bold': {
    fontSize: 48,
    fontFamily: 'Geist-Bold',
    letterSpacing: -0.025 * 48,
    lineHeight: 48, // 100% of fontSize
  },
  'text-6xl-bold': {
    fontSize: 60,
    fontFamily: 'Geist-Bold',
    letterSpacing: -0.025 * 60,
    lineHeight: 60, // 100% of fontSize
  },
  'text-7xl-bold': {
    fontSize: 72,
    fontFamily: 'Geist-Bold',
    letterSpacing: -0.025 * 72,
    lineHeight: 72, // 100% of fontSize
  },
  'text-8xl-bold': {
    fontSize: 96,
    fontFamily: 'Geist-Bold',
    letterSpacing: -0.025 * 96,
    lineHeight: 96, // 100% of fontSize
  },
  'text-9xl-bold': {
    fontSize: 128,
    fontFamily: 'Geist-Bold',
    letterSpacing: -0.025 * 128,
    lineHeight: 128, // 100% of fontSize
  },
};

export default fontConfig;
