import {
  Image,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
  FlatList,
  Animated,
  Dimensions,
} from 'react-native';
import MasonryList from '@react-native-seoul/masonry-list';
import React, {useState, useRef} from 'react';
import {Colors} from '../../../styles';
import {ArrowLeft, LayoutGrid, Server} from 'lucide-react-native';
import {CustomText} from '../../../common/components';
import {useSelector} from 'react-redux';
import {RootState} from '../../../store';
import {useNavigation} from '@react-navigation/native';

const {width} = Dimensions.get('window');

export function HotelImages() {
  const [layout, setLayout] = useState<'Grid' | 'Landscape'>('Grid');
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const navigation = useNavigation();

  const handleLayoutChange = (newLayout: 'Grid' | 'Landscape') => {
    if (newLayout === layout) return;

    // Fade out
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 150,
      useNativeDriver: true,
    }).start(() => {
      // Change layout
      setLayout(newLayout);
      // Fade in
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }).start();
    });
  };

  const selectedHotelDetails = useSelector(
    (state: RootState) => state.hotel.selectedHotelDetails?._data,
  );

  const hotelImages = selectedHotelDetails?.details.hotelImages || [];
  const photoCount = hotelImages.length;

  return (
    <View style={styles.container}>
      <StatusBar barStyle={'dark-content'} />
      <View style={styles.headerWrapper}>
        <View
          style={{flexDirection: 'row', alignItems: 'center', columnGap: 16}}>
          <ArrowLeft onPress={() => navigation.goBack()} />
          <CustomText variant="text-base-semibold" color="neutral900">
            Photos
          </CustomText>
        </View>
        <View style={styles.toggleContainer}>
          <TouchableOpacity
            onPress={() => handleLayoutChange('Grid')}
            style={[
              styles.layoutToggle,
              layout === 'Grid' && styles.activeToggle,
            ]}>
            <LayoutGrid
              size={16}
              color={
                layout === 'Grid'
                  ? Colors.lightThemeColors.neutral900
                  : Colors.lightThemeColors.neutral500
              }
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => handleLayoutChange('Landscape')}
            style={[
              styles.layoutToggle,
              layout === 'Landscape' && styles.activeToggle,
            ]}>
            <Server
              size={16}
              color={
                layout === 'Landscape'
                  ? Colors.lightThemeColors.neutral900
                  : Colors.lightThemeColors.neutral500
              }
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Separator */}
      <View style={styles.separator}></View>

      <Animated.View style={[styles.animatedContainer, {opacity: fadeAnim}]}>
        <GridView images={hotelImages} layout={layout} />
      </Animated.View>
    </View>
  );
}

const MasonryImage = ({uri, index}: {uri: string; index: number}) => {
  const HEIGHTS = [140, 200, 260, 180];
  const height = React.useMemo(
    () => HEIGHTS[Math.floor(Math.random() * HEIGHTS.length)],
    [],
  );
  return (
    <View style={{height, width: '100%'}}>
      <Image
        source={{uri}}
        style={{
          width: '100%',
          height: '100%',
          // aspectRatio: ratio,
          borderRadius: 12,
          objectFit: 'cover',
        }}
        resizeMode="cover"
      />
    </View>
  );
};

const LandscapeImage = ({uri}: {uri: string}) => {
  return (
    <Image
      source={{uri}}
      style={{
        width: '100%',
        height: 200,
        borderRadius: 12,
      }}
      resizeMode="cover"
    />
  );
};

const GridView = ({
  images,
  layout,
}: {
  images: {imageUrl: string}[];
  layout: 'Grid' | 'Landscape';
}) => {
  if (layout === 'Landscape') {
    return (
      <FlatList
        data={images}
        keyExtractor={(_, index) => `landscape-${index}`}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.landscapeContainer}
        renderItem={({item}) => (
          <View style={styles.landscapeImageWrapper}>
            <LandscapeImage uri={item.imageUrl} />
          </View>
        )}
      />
    );
  }

  return (
    <MasonryList
      key={layout}
      style={{flex: 1}}
      contentContainerStyle={styles.gridContainer}
      data={images}
      keyExtractor={(_, index) => `grid-${index}`}
      numColumns={2}
      showsVerticalScrollIndicator={false}
      renderItem={({item, index}: any) => (
        <View style={styles.gridImageWrapper}>
          <MasonryImage uri={item.imageUrl} index={index} />
        </View>
      )}
    />
  );
};

const styles = StyleSheet.create({
  headerWrapper: {
    flexDirection: 'row',
    columnGap: 16,
    width: width * 0.9,
    alignSelf: 'center',
    alignItems: 'center',
    padding: 5,
    justifyContent: 'space-between',
  },
  separator: {
    height: 1,
    width: '100%',
    backgroundColor: Colors.lightThemeColors.neutral300,
    marginTop: 5,
  },
  container: {
    flex: 1,
    paddingTop: 50,
    backgroundColor: Colors.lightThemeColors.white,
  },
  animatedContainer: {
    flex: 1,
  },
  controlsContainer: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  toggleContainer: {
    backgroundColor: Colors.lightThemeColors.neutral100,
    flexDirection: 'row',
    padding: 4,
    borderRadius: 8,
    gap: 4,
  },
  layoutToggle: {
    paddingHorizontal: 18,
    paddingVertical: 4,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeToggle: {
    backgroundColor: Colors.lightThemeColors.white,
    shadowColor: Colors.lightThemeColors.neutral900,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  gridContainer: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  gridImageWrapper: {
    flex: 1,
    padding: 4,
  },
  landscapeContainer: {
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  landscapeImageWrapper: {
    marginBottom: 12,
  },
});
