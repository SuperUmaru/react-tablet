import { createFileRoute } from '@tanstack/react-router';
import { PatientDetailPage } from '../pages/PatientDetailPage';

function PatientDetailRoute() {
  const { patientId } = Route.useParams();
  return <PatientDetailPage patientId={patientId} />;
}

export const Route = createFileRoute('/patients/$patientId')({ component:PatientDetailRoute });
