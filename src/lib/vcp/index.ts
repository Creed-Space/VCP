/**
 * VCP (Value Context Protocol) Library
 * Main entry point - re-exports all VCP functionality
 */

// Types
export * from './types';

// Context management
export {
	vcpContext,
	publicContext,
	influenceFlags,
	vcpConsents,
	filterContextForPlatform,
	getSharePreview,
	createContext,
	mergeContext
} from './context';

// Constitution loading and resolution
export {
	loadConstitution,
	getAllConstitutions,
	getConstitutionIds,
	resolveRules,
	getPersonaTone,
	getActivePersona,
	constitutionAppliesToScope,
	getConstitutionsForScope,
	suggestPersonaFromPersonalState
} from './constitution';

// Transition detection
export { detectTransition } from './transition-detection';
export type { TransitionSeverity, TransitionResult } from './transition-detection';

// Natural language parsing
export { parsePersonalStateFromText, applyParsedSignals } from './nl-parser';
export type { ParsedSignal } from './nl-parser';

// Audit trail
export {
	auditTrail,
	logAuditEntry,
	logContextShared,
	logRecommendation,
	logAdjustment,
	todayAudit,
	auditedPlatforms,
	getStakeholderView,
	getFullView,
	getComparisonView,
	getAuditSummary
} from './audit';

// Privacy filtering
export {
	PUBLIC_FIELDS,
	CONSENT_REQUIRED_FIELDS,
	PRIVATE_FIELDS,
	getFieldValue,
	isPrivateField,
	extractConstraintFlags,
	getStakeholderVisibleFields,
	getStakeholderHiddenFields,
	formatFieldName,
	getFieldPrivacyLevel,
	generatePrivacySummary,
	getSharePreview as getSharePreviewDetailed
} from './privacy';
