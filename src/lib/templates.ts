import { AZ } from "./templates/az";
import { CA } from "./templates/ca";
import { FL } from "./templates/fl";
import { GA } from "./templates/ga";
import { MI } from "./templates/mi";
import { NV } from "./templates/nv";
import { NY } from "./templates/ny";
import { OTHER } from "./templates/other";
import { TX } from "./templates/tx";
import type { StateTemplates } from "./templates/types";
import { UT } from "./templates/ut";

export type { StateTemplates, WaiverTemplate } from "./templates/types";

export const WAIVER_TEMPLATES: Record<string, StateTemplates> = {
	TX,
	CA,
	FL,
	GA,
	MI,
	NY,
	AZ,
	NV,
	UT,
	OTHER,
};
