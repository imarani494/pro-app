// Car Filters utility class for dynamic filtering based on car search results
interface CarSearchResult {
  prc: number;
  dpLoc?: { loc?: string; isApt?: boolean };
  pkLoc?: { loc?: string; isApt?: boolean };
  fpl?: string;
  gk?: string;
  mpl?: string;
  prD?: string;
  optr?: { nm?: string; lg?: string };
  vd?: {
    vnm?: string;
    img?: string;
    vtyp?: string;
    isAutoTx?: boolean;
    hasAC?: boolean;
    ndr?: number;
    nst?: number;
    slg?: number;
    ftA?: string[];
    isAWD?: boolean;
  };
}

interface FilterOption {
  id: string | number;
  nm: string;
  count?: number;
}

interface FilterItem {
  typ: string;
  nm: string;
  applA: (string | number)[];
  optA: FilterOption[];
  opts: Record<string | number, boolean>;
  isDyn?: boolean;
}

interface FilterOptions {
  cname: FilterItem;
  ctype: FilterItem;
  spec: FilterItem;
  seat: FilterItem;
  optr: FilterItem;
  pkup: FilterItem;
  drpoff: FilterItem;
}

export class CarFilters {
  private carSearchResults: CarSearchResult[];
  public filterOptions: FilterOptions;
  public filters: string[];

  constructor(carSearchResults: CarSearchResult[]) {
    this.carSearchResults = carSearchResults;
    this.filterOptions = {
      cname: { typ: "cname", nm: "Search", applA: [], optA: [], opts: {} },
      ctype: { typ: "ctype", nm: "Car Type", applA: [], optA: [], opts: {} },
      spec: { typ: "spec", nm: "Specification", applA: [], optA: [], opts: {} },
      seat: { typ: "seat", nm: "Seats", applA: [], optA: [], opts: {} },
      optr: { typ: "optr", nm: "Supplier", applA: [], optA: [], opts: {} },
      pkup: { typ: "pkup", nm: "Pick-up Location", applA: [], optA: [], opts: {} },
      drpoff: { typ: "drpoff", nm: "Drop-off Location", applA: [], optA: [], opts: {} }
    };
    this.filters = ['cname', 'ctype', 'spec', 'seat', 'optr', 'pkup', 'drpoff'];
    
    this.createFilterOptions();
  }

  private createFilterOptions(): void {
    if (!this.carSearchResults || this.carSearchResults.length === 0) return;

    // Reset all options
    Object.keys(this.filterOptions).forEach(key => {
      this.filterOptions[key as keyof FilterOptions].optA = [];
      this.filterOptions[key as keyof FilterOptions].opts = {};
    });

    this.carSearchResults.forEach((carItem, index) => {
      const vdO = carItem.vd;
      
      if (!vdO) {
        console.warn(`Car ${index}: Missing vehicle data (vd)`);
        return;
      }

      // Seats filter - include all seat counts including 2 seats
      if (vdO.nst && vdO.nst > 0) {
        const seatCount = vdO.nst > 6 ? 7 : vdO.nst; // Use 7 for 7+ seats instead of 6
        const seatLabel = vdO.nst > 6 ? '6+' : vdO.nst.toString();
        this.addFilterOption('seat', {
          id: seatCount,
          nm: `${seatLabel} seats`
        });
      }

      // Car type filter - ensure all types including Passenger Van are captured
      if (vdO.vtyp) {
        this.addFilterOption('ctype', {
          id: vdO.vtyp,
          nm: vdO.vtyp
        });
      }

      // Specification filters
      if (vdO.isAutoTx !== undefined) {
        this.addFilterOption('spec', {
          id: vdO.isAutoTx ? 'Auto' : 'Manual',
          nm: vdO.isAutoTx ? 'Automatic Transmission' : 'Manual Transmission'
        });
      }

      if (vdO.isAWD) {
        this.addFilterOption('spec', {
          id: 'AWD',
          nm: 'All wheel-drive/4x4'
        });
      }

      if (vdO.hasAC) {
        this.addFilterOption('spec', {
          id: 'AC',
          nm: 'Air Conditioning'
        });
      }

      // Supplier filter
      if (carItem.optr?.nm) {
        this.addFilterOption('optr', {
          id: carItem.optr.nm,
          nm: carItem.optr.nm
        });
      }

      // Pick-up location filter
      if (carItem.pkLoc?.loc) {
        this.addFilterOption('pkup', {
          id: carItem.pkLoc.loc,
          nm: carItem.pkLoc.loc
        });
      }

      // Drop-off location filter
      if (carItem.dpLoc?.loc) {
        this.addFilterOption('drpoff', {
          id: carItem.dpLoc.loc,
          nm: carItem.dpLoc.loc
        });
      }
    });

    // Sort options alphabetically
    Object.keys(this.filterOptions).forEach(key => {
      if (key !== 'cname' && key !== 'seat') {
        this.filterOptions[key as keyof FilterOptions].optA.sort((a, b) => a.nm.localeCompare(b.nm));
      }
    });

    // Sort seats numerically
    this.filterOptions.seat.optA.sort((a, b) => {
      const aNum = typeof a.id === 'number' ? a.id : parseInt(a.id.toString());
      const bNum = typeof b.id === 'number' ? b.id : parseInt(b.id.toString());
      return aNum - bNum;
    });
  }

  private isLuxuryVehicle(carName: string, carType: string, supplierName: string): boolean {
    // Define luxury car indicators
    const luxuryBrands = ['bmw', 'mercedes', 'audi', 'lexus', 'cadillac', 'infiniti', 'acura', 'lincoln', 'jaguar', 'porsche', 'maserati', 'bentley', 'rolls-royce'];
    const luxuryTypes = ['luxury', 'premium', 'executive', 'prestige', 'convertible'];
    const luxuryModels = ['mustang', 'camaro', 'corvette', 'challenger', 'charger'];
    const premiumSuppliers = ['avis', 'hertz']; // Premium suppliers
    
    const nameCheck = luxuryBrands.some(brand => carName.includes(brand)) || 
                     luxuryModels.some(model => carName.includes(model));
    const typeCheck = luxuryTypes.some(type => carType.includes(type));
    const supplierCheck = premiumSuppliers.includes(supplierName.toLowerCase());
    
    return nameCheck || typeCheck || supplierCheck;
  }

  private addFilterOption(type: keyof FilterOptions, option: FilterOption): void {
    const filterItem = this.filterOptions[type];
    if (!filterItem) return;

    if (!filterItem.opts[option.id]) {
      filterItem.optA.push(option);
      filterItem.opts[option.id] = true;
    }
  }

  public resetAppliedFilters(): void {
    Object.keys(this.filterOptions).forEach(key => {
      this.filterOptions[key as keyof FilterOptions].applA = [];
    });
  }

  public isCarValid(carItem: CarSearchResult, searchTerm?: string): boolean {
    if (!carItem) return true;

    const vdO = carItem.vd;
    
    // Handle search filter first if search term is provided
    if (searchTerm && searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase().trim();
      
      // Basic text search across multiple fields
      const carName = vdO?.vnm?.toLowerCase() || '';
      const carType = vdO?.vtyp?.toLowerCase() || '';
      const supplierName = carItem.optr?.nm?.toLowerCase() || '';
      
      // Smart search for seat-related queries
      const seatCount = vdO?.nst || 0;
      const seatText = `${seatCount} seats`;
      const seatPlusText = seatCount > 6 ? '7+ seats' : seatText;
      
      // Smart search for transmission
      const transmissionText = vdO?.isAutoTx ? 'automatic' : 'manual';
      
      // Smart search for features
      const features: string[] = [];
      if (vdO?.hasAC) features.push('air conditioning', 'ac');
      if (vdO?.isAWD) features.push('awd', 'all wheel drive', '4x4');
      
      // Smart search for luxury/premium categories
      const isLuxuryCar = this.isLuxuryVehicle(carName, carType, supplierName);
      
      // Check if search matches any criteria
      const matchesBasicSearch = carName.includes(searchLower) || 
                                carType.includes(searchLower) || 
                                supplierName.includes(searchLower);
      
      const matchesSeatSearch = seatText.includes(searchLower) || 
                               seatPlusText.includes(searchLower) ||
                               searchLower.includes(seatCount.toString());
      
      const matchesTransmission = transmissionText.includes(searchLower);
      
      const matchesFeatures = features.some(feature => 
        feature.includes(searchLower) || searchLower.includes(feature)
      );
      
      // Smart search for luxury/premium terms
      const luxuryTerms = ['luxury', 'premium', 'executive', 'prestige'];
      const matchesLuxury = luxuryTerms.some(term => searchLower.includes(term)) && isLuxuryCar;
      
      // If none of the search criteria match, exclude this car
      if (!matchesBasicSearch && !matchesSeatSearch && !matchesTransmission && !matchesFeatures && !matchesLuxury) {
        return false;
      }
    }
    
    // Then apply category filters
    for (const filterType of this.filters) {
      const filterItem = this.filterOptions[filterType as keyof FilterOptions];
      
      if (!filterItem) continue;

      // Skip search filter as it's handled above
      if (filterType === 'cname') continue;

      // Skip if no filters applied for this type
      if (!filterItem.applA || filterItem.applA.length === 0) continue;

      switch (filterType) {
        case 'ctype':
          if (!vdO?.vtyp || filterItem.applA.indexOf(vdO.vtyp) < 0) {
            return false;
          }
          break;

        case 'seat': {
          let isFound = false;
          for (const appliedSeat of filterItem.applA) {
            const seatNum = typeof appliedSeat === 'number' ? appliedSeat : parseInt(appliedSeat.toString());
            if (vdO?.nst === seatNum || (seatNum >= 7 && (vdO?.nst || 0) >= 7)) {
              isFound = true;
              break;
            }
          }
          if (!isFound) return false;
          break;
        }

        case 'spec': {
          let isFound = false;
          for (const appliedSpec of filterItem.applA) {
            if ((vdO?.hasAC && appliedSpec === 'AC') ||
                (vdO?.isAWD && appliedSpec === 'AWD') ||
                (vdO?.isAutoTx && appliedSpec === 'Auto') ||
                (!vdO?.isAutoTx && appliedSpec === 'Manual')) {
              isFound = true;
              break;
            }
          }
          if (!isFound) return false;
          break;
        }

        case 'optr':
          if (!carItem.optr?.nm || filterItem.applA.indexOf(carItem.optr.nm) < 0) {
            return false;
          }
          break;

        case 'pkup':
          if (!carItem.pkLoc?.loc || filterItem.applA.indexOf(carItem.pkLoc.loc) < 0) {
            return false;
          }
          break;

        case 'drpoff':
          if (!carItem.dpLoc?.loc || filterItem.applA.indexOf(carItem.dpLoc.loc) < 0) {
            return false;
          }
          break;
      }
    }

    return true;
  }

  public applyFilter(filterType: keyof FilterOptions, optionId: string | number): void {
    const filterItem = this.filterOptions[filterType];
    if (!filterItem) return;

    const index = filterItem.applA.indexOf(optionId);
    if (index >= 0) {
      // Remove filter
      filterItem.applA.splice(index, 1);
    } else {
      // Add filter
      filterItem.applA.push(optionId);
    }
  }

  public getFilteredResults(searchTerm?: string): CarSearchResult[] {
    return this.carSearchResults.filter(car => this.isCarValid(car, searchTerm));
  }

  public getAppliedFiltersCount(): number {
    return Object.values(this.filterOptions).reduce((count, filter) => {
      return count + filter.applA.length;
    }, 0);
  }

  public getFilterSummary(): Record<string, number> {
    const summary: Record<string, number> = {};
    Object.entries(this.filterOptions).forEach(([key, filter]) => {
      summary[key] = filter.applA.length;
    });
    return summary;
  }
}

export default CarFilters;
