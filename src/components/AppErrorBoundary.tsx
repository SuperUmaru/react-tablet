import { Component, type ErrorInfo, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { telemetry } from '../observability/telemetry';

class Boundary extends Component<{ children: ReactNode; copy: { title: string; detail: string; reload: string; reference: string } }, { crashed: boolean; traceId?: string }> {
  state = { crashed: false, traceId: undefined };
  static getDerivedStateFromError() { return { crashed: true }; }
  componentDidCatch(error: Error, info: ErrorInfo) { this.setState({ traceId: telemetry.capture('app_crash', error, undefined, info.componentStack ?? undefined) }); }
  render() {
    if (!this.state.crashed) return this.props.children;
    return <main className="fatal-error"><h1>{this.props.copy.title}</h1><p>{this.props.copy.detail}</p>{this.state.traceId && <code>{this.props.copy.reference}: {this.state.traceId}</code>}<button className="button" type="button" onClick={() => location.reload()}>{this.props.copy.reload}</button></main>;
  }
}

export function AppErrorBoundary({ children }: { children: ReactNode }) {
  const { t } = useTranslation();
  return <Boundary copy={{ title: t('errors.crashTitle'), detail: t('errors.crashDetail'), reload: t('errors.reload'), reference: t('errors.reference') }}>{children}</Boundary>;
}
