'use client'

import {
	generateRandomNumbers,
	getRequestUUIDHash,
} from '@/service/generate.service'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { setCount, setInterval } from '@/store/intervalSlice'
import { IGetRequestUUIDHash, IServerResponse } from '@/types/generate.type'
import { useQuery } from '@tanstack/react-query'
import { Button, Card, Input } from 'antd'
import Cookies from 'js-cookie'
import {
	CheckCircle,
	Dices,
	ExternalLink,
	Save,
	Settings,
	Sparkles,
	Zap,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'

export function GenerateView() {
	const dispatch = useAppDispatch()
	const { min, max, count } = useAppSelector(state => state.interval)
	const router = useRouter()
	const [isGenerating, setIsGenerating] = useState(false)
	const [rngData, setRngData] = useState<IServerResponse | null>(null)
	const [currentClientUUID, setCurrentClientUUID] = useState<string>('')
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

	// Генерируем clientUUID при загрузке страницы для первой генерации
	useEffect(() => {
		const clientUUID = uuidv4()
		setCurrentClientUUID(clientUUID)
	}, [])

	const handleSaveInterval = () => {
		dispatch(setInterval({ min: minInput, max: maxInput }))
		dispatch(setCount(countInput))
	}

	const generateNumber = async () => {
		if (!data || !currentClientUUID) return
		setIsGenerating(true)
		try {
			// Используем существующий clientUUID для первой генерации, затем генерируем новый
			const clientUUID = currentClientUUID
			// Генерируем новый UUID для следующих генераций
			const newClientUUID = uuidv4()
			setCurrentClientUUID(newClientUUID)

			// Получаем токен из кук
			const jwtToken = Cookies.get('jwtRequestUUIDToken')
			if (!jwtToken) {
				console.error('JWT token not found in cookies')
				return
			}

			const response = await generateRandomNumbers({
				clientUUID: clientUUID,
				interval: [min, max],
				count: count,
				jwtRequestUUIDToken: jwtToken,
			})
			setRngData(response.data)
		} catch (error) {
			console.error('Error generating numbers:', error)
		} finally {
			setIsGenerating(false)
		}
	}

	return (
		<div className='min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-8'>
			<div className='max-w-4xl mx-auto'>
				{/* Заголовок */}
				<div className='text-center mb-12'>
					<h1 className='text-4xl font-bold text-gray-800 mb-4 flex items-center justify-center gap-3'>
						<Dices className='w-12 h-12 text-blue-600' />
						<span>Генератор случайных чисел</span>
					</h1>
					<p className='text-xl text-gray-600 mb-6'>
						Создайте случайные числа с криптографической защитой
					</p>

					{/* Блок Client UUID в формате кода */}
					<div className='bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm max-w-2xl mx-auto border border-gray-700'>
						<div className='text-gray-400 mb-2'>
							{/* Current Client UUID */}
						</div>
						<div className='text-green-300'>
							Client UUID:{' '}
							<span className='text-yellow-300 break-all'>
								{currentClientUUID || 'Генерируется...'}
							</span>
						</div>

						<div className='text-green-300'>
							Status:{' '}
							<span className='text-purple-300'>
								{currentClientUUID ? 'Ready for request' : 'Waiting...'}
							</span>
						</div>
					</div>
				</div>

				{/* Карточка с формой */}
				<Card className='shadow-2xl border-0 bg-white/80 backdrop-blur-sm'>
					<div className='space-y-8'>
						{/* Параметры генерации */}
						<div>
							<h2 className='text-2xl font-semibold text-gray-800 mb-6 text-center flex items-center justify-center gap-2'>
								<Settings className='w-7 h-7' />
								<span>Параметры генерации</span>
							</h2>
							<div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
								<div className='text-center'>
									<label className='block text-sm font-medium text-gray-700 mb-2'>
										Минимум
									</label>
									<Input
										type='number'
										placeholder='10'
										value={minInput}
										onChange={e => setMinInput(Number(e.target.value))}
										min={10}
										max={100}
										className='text-center text-lg h-12'
									/>
								</div>
								<div className='text-center'>
									<label className='block text-sm font-medium text-gray-700 mb-2'>
										Максимум
									</label>
									<Input
										type='number'
										placeholder='100'
										value={maxInput}
										onChange={e => setMaxInput(Number(e.target.value))}
										min={10}
										max={100}
										className='text-center text-xl h-12'
									/>
								</div>
								<div className='text-center'>
									<label className='block text-sm font-medium text-gray-700 mb-2'>
										Количество
									</label>
									<Input
										type='number'
										placeholder='5'
										value={countInput}
										onChange={e => setCountInput(Number(e.target.value))}
										min={1}
										className='text-center text-lg h-12'
									/>
								</div>
							</div>
							<div className='flex justify-center mt-6'>
								<Button
									onClick={handleSaveInterval}
									className='px-8 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-semibold flex items-center gap-2'
								>
									<Save className='w-5 h-5' />
									<span>Сохранить параметры</span>
								</Button>
							</div>
						</div>

						{/* Кнопка генерации */}
						<div className='text-center'>
							<Button
								onClick={generateNumber}
								disabled={
									isGenerating || !data || !Cookies.get('jwtRequestUUIDToken')
								}
								size='large'
								className='px-12 py-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-200'
							>
								{isGenerating ? (
									<div className='flex items-center gap-1.5'>
										<Zap className='w-6 h-6 animate-pulse' />
										<span>Генерация...</span>
									</div>
								) : (
									<div className='flex items-center gap-1.5'>
										<Zap className='w-6 h-6' />
										<span>Сгенерировать числа</span>
									</div>
								)}
							</Button>
						</div>

						{/* Результат генерации */}
						{rngData && (
							<div className='bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-8'>
								<h3 className='text-2xl font-bold text-gray-800 mb-6 text-center flex items-center justify-center gap-2'>
									<Sparkles className='w-7 h-7 text-yellow-500' />
									<span>Результат генерации</span>
								</h3>

								{/* Параметры запроса */}
								<div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-6'>
									<div className='bg-white rounded-lg p-4 text-center shadow-sm'>
										<div className='text-sm text-gray-600 mb-1'>Диапазон</div>
										<div className='text-lg font-semibold text-gray-800'>
											[{rngData.inputLayer.interval[0]},{' '}
											{rngData.inputLayer.interval[1]}]
										</div>
									</div>
									<div className='bg-white rounded-lg p-4 text-center shadow-sm'>
										<div className='text-sm text-gray-600 mb-1'>Количество</div>
										<div className='text-lg font-semibold text-gray-800'>
											{rngData.inputLayer.count} чисел
										</div>
									</div>
									<div className='bg-white rounded-lg p-4 text-center shadow-sm'>
										<div className='text-sm text-gray-600 mb-1'>Время</div>
										<div className='text-lg font-semibold text-gray-800'>
											{new Date().toLocaleTimeString('ru-RU')}
										</div>
									</div>
								</div>

								{/* Сгенерированные числа */}
								<div className='bg-white rounded-lg p-6 shadow-sm'>
									<h4 className='text-lg font-semibold text-gray-800 mb-4 text-center flex items-center justify-center gap-2'>
										<CheckCircle className='w-6 h-6 text-green-600' />
										<span>Сгенерированные числа:</span>
									</h4>
									<div className='flex flex-wrap justify-center gap-3 mb-4'>
										{rngData.outputLayer.outputValues.map((value, index) => (
											<div
												key={index}
												className='w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-xl flex items-center justify-center text-xl font-bold shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110'
											>
												{value}
											</div>
										))}
									</div>
									<div className='text-center text-gray-600'>
										Всего сгенерировано:{' '}
										{rngData.outputLayer.outputValues.length} чисел
									</div>
								</div>

								{/* Кнопка перехода к визуализации */}
								<div className='text-center mt-6'>
									<button
										onClick={() => {
											localStorage.setItem(
												'visualizationData',
												JSON.stringify(rngData)
											)
											router.push('/visualization')
										}}
										className='inline-flex items-center px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 gap-2'
									>
										<ExternalLink className='w-6 h-6' />
										<span>Посмотреть визуализацию процесса</span>
									</button>
								</div>
							</div>
						)}
					</div>
				</Card>
			</div>
		</div>
	)
}
