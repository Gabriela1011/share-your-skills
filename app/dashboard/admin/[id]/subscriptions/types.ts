export interface Subscription {
  id: string;
  plan_type: string;
  price: number;
  commission: number;
  target: string;
  recommendation: string;
  subscription_features: SubscriptionFeature[];
}

export interface SubscriptionFeature {
  features: Feature;
}

export interface Feature {
  id: string;
  feature: string;
}
