"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLegalTransitions = exports.isTransitionAllowed = exports.VISIT_TRANSITIONS = void 0;
exports.timestampFieldFor = timestampFieldFor;
const shared_1 = require("@ghar-doc/shared");
var shared_2 = require("@ghar-doc/shared");
Object.defineProperty(exports, "VISIT_TRANSITIONS", { enumerable: true, get: function () { return shared_2.VISIT_TRANSITIONS; } });
Object.defineProperty(exports, "isTransitionAllowed", { enumerable: true, get: function () { return shared_2.isTransitionAllowed; } });
Object.defineProperty(exports, "getLegalTransitions", { enumerable: true, get: function () { return shared_2.getLegalTransitions; } });
function timestampFieldFor(status) {
    switch (status) {
        case shared_1.VisitStatus.ASSIGNED:
            return 'assignedAt';
        case shared_1.VisitStatus.PROVIDER_ACCEPTED:
            return 'acceptedAt';
        case shared_1.VisitStatus.EN_ROUTE:
            return 'enRouteAt';
        case shared_1.VisitStatus.ARRIVED:
            return 'arrivedAt';
        case shared_1.VisitStatus.IN_PROGRESS:
            return 'inProgressAt';
        case shared_1.VisitStatus.COMPLETED:
            return 'completedAt';
        case shared_1.VisitStatus.CANCELLED:
            return 'cancelledAt';
        default:
            return null;
    }
}
//# sourceMappingURL=visit-status.util.js.map