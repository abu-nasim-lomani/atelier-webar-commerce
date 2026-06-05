/**
 * Capability — leaf layer for device / network / AR-support detection. Read by
 * any layer, depends on none. Phase H consumes this in full; Phase F1 only
 * needs the platform discriminator.
 */
export {
  detectPlatform,
  isImmersiveArSupported,
  type Platform,
} from './arSupport';
