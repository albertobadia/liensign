export const WAIVER_TYPES = [
	"conditional_progress",
	"unconditional_progress",
	"conditional_final",
	"unconditional_final",
] as const;

export type WaiverType = (typeof WAIVER_TYPES)[number];

export interface WaiverTemplate {
	title: string;
	notice?: string;
	noticeStyle?: {
		fontSize?: number;
		isBold?: boolean;
		isAllCaps?: boolean;
	};
	body: string;
	fields: string[];
}

export interface StateTemplates {
	name: string;
	statute: string;
	lastVerified: string;
	sourceUrl: string;
	baseFontSize?: number;
	signatureConfig?: {
		maxWidth?: number;
		maxHeight?: number;
	};
	sealRequired?: boolean;
	forms: Record<WaiverType, WaiverTemplate>;
}
