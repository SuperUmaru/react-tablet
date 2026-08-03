import { createFileRoute } from '@tanstack/react-router';
import { SchedulePage } from '../pages/SchedulePage';

interface ScheduleSearch { patientId?: string }

function ScheduleRoute() {
  const { patientId } = Route.useSearch();
  return <SchedulePage patientId={patientId} />;
}

export const Route = createFileRoute('/schedule')({
  validateSearch: (search:Record<string, unknown>):ScheduleSearch => ({
    patientId: typeof search.patientId === 'string' && search.patientId.length <= 80 ? search.patientId : undefined,
  }),
  component:ScheduleRoute,
});
