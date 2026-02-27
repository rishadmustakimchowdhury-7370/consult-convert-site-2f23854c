import { useConversionTracking } from '@/hooks/useConversionTracking';

/**
 * Renders nothing — just initialises conversion tracking
 * (captures UTM / gclid params, loads gtag on production).
 */
export const ConversionTrackingProvider = () => {
  useConversionTracking();
  return null;
};
