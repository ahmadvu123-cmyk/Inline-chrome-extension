import { scanComposes } from "../_shared/helpers/scan-compose";
import { findComposeWindow } from "./gmail/compose-detector";
import { analyzeCurrentCompose } from "../_shared/helpers/analyze-current-compose";
import { enableComposeAutoAnalysis } from "../_shared/helpers/setup-compose";

const extensionState = globalThis as typeof globalThis & {
	__gmailComposeAnalyzerStarted?: boolean;
};

if (!extensionState.__gmailComposeAnalyzerStarted) {
	extensionState.__gmailComposeAnalyzerStarted = true;

	chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
		if (message.action !== "ANALYZE_CURRENT_COMPOSE") {
			return;
		}

		const composes = findComposeWindow();
		const activeElement = document.activeElement;
		const compose =
			composes.find((candidate) => activeElement && candidate.contains(activeElement)) ??
			composes.at(-1);

		if (!compose) {
			sendResponse({
				success: false,
				error: "No open Gmail compose window was found."
			});
			return;
		}

		enableComposeAutoAnalysis(compose);
		analyzeCurrentCompose(compose)
			.then((data) => sendResponse({ success: true, data }))
			.catch((error: unknown) =>
				sendResponse({
					success: false,
					error: error instanceof Error ? error.message : "Compose analysis failed."
				})
			);

		return true;
	});

	console.log("Gmail compose content script started");
	void scanComposes();
}