export interface IGenerateRandomBinary {
	inputLayer: {
		entropySeed: string
		executionUnixTime: number
	}
	outputLayer: {
		genesisHash: string
		fileUrl: string
	}
}
