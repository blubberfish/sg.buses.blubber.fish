export const ONE_SECOND = 1000;

export const ONE_MINUTE = 60 * ONE_SECOND;

export const ONE_HOUR = 60 * ONE_MINUTE;

export const ONE_DAY = 24 * ONE_HOUR;

export const SERVER_CACHE_ONE_SECOND = 1;

export const SERVER_CACHE_ONE_MINUTE = 60 * SERVER_CACHE_ONE_SECOND;

export const SERVER_CACHE_ONE_HOUR = 60 * SERVER_CACHE_ONE_MINUTE;

export const SERVER_CACHE_ONE_DAY = 24 * SERVER_CACHE_ONE_HOUR;

export const DEFAULT_POSITION_BIAS = {
  SINGAPORE: {
    LONGITUDE: 103.8198,
    LATITUDE: 1.3521,
  },
};

export const RADIUS_STEPS = [150, 250, 500];

export const BEARING = {
  N: 0,
  S: 180,
  E: 90,
  W: -90,
} as const;
