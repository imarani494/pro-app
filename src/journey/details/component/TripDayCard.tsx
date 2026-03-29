import {Dimensions, View, StyleSheet, TouchableOpacity} from 'react-native';
import {CustomText} from '../../../common/components';
import {useTheme} from '../../../context/ThemeContext';
import {Dot, MessageCircle, Plus} from 'lucide-react-native';
import {useNavigation} from '@react-navigation/native';
import {DyA} from '../../types/journey';
import {Colors} from '../../../styles';
import {useAppDispatch} from '../../../store';
import {useMemo} from 'react';
import {ActionType} from '../../../contentCard/types/contentCard';
import {DateUtil} from '../../../utils';
import TripDayInclusionCard from './TripDayInclusionCard';
import Actions from './Actions';
import JourneyMealsCard from './journeyDetailsCard/meals/JourneyMealsCard';
import SectionLabel from './journeyDetailsCard/hotel/components/SectionLabel';
import CommentCard from './CommentCard';

const {width} = Dimensions.get('window');

interface TripDayCardProps {
  index: number;
  day: DyA;
  jid: string;
  registerDayPosition?: (
    dayNum: number,
    y: number,
    height: number,
    day: any,
  ) => void;
}

export function TripDayCard({
  index,
  day,
  registerDayPosition,
}: TripDayCardProps) {
  const navigation = useNavigation();
  const {colors} = useTheme();
  const dispatch = useAppDispatch();

  const activityOverview = useMemo(() => {
    return day?.blkA?.find(incl => incl.typ === 'SIGHTSEEING');
  }, [day?.blkA]);

  const travellersInaDay = useMemo(() => {
    return [...new Set(day?.blkA?.flatMap(item => item.tvlG?.tvlA || []))];
  }, [day]);

  // ✅ FIXED: Extract mealsData from blkA MEAL_COUPONS + day.meals
  const mealsData = useMemo(() => {
    const gBlkMap: Record<string, any> = {};

    // Create map from blkA MEAL_COUPONS blocks
    day?.blkA?.forEach(block => {
      if (block.typ === 'MEAL_COUPONS') {
        gBlkMap[block.bid] = block;
      }
    });

    console.log('API Meals data:', day?.meals, 'gBlkMap:', gBlkMap);

    return {
      meals: day?.meals || [],
      date: day?.date || '',
      gBlkMap, // Contains MEAL_COUPONS blocks like "mea_e9094f3859d8211d"
    };
  }, [day]);

  const advisorCommentAction = useMemo(() => {
    return day?.actions?.find(
      (action: any) => action?.type === ActionType.ADVISOR_COMMENT,
    );
  }, [day?.actions]);

  const isDateMatchingDay = (dateStr: string | undefined): boolean => {
    if (!dateStr) return false;
    try {
      const actionDate = dateStr.split(' ')[0];
      const dayDateStr = DateUtil.formatDateToISO(day?.date);
      return actionDate === dayDateStr;
    } catch {
      return false;
    }
  };

  const filteredDayActions = useMemo(() => {
    return (
      day?.actions?.filter((action: any) => {
        if (action?.type === ActionType.ADVISOR_COMMENT) {
          return false;
        }
        if (
          action.type === 'SELF_BOOKED_TRANSPORT_ADD' &&
          action.otherData?.config
        ) {
          const config = action.otherData.config;
          const isArrivalAction =
            config.isArr === true ||
            (action.name && action.name.toLowerCase().includes('arrival'));
          const isDepartureAction =
            config.isDep === true ||
            (action.name && action.name.toLowerCase().includes('departure'));
          const actionDate = isArrivalAction
            ? config.arrDt
            : isDepartureAction
            ? config.depDt
            : null;
          return isDateMatchingDay(actionDate);
        }
        return true;
      }) || []
    );
  }, [day?.actions, day?.date]);

  return (
    <View
      style={[
        styles.container,
        {backgroundColor: colors.white || Colors.lightThemeColors.white},
      ]}
      onLayout={event => {
        if (registerDayPosition) {
          const {y, height} = event.nativeEvent.layout;
          registerDayPosition(day.dayNum, y, height, day);
        }
      }}>
      <View
        style={[
          styles.headerContainer,
          (day as any)?.dayNum !== 1 && styles.headerMarginTop,
        ]}>
        <View style={styles.titleSection}>
          <View style={styles.dayTitleRow}>
            <CustomText variant="text-lg-semibold" color="neutral900">
              Day {day.dayNumD || day.dayNum}
            </CustomText>
            <Dot size={12} color={colors.neutral600} />
            <CustomText variant="text-sm-medium" color="neutral700">
              {DateUtil.getDisplayDate(day?.date)}
            </CustomText>
          </View>
          <CustomText
            style={{maxWidth: 240}}
            variant="text-sm-normal"
            color="neutral700">
            {day?.ttl}
          </CustomText>
        </View>

        <View style={styles.actionSection}>
          {advisorCommentAction && (
            <>
              <Actions
                date={day?.date}
                actions={[advisorCommentAction]}
                blockId={null}
                sid={null}
                grpName=""
                leftIcon={<MessageCircle size={20} color={colors.neutral500} />}
                hideText={
                  advisorCommentAction?.name?.toLowerCase() === 'add comment'
                }
                dayNum={day.dayNumD || day.dayNum}
              />
              <View
                style={[styles.divider, {backgroundColor: colors.neutral200}]}
              />
            </>
          )}
          <Actions
            date={day?.date}
            actions={filteredDayActions}
            blockId={null}
            sid={null}
            grpName="Add"
            dayNum={day.dayNumD || day.dayNum}
            leftIcon={<Plus size={16} color={colors.neutral700} />}
          />
        </View>
      </View>

      <View style={styles.contentContainer}>
        {/* Day-level comments */}
        {(day as any)?.advCmtA && (day as any).advCmtA.length > 0 && (
          <View style={styles.commentsSection}>
            {(day as any).advCmtA.map(
              (
                comment: {
                  comment: string;
                  commentId: string;
                  userName: string;
                  date: string;
                },
                commentIndex: number,
              ) => (
                <View
                  key={`day-comment-${comment.commentId || commentIndex}`}
                  style={styles.commentItem}>
                  <CommentCard
                    id={comment.commentId || `day-comment-${commentIndex}`}
                    comment={comment.comment}
                    author={comment.userName || ''}
                    date={day?.date}
                  />
                </View>
              ),
            )}
          </View>
        )}

        <View style={styles.inclusionsContainer}>
          {/* ✅ Other inclusions (excluding MEAL_COUPONS) */}
          {day?.blkA &&
            day?.blkA?.length > 0 &&
            day?.blkA
              .filter(inclusion => inclusion?.typ !== 'MEAL_COUPONS')
              .map((inclusion, idx) => {
                return (
                  <View key={idx}>
                    <TripDayInclusionCard
                      inclusion={inclusion}
                      date={day?.date}
                      dCtyD={inclusion?.dctyD || day?.dCtyD}
                      dayNum={day.dayNumD || day.dayNum}
                    />
                  </View>
                );
              })}

          {/* ✅ FIXED MEALS SECTION - NOW ICON + TEXT WILL SHOW! */}
          {mealsData.meals.length > 0 && (
            <View style={styles.mealsSection}>
              {/* 1. SectionLabel - 🥄 ICON + "Meals" TEXT */}
              <View style={styles.sectionLabelContainer}>
                <SectionLabel type="MEALS" title="Meals" />
              </View>

              {/* 2. MealsCard */}
              <View style={styles.mealsCardContainer}>
                <JourneyMealsCard
                  data={mealsData}
                  travelers={travellersInaDay}
                />
              </View>
            </View>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerMarginTop: {
    marginTop: 28,
  },
  titleSection: {
    gap: 9,
    flex: 1,
  },
  dayTitleRow: {
    flexDirection: 'row',
    gap: 6,
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  actionSection: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  divider: {
    width: 1,
    height: 20,
  },
  contentContainer: {
    marginTop: 16,
  },
  commentsSection: {
    gap: 12,
    marginBottom: 16,
  },
  commentItem: {
    padding: 12,
  },
  inclusionsContainer: {
    gap: 12,
  },
  inclusionItem: {},

  // ✅ NEW FIXED STYLES FOR MEALS SECTION
  mealsSection: {
    marginTop: 8,
  },
  sectionLabelContainer: {
    paddingHorizontal: 4,
    paddingVertical: 4,
    // backgroundColor: 'red', // ✅ Remove this after testing
  },
  mealsCardContainer: {
    marginTop: 4,
  },
});
