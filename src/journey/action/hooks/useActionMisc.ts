// @ts-nocheck
import {useMemo} from 'react';

import {ActionMiscData} from '../types/actionTypes';
import {Action} from '../../types/journey';
import {useJournery} from '../../hooks/useJournery';

export function useActionMisc(
  date: string,
  action: Action,
  blockId: string | null,
  sid: string | null,
): ActionMiscData {
  const journeyData = useJournery();

  return useMemo(() => {
    const mscData: Partial<ActionMiscData> = {};
    const cyData = journeyData.dayBlkActionsMap[date];
    mscData.dayNum = cyData?.dayNum;
    mscData.dayNumD = cyData?.dayNumD;
    if (blockId) {
      mscData.dayNum = journeyData.dayBlkActionsMap[blockId]?.dayNum;
    }
    if (blockId && action.ctype === 'FLIGHT') {
      const cyBlkData = journeyData.dayBlkActionsMap[blockId];
      mscData.srchO = cyBlkData?.fSrchO;
      mscData.fltSA = cyBlkData?.fltSA;
      mscData.aCtyId = cyBlkData?.aCtyId;
      mscData.dCtyId = cyBlkData?.dCtyId;
      mscData.fltO = cyBlkData?.fltO;
      mscData.ctyA = journeyData.journey.ctyA;
      mscData.dayNum = cyBlkData?.dayNum || cyData?.dayNum;
    }

    if (
      (blockId && action.ctype === 'HOTEL_ROOM') ||
      (action.ctype === 'TRAIN' &&
        (action.type === 'UPDATE' ||
          action.type === 'ROOM_CHANGE' ||
          action.type === 'STAY_LOOKUP' ||
          action.type === 'SELF_BOOKED_STAY' ||
          action.type === 'UPDATE_TRANSPORTSTAY' ||
          action.type === 'ADD_TRANSPORTSTAY' ||
          action.type === 'STAY_LOOKUP'))
    ) {
      const cyBlkData = journeyData.dayBlkActionsMap[blockId];
      mscData.checkinDate = cyBlkData?.srchQ?.chkIn || cyBlkData?.chkin;
      mscData.checkoutDate = cyBlkData?.srchQ?.chkOut || cyBlkData?.chkout;
      mscData.hotel_slug = cyBlkData?.url;
      const currentRmTvlG =
        cyBlkData?.rmTvlG || cyBlkData?.rmTvlsG || action?.rmTvlG;
      mscData.rmTvlG = currentRmTvlG;
      mscData.dayNum = cyBlkData?.dayNum || cyData?.dayNum;
      mscData.nationality =
        cyBlkData?.srchQ?.ntn ?? journeyData?.journey?.ntnId;
      mscData.cityId =
        action?.otherData?.city ||
        cyBlkData?.srchQ?.cid ||
        cyBlkData?.dcty ||
        cyBlkData?.dCty ||
        cyData?.dCty;
    }

    // Get cdid for content card types (SIGHTSEEING, TRANSFERS, etc.)
    if (
      blockId &&
      (action.type === 'UPDATE' || action.type === 'REMOVE_FD_OPTIONAL')
    ) {
      const cyBlkData = journeyData.dayBlkActionsMap[blockId];

      mscData.cdid = cyBlkData?.cdid;
    }
    if (blockId && action.type === 'SELF_BOOKED_TRANSPORT_UPDATE') {
      const cyBlkData = journeyData.dayBlkActionsMap[blockId];
      mscData.uTxptO = cyBlkData?.uTxptO;
    }

    if (blockId && action.type === 'FD_UPDATE_ROOM') {
      const cyBlkData = journeyData.dayBlkActionsMap[blockId];
      mscData.selectedTourId = cyBlkData?.pkgId;
    }

    // Extract pkTm, dpTm, pkLoc, dpLoc for CAR_RENTAL actions
    if (blockId && action.ctype === 'CAR_RENTAL') {
      const cyBlkData = journeyData.dayBlkActionsMap[blockId];
      // Extract pickup and dropoff times and locations from block data or action
      // Try block data first, then action data, then carO nested data
      mscData.pkTm = 
        cyBlkData?.pkTm || 
        action?.pkTm || 
        cyBlkData?.carO?.pkTm ||
        (cyBlkData?.carO?.pkTm ? `${cyBlkData.carO.pkTm}` : undefined);
      mscData.dpTm = 
        cyBlkData?.dpTm || 
        action?.dpTm || 
        cyBlkData?.carO?.dpTm ||
        (cyBlkData?.carO?.dpTm ? `${cyBlkData.carO.dpTm}` : undefined);
      mscData.pkLoc = 
        cyBlkData?.pkLoc || 
        action?.pkLoc || 
        cyBlkData?.carO?.pkLoc?.loc || 
        cyBlkData?.carO?.pkLoc?.nm ||
        cyBlkData?.carO?.pkLoc?.cid?.toString();
      mscData.dpLoc = 
        cyBlkData?.dpLoc || 
        action?.dpLoc || 
        cyBlkData?.carO?.dpLoc?.loc || 
        cyBlkData?.carO?.dpLoc?.nm ||
        cyBlkData?.carO?.dpLoc?.cid?.toString();
    }

    // Extract cityKey for self-booked tour blocks
    // Check if this is a self-booked tour removal action
    if (blockId && (action.type === 'REMOVE' || action.addPrms?.cityKey)) {
      const cyBlkData = journeyData.dayBlkActionsMap[blockId];
      // Try to get cityKey from block data or action
      const cityKey =
        action.addPrms?.cityKey || cyBlkData?.cityKey || cyBlkData?.cky;
      if (cityKey) {
        mscData.cityKey = cityKey;
      }
      // Check if block is self-booked tour
      if (cyBlkData?.isSelfBookedTour) {
        mscData.isSelfBookedTourBlock = true;
      }
    }

    return {
      date,
      blockId,
      bid: blockId,
      sid,
      cityId: cyData?.dCty ?? action?.otherData?.city,
      tvlrKeys: JSON.stringify(mscData.rmTvlG || action?.rmTvlG),
      jid: journeyData.id,
      rmTvlG: mscData.rmTvlG || action?.rmTvlG,
      tvlG: action?.tvlG?.tvlA,
      dayNum: cyData?.dayNum,
      cityName: cyData?.dCtyD,
      ...mscData,
    };
  }, [date, action, blockId, journeyData]);
}
