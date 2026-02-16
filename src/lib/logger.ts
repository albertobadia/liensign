function sanitize(obj: unknown): unknown {
	if (obj === null || typeof obj !== "object") {
		if (typeof obj === "string" && obj.includes("@")) {
			return obj.replace(/([^@\s]{1,3})([^@\s]*)@/, "$1***@");
		}
		return obj;
	}

	if (Array.isArray(obj)) {
		return obj.map(sanitize);
	}

	const sensitiveKeys = [
		"tax_id",
		"taxId",
		"password",
		"token",
		"access_token",
		"secret",
		"credit_card",
		"signature",
	];
	const sanitized: Record<string, unknown> = {};

	for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
		if (
			sensitiveKeys.some((sk) => key.toLowerCase().includes(sk.toLowerCase()))
		) {
			sanitized[key] = "[MASKED]";
		} else {
			sanitized[key] = sanitize(value);
		}
	}
	return sanitized;
}

export const logger = {
	info: (message: string, data?: unknown) => {
		console.log(
			`[INFO] [${new Date().toISOString()}] ${message}`,
			data ? sanitize(data) : "",
		);
	},
	warn: (message: string, data?: unknown) => {
		console.warn(
			`\x1b[33m[WARN] [${new Date().toISOString()}] ${message}\x1b[0m`,
			data ? sanitize(data) : "",
		);
	},
	error: (message: string, error?: unknown) => {
		console.error(
			`\x1b[31m[ERROR] [${new Date().toISOString()}] ${message}\x1b[0m`,
		);
		if (error) {
			const sanitizedError = sanitize(error);
			if (error instanceof Error) {
				console.error(`\x1b[31mStack: ${error.stack}\x1b[0m`);
			} else {
				console.error("\x1b[31mDetails:\x1b[0m", sanitizedError);
			}
		}
	},
	critical: (message: string, error?: unknown) => {
		const timestamp = new Date().toISOString();
		const sanitizedError = sanitize(error);
		console.error(
			`\x1b[41m\x1b[37m[CRITICAL] [${timestamp}] ${message}\x1b[0m`,
		);
		if (error) console.error(sanitizedError);
	},
};
