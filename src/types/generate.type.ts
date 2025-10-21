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
		serverUUID: string
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
