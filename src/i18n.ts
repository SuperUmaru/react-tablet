import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

export const resources = {
  en: {
    translation: {
      brand: 'Aurelia',
      clinic: 'Riverside Clinic',
      staffPortal: 'Staff portal',
      nav: { overview: 'Overview', schedule: 'Schedule', patients: 'Patients', checkout: 'Checkout', settings: 'Settings' },
      dashboard: {
        greeting: 'Good morning, Olivia',
        subtitle: 'Here’s what’s happening at Riverside Clinic today.',
        startCheckIn: 'Start patient check-in',
        today: "Today’s schedule",
        viewSchedule: 'View full schedule',
        appointments: 'Appointments',
        checkedIn: 'Checked in',
        needsAttention: 'Needs attention',
        readyCheckout: 'Ready for checkout'
      },
      kiosk: {
        eyebrow: 'PRIVATE & SECURE CHECK-IN',
        title: 'Welcome to Aurelia',
        subtitle: 'Let’s get you checked in. It only takes a few minutes.',
        phone: 'Last 4 digits of your phone number',
        dob: 'Date of birth',
        continue: 'Find my appointment',
        staffHelp: 'Need help? Ask our front desk team.',
        notFound: 'We couldn’t find a matching appointment. Check your details or ask the front desk.',
        found: 'We found your appointment',
        confirm: 'Yes, check me in',
        back: 'That’s not me',
        success: 'You’re checked in!',
        successDetail: 'Please have a seat. Your provider will be with you shortly.',
        finish: 'Finish'
      },
      status: {
        scheduled: 'Scheduled', arrived: 'Arrived', 'forms-incomplete': 'Forms needed',
        ready: 'Ready', 'in-treatment': 'In treatment', checkout: 'Checkout', completed: 'Completed'
      },
      common: { language: 'Language', time: 'Time', patient: 'Patient', service: 'Service', provider: 'Provider', status: 'Status' }
    }
  },
  es: {
    translation: {
      brand: 'Aurelia', clinic: 'Clínica Riverside', staffPortal: 'Portal del personal',
      nav: { overview: 'Resumen', schedule: 'Agenda', patients: 'Pacientes', checkout: 'Pago', settings: 'Configuración' },
      dashboard: { greeting: 'Buenos días, Olivia', subtitle: 'Esto es lo que ocurre hoy en la Clínica Riverside.', startCheckIn: 'Iniciar registro del paciente', today: 'Agenda de hoy', viewSchedule: 'Ver agenda completa', appointments: 'Citas', checkedIn: 'Registrados', needsAttention: 'Requieren atención', readyCheckout: 'Listos para pagar' },
      kiosk: { eyebrow: 'REGISTRO PRIVADO Y SEGURO', title: 'Bienvenido a Aurelia', subtitle: 'Vamos a registrarte. Solo tomará unos minutos.', phone: 'Últimos 4 dígitos de tu teléfono', dob: 'Fecha de nacimiento', continue: 'Buscar mi cita', staffHelp: '¿Necesitas ayuda? Pregunta en recepción.', notFound: 'No encontramos una cita que coincida. Revisa tus datos o pregunta en recepción.', found: 'Encontramos tu cita', confirm: 'Sí, registrarme', back: 'No soy yo', success: '¡Registro completado!', successDetail: 'Toma asiento. Tu proveedor estará contigo en breve.', finish: 'Finalizar' },
      status: { scheduled: 'Programada', arrived: 'Registrado', 'forms-incomplete': 'Faltan formularios', ready: 'Listo', 'in-treatment': 'En tratamiento', checkout: 'Pago', completed: 'Completada' },
      common: { language: 'Idioma', time: 'Hora', patient: 'Paciente', service: 'Servicio', provider: 'Proveedor', status: 'Estado' }
    }
  }
} as const;

void i18n.use(initReactI18next).init({
  resources,
  lng: 'en',
  fallbackLng: 'en',
  interpolation: { escapeValue: false }
});

export default i18n;
