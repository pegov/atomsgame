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

export type ClientMessage = ScanRequest | SuggestRequest


interface ScanResponse {
	type: "scan"
	input: number
	output: number
}

interface SuggestResponse {
	type: "suggest"
	success: boolean
}

interface ErrorResponse {
	type: "error"
	error: "TODO"
}

export type ServerMessage = ErrorResponse | ScanResponse | SuggestResponse
