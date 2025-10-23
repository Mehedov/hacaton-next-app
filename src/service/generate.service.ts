import { IGetRequestUUIDHash, IServerResponse } from '@/types/generate.type'
import axios from 'axios'

export const getEntropyHash = () => {
	return axios.get<IGetRequestUUIDHash>(
		`https://back.bgitu-compass.ru/getEntropyHash`,
		{
			headers: {
				'Content-Type': 'application/json',
			},
		}
	)
}

export const generateRandomNumbers = (data: {
	clientUUID: string
	interval: [number, number]
	count: number
	encryptedEntropy: string
}) => {
	return axios.post<IServerResponse>(
		`https://back.bgitu-compass.ru/fullChain/generateRandomNumbers`,
		data,
		{
			headers: {
				'Content-Type': 'application/json',
			},
		}
	)
}

export const analyzeRandomNumbers = (data: {
	numbers: number[]
	k_intervals?: number
}) => {
	return axios.post(
		'https://enthropy.bgitu-compass.ru/rqs/analyze',
		data,
		{
			headers: {
				'Content-Type': 'application/json',
			},
		}
	)
}

export const generateRandomBinary = () => {
	return axios.get(
		'https://back.bgitu-compass.ru/generateRandomBinary',
		{
			headers: {
				'Content-Type': 'application/json',
			},
		}
	)
}
