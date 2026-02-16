import { APP_SETTINGS } from "../config/settings";

/**
 * Global application logic helpers to keep Astro files clean
 */

export const _stateList = APP_SETTINGS.SUPPORTED_STATES.join(", ");

export const _stateListHero =
	APP_SETTINGS.SUPPORTED_STATES.length > 1
		? `${APP_SETTINGS.SUPPORTED_STATES.slice(0, -1).join(", ")}, and ${APP_SETTINGS.SUPPORTED_STATES.slice(-1)}`
		: APP_SETTINGS.SUPPORTED_STATES[0];

export const _stateListFooter =
	APP_SETTINGS.SUPPORTED_STATES.slice(0, -1).join(", ") +
	(APP_SETTINGS.SUPPORTED_STATES.length > 1
		? `, and ${APP_SETTINGS.SUPPORTED_STATES.slice(-1)}`
		: APP_SETTINGS.SUPPORTED_STATES[0]);

export const _defaultDescription = `Professional Lien Waiver templates for ${_stateList}. Streamline your construction billing workflow.`;
