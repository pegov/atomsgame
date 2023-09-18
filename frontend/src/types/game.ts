export interface ScanRequest {
	type: "scan"
	input: number
}

export interface Coord {
	x: number
	y: number
}

export interface SuggestRequest {
	type: "suggest"
	coords: Coord[]
}

export interface StartRequest {
	type: "start"
	settings: Settings
}


export type ClientMessage =
	ScanRequest
	| SuggestRequest
	| StartRequest


export interface ScanResponse {
	type: "scan"
	input: number
	output: number
}

export interface SuggestResponse {
	type: "suggest"
	success: boolean
}

export interface Settings {
	sizeX: number
	sizeY: number
	atomsCount: number
}

export type StartResponse = StartRequest

export interface ErrorResponse {
	type: "error"
	error: "TODO"
}

export type ServerMessage =
	ErrorResponse
	| ScanResponse
	| SuggestResponse
	| StartResponse
