import React from 'react';
import AddPackageModal from '../../common/components/AddPackageModal';
import {ILLUSION_IMG, ILLUST_IMG} from '../../utils/assetUtil';

interface AddPackageProps {
  onGoToItinerary?: () => void;
  status?: 'success' | 'error' | 'loading';
  errorMessage?: string | null;
  selectedItem?: {
    id: string;
    name: string;
    price?: { prcD: string };
  } | null;
}

const AddPackage: React.FC<AddPackageProps> = ({
  onGoToItinerary, 
  status = 'success',
  errorMessage,
  selectedItem
}) => {
  const isSuccess = status === 'success';
  const isLoading = status === 'loading';
  
 
  const getTitle = () => {
    if (isLoading) return 'Adding Road Transport...';
    if (isSuccess) return 'Road Transport Added Successfully!';
    return 'Failed to Add Road Transport';
  };
  
  const getDescription = () => {
    if (isLoading) return 'Please wait while we add your transport to the itinerary';
    if (isSuccess) return 'Your private transfers has been added to your itinerary';
    return errorMessage || 'There was an error adding your private transfers. Please try again.';
  };
  
  const getButtonText = () => {
    if (isLoading) return 'Adding...';
    if (isSuccess) return 'Go to Itinerary';
    return 'Try Again';
  };

  return (
    <AddPackageModal
      mainImage={ILLUSION_IMG}
      title={getTitle()}
      description={getDescription()}
      buttonText={getButtonText()}
      onButtonPress={onGoToItinerary}
      badgePosition={{left: 220, top: 88}}
      status={status}
      isLoading={isLoading}
    />
  );
};

export default AddPackage;