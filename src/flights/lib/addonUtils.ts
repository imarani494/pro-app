import type { FlightAddonSection, FlightAddonOption, FlightAddonsResponse } from "../types/flightAddons";
import { ADDON_TYPES, SECTION_TYPES, TRAVELLER_PREFIX } from "../types/flightAddons";

export interface SelectedAddon {
  sectionType: "baggage" | "meal";
  sectionKey: string;
  sectionName?: string;
  travellerIdx: number;
  option: FlightAddonOption;
}

interface AcAItem {
  val?: string;
  value?: string;
  t?: string;
  type?: string;
  fs?: string;
  sector?: string;
  oc?: string;
  tvlG?: string[] | { tvlA?: string[] };
}

/**
 * Matches existing acA items with fetched addon options
 * @param existingAcA - Array of existing addon items from journey data
 * @param flightAddons - Fetched flight addons response
 * @returns Array of matched selected addons
 */
export function matchExistingAddons(
  existingAcA: AcAItem[],
  flightAddons: FlightAddonsResponse
): SelectedAddon[] {
  if (!existingAcA || existingAcA.length === 0 || !flightAddons?.success) {
    return [];
  }

  const addonsData = flightAddons._data;
  const preselectedAddons: SelectedAddon[] = [];

  existingAcA.forEach((acItem) => {
    // Extract fields supporting both old and new formats
    const addonType = acItem.t || acItem.type;
    const optionValue = acItem.val || acItem.value;
    const flightSegment = acItem.fs;
    const optionCode = acItem.oc;
    
    // Support both tvlG as array or object with tvlA
    const travellers = Array.isArray(acItem.tvlG)
      ? acItem.tvlG
      : (acItem.tvlG as any)?.tvlA || [];

    if (!addonType) return;

    // Determine which sections to search (baggages or meals)
    const sectionsToSearch =
      addonType === ADDON_TYPES.BAGGAGE
        ? addonsData.baggages || []
        : addonsData.meals || [];

    let matchedSection: FlightAddonSection | null = null;
    let matchingOption: FlightAddonOption | null = null;

    // PRIMARY MATCHING: Match by full option value (val) and flight segment (fs)
    if (optionValue) {
      // First, try to match by flight segment + option value for better accuracy
      if (flightSegment) {
        for (const section of sectionsToSearch) {
          if (section.sctK === flightSegment) {
            const option = section.optA.find(
              (opt: FlightAddonOption) => opt.val === optionValue
            );
            if (option) {
              matchedSection = section;
              matchingOption = option;
              break;
            }
          }
        }
      }

      // Fallback: Match by option value only
      if (!matchedSection || !matchingOption) {
        for (const section of sectionsToSearch) {
          const option = section.optA.find(
            (opt: FlightAddonOption) => opt.val === optionValue
          );
          if (option) {
            matchedSection = section;
            matchingOption = option;
            if (sectionsToSearch.length === 1) {
              break;
            }
          }
        }
      }
    }

    // LEGACY FALLBACK: Match by option code (first 4 chars) and flight segment
    if ((!matchedSection || !matchingOption) && optionCode && flightSegment) {
      for (const section of sectionsToSearch) {
        if (section.sctK === flightSegment) {
          const option = section.optA.find(
            (opt: FlightAddonOption) => opt.val.substring(0, 4) === optionCode
          );
          if (option) {
            matchedSection = section;
            matchingOption = option;
            break;
          }
        }
      }
    }

    // If we found a match, add it for each traveller
    if (matchedSection && matchingOption) {
      const sectionType: "baggage" | "meal" =
        addonType === ADDON_TYPES.BAGGAGE ? SECTION_TYPES.BAGGAGE : SECTION_TYPES.MEAL;

      travellers.forEach((traveller: string) => {
        const travellerMatch = traveller.match(new RegExp(`${TRAVELLER_PREFIX}(\\d+)`));
        if (travellerMatch) {
          const travellerIdx = parseInt(travellerMatch[1], 10);
          preselectedAddons.push({
            sectionType,
            sectionKey: matchedSection!.sctK,
            sectionName: matchedSection!.sctN,
            travellerIdx,
            option: matchingOption!,
          });
        }
      });
    }
  });

  return preselectedAddons;
}

/**
 * Groups selected addons by option value and sector for payload creation
 * @param selectedAddons - Array of selected addons
 * @returns Grouped addons ready for API payload
 */
export function groupAddonsForPayload(selectedAddons: SelectedAddon[]) {
  const grouped = selectedAddons.reduce((acc, addon) => {
    const sectionName = addon.sectionName || addon.sectionKey;
    const key = `${addon.option.val}_${sectionName}`;
    if (!acc[key]) {
      acc[key] = {
        option: addon.option,
        sectionType: addon.sectionType,
        sectionName: sectionName,
        travelers: [],
      };
    }
    acc[key].travelers.push(`${TRAVELLER_PREFIX}${addon.travellerIdx}`);
    return acc;
  }, {} as Record<string, any>);

  return Object.values(grouped).map((group: any) => ({
    price: group.option.pr,
    value: group.option.val,
    sector: group.sectionName,
    type: group.sectionType === SECTION_TYPES.BAGGAGE ? ADDON_TYPES.BAGGAGE : ADDON_TYPES.INFLIGHT_MEAL,
    tvlG: group.travelers,
  }));
}

