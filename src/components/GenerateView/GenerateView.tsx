'use client'

import { getRequestUUIDHash, generateRandomNumbers } from '@/service/generate.service'
import { IGetRequestUUIDHash, IServerResponse } from '@/types/generate.type'
import { useQuery } from '@tanstack/react-query'
import { Button, Card, Input } from 'antd'
import Cookies from 'js-cookie'
import { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { setInterval, setCount } from '@/store/intervalSlice'
import Flow from '../Flow/Flow'

export function GenerateView() {
	const dispatch = useAppDispatch()
	const { min, max, count } = useAppSelector((state) => state.interval)
	const [isGenerating, setIsGenerating] = useState(false)
	const [rngData, setRngData] = useState<IServerResponse | null>(null)
	const [minInput, setMinInput] = useState(min)
	const [maxInput, setMaxInput] = useState(max)
	const [countInput, setCountInput] = useState(count)
	const { data, isLoading } = useQuery<{ data: IGetRequestUUIDHash }>({
		queryKey: ['generate'],
		queryFn: () => getRequestUUIDHash(),
	})

	useEffect(() => {
		if (data) {
			Cookies.set('requestUUIDHash', data.data.requestUUIDHash)
			Cookies.set('jwtRequestUUIDToken', data.data.jwtRequestUUIDToken)
		}
	}, [data, isLoading])

	useEffect(() => {
		setMinInput(min)
		setMaxInput(max)
		setCountInput(count)
	}, [min, max, count])

	const handleSaveInterval = () => {
		dispatch(setInterval({ min: minInput, max: maxInput }))
		dispatch(setCount(countInput))
	}

	const generateNumber = async () => {
		if (!data) return
		setIsGenerating(true)
		try {
			const response = await generateRandomNumbers({
				clientUUID: data.data.requestUUIDHash,
				interval: [min, max],
				count: count,
				jwtRequestUUIDToken: data.data.jwtRequestUUIDToken,
			})
			setRngData(response.data)
		} catch (error) {
			console.error('Error generating numbers:', error)
		} finally {
			setIsGenerating(false)
		}
	}
	return (
		<Card title='Генерация случайных чисел' className='w-[1150px]'>
			<div className='flex flex-col items-center space-y-4'>
				<div className='flex space-x-4'>
					<Input
						type='number'
						placeholder='Min (10-100)'
						value={minInput}
						onChange={(e) => setMinInput(Number(e.target.value))}
						min={10}
						max={100}
					/>
					<Input
						type='number'
						placeholder='Max (10-100)'
						value={maxInput}
						onChange={(e) => setMaxInput(Number(e.target.value))}
						min={10}
						max={100}
					/>
					<Input
						type='number'
						placeholder='Count'
						value={countInput}
						onChange={(e) => setCountInput(Number(e.target.value))}
						min={1}
					/>
				</div>
				<Button onClick={handleSaveInterval}>Сохранить</Button>
				<Button
					onClick={generateNumber}
					disabled={isGenerating || !data}
					className='hover:bg-primary'
				>
					{isGenerating ? 'Генерация...' : 'Генерировать'}
				</Button>
				<Card title='Визуализация процесса' className='w-full'>
					{/* <RNGGraph data={rngData} /> */}
					<Flow data={rngData} />
				</Card>
			</div>
		</Card>
	)
}
