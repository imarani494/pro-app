import React, {useMemo, useState} from 'react';
import {View, StyleSheet, LayoutChangeEvent} from 'react-native';
import Svg, {Rect} from 'react-native-svg';
import {MessageCircleMore} from 'lucide-react-native';
import {useJournery} from '../../hooks/useJournery';
import {ActionType} from '../../../contentCard/types/contentCard';
import Actions from './Actions';
import {Colors} from '../../../styles';
import {useTheme} from '../../../context/ThemeContext';

export function AddIntroButton() {
  const journeyData = useJournery();
  const {colors} = useTheme();
  const [dimensions, setDimensions] = useState({width: 0, height: 0});

  const handleLayout = (event: LayoutChangeEvent) => {
    const {width, height} = event.nativeEvent.layout;
    setDimensions({width, height});
  };

  const advisorCommentActions = useMemo(() => {
    if (!journeyData?.journey?.actions) {
      return [];
    }
    return journeyData.journey.actions.filter(
      (action: any) => action.type === ActionType.ADVISOR_COMMENT,
    );
  }, [journeyData?.journey?.actions]);

  // Only show button if advisor comment actions exist
  if (!advisorCommentActions || advisorCommentActions.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View
        style={[styles.buttonContainer, {backgroundColor: colors.neutral50}]}
        onLayout={handleLayout}>
        {/* Dashed Border SVG - positioned absolutely */}
        {dimensions.width > 0 && dimensions.height > 0 && (
          <View style={styles.svgContainer}>
            <Svg width={dimensions.width} height={dimensions.height}>
              <Rect
                x="0.5"
                y="0.5"
                width={dimensions.width - 1}
                height={dimensions.height - 1}
                rx="6"
                ry="6"
                fill="none"
                stroke={colors.neutral300 || '#D1D5DB'}
                strokeWidth="1"
                strokeDasharray="5 4"
                strokeLinecap="butt"
              />
            </Svg>
          </View>
        )}

        {/* Content */}
        <View style={styles.content}>
          <Actions
            date={null}
            actions={advisorCommentActions}
            blockId={null}
            leftIcon={
              <MessageCircleMore size={20} color={colors.neutral600 || '#6B7280'} />
            }
            grpName="Add intro to the customer"
            btnStyle={styles.actionButton}
            textColor="neutral600"
            textStyle={styles.actionText}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 8,
  },
  buttonContainer: {
    width: '100%',
    padding: 8,
    borderRadius: 6,
    position: 'relative',
    overflow: 'hidden',
    minHeight: 40,
  },
  svgContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 0,
  },
  content: {
    width: '100%',
    position: 'relative',
    zIndex: 1,
  },
  actionButton: {
    width: '100%',
    borderWidth: 0,
    padding: 0,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  actionText: {
    fontSize: 14,
    textAlign: 'center',
    flexWrap: 'wrap',
  },
});

export default AddIntroButton;
