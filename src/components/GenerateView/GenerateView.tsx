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
		<div className='min-h-screen from-blue-50 to-indigo-100 flex items-center justify-center p-8'>
			<div className='max-w-4xl mx-auto'>
				{/* Заголовок */}
				<div className='text-center mb-12'>
					<h1 className='text-4xl font-bold text-gray-800 mb-4 flex items-center justify-center gap-3'>
						<Dices className='w-12 h-12 text-blue-600' />
						<span>Генератор случайных чисел</span>
					</h1>
					<p className='text-xl text-gray-600 mb-6'>
						Создайте случайные числа с аппаратной энтропией
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
							<div className='bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border border-gray-700 rounded-xl p-8 shadow-2xl'>
								{/* Заголовок */}
								<div className='text-center mb-8'>
									<h3 className='text-3xl font-bold mb-2'>
										<span className='bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent'>
											Результат генерации
										</span>
									</h3>
									<div className='w-24 h-1 bg-gradient-to-r from-green-400 to-emerald-400 mx-auto rounded-full'></div>
								</div>

								{/* Информационный блок в стиле терминала */}
								<div className='bg-gray-900 border border-gray-600 rounded-lg p-6 mb-8 font-mono text-sm'>
									<div className='text-gray-400 mb-4 text-xs uppercase tracking-wider'>
										Generation Parameters
									</div>
									<div className='space-y-3'>
										<div className='flex items-center gap-3'>
											<span className='text-yellow-400 w-16'>Range:</span>
											<span className='text-yellow-300 bg-gray-800 px-3 py-1 rounded border border-yellow-400/30'>
												[{rngData.inputLayer.interval[0]}, {rngData.inputLayer.interval[1]}]
											</span>
										</div>
										<div className='flex items-center gap-3'>
											<span className='text-purple-400 w-16'>Count:</span>
											<span className='text-purple-300 bg-gray-800 px-3 py-1 rounded border border-purple-400/30'>
												{rngData.inputLayer.count} numbers
											</span>
										</div>
										<div className='flex items-center gap-3'>
											<span className='text-cyan-400 w-16'>Seed:</span>
											<span className='text-cyan-300 bg-gray-800 px-3 py-1 rounded border border-cyan-400/30'>
												Combined entropy hash
											</span>
										</div>
									</div>
								</div>

								{/* Сгенерированные числа в красивом стиле */}
								<div className='text-center mb-8'>
									<h4 className='text-xl font-semibold text-gray-300 mb-6 flex items-center justify-center gap-2'>
										<CheckCircle className='w-6 h-6 text-green-400' />
										<span className='text-gray-300'>Сгенерированные числа:</span>
									</h4>
									<div className='flex flex-wrap justify-center gap-4 mb-6'>
										{rngData.outputLayer.outputValues.map((value, index) => (
											<div
												key={index}
												className='relative group'
											>
												{/* Glow эффект */}
												<div className='absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-400 rounded-xl blur-lg opacity-30 group-hover:opacity-50 transition-opacity duration-300'></div>

												{/* Основная кнопка */}
												<div className='relative w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white rounded-xl flex items-center justify-center text-2xl font-bold shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-110 border border-green-400/30'>
													{value}
												</div>

												{/* Декоративные элементы */}
												<div className='absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full opacity-60 group-hover:opacity-100 transition-opacity duration-300'></div>
												<div className='absolute -bottom-1 -left-1 w-2 h-2 bg-blue-400 rounded-full opacity-60 group-hover:opacity-100 transition-opacity duration-300'></div>
											</div>
										))}
									</div>
									<div className='text-gray-400 text-sm'>
										Всего сгенерировано: <span className='text-green-400 font-semibold'>{rngData.outputLayer.outputValues.length}</span> чисел
									</div>
								</div>

								{/* Кнопка визуализации */}
								<div className='text-center'>
									<button
										onClick={() => {
											localStorage.setItem(
												'visualizationData',
												JSON.stringify(rngData)
											)
											router.push('/visualization')
										}}
										className='group relative px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 border border-purple-400/30'
									>
										{/* Glow эффект для кнопки */}
										<div className='absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity duration-300'></div>

										<div className='relative flex items-center gap-3'>
											<ExternalLink className='w-6 h-6 group-hover:rotate-12 transition-transform duration-300' />
											<span>Посмотреть визуализацию процесса</span>
										</div>
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
