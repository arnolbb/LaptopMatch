export type Recommendation = {
  rank: number;
  title: string;
  name: string;
  price: string;
  specs: {
    cpu: string;
    ram: string;
    storage: string;
    gpu: string;
    battery: string;
    weight: string;
  };
  description: string;
  pros: string[];
  cons: string[];
};

export type ResultData = {
  recommendations: Recommendation[];
  buyingAdvice: string;
};

export type UserPreferences = {
  budget: number;
  needs: string[];
  priorities: string[];
  os: string;
  brand: string;
};
