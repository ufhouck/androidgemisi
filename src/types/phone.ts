export interface Phone {
  id: string;
  name: string;
  price: {
    tr: string;
    eu: string;
    us: string;
  };
  rating: number;
  specs: {
    processor: string;
    ram: string;
    storage: string;
    camera: string;
    battery: string;
    screen: string;
  };
  colors: string[];
  releaseDate: string;
  reviews?: {
    positive: number;
    neutral: number;
    negative: number;
  };
}