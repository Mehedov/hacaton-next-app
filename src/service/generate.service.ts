import { IGetRequestUUIDHash, IServerResponse } from '@/types/generate.type'
import axios from 'axios'

export const getRequestUUIDHash = () => {
	return axios.get<IGetRequestUUIDHash>(
		`${process.env.NEXT_PUBLIC_SERVER_URL}/getRequestUUIDHash`,
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
	jwtRequestUUIDToken: string
}) => {
	return axios.post<IServerResponse>(
		`${process.env.NEXT_PUBLIC_SERVER_URL}/fullChain/generateRandomNumbers`,
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
