import {
  Activity,
  ActivityRow,
  ActivityStatus,
  ActivityType,
  DayInfo,
  Traveler,
  TravelerDay,
} from '../types/summary';

// Color palette for travelers
const TRAVELER_COLORS = [
  '#8B5CF6', // Purple
  '#10B981', // Green
  '#F59E0B', // Orange
  '#8B5CF6', // Purple
  '#EF4444', // Red
  '#3B82F6', // Blue
  '#EC4899', // Pink
  '#14B8A6', // Teal
];

const getTravelerJoinDay = (
  travelerId: string,
  totalDays: number,
  travelerDayMapData: Record<string, any>,
): number | null => {
  for (let dayIndex = 0; dayIndex < totalDays; dayIndex++) {
    const key = `${dayIndex}_${travelerId}`;
    if (travelerDayMapData?.[key]) {
      return dayIndex;
    }
  }
  return null;
};

// Helper function to check if traveler has left
const hasTravelerLeft = (
  travelerId: string,
  currentDayIndex: number,
  totalDays: number,
  travelerDayMapData: Record<string, any>,
): boolean => {
  // Check if traveler was present on any previous day
  let wasPresentBefore = false;
  for (let i = 0; i < currentDayIndex; i++) {
    const key = `${i}_${travelerId}`;
    if (travelerDayMapData?.[key]) {
      wasPresentBefore = true;
      break;
    }
  }

  // If was present before but not now, they've left
  const key = `${currentDayIndex}_${travelerId}`;
  return wasPresentBefore && !travelerDayMapData?.[key];
};

// Helper to get traveler initials
const getTravelerInitials = (name: string): string => {
  const parts = name.trim().split(' ');
  if (parts.length === 1) {
    return parts[0].substring(0, 2).toUpperCase();
  }
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

// Map block type to activity type
const getActivityType = (block: any): ActivityType => {
  const typD = block?.typD?.toLowerCase();
  // const typ = block?.typ?.toLowerCase();

  if (typD === 'flight') return 'flight';
  if (typD === 'hotel') return 'hotel';
  if (typD === 'transfer') return 'transfer';
  if (typD === 'meal voucher') return 'meals';
  if (typD === 'sightseeing') return 'sightseeing';
  if (typD === 'car rental') return 'car-rental';
  if (typD === 'itinerary') return 'itinerary';
  if (typD === 'fixed package') return 'fixed-package';
  if (typD === 'road transport') return 'road-transport';
  if (typD === 'train') return 'train';
  if (typD === 'ship') return 'ship';

  // Default fallback for unknown types
  return 'activity';
};

// Get activity status (private/shared)
const getActivityStatus = (block: any): ActivityStatus => {
  // Check for txpT property in block
  if (block?.txpT === 'PRIVATE') {
    return 'private';
  }
  if (block?.txpT === 'SIC') {
    return 'shared';
  }

  // Default fallback for unknown status
  return 'info';
};

// Format time from block data
const formatTime = (block: any): string | undefined => {
  const typ = block?.typD?.toLowerCase();

  // Helper function to format time from ISO string
  const formatISOTime = (isoString: string): string => {
    try {
      const date = new Date(isoString);
      const hours = date.getHours();
      const minutes = date.getMinutes();
      const ampm = hours >= 12 ? 'PM' : 'AM';
      const formattedHours = hours % 12 || 12; // Convert 0 to 12 for midnight
      const formattedMinutes = minutes.toString().padStart(2, '0');
      return `${formattedHours}:${formattedMinutes} ${ampm}`;
    } catch (error) {
      console.error('Error parsing time:', error);
      return isoString;
    }
  };

  // Flight time formatting
  if (typ === 'flight' && block.depTm) {
    return formatISOTime(block.depTm);
  }

  // Car rental time formatting - using arrTm
  if (typ === 'car rental' && block.arrTm) {
    return formatISOTime(block.arrTm);
  }

  if (typ === 'road transport' && block.arrTm) {
    return formatISOTime(block.arrTm);
  }

  // Other activity types
  if (typ === 'hotel') return block.cinT;
  if (typ === 'transfer') return block.sInTm;
  if (typ === 'sightseeing') return block.slotD;

  return undefined;
};

// Get activity title from block
const getActivityTitle = (block: any): string => {
  const typ = block?.typD?.toLowerCase();

  if (typ === 'flight') {
    const fSctNm = block?.fSctNm || '';
    return fSctNm || 'Flight';
  }

  if (typ === 'hotel') {
    return `Stay at ${block?.hnm}` || 'Hotel';
  }

  if (typ === 'transfer') {
    return `${block?.cdnm}`;
  }

  if (typ === 'meal voucher') {
    return `${block?.cdnm}`;
  }

  if (typ === 'sightseeing') {
    return `${block?.cdnm}`;
  }

  if (typ === 'car rental') {
    return `${block?.carO?.vd?.vnm}`;
  }

  if (typ === 'itinerary') {
    return `${block?.cdnm}`;
  }

  if (typ === 'fixed package') {
    return `${block?.pkgName}`;
  }

  if (typ === 'road transport') {
    return `${block?.txptName}`;
  }

  return block?.cdnm || block?.ttl || 'Activity';
};

// Get activity subtitle
const getActivitySubtitle = (block: any): string | undefined => {
  const typ = block?.typ?.toLowerCase();

  if (typ === 'flight') {
    const paxD = block?.fSrchO?.paxD;
    if (paxD) return paxD;
  }

  return undefined;
};

// Transform block to activity
const transformBlockToActivity = (
  block: any,
  blockId: string,
): Activity | null => {
  if (!block) {
    console.warn(`Block not found for ID: ${blockId}`);
    return null;
  }

  const typ = block?.typD?.toLowerCase();

  const hasWarning = !!(block?.vldA && block.vldA.length > 0);

  // Check for empty flight block
  if (typ === 'flight' && !block.fltO) {
    return {
      id: blockId,
      type: 'add-flight',
      status: 'flight-add',
      title: `${block?.fSctNm} `,
      blk: block,
      actions: block.actions || [],
      warning: hasWarning,
    };
  }

  // Check for empty hotel block
  if (typ === 'hotel' && !block.url) {
    return {
      id: blockId,
      type: 'add-hotel',
      status: 'hotel-add',
      title: '+ ADD HOTEL ',
      blk: block,
      actions: block.actions || [],
      warning: hasWarning,
    };
  }

  const activity: Activity = {
    id: blockId,
    type: getActivityType(block),
    status: getActivityStatus(block),
    title: getActivityTitle(block),
    subtitle: getActivitySubtitle(block),
    time: formatTime(block),
    blk: block,
    actions: block.actions || [],
    txpT: block?.txpT,
    warning: hasWarning,
  };

  return activity;
};

// Helper function to generate activity key for grouping similar activities
const generateActivityKey = (activity: Activity): string => {
  const type = activity.type;
  const time = activity.time || 'no-time';
  const title = activity.title;
  const blk = activity.id;

  // Group by type and time slot
  if (type === 'flight') {
    return `flight-${blk}`;
  }
  if (type === 'hotel') {
    return `hotel-${blk}`;
  }
  if (type === 'transfer') {
    return `transfer-${blk}`;
  }
  if (type === 'sightseeing') {
    return `sightseeing-${blk}`;
  }
  if (type === 'meals') {
    return `meals-${blk}`;
  }
  if (type === 'car-rental') {
    return `car-rental-${blk}`;
  }
  if (type === 'itinerary') {
    return `itinerary-${blk}`;
  }

  if (type === 'fixed-package') {
    return `fixed-package-${blk}`;
  }

  if (type === 'road-transport') {
    return `road-transport-${blk}`;
  }

  return `${type}-${blk}-${title}`;
};

const createActivityRows = (
  travelers: Traveler[],
  travelerDays: TravelerDay[],
): ActivityRow[] => {
  const activityMap = new Map<
    string,
    {
      activities: {travelerId: string; activity: Activity}[];
      referenceActivity: Activity;
    }
  >();

  // Collect all activities and group them by activity key
  travelerDays.forEach(travelerDay => {
    travelerDay.activities.forEach(activity => {
      const activityKey = generateActivityKey(activity);

      if (!activityMap.has(activityKey)) {
        activityMap.set(activityKey, {
          activities: [],
          referenceActivity: activity,
        });
      }

      activityMap.get(activityKey)!.activities.push({
        travelerId: travelerDay.travelerId,
        activity,
      });
    });
  });

  // Convert to activity rows
  const activityRows: ActivityRow[] = [];
  let rowIndex = 0;

  // Define activity order priority
  const typeOrder: ActivityType[] = [
    'joins-day',
    'not-joined',
    'add-flight',
    'flight',
    'transfer',
    'hotel',
    'add-hotel',
    'road-transport',
    'fixed-package',
    'train',
    'ship',
    'itinerary',
    'sightseeing',
    'car-rental',
    'meals',
    'activity',
  ];

  // Sort activity keys by type priority and time
  const sortedKeys = Array.from(activityMap.keys()).sort((a, b) => {
    const aData = activityMap.get(a)!.referenceActivity;
    const bData = activityMap.get(b)!.referenceActivity;

    const aTypeIndex = typeOrder.indexOf(aData.type);
    const bTypeIndex = typeOrder.indexOf(bData.type);

    if (aTypeIndex !== bTypeIndex) {
      return aTypeIndex - bTypeIndex;
    }

    // Sort by time within same type
    const aTime = aData.time || '';
    const bTime = bData.time || '';
    return aTime.localeCompare(bTime);
  });

  sortedKeys.forEach(activityKey => {
    const groupData = activityMap.get(activityKey)!;
    const referenceActivity = groupData.referenceActivity;

    // Create traveler activities map
    const travelerActivities: Record<string, Activity | null> = {};

    // Initialize all travelers to null
    travelers.forEach(traveler => {
      travelerActivities[traveler.id] = null;
    });

    // Set activities for travelers who have them
    groupData.activities.forEach(({travelerId, activity}) => {
      travelerActivities[travelerId] = activity;
    });

    activityRows.push({
      rowId: `row-${rowIndex++}`,
      activityKey,
      activityType: referenceActivity.type,
      referenceActivity,
      travelerActivities,
      time: referenceActivity.time,
      title: referenceActivity.title,
    });
  });

  return activityRows;
};

// Main transformation function
export const transformJourneyDataToSummary = (journeyState: any) => {
  const {journey, gBlkMap, travelerDayMapData} = journeyState;

  if (!journey || !journey.dyA || !journey.trvlrA) {
    console.warn('Missing journey data');
    return {travelers: [], days: []};
  }

  // Transform travelers
  const travelers: Traveler[] = journey.trvlrA.map(
    (traveler: any, index: number) => ({
      id: traveler.id,
      name: traveler.nm || `Traveler ${index + 1}`,
      initials: getTravelerInitials(traveler.nm || `T${index + 1}`),
      color: TRAVELER_COLORS[index % TRAVELER_COLORS.length],
    }),
  );

  const totalDays = journey.dyA.length;

  // Transform days
  const days: DayInfo[] = journey.dyA.map((day: any, dayIndex: number) => {
    const dayNumber = day.dayNum || dayIndex + 1;

    // Format date
    const date = day.date;

    const actions = day.actions;

    // Get location
    const location = day.dCtyD || day.loc || '';

    // Get activities for each traveler on this day
    const travelerDays = journey.trvlrA.map((traveler: any) => {
      const key = `${dayIndex}_${traveler.id}`;
      const dayMapEntry = travelerDayMapData?.[key];

      const activities: Activity[] = [];

      // Check if traveler has not joined yet
      const joinDay = getTravelerJoinDay(
        traveler.id,
        totalDays,
        travelerDayMapData,
      );
      const hasLeft = hasTravelerLeft(
        traveler.id,
        dayIndex,
        totalDays,
        travelerDayMapData,
      );

      // If traveler hasn't joined yet
      if (joinDay !== null && dayIndex < joinDay) {
        activities.push({
          id: `not-joined-${dayIndex}-${traveler.id}`,
          type: 'not-joined',
          status: 'info',
          title: 'Not yet joined',
          blk: null,
          warning: false,
        });
      }
      // If traveler has left
      else if (hasLeft) {
        // Could add "Has left" activity if needed
        // For now, we'll just show empty or you can add this
      }
      // Traveler is present this day
      else if (dayMapEntry && gBlkMap) {
        // Check if this is the joining day
        const isJoiningDay = joinDay === dayIndex;

        // Get all numeric keys that contain block IDs
        const blockIdKeys = Object.keys(dayMapEntry)
          .filter(k => k !== 'id' && !isNaN(Number(k)))
          .sort((a, b) => Number(a) - Number(b));

        const tempActivities: Activity[] = [];

        // Transform each block to activity
        for (const blockIdKey of blockIdKeys) {
          const blockIdValue = dayMapEntry[blockIdKey];

          const blockIds = Array.isArray(blockIdValue)
            ? blockIdValue
            : [blockIdValue];

          for (const blockId of blockIds) {
            if (!blockId || typeof blockId !== 'string') {
              console.warn(`      ⚠️ Invalid blockId:`, blockId);
              continue;
            }

            const block = gBlkMap[blockId];

            if (block) {
              const activity = transformBlockToActivity(block, blockId);
              if (activity) {
                tempActivities.push(activity);
              }
            } else {
              console.warn(`❌ Block not found in gBlkMap: ${blockId}`);
            }
          }
        }

        // If this is joining day, sort to put flights first
        if (isJoiningDay && joinDay > 0 && tempActivities.length > 0) {
          tempActivities.sort((a, b) => {
            // Flights first
            if (a.type === 'flight' && b.type !== 'flight') return -1;
            if (a.type !== 'flight' && b.type === 'flight') return 1;
            return 0;
          });

          // Add a "Joins the day" indicator before activities
          activities.push({
            id: `joins-day-${dayIndex}-${traveler.id}`,
            type: 'joins-day',
            status: 'joining',
            title: 'Joins the day',
            blk: null,
            warning: false,
          });
        }
        // If joining on first day, just add activities in normal order
        else if (isJoiningDay && joinDay === 0) {
          tempActivities.sort((a, b) => {
            if (a.type === 'flight' && b.type !== 'flight') return -1;
            if (a.type !== 'flight' && b.type === 'flight') return 1;
            return 0;
          });
        }

        activities.push(...tempActivities);
      }

      return {
        travelerId: traveler.id,
        activities,
      };
    });

    const activityRows = createActivityRows(travelers, travelerDays);

    return {
      dayNumber,
      actions,
      date,
      location,
      travelers: travelerDays,
      activityRows,
    };
  });

  return {travelers, days};
};

// Add this to summaryDataMapper.ts or create a new utility file

export const extractAvailableActivityTypes = (
  days: any[],
  gBlkMap: any,
): Set<string> => {
  const activityTypes = new Set<string>();

  days.forEach(day => {
    day.activityRows?.forEach((row: any) => {
      Object.values(row.travelerActivities || {}).forEach((activity: any) => {
        if (activity && activity.type) {
          activityTypes.add(activity.type);

          // Check for private/shared status
          if (
            activity.blk?.txpT === 'PRIVATE' ||
            activity.status === 'private'
          ) {
            activityTypes.add('private');
          }
          if (activity.blk?.txpT === 'SIC' || activity.status === 'shared') {
            activityTypes.add('shared');
          }
        }
      });
    });
  });

  return activityTypes;
};
