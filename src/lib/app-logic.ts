import { SUPPORTED_STATES } from "./templates";

const listFormatter = new Intl.ListFormat("en", {
	style: "long",
	type: "conjunction",
});

export const _stateList = SUPPORTED_STATES.join(", ");

export const _stateListHero = listFormatter.format(SUPPORTED_STATES);

export const _stateListFooter = listFormatter.format(SUPPORTED_STATES);

export const _defaultDescription = `Professional Lien Waiver templates for ${_stateList}. Streamline your construction billing workflow.`;
