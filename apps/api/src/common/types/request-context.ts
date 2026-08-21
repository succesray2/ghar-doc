/** IP/user-agent captured from the request for an audit-trail row —
 *  never used for any access-control decision, purely a forensic record. */
export interface RequestContext {
  ip?: string;
  userAgent?: string;
}
