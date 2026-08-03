import { useEffect } from 'react';
import { installGlobalErrorCapture } from '../observability/telemetry';
export function ObservabilityBootstrap() { useEffect(() => installGlobalErrorCapture(), []); return null; }
