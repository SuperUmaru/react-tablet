import { createFileRoute } from '@tanstack/react-router';
import { CheckInPage } from '../pages/CheckInPage';

export const Route = createFileRoute('/check-in')({ component:CheckInPage });
