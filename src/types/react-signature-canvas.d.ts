declare module "react-signature-canvas" {
	import * as React from "react";

	export interface SignatureCanvasProps
		extends React.CanvasHTMLAttributes<HTMLCanvasElement> {
		velocityFilterWeight?: number;
		minWidth?: number;
		maxWidth?: number;
		minDistance?: number;
		dotSize?: number | (() => number);
		penColor?: string;
		backgroundColor?: string;
		onEnd?: () => void;
		onBegin?: () => void;
		canvasProps?: React.CanvasHTMLAttributes<HTMLCanvasElement>;
		clearOnResize?: boolean;
	}

	export default class SignatureCanvas extends React.Component<SignatureCanvasProps> {
		clear: () => void;
		isEmpty: () => boolean;
		fromDataURL: (base64String: string, options?: unknown) => void;
		toDataURL: (mimetype?: string, encoderOptions?: number) => string;
		fromData: (pointGroups: unknown[]) => void;
		toData: () => unknown[];
		off: () => void;
		on: () => void;
		getCanvas: () => HTMLCanvasElement;
		getTrimmedCanvas: () => HTMLCanvasElement;
	}
}
