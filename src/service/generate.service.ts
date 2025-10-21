import { IGenerateRandomBinary } from '@/types/generate.type'
import axios from 'axios'

export const generateRandomBinary = () => {
	return axios.get<IGenerateRandomBinary>(
		`${process.env.NEXT_PUBLIC_SERVER_URL + '/generateRandomBinary'}`
	)
}
