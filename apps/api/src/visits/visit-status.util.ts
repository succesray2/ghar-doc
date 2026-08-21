import { VisitStatus } from '@ghar-doc/shared';

export { VISIT_TRANSITIONS, isTransitionAllowed, getLegalTransitions } from '@ghar-doc/shared';

/** Which Visit column records the timestamp of entering a given status. */
export function timestampFieldFor(status: VisitStatus): string | null {
  switch (status) {
    case VisitStatus.ASSIGNED:
      return 'assignedAt';
    case VisitStatus.PROVIDER_ACCEPTED:
      return 'acceptedAt';
    case VisitStatus.EN_ROUTE:
      return 'enRouteAt';
    case VisitStatus.ARRIVED:
      return 'arrivedAt';
    case VisitStatus.IN_PROGRESS:
      return 'inProgressAt';
    case VisitStatus.COMPLETED:
      return 'completedAt';
    case VisitStatus.CANCELLED:
      return 'cancelledAt';
    default:
      return null;
  }
}
