import { IGetRequestUUIDHash, IServerResponse } from '@/types/generate.type'
import axios from 'axios'

export const getRequestUUIDHash = () => {
	return axios.get<IGetRequestUUIDHash>(
		`${process.env.NEXT_PUBLIC_SERVER_URL + '/getRequestUUIDHash'}`
	)
}

export const generateRandomNumbers = (data: {
	clientUUID: string
	interval: [number, number]
	count: number
	jwtRequestUUIDToken: string
}) => {
	return axios.post<IServerResponse>(
		`${
			process.env.NEXT_PUBLIC_SERVER_URL + '/fullChain/generateRandomNumbers'
		}`,
		data
	)
}
