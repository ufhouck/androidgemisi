import { DollarSign, Smartphone, Cpu, HardDrive, Battery } from 'lucide-react';

export interface FilterOption {
  value: string;
  label: string;
}

export interface Filter {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  options: FilterOption[];
}

export function getFilterConfig(isMobile: boolean) {
  const mainFilters: Filter[] = [
    {
      id: 'price',
      label: 'Fiyat',
      icon: DollarSign,
      options: [
        { value: '0-10000', label: '10.000 ₺ altı' },
        { value: '10000-20000', label: '10.000 ₺ - 20.000 ₺' },
        { value: '20000-30000', label: '20.000 ₺ - 30.000 ₺' },
        { value: '30000-50000', label: '30.000 ₺ - 50.000 ₺' },
        { value: '50000-plus', label: '50.000 ₺ üzeri' },
      ]
    },
    {
      id: 'brand',
      label: 'Marka',
      icon: Smartphone,
      options: [
        { value: 'samsung', label: 'Samsung' },
        { value: 'xiaomi', label: 'Xiaomi' },
        { value: 'google', label: 'Google' },
        { value: 'oneplus', label: 'OnePlus' },
        { value: 'honor', label: 'Honor' },
        { value: 'tecno', label: 'Tecno' },
        { value: 'reeder', label: 'Reeder' },
      ]
    }
  ];

  const additionalFilters: Filter[] = [
    {
      id: 'processor',
      label: 'İşlemci',
      icon: Cpu,
      options: [
        { value: 'snapdragon-8-gen-3', label: 'Snapdragon 8 Gen 3' },
        { value: 'dimensity-9300', label: 'Dimensity 9300' },
        { value: 'tensor-g3', label: 'Google Tensor G3' },
        { value: 'dimensity-7200', label: 'Dimensity 7200' },
        { value: 'helio-g99', label: 'Helio G99' },
        { value: 'helio-g85', label: 'Helio G85' },
      ]
    },
    {
      id: 'ram',
      label: 'RAM',
      icon: HardDrive,
      options: [
        { value: '6gb', label: '6 GB' },
        { value: '8gb', label: '8 GB' },
        { value: '12gb', label: '12 GB' },
        { value: '16gb', label: '16 GB' },
      ]
    },
    {
      id: 'storage',
      label: 'Depolama',
      icon: HardDrive,
      options: [
        { value: '128gb', label: '128 GB' },
        { value: '256gb', label: '256 GB' },
        { value: '512gb', label: '512 GB' },
        { value: '1tb', label: '1 TB' },
      ]
    },
    {
      id: 'battery',
      label: 'Batarya',
      icon: Battery,
      options: [
        { value: '4000-5000', label: '4000-5000 mAh' },
        { value: '5000+', label: '5000+ mAh' },
      ]
    }
  ];

  // For mobile, move storage to additional filters
  if (isMobile) {
    const storageFilter = mainFilters.find(f => f.id === 'storage');
    if (storageFilter) {
      mainFilters.splice(mainFilters.indexOf(storageFilter), 1);
      additionalFilters.unshift(storageFilter);
    }
  }

  return {
    mainFilters,
    additionalFilters
  };
}