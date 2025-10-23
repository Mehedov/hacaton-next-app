'use client'

import { analyzeRandomNumbers } from '@/service/generate.service'
import {
	IAnalysisRequest,
	IAnalysisResponse,
	ITestResult,
} from '@/types/generate.type'
import {
	AlertCircle,
	BarChart3,
	CheckCircle,
	Download,
	Info,
	Play,
	RefreshCw,
	TrendingUp,
	Upload,
	XCircle,
} from 'lucide-react'
import React, { useCallback, useState } from 'react'

interface AnalysisFormData {
	numbers: string
	kIntervals: string
	isFileUpload: boolean
}

interface AnalysisState {
	isLoading: boolean
	error: string | null
	results: IAnalysisResponse | null
}

const AnalysisPage: React.FC = () => {
	const [formData, setFormData] = useState<AnalysisFormData>({
		numbers: '',
		kIntervals: '',
		isFileUpload: false,
	})

	const [analysisState, setAnalysisState] = useState<AnalysisState>({
		isLoading: false,
		error: null,
		results: null,
	})

	const handleInputChange = useCallback(
		(field: keyof AnalysisFormData, value: string | boolean) => {
			setFormData(prev => ({ ...prev, [field]: value }))
			setAnalysisState(prev => ({ ...prev, error: null, results: null }))
		},
		[]
	)

	const parseNumbersInput = useCallback((input: string): number[] => {
		// Убираем все пробелы, переносы строк и разделяем по запятым
		const cleaned = input.replace(/\s+/g, '').replace(/[\r\n]+/g, ',')
		const numbers = cleaned.split(',').filter(n => n.trim() !== '')

		return numbers.map(n => {
			const parsed = parseFloat(n)
			if (isNaN(parsed)) {
				throw new Error(`Некорректное число: ${n}`)
			}
			return Math.floor(parsed) // Округляем до целого числа
		})
	}, [])

	const handleFileUpload = useCallback(
		(event: React.ChangeEvent<HTMLInputElement>) => {
			const file = event.target.files?.[0]
			if (!file) return

			const reader = new FileReader()
			reader.onload = e => {
				try {
					const text = e.target?.result as string
					const numbers = parseNumbersInput(text)
					setFormData(prev => ({ ...prev, numbers: numbers.join(', ') }))
				} catch (error) {
					setAnalysisState(prev => ({
						...prev,
						error:
							error instanceof Error
								? error.message
								: 'Ошибка при чтении файла',
					}))
				}
			}
			reader.readAsText(file)
		},
		[parseNumbersInput]
	)

	const validateForm = useCallback((): string | null => {
		if (!formData.numbers.trim()) {
			return 'Введите числа для анализа'
		}

		try {
			const numbers = parseNumbersInput(formData.numbers)

			if (numbers.length < 50) {
				return `Для анализа требуется минимум 50 чисел. Текущее количество: ${numbers.length}`
			}

			if (numbers.length > 100000) {
				return 'Максимальное количество чисел для анализа: 100 000'
			}

			// Проверяем, что все числа в разумном диапазоне
			const outOfRange = numbers.some(n => n < 0 || n > Number.MAX_SAFE_INTEGER)
			if (outOfRange) {
				return 'Все числа должны быть положительными и не превышать максимальное безопасное целое число'
			}
		} catch (error) {
			return error instanceof Error ? error.message : 'Ошибка в формате чисел'
		}

		if (formData.kIntervals) {
			const k = parseInt(formData.kIntervals)
			if (isNaN(k) || k < 2 || k > 1000) {
				return 'Количество интервалов должно быть числом от 2 до 1000'
			}
		}

		return null
	}, [formData.numbers, formData.kIntervals, parseNumbersInput])

	const handleSubmit = useCallback(async () => {
		const validationError = validateForm()
		if (validationError) {
			setAnalysisState(prev => ({ ...prev, error: validationError }))
			return
		}

		setAnalysisState(prev => ({ ...prev, isLoading: true, error: null }))

		try {
			const numbers = parseNumbersInput(formData.numbers)
			const requestData: IAnalysisRequest = {
				numbers,
				...(formData.kIntervals && {
					k_intervals: parseInt(formData.kIntervals),
				}),
			}

			const response = await analyzeRandomNumbers(requestData)
			setAnalysisState(prev => ({
				...prev,
				results: response.data as IAnalysisResponse,
			}))
		} catch (error) {
			console.error('Analysis error:', error)
			setAnalysisState(prev => ({
				...prev,
				error:
					error instanceof Error
						? error.message
						: 'Ошибка при выполнении анализа',
			}))
		} finally {
			setAnalysisState(prev => ({ ...prev, isLoading: false }))
		}
	}, [formData, validateForm, parseNumbersInput])

	const resetForm = useCallback(() => {
		setFormData({
			numbers: '',
			kIntervals: '',
			isFileUpload: false,
		})
		setAnalysisState({
			isLoading: false,
			error: null,
			results: null,
		})
	}, [])

	const exportResults = useCallback(() => {
		if (!analysisState.results) return

		const dataStr = JSON.stringify(analysisState.results, null, 2)
		const dataUri =
			'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr)

		const exportFileDefaultName = `analysis-results-${
			new Date().toISOString().split('T')[0]
		}.json`
		const linkElement = document.createElement('a')
		linkElement.setAttribute('href', dataUri)
		linkElement.setAttribute('download', exportFileDefaultName)
		linkElement.click()
	}, [analysisState.results])

	return (
		<div className='min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100'>
			{/* Заголовок */}
			<div className='bg-white/80 backdrop-blur-sm shadow-sm border-b'>
				<div className='max-w-7xl mx-auto px-4 py-8'>
					<div className='text-center'>
						<div className='flex items-center justify-center gap-3 mb-4'>
							<div className='p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full'>
								<BarChart3 className='w-8 h-8 text-white' />
							</div>
							<h1 className='text-4xl font-bold text-gray-900'>
								Статистический анализ случайных чисел
							</h1>
						</div>
						<p className='text-lg text-gray-600 max-w-3xl mx-auto'>
							Выполните комплексный анализ последовательности чисел с
							использованием статистических тестов Хи-квадрат и проверки серий
						</p>
					</div>
				</div>
			</div>

			<div className='max-w-7xl mx-auto px-4 py-8'>
				<div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
					{/* Форма ввода */}
					<div className='bg-white rounded-2xl shadow-xl p-8 border border-gray-100'>
						<h2 className='text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3'>
							<Upload className='w-6 h-6 text-blue-500' />
							Ввод данных для анализа
						</h2>

						{/* Переключатель ввода */}
						<div className='mb-6'>
							<div className='flex bg-gray-100 rounded-lg p-1'>
								<button
									onClick={() => handleInputChange('isFileUpload', false)}
									className={`flex-1 py-2 px-4 rounded-md font-medium transition-all duration-200 ${
										!formData.isFileUpload
											? 'bg-white text-blue-600 shadow-sm'
											: 'text-gray-600 hover:text-gray-900'
									}`}
								>
									Вручную
								</button>
								<button
									onClick={() => handleInputChange('isFileUpload', true)}
									className={`flex-1 py-2 px-4 rounded-md font-medium transition-all duration-200 ${
										formData.isFileUpload
											? 'bg-white text-blue-600 shadow-sm'
											: 'text-gray-600 hover:text-gray-900'
									}`}
								>
									Загрузить файл
								</button>
							</div>
						</div>

						{/* Загрузка файла */}
						{formData.isFileUpload && (
							<div className='mb-6'>
								<label className='block w-full h-32 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 transition-colors duration-200 cursor-pointer'>
									<div className='flex flex-col items-center justify-center h-full text-gray-500'>
										<Upload className='w-8 h-8 mb-2' />
										<span className='text-sm'>Выберите файл с числами</span>
										<span className='text-xs'>
											Формат: TXT, CSV (минимум 50 чисел)
										</span>
									</div>
									<input
										type='file'
										accept='.txt,.csv'
										onChange={handleFileUpload}
										className='hidden'
									/>
								</label>
							</div>
						)}

						{/* Ручной ввод чисел */}
						{!formData.isFileUpload && (
							<div className='mb-6'>
								<label className='block text-sm font-medium text-gray-700 mb-2'>
									Числа для анализа *
								</label>
								<textarea
									value={formData.numbers}
									onChange={e => handleInputChange('numbers', e.target.value)}
									placeholder='Введите числа через запятую, пробел или перенос строки&#10;Пример: 123, 456, 789, 012&#10;Минимум 50 чисел'
									rows={8}
									className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none font-mono text-sm'
								/>
								<div className='mt-2 text-sm text-gray-500'>
									Количество чисел: {parseNumbersInput(formData.numbers).length}
								</div>
							</div>
						)}

						{/* Количество интервалов */}
						<div className='mb-6'>
							<label className='block text-sm font-medium text-gray-700 mb-2'>
								Количество интервалов (K)
							</label>
							<input
								type='number'
								value={formData.kIntervals}
								onChange={e => handleInputChange('kIntervals', e.target.value)}
								placeholder='По умолчанию рассчитывается автоматически'
								min='2'
								max='1000'
								className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
							/>
							<div className='mt-1 text-xs text-gray-500'>
								Необязательный параметр. Если не указан, рассчитывается
								автоматически.
							</div>
						</div>

						{/* Кнопки действий */}
						<div className='flex gap-3'>
							<button
								onClick={handleSubmit}
								disabled={analysisState.isLoading}
								className='flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-3 px-6 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed'
							>
								{analysisState.isLoading ? (
									<>
										<RefreshCw className='w-5 h-5 animate-spin' />
										<span>Анализ...</span>
									</>
								) : (
									<>
										<Play className='w-5 h-5' />
										<span>Выполнить анализ</span>
									</>
								)}
							</button>

							<button
								onClick={resetForm}
								className='px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-semibold transition-all duration-200'
							>
								Очистить
							</button>
						</div>

						{/* Ошибки валидации */}
						{analysisState.error && (
							<div className='mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3'>
								<AlertCircle className='w-5 h-5 text-red-500 flex-shrink-0 mt-0.5' />
								<div className='text-sm text-red-700'>
									{analysisState.error}
								</div>
							</div>
						)}
					</div>

					{/* Результаты анализа */}
					<div className='bg-white rounded-2xl shadow-xl p-8 border border-gray-100'>
						<h2 className='text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3'>
							<TrendingUp className='w-6 h-6 text-green-500' />
							Результаты анализа
						</h2>

						{!analysisState.results ? (
							<div className='text-center py-12'>
								<BarChart3 className='w-16 h-16 text-gray-300 mx-auto mb-4' />
								<p className='text-gray-500 text-lg'>
									Введите данные и выполните анализ для получения результатов
								</p>
							</div>
						) : (
							<div className='space-y-6'>
								{/* Общая информация */}
								<div className='bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-100'>
									<h3 className='font-semibold text-gray-900 mb-3 flex items-center gap-2'>
										<Info className='w-5 h-5 text-blue-500' />
										Общая информация
									</h3>
									<div className='grid grid-cols-2 gap-4 text-sm'>
										<div>
											<span className='text-gray-600'>Всего чисел:</span>
											<span className='font-semibold ml-2'>
												{analysisState.results.total_numbers}
											</span>
										</div>
										<div>
											<span className='text-gray-600'>Интервалов:</span>
											<span className='font-semibold ml-2'>
												{analysisState.results.k_intervals_used}
											</span>
										</div>
									</div>
									<div className='mt-3 p-3 bg-white/50 rounded border'>
										<p className='text-sm text-gray-700'>
											<strong>Заключение:</strong>{' '}
											{analysisState.results.summary}
										</p>
									</div>
								</div>

								{/* Результаты тестов */}
								<div className='space-y-4'>
									<h3 className='font-semibold text-gray-900 text-lg'>
										Результаты тестов
									</h3>

									{analysisState.results.results.map(
										(test: ITestResult, index: number) => (
											<div
												key={index}
												className={`p-4 rounded-lg border-2 ${
													test.passed
														? 'bg-green-50 border-green-200'
														: 'bg-red-50 border-red-200'
												}`}
											>
												<div className='flex items-start gap-3'>
													{test.passed ? (
														<CheckCircle className='w-5 h-5 text-green-500 flex-shrink-0 mt-0.5' />
													) : (
														<XCircle className='w-5 h-5 text-red-500 flex-shrink-0 mt-0.5' />
													)}

													<div className='flex-1'>
														<h4 className='font-semibold text-gray-900 mb-1'>
															{test.test_name}
														</h4>
														<div className='grid grid-cols-2 gap-4 text-sm mb-2'>
															<div>
																<span className='text-gray-600'>P-value:</span>
																<span
																	className={`font-semibold ml-2 ${
																		test.passed
																			? 'text-green-600'
																			: 'text-red-600'
																	}`}
																>
																	{test.p_value.toFixed(6)}
																</span>
															</div>
															<div>
																<span className='text-gray-600'>
																	Результат:
																</span>
																<span
																	className={`font-semibold ml-2 ${
																		test.passed
																			? 'text-green-600'
																			: 'text-red-600'
																	}`}
																>
																	{test.passed ? 'Пройден' : 'Не пройден'}
																</span>
															</div>
														</div>
														<div className='text-xs text-gray-600 bg-white/50 p-2 rounded border'>
															{test.details}
														</div>
													</div>
												</div>
											</div>
										)
									)}
								</div>

								{/* Кнопка экспорта */}
								<div className='pt-4 border-t'>
									<button
										onClick={exportResults}
										className='w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-3 px-6 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2'
									>
										<Download className='w-5 h-5' />
										<span>Экспортировать результаты</span>
									</button>
								</div>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	)
}

export default AnalysisPage
