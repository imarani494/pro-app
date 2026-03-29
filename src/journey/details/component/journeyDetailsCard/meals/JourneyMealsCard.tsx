import React from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {PencilLine, Plus, X} from 'lucide-react-native';
import {CustomText} from '../../../../../common/components';
import TravelerSummary from '../../../../../common/components/TravelersTag';
import {useTheme} from '../../../../../context/ThemeContext';

interface Traveler {
  id: string;
}

interface MealItem {
  isInc: boolean;
  srcBlockId: string;
  text?: string;
  tvlG?: {
    tvlA: string[];
  };
  txpL?: {
    nm: string;
    st: string;
  };
  bid?: string;
  actions?: any[];
  vldA?: any[];
  canRemove?: boolean;
}

interface Meal {
  itemA: MealItem[];
  name: string;
  type: string;
}

interface BlockData {
  bid: string;
  typ: string;
  paxD: string;
  txpL: {
    nm: string;
    st: string;
  };
  tvlG: {
    tvlA: string[];
  };
  actions?: any[];
}

interface MealCardProps {
  data: {
    meals: Meal[];
    date: string;
    gBlkMap?: Record<string, BlockData>;
  };
  travelers?: string[];
}

const formatMealType = (type: string): string => {
  if (!type) return '';
  return type.charAt(0).toUpperCase() + type.slice(1).toLowerCase();
};

export default function JourneyMealsCard({data, travelers}: MealCardProps) {
  const {colors} = useTheme();

  const getBlockData = (
    srcBlockId: string,
    gBlkMap?: Record<string, BlockData>,
  ) => {
    return gBlkMap?.[srcBlockId] || null;
  };

  if (!data.meals || data.meals.length === 0) {
    return null;
  }

  return (
    <View
      style={[
        styles.cardContainer,
        {
          borderColor: colors.neutral200,
          backgroundColor: colors.white,
        },
      ]}>
      {data.meals.map((meal, mealIndex) => {
        const hasItems = meal.itemA && meal.itemA.length > 0;

        // Check individual items
        if (hasItems) {
          meal.itemA.forEach((item, idx) => {
            console.log(`Item ${idx}:`, {
              isInc: item.isInc,
              text: item.text,
              shouldShowModify: item.isInc && item.text !== 'Not Included',
            });
          });
        }

        // Final condition - sirf included items wale meals ke liye modify button
        const shouldShowModifyButton =
          hasItems &&
          meal.itemA.some(item => item.isInc && item.text !== 'Not Included');

        return (
          <View key={`meal-${meal.type}-${mealIndex}`}>
            <View style={styles.mealContent}>
              <View style={styles.leftSection}>
                <View style={styles.header}>
                  <View style={styles.titleSection}>
                    <CustomText variant="text-base-semibold" color="neutral900">
                      {formatMealType(meal.name || meal.type)}
                    </CustomText>
                  </View>

                  {/* {shouldShowModifyButton && (
                      <TouchableOpacity
                        activeOpacity={0.7}
                        style={[
                          styles.modifyButton,
                          {borderColor: colors.neutral300},
                        ]}>
                        <PencilLine size={16} color={colors.neutral900} />
                        <CustomText
                          variant="text-sm-medium"
                          color="neutral900">
                          Modify
                        </CustomText>
                      </TouchableOpacity>
                    )} */}
                </View>

                {hasItems ? (
                  meal.itemA.map((item, itemIndex) => {
                    const isNotIncluded =
                      !item.isInc || item.text === 'Not Included';
                    const blockData = getBlockData(
                      item.srcBlockId,
                      data.gBlkMap,
                    );
                    const travelersList =
                      blockData?.tvlG?.tvlA ||
                      item.tvlG?.tvlA ||
                      travelers ||
                      [];
                    const validations = item.vldA || [];

                    return (
                      <View key={`meal-item-${item.srcBlockId}-${itemIndex}`}>
                        <View style={styles.travelerInfo}>
                          <TravelerSummary
                            travelers={travelersList.map(id => ({id}))}
                            paxD={blockData?.paxD || ''}
                            showProfileIcon={false}
                          />
                        </View>
                        <CustomText
                          style={styles.mealDescription}
                          variant="text-xs-normal"
                          color="neutral500">
                          {item.text ||
                            blockData?.paxD ||
                            'Lunch Coupon at Indian Restaurant (Al Tazeem) in Dubai - 1 day (with Transfers) - Veg / Non-Veg'}
                        </CustomText>

                        {validations.length > 0 && (
                          <View style={styles.validationsContainer}>
                            {validations.map(
                              (validation: any, vldIndex: number) => (
                                <View
                                  key={vldIndex}
                                  style={[
                                    styles.validationBanner,
                                    {
                                      backgroundColor: colors.yellow50,
                                      borderColor: colors.yellow200,
                                    },
                                  ]}>
                                  <CustomText
                                    variant="text-xs-normal"
                                    color="yellow900">
                                    {validation.msg || 'Validation required'}
                                  </CustomText>
                                </View>
                              ),
                            )}
                          </View>
                        )}
                      </View>
                    );
                  })
                ) : (
                  <View style={styles.notIncludedSection}>
                    <View style={styles.notIncludedContent}>
                      <View
                        style={[
                          styles.notIncludedTag,
                          {backgroundColor: colors.red50 || '#FEF2F2'},
                        ]}>
                        <CustomText color="red600" variant="text-xs-medium">
                          Not included
                        </CustomText>
                        <X size={12} color={colors.red600} />
                      </View>
                    </View>
                    <TouchableOpacity
                      activeOpacity={0.7}
                      style={[
                        styles.addButton,
                        {
                          borderColor: colors.neutral300,
                          backgroundColor: colors.white,
                        },
                      ]}>
                      <Plus size={16} color={colors.neutral900} />
                      <CustomText variant="text-sm-medium" color="neutral900">
                        Add
                      </CustomText>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </View>
            {mealIndex < data.meals.length - 1 && (
              <View
                style={[styles.separator, {backgroundColor: colors.neutral200}]}
              />
            )}
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    width: '100%',
    overflow: 'hidden',
  },
  mealSection: {
    // paddingVertical: 20,
  },
  mealContent: {
    gap: 16,
  },
  leftSection: {
    flex: 1,
    gap: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  titleSection: {
    // flex: 1,
  },
  travelerInfo: {
    marginTop: 10,
  },
  mealDescription: {
    marginTop: 4,
  },
  notIncludedSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  notIncludedContent: {
    flex: 1,
    gap: 8,
  },
  notIncludedTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderRadius: 8,
    height: 40,
  },
  modifyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderRadius: 8,
    height: 40,
  },
  validationsContainer: {
    marginTop: 12,
    gap: 8,
  },
  validationBanner: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  separator: {
    height: 1,
    width: '100%',
  },
});
