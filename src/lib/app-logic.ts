import { SUPPORTED_STATES } from "./templates";

export const _stateList = SUPPORTED_STATES.join(", ");

export const _stateListHero =
	SUPPORTED_STATES.length > 1
		? `${SUPPORTED_STATES.slice(0, -1).join(", ")}, and ${SUPPORTED_STATES.slice(-1)}`
		: SUPPORTED_STATES[0];

export const _stateListFooter =
	SUPPORTED_STATES.slice(0, -1).join(", ") +
	(SUPPORTED_STATES.length > 1
		? `, and ${SUPPORTED_STATES.slice(-1)}`
		: SUPPORTED_STATES[0]);

export const _defaultDescription = `Professional Lien Waiver templates for ${_stateList}. Streamline your construction billing workflow.`;
