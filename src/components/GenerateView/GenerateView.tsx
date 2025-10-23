'use client'

import {
	analyzeRandomNumbers,
	generateRandomNumbers,
	getEntropyHash,
} from '@/service/generate.service'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { setCount, setMax, setMin } from '@/store/intervalSlice'
import {
	IAnalysisResponse,
	IGetRequestUUIDHash,
	IServerResponse,
} from '@/types/generate.type'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Button, Card, Input } from 'antd'
import Cookies from 'js-cookie'
import {
	BarChart3,
	CheckCircle,
	Dices,
	ExternalLink,
	Settings,
	Zap,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'

export function GenerateView() {
	const dispatch = useAppDispatch()
	const { min, max, count } = useAppSelector(state => state.interval)
	const router = useRouter()
	const queryClient = useQueryClient()
	const [isGenerating, setIsGenerating] = useState(false)
	const [rngData, setRngData] = useState<IServerResponse | null>(null)
	const [analysisData, setAnalysisData] = useState<IAnalysisResponse | null>(
		null
	)
	const [isAnalyzing, setIsAnalyzing] = useState(false)
	const [currentClientUUID, setCurrentClientUUID] = useState<string>('')
	const [minInput, setMinInput] = useState(min)
	const [maxInput, setMaxInput] = useState(max)
	const [countInput, setCountInput] = useState(count)
	const { data, isLoading } = useQuery<{ data: IGetRequestUUIDHash }>({
		queryKey: ['generate'],
		queryFn: () => getEntropyHash(),
		refetchOnWindowFocus: false,
		staleTime: Infinity,
	})

	useEffect(() => {
		if (data) {
			Cookies.set('entropyHash', data.data.entropyHash)
			Cookies.set('encryptedEntropy', data.data.encryptedEntropy)
		}
	}, [data, isLoading, currentClientUUID])

	useEffect(() => {
		setMinInput(min)
		setMaxInput(max)
		setCountInput(count)
	}, [min, max, count])

	// Генерируем clientUUID при загрузке страницы для первой генерации
	useEffect(() => {
		const clientUUID = uuidv4()
		Cookies.set('clientUUID', clientUUID)
		setCurrentClientUUID(clientUUID)
	}, [])

	const generateNumber = async () => {
		if (!data || !currentClientUUID) return
		setIsGenerating(true)
		try {
			// Используем существующий clientUUID для генерации
			const clientUUID = currentClientUUID

			// Получаем encryptedEntropy из кук
			const encryptedEntropy = Cookies.get('encryptedEntropy')
			if (!encryptedEntropy) {
				console.error('Encrypted entropy not found in cookies')
				return
			}

			const response = await generateRandomNumbers({
				clientUUID: clientUUID,
				interval: [min, max],
				count: count,
				encryptedEntropy: encryptedEntropy,
			})
			setRngData(response.data)

			// Не обновляем entropyHash при генерации

			// Автоматический запуск анализа сгенерированных чисел
			if (response.data.outputLayer.outputValues.length >= 50) {
				setIsAnalyzing(true)
				try {
					const analysisResponse = await analyzeRandomNumbers({
						numbers: response.data.outputLayer.outputValues,
						k_intervals: 10,
					})
					setAnalysisData(analysisResponse.data as IAnalysisResponse)
				} catch (error) {
					console.error('Error analyzing numbers:', error)
				} finally {
					setIsAnalyzing(false)
				}
			}
		} catch (error) {
			console.error('Error generating numbers:', error)
		} finally {
			setIsGenerating(false)
		}
	}

	return (
		<div className='min-h-screen from-blue-50 to-indigo-100 flex items-center justify-center p-8'>
			<div className='max-w-[900px] mx-auto'>
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
					<div className='bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm max-w-[1000px] text-left mr-auto border border-gray-700'>
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
							Entropy Hash:{' '}
							<span className='text-blue-300 break-all'>
								{data?.data.entropyHash || 'Loading...'}
							</span>
						</div>
						<div className='text-green-300'>
							Status:{' '}
							<span className='text-purple-300'>
								{data ? 'Ready for request' : 'Waiting...'}
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
										onChange={e => {
											const value = Number(e.target.value)
											setMinInput(value)
											dispatch(setMin(value))
										}}
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
										onChange={e => {
											const value = Number(e.target.value)
											setMaxInput(value)
											dispatch(setMax(value))
										}}
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
										onChange={e => {
											const value = Number(e.target.value)
											const clampedValue = Math.min(Math.max(value, 1), 1000000)
											setCountInput(clampedValue)
											dispatch(setCount(clampedValue))
										}}
										min={1}
										max={1000000}
										className='text-center text-lg h-12'
									/>
								</div>
							</div>
						</div>

						{/* Кнопка генерации */}
						<div className='text-center'>
							<Button
								onClick={generateNumber}
								disabled={
									isGenerating || !data || !Cookies.get('encryptedEntropy')
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
												[{rngData.inputLayer.interval[0]},{' '}
												{rngData.inputLayer.interval[1]}]
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
												{rngData.inputLayer.encryptedEntropy.substring(0, 32)}
												...
											</span>
										</div>
									</div>
								</div>

								{/* Сгенерированные числа в красивом стиле */}
								<div className='text-center mb-8'>
									<h4 className='text-xl font-semibold text-gray-300 mb-6 flex items-center justify-center gap-2'>
										<CheckCircle className='w-6 h-6 text-green-400' />
										<span className='text-gray-300'>
											Сгенерированные числа:
										</span>
									</h4>
									<div className='flex flex-wrap justify-center gap-2 mb-6'>
										{rngData.outputLayer.outputValues.length > 100
											? rngData.outputLayer.outputValues
													.slice(0, 5)
													.map((value, index) => (
														<span
															key={index}
															className='bg-transparent text-gray-500 px-3 py-2 rounded-lg text-lg font-mono border border-gray-500  transition-colors duration-200'
														>
															{value}
														</span>
													))
											: rngData.outputLayer.outputValues.map((value, index) => (
													<span
														key={index}
														className='bg-transparent text-gray-500 px-3 py-2 rounded-lg text-lg font-mono border border-gray-500  transition-colors duration-200'
													>
														{value}
													</span>
											  ))}
										{rngData.outputLayer.outputValues.length > 100 && (
											<span className='text-gray-400 text-lg mt-2'>
												{rngData.outputLayer.outputValues.length - 5} скрыто
											</span>
										)}
									</div>
									{rngData.outputLayer.outputValues.length > 100 && (
										<div className='flex justify-center mb-6'>
											<button
												onClick={() => {
													const numbers =
														rngData.outputLayer.outputValues.join('\n')
													const blob = new Blob([numbers], {
														type: 'text/plain',
													})
													const url = URL.createObjectURL(blob)
													const a = document.createElement('a')
													a.href = url
													a.download = 'generated_numbers.txt'
													document.body.appendChild(a)
													a.click()
													document.body.removeChild(a)
													URL.revokeObjectURL(url)
												}}
												className='px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition-colors duration-200'
											>
												📥 Скачать все числа (TXT)
											</button>
										</div>
									)}
									<div className='text-gray-400 text-sm'>
										Всего сгенерировано:{' '}
										<span className='text-green-400 font-semibold'>
											{rngData.outputLayer.outputValues.length}
										</span>{' '}
										чисел
									</div>
								</div>

								{/* Результаты анализа */}
								{isAnalyzing && (
									<div className='bg-gradient-to-r from-blue-900/50 to-purple-900/50 border border-blue-400/30 rounded-xl p-6 mb-6'>
										<div className='flex items-center justify-center gap-3 text-blue-300'>
											<div className='animate-spin rounded-full h-6 w-6 border-b-2 border-blue-300'></div>
											<span className='font-semibold'>
												Выполняется анализ случайности...
											</span>
										</div>
									</div>
								)}

								{analysisData && (
									<div className='bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 border border-blue-400/30 rounded-xl p-6 mb-6 shadow-2xl'>
										{/* Заголовок анализа */}
										<div className='text-center mb-6'>
											<h4 className='text-2xl font-bold mb-2'>
												<span className='bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent'>
													Результаты статистического анализа
												</span>
											</h4>
											<div className='w-24 h-1 bg-gradient-to-r from-cyan-400 to-blue-400 mx-auto rounded-full'></div>
										</div>

										{/* Общая информация */}
										<div className='bg-slate-800/50 rounded-lg p-4 mb-6 border border-slate-600/30'>
											<div className='grid grid-cols-2 gap-4 text-sm'>
												<div className='text-center'>
													<div className='text-gray-400'>Всего чисел</div>
													<div className='text-2xl font-bold text-cyan-400'>
														{analysisData.total_numbers}
													</div>
												</div>
												<div className='text-center'>
													<div className='text-gray-400'>Интервалов</div>
													<div className='text-2xl font-bold text-purple-400'>
														{analysisData.k_intervals_used}
													</div>
												</div>
											</div>
											<div className='mt-4 p-3 bg-slate-700/50 rounded border border-slate-600/50'>
												<p className='text-sm text-gray-300 text-center'>
													<strong>Заключение:</strong> {analysisData.summary}
												</p>
											</div>
										</div>

										{/* Результаты тестов */}
										<div className='space-y-4 mb-6'>
											<h5 className='font-semibold text-gray-300 text-lg text-center'>
												Детальные результаты тестов
											</h5>

											{analysisData.results.map((test, index) => (
												<div
													key={index}
													className={`p-4 rounded-lg border-2 transition-all duration-300 ${
														test.passed
															? 'bg-green-900/30 border-green-500/50 hover:bg-green-900/40'
															: 'bg-red-900/30 border-red-500/50 hover:bg-red-900/40'
													}`}
												>
													<div className='flex items-start gap-3'>
														{test.passed ? (
															<CheckCircle className='w-5 h-5 text-green-400 flex-shrink-0 mt-0.5' />
														) : (
															<div className='w-5 h-5 rounded-full bg-red-500/20 border-2 border-red-400 flex-shrink-0 mt-0.5 flex items-center justify-center'>
																<div className='w-2 h-2 bg-red-400 rounded-full'></div>
															</div>
														)}

														<div className='flex-1'>
															<h6 className='font-semibold text-gray-200 mb-1'>
																{test.test_name}
															</h6>
															<div className='grid grid-cols-2 gap-4 text-sm mb-2'>
																<div>
																	<span className='text-gray-400'>
																		P-value:
																	</span>
																	<span
																		className={`font-semibold ml-2 ${
																			test.passed
																				? 'text-green-400'
																				: 'text-red-400'
																		}`}
																	>
																		{Math.sqrt(Number(test.p_value.toFixed(6)))}
																	</span>
																</div>
																<div>
																	<span className='text-gray-400'>
																		Результат:
																	</span>
																	<span
																		className={`font-semibold ml-2 ${
																			test.passed
																				? 'text-green-400'
																				: 'text-red-400'
																		}`}
																	>
																		{test.passed ? 'Пройден ✓' : 'Не пройден ✗'}
																	</span>
																</div>
															</div>
															<div className='text-xs text-gray-400 bg-slate-800/30 p-2 rounded border border-slate-700/50'>
																{test.details}
															</div>
														</div>
													</div>
												</div>
											))}
										</div>
									</div>
								)}

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

				{/* Отдельный блок с кнопкой анализа пользовательских чисел */}
				<div className='mt-8 text-center'>
					<div className='bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-gray-100'>
						<h2 className='text-2xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-3'>
							<BarChart3 className='w-7 h-7 text-blue-500' />
							<span>Анализ пользовательских чисел</span>
						</h2>
						<p className='text-gray-600 mb-6'>
							Выполните статистический анализ ваших собственных
							последовательностей чисел
						</p>
						<button
							onClick={() => router.push('/analyze')}
							className='px-12 py-4 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-500 hover:to-blue-500 text-white rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 border border-green-400/30 flex items-center gap-3 mx-auto'
						>
							<BarChart3 className='w-6 h-6' />
							<span>Перейти к анализу</span>
						</button>
					</div>
				</div>
			</div>
		</div>
	)
}
