export interface IGetRequestUUIDHash {
	requestUUIDHash: string
  jwtRequestUUIDToken:string
}

export interface IServerResponse {
	inputLayer: {
		clientUUID: string
		interval: [number, number]
		count: number
		jwtServerUUIDToken: string
	}
	outputLayer: {
		requestUUID: string
		extraSalt: string
		entropyData: {
			data: string
			url: string
		}
		genesisHash: string
		outputValues: number[]
	}
}

export interface IDataNode {
	id: string
	label: string
	value: string | number | number[] | [number, number]
	type: 'string' | 'number' | 'array' | 'interval'
	description: string
}

export interface IAnalysisRequest {
	numbers: number[]
	k_intervals?: number
}

export interface ITestResult {
	test_name: string
	p_value: number
	passed: boolean
	details: string
}

export interface IAnalysisResponse {
	total_numbers: number
	k_intervals_used: number
	results: ITestResult[]
	summary: string
}
