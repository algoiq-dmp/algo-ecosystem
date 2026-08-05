export type AppMode = 'beta' | 'production';

export interface FeatureFlags {
  narad: boolean;
  suraksha: boolean;
  hanuman: boolean;
  thetaYantra: boolean;
  odinPlatform: boolean;
  parikshak: boolean;
}

export const BETA_HIDDEN_NODES = [
  'hanuman',
  'theta-yantra',
  'odin',
  'suraksha',
  'narad',
  'parikshak',
] as const;

export const BETA_HIDDEN_NAV_ITEMS = [
  'Hanuman',
  'Theta Yantra',
  'ODIN',
  'Suraksha',
  'Narad',
  'Parikshak',
] as const;

export const FEATURE_FLAGS: Record<AppMode, FeatureFlags> = {
  beta: {
    narad: false,
    suraksha: false,
    hanuman: false,
    thetaYantra: false,
    odinPlatform: false,
    parikshak: false,
  },
  production: {
    narad: true,
    suraksha: true,
    hanuman: true,
    thetaYantra: true,
    odinPlatform: true,
    parikshak: true,
  },
};

export function isNodeVisibleInBeta(nodeId: string): boolean {
  return !(BETA_HIDDEN_NODES as readonly string[]).includes(nodeId);
}

export function isNavItemVisibleInBeta(label: string): boolean {
  return !(BETA_HIDDEN_NAV_ITEMS as readonly string[]).includes(label);
}
