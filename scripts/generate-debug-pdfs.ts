import fs from "node:fs";
import path from "node:path";
import { generateWaiverPDF } from "../src/lib/pdf";
import { WAIVER_TEMPLATES } from "../src/lib/templates";

// Mock data (similar to what the Wizard would provide)
const MOCK_DATA = {
	customer: "Acme Constructions Inc.",
	amount: "1,500.00",
	claimant: "John Doe Electric",
	owner: "Stark Industries",
	location: "1234 Malibu Point, CA",
	job_description: "Electrical Wiring and Fixtures",
	through_date: "2026-02-15",
	job_name: "Stark Tower Renovation",
	// Extra fields for specific states if needed
	invoice_number: "INV-2026-001",
	payment_amount: "1,500.00",
	exceptions: "None",
};

// Simple base64 1x1 transparent PNG for signature mock
const MOCK_SIGNATURE =
	"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";

const OUTPUT_DIR = path.join(process.cwd(), "debug_pdfs");

async function main() {
	console.log(`🚀 Starting PDF Generation Debug Script...`);
	console.log(`📂 Output Directory: ${OUTPUT_DIR}`);

	// Clean or create output directory
	if (fs.existsSync(OUTPUT_DIR)) {
		fs.rmSync(OUTPUT_DIR, { recursive: true, force: true });
	}
	fs.mkdirSync(OUTPUT_DIR);

	let count = 0;

	for (const [stateCode, stateData] of Object.entries(WAIVER_TEMPLATES)) {
		console.log(`\nProcessing State: ${stateCode} (${stateData.name})`);

		for (const [formType, _form] of Object.entries(stateData.forms)) {
			const fileName = `${stateCode}_${formType}.pdf`;
			const filePath = path.join(OUTPUT_DIR, fileName);

			try {
				// We map the mock data to the fields required by the template
				// In a real app, the wizard ensures only valid fields are passed,
				// but here we pass a superset and the PDF generator picks what it needs.
				const pdfBytes = await generateWaiverPDF(
					stateCode,
					// biome-ignore lint/suspicious/noExplicitAny: Iterating over object keys typed as string
					formType as any,
					MOCK_DATA,
					MOCK_SIGNATURE,
				);

				const draftPdfBytes = await generateWaiverPDF(
					stateCode,
					// biome-ignore lint/suspicious/noExplicitAny: Iterating over object keys typed as string
					formType as any,
					MOCK_DATA,
					MOCK_SIGNATURE,
					"DRAFT",
				);

				fs.writeFileSync(filePath, pdfBytes);
				fs.writeFileSync(
					path.join(OUTPUT_DIR, `${stateCode}_${formType}_DRAFT.pdf`),
					draftPdfBytes,
				);
				console.log(`  ✅ Generated: ${fileName} (+ DRAFT)`);
				count += 2;
			} catch (error) {
				console.error(`  ❌ Failed to generate ${fileName}:`, error);
			}
		}
	}

	console.log(`\n✨ Done! Generated ${count} PDFs in ${OUTPUT_DIR}`);
}

main().catch(console.error);
