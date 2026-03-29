import {RmA} from '../types/detailsType';

/**
 * Filters and maps room options based on the iSltd (is selected) property
 *
 * @param rmA - Array of room objects containing roptA (room options array)
 * @param travelerCount - Number of travelers/rooms needed
 * @returns Array of selected room option objects in correct order
 */
export const filterSelectedRooms = (
  rmA: RmA[],
  travelerCount?: number,
): any[] => {
  if (!rmA || rmA.length === 0) {
    return [];
  }

  // Determine the expected array length
  const maxLength = travelerCount || getMaxTravelerCount(rmA);

  // Initialize result array with nulls
  const result: any[] = new Array(maxLength).fill(null);

  // Track if any iSltd was found
  let hasSelectedRooms = false;

  // Iterate through all rooms
  for (const room of rmA) {
    if (!room.roptA || !Array.isArray(room.roptA)) {
      continue;
    }

    // Iterate through room options
    for (const roomOption of room.roptA) {
      if (!roomOption.iSltd || !Array.isArray(roomOption.iSltd)) {
        continue;
      }

      hasSelectedRooms = true;

      // Place the room option at each index specified in iSltd
      for (const index of roomOption.iSltd) {
        if (index >= 0 && index < maxLength) {
          result[index] = roomOption;
        }
      }
    }
  }

  // If no selected rooms found, return array filled with minimum price room
  if (!hasSelectedRooms) {
    let minPriceRoom: any = null;
    let minPrice = Infinity;

    // Find the room with minimum price
    for (const room of rmA) {
      if (!room.roptA || !Array.isArray(room.roptA)) {
        continue;
      }

      for (const roomOption of room.roptA) {
        // Extract numeric value from price string (e.g., "S$ 284" -> 284)
        let price = Infinity;

        if (roomOption.prD) {
          // Split by space and get the last part (numeric value)
          const parts = roomOption.prD.trim().split(/\s+/);
          const numericPart = parts[parts.length - 1];
          // Remove any non-numeric characters except decimal point
          const cleanedPrice = numericPart.replace(/[^0-9.]/g, '');
          price = parseFloat(cleanedPrice);
        }

        if (price < minPrice && isFinite(price) && price > 0) {
          minPrice = price;
          minPriceRoom = roomOption;
        }
      }
    }

    // Return array filled with minimum price room
    if (minPriceRoom) {
      return Array.from({length: maxLength}, () => minPriceRoom);
    }

    // If no valid room found, return empty array
    return [];
  }

  // Filter out any null values (in case some indices weren't filled)
  return result.filter(item => item !== null);
};

/**
 * Helper function to determine the maximum traveler count from room data
 */
const getMaxTravelerCount = (rmA: any[]): number => {
  let maxIndex = 0;

  for (const room of rmA) {
    if (!room.roptA || !Array.isArray(room.roptA)) {
      continue;
    }

    for (const roomOption of room.roptA) {
      if (roomOption.iSltd && Array.isArray(roomOption.iSltd)) {
        const maxInOption = Math.max(...roomOption.iSltd);
        maxIndex = Math.max(maxIndex, maxInOption);
      }
    }
  }

  return maxIndex + 1; // Convert 0-based index to count
};

/**
 * Alternative function that returns only unique selected room options
 * (useful if you need each room option only once regardless of iSltd array length)
 */
export const getUniqueSelectedRooms = (rmA: any[]): any[] => {
  if (!rmA || rmA.length === 0) {
    return [];
  }

  const selectedRooms: any[] = [];
  const seenIds = new Set<string>();

  for (const room of rmA) {
    if (!room.roptA || !Array.isArray(room.roptA)) {
      continue;
    }

    for (const roomOption of room.roptA) {
      if (
        roomOption.iSltd &&
        Array.isArray(roomOption.iSltd) &&
        roomOption.iSltd.length > 0
      ) {
        // Use uId or prId as unique identifier
        const id = roomOption.uId || roomOption.prId;

        if (id && !seenIds.has(id)) {
          seenIds.add(id);
          selectedRooms.push(roomOption);
        }
      }
    }
  }

  return selectedRooms;
};

/**
 * Gets selected rooms with their metadata including traveler indices
 */
export const getSelectedRoomsWithIndices = (
  rmA: any[],
): Array<{
  roomOption: any;
  indices: number[];
  roomName: string;
}> => {
  if (!rmA || rmA.length === 0) {
    return [];
  }

  const selectedRooms: Array<{
    roomOption: any;
    indices: number[];
    roomName: string;
  }> = [];

  for (const room of rmA) {
    if (!room.roptA || !Array.isArray(room.roptA)) {
      continue;
    }

    for (const roomOption of room.roptA) {
      if (
        roomOption.iSltd &&
        Array.isArray(roomOption.iSltd) &&
        roomOption.iSltd.length > 0
      ) {
        selectedRooms.push({
          roomOption,
          indices: roomOption.iSltd,
          roomName: roomOption.name || room.nm || 'Unknown Room',
        });
      }
    }
  }

  return selectedRooms;
};

export default filterSelectedRooms;
