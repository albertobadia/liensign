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
	forms: {
		conditional_progress: WaiverTemplate;
		unconditional_progress: WaiverTemplate;
		conditional_final: WaiverTemplate;
		unconditional_final: WaiverTemplate;
	};
}
