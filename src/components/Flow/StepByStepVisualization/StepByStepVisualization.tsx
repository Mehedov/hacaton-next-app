'use client'

import { IServerResponse } from '@/types/generate.type'
import {
	ArrowRightLeft,
	CheckCircle,
	Dices,
	Info,
	Link,
	Pause,
	Play,
	Rocket,
	RotateCcw,
	Target,
	Zap,
} from 'lucide-react'
import React, { useEffect, useState } from 'react'
import DataTransformationAnimation from '../DataTransformationAnimation/DataTransformationAnimation'
import InteractiveTooltips from '../InteractiveTooltips/InteractiveTooltips'

interface StepByStepVisualizationProps {
	data: IServerResponse | null
	isPlaying: boolean
	onTogglePlay: () => void
}

interface ProcessStep {
	id: string
	title: string
	description: string
	icon: React.ReactNode
	color: string
	duration: number
	data?:
		| string
		| number
		| number[]
		| { server: string; client: string }
		| { data: string; url: string }
		| { entropyHash: string; cryptedEntropy: string; entropyURL: string }
		| {
				clientUUID: string
				interval: [number, number]
				count: number
				cryptedEntropy: string
		  }
		| { genesisHash: string; data: string; clientUUID: string }
		| { outputValues: number[]; entropyURL: string; genesisHash: string }
}

const StepByStepVisualization: React.FC<StepByStepVisualizationProps> = ({
	data,
	isPlaying,
	onTogglePlay,
}) => {
	const [currentStep, setCurrentStep] = useState(0)
	const [isAnimating, setIsAnimating] = useState(false)
	const [isCompleted, setIsCompleted] = useState(false)
	const [showInteractiveTooltips, setShowInteractiveTooltips] = useState(false)
	const tooltipsRef = React.useRef<HTMLDivElement>(null)

	const steps: ProcessStep[] = React.useMemo(() => {
		if (!data) return []

		return [
			{
				id: 'get-entropy',
				title: 'Получение энтропии',
				description: 'GET запрос для получения entropyHash и encryptedEntropy',
				icon: <Link className='w-6 h-6 text-white' />,
				color: '#ef4444',
				duration: 1000,
				data: {
					entropyHash: data.outputLayer.entropy.entropyId,
					cryptedEntropy: data.inputLayer.encryptedEntropy,
					entropyURL: data.outputLayer.entropy.url,
				},
			},
			{
				id: 'prepare-request',
				title: 'Подготовка запроса',
				description: 'Ввод clientUUID, interval, count и encryptedEntropy',
				icon: <Dices className='w-6 h-6 text-white' />,
				color: '#22c55e',
				duration: 900,
				data: {
					clientUUID: data.inputLayer.clientUUID,
					interval: data.inputLayer.interval,
					count: data.inputLayer.count,
					cryptedEntropy: data.inputLayer.encryptedEntropy,
				},
			},
			{
				id: 'send-request',
				title: 'Отправка запроса',
				description: 'POST запрос на генерацию случайных чисел',
				icon: <ArrowRightLeft className='w-6 h-6 text-white' />,
				color: '#06b6d4',
				duration: 750,
			},
			{
				id: 'server-processing',
				title: 'Обработка на сервере',
				description: 'Генерация genesisHash (SHA-512) и outputValues',
				icon: <Zap className='w-6 h-6 text-white' />,
				color: '#8b5cf6',
				duration: 1250,
				data: {
					genesisHash: data.outputLayer.genesisHash,
					data: data.outputLayer.entropy.data,
					clientUUID: data.inputLayer.clientUUID,
				},
			},
			{
				id: 'receive-results',
				title: 'Получение результатов',
				description: 'Финальные случайные числа и entropyURL',
				icon: <Target className='w-6 h-6 text-white' />,
				color: '#10b981',
				duration: 1000,
				data: {
					outputValues: data.outputLayer.outputValues,
					entropyURL: data.outputLayer.entropy.url,
					genesisHash: data.outputLayer.genesisHash,
				},
			},
		]
	}, [data])

	useEffect(() => {
		// Запускаем анимацию при смене currentStep только если isPlaying true и не completed
		if (!isPlaying || isCompleted) return
		if (steps.length === 0) return

		const step = steps[currentStep]
		if (!step) return

		setIsAnimating(true)

		// Анимация завершится через onAnimationComplete в DataTransformationAnimation

	}, [currentStep, steps, isPlaying, isCompleted])

	useEffect(() => {
		// Запускаем анимацию при переключении isPlaying на true, если не completed
		if (isPlaying && !isAnimating && !isCompleted && steps.length > 0) {
			setIsAnimating(true)
		}
	}, [isPlaying, isAnimating, isCompleted, steps])

	// Эффект для автопрокрутки к блоку подсказок (убран автоматический скролл при загрузке)

	const handleStepClick = (stepIndex: number) => {
		// Всегда просто переключаемся на выбранный этап для просмотра
		// Воспроизведение должно запускаться только кнопками "Воспроизвести" или "Повторить"

		// Гарантированно останавливаем любую активную анимацию
		setIsAnimating(false)

		// Переключаемся на выбранный этап
		setCurrentStep(stepIndex)

		// Сбрасываем состояние завершения, если оно было установлено
		setIsCompleted(false)
	}

	const getProgressPercentage = () => {
		if (isCompleted) return 100
		const baseProgress = (currentStep / steps.length) * 100
		const animationBonus = isAnimating ? (1 / steps.length) * 100 : 0
		return Math.min(baseProgress + animationBonus, 100)
	}

	if (!data) {
		return (
			<div className='flex items-center justify-center p-10 text-gray-500'>
				<p>Нет данных для визуализации</p>
			</div>
		)
	}

	return (
		<div className='w-full max-w-6xl mx-auto p-6 to-blue-50 rounded-xl'>
			{/* Header */}
			<div className='text-center mb-8'>
				<div className='flex items-center justify-between'>
					<h3 className='text-2xl font-bold text-gray-800 mb-2 flex items-center gap-2 mb-2'>
						<Rocket className='w-8 h-8' />
						<span>Пошаговая визуализация процесса</span>
					</h3>
					{isCompleted && (
						<span className='px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full font-medium'>
							✓ Готово к просмотру
						</span>
					)}
				</div>
			</div>

			{/* Progress Bar */}
			<div className='mb-8'>
				<div className='flex justify-between text-sm text-gray-600 mb-2'>
					<span>
						Шаг {currentStep + 1} из {steps.length}
					</span>
					<span>{Math.round(getProgressPercentage())}%</span>
				</div>
				<div className='w-full bg-gray-200 rounded-full h-3 overflow-hidden'>
					<div
						className='h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-300 ease-out relative'
						style={{ width: `${getProgressPercentage()}%` }}
					>
						<div className='absolute inset-0 bg-white opacity-30 animate-pulse'></div>
					</div>
				</div>
			</div>

			{/* Main Content */}
			<div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
				{/* Current Step Visualization */}
				<div className='space-y-6'>
					{/* Current Step Card */}
					<div className='relative'>
						<div
							className={`p-6 rounded-xl shadow-lg border-2 transition-all duration-500 transform ${
								isAnimating
									? 'scale-105 shadow-2xl border-blue-400'
									: 'scale-100 border-gray-200'
							}`}
							style={{
								backgroundColor: steps[currentStep]?.color + '15',
								borderColor: steps[currentStep]?.color,
							}}
						>
							{/* Animated Icon */}
							<div className='flex items-center mb-4'>
								<div
									className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl mr-4 transition-all duration-500 ${
										isAnimating ? 'animate-bounce scale-110' : ''
									}`}
									style={{ backgroundColor: steps[currentStep]?.color }}
								>
									{steps[currentStep]?.icon}
								</div>
								<div>
									<h4 className='text-xl font-bold text-gray-800'>
										{steps[currentStep]?.title}
									</h4>
									<p className='text-gray-600'>
										{steps[currentStep]?.description}
									</p>
								</div>
							</div>

							{/* Data Visualization */}
							<div className='space-y-4'>
								<h5 className='font-semibold text-gray-700 mb-3 flex items-center gap-2'>
									<div className='w-2 h-2 bg-blue-500 rounded-full'></div>
									Технические данные процесса:
								</h5>

								{(() => {
									const step = steps[currentStep]
									if (!step) return null

									switch (step.id) {
										case 'get-entropy':
											const entropyData = step.data as {
												entropyHash: string
												cryptedEntropy: string
												entropyURL: string
											}
											return (
												<div className='space-y-3'>
													<div className='bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm overflow-x-auto border border-gray-700'>
														<div className='text-gray-400 mb-2'>
															{/* GET /getEntropyHash Response */}
														</div>
														<div className='text-green-300'>
															Entropy Hash:{' '}
															<span className='text-yellow-300 break-all'>
																{entropyData.entropyHash}
															</span>
														</div>
														<div className='text-green-300'>
															Encrypted Entropy:{' '}
															<span className='text-blue-300 break-all'>
																{entropyData.cryptedEntropy.substring(0, 32)}...
															</span>
														</div>
														<div className='text-green-300'>
															Entropy URL:{' '}
															<span className='text-purple-300'>
																{entropyData.entropyURL}
															</span>
														</div>
													</div>
													<div className='bg-blue-50 p-3 rounded-lg border-l-4 border-blue-400'>
														<p className='text-sm text-blue-800'>
															<strong>Процесс:</strong> Получение хэша энтропии
															и зашифрованной энтропии от сервера для
															последующей генерации.
														</p>
													</div>
												</div>
											)

										case 'prepare-request':
											const requestData = step.data as {
												clientUUID: string
												interval: [number, number]
												count: number
												cryptedEntropy: string
											}
											return (
												<div className='space-y-3'>
													<div className='bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm overflow-x-auto border border-gray-700'>
														<div className='text-gray-400 mb-2'>
															{/* POST Request Parameters */}
														</div>
														<div className='text-green-300'>
															Client UUID:{' '}
															<span className='text-blue-300 break-all'>
																{requestData.clientUUID}
															</span>
														</div>
														<div className='text-green-300'>
															Interval:{' '}
															<span className='text-yellow-300'>
																[{requestData.interval[0]},{' '}
																{requestData.interval[1]}]
															</span>
														</div>
														<div className='text-green-300'>
															Count:{' '}
															<span className='text-purple-300'>
																{requestData.count}
															</span>
														</div>
														<div className='text-green-300'>
															Encrypted Entropy:{' '}
															<span className='text-red-300 break-all'>
																{requestData.cryptedEntropy.substring(0, 32)}...
															</span>
														</div>
													</div>
													<div className='bg-green-50 p-3 rounded-lg border-l-4 border-green-400'>
														<p className='text-sm text-green-800'>
															<strong>Процесс:</strong> Подготовка параметров
															для POST запроса на генерацию случайных чисел.
														</p>
													</div>
												</div>
											)

										case 'send-request':
											return (
												<div className='space-y-3'>
													<div className='bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm overflow-x-auto border border-gray-700'>
														<div className='text-gray-400 mb-2'>
															{/* POST /fullChain/GenerateRandomNumbers */}
														</div>
														<div className='text-green-300'>
															Endpoint:{' '}
															<span className='text-yellow-300'>
																https://enthropy.bgitu-compass.ru/fullChain/GenerateRandomNumbers
															</span>
														</div>
														<div className='text-green-300'>
															Method:{' '}
															<span className='text-purple-300'>POST</span>
														</div>
													</div>
													<div className='bg-cyan-50 p-3 rounded-lg border-l-4 border-cyan-400'>
														<p className='text-sm text-cyan-800'>
															<strong>Процесс:</strong> Отправка POST запроса с
															параметрами для генерации случайных чисел.
														</p>
													</div>
												</div>
											)

										case 'server-processing':
											const serverData = step.data as {
												genesisHash: string
												data: string
												clientUUID: string
											}
											return (
												<div className='space-y-3'>
													<div className='bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm overflow-x-auto border border-gray-700'>
														<div className='text-gray-400 mb-2'>
															{/* Server Processing */}
														</div>
														<div className='text-green-300'>
															Genesis Hash (SHA-512):{' '}
															<span className='text-yellow-300 break-all'>
																{serverData.genesisHash.substring(0, 32)}...
															</span>
														</div>
														<div className='text-green-300'>
															Data:{' '}
															<span className='text-blue-300 break-all'>
																{serverData.data.substring(0, 32)}...
															</span>
														</div>
														<div className='text-green-300'>
															Client UUID:{' '}
															<span className='text-purple-300 break-all'>
																{serverData.clientUUID}
															</span>
														</div>
													</div>
													<div className='bg-purple-50 p-3 rounded-lg border-l-4 border-purple-400'>
														<p className='text-sm text-purple-800'>
															<strong>Процесс:</strong> Сервер генерирует
															Genesis Hash путем хэширования data + clientUUID с
															SHA-512 и вычисляет outputValues.
														</p>
													</div>
												</div>
											)

										case 'receive-results':
											const resultsData = step.data as {
												outputValues: number[]
												entropyURL: string
												genesisHash: string
											}
											return (
												<div className='space-y-3'>
													<div className='bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm overflow-x-auto border border-gray-700'>
														<div className='text-gray-400 mb-2'>
															{/* Final Results */}
														</div>
														<div className='text-green-300'>
															Range:{' '}
															<span className='text-yellow-300'>
																[{data?.inputLayer.interval[0]},{' '}
																{data?.inputLayer.interval[1]}]
															</span>
														</div>
														<div className='text-green-300'>
															Count:{' '}
															<span className='text-purple-300'>
																{data?.inputLayer.count} numbers
															</span>
														</div>
														<div className='text-green-300'>
															Entropy URL:{' '}
															<span className='text-blue-300'>
																{resultsData.entropyURL}
															</span>
														</div>
														<div className='text-green-300'>
															Genesis Hash:{' '}
															<span className='text-red-300 break-all'>
																{resultsData.genesisHash.substring(0, 32)}...
															</span>
														</div>
														<div className='flex flex-wrap gap-1 mt-2'>
															{resultsData.outputValues.length > 50
																? resultsData.outputValues
																		.slice(0, 5)
																		.map((val, idx) => (
																			<span
																				key={idx}
																				className='bg-green-600 text-white px-2 py-1 rounded text-xs animate-pulse'
																			>
																				{val}
																			</span>
																		))
																: resultsData.outputValues
																		.slice(0, 8)
																		.map((val, idx) => (
																			<span
																				key={idx}
																				className='bg-green-600 text-white px-2 py-1 rounded text-xs animate-pulse'
																			>
																				{val}
																			</span>
																		))}
															{resultsData.outputValues.length > 50 && (
																<span className='text-yellow-400 text-xs'>
																	+{resultsData.outputValues.length - 5} more
																</span>
															)}
															{resultsData.outputValues.length > 8 &&
																resultsData.outputValues.length <= 50 && (
																	<span className='text-gray-400 text-xs'>
																		+{resultsData.outputValues.length - 8} more
																	</span>
																)}
														</div>
													</div>
													<div className='bg-green-50 p-3 rounded-lg border-l-4 border-green-400'>
														<p className='text-sm text-green-800'>
															<strong>Процесс:</strong> Получение финальных
															случайных чисел, entropyURL и genesisHash от
															сервера.
														</p>
													</div>
												</div>
											)

										default:
											return (
												<div className='bg-gray-100 p-4 rounded-lg border'>
													<p className='text-sm text-gray-600'>
														Данные для этого этапа недоступны
													</p>
												</div>
											)
									}
								})()}
							</div>

							{/* Animated Particles */}
							{isAnimating && (
								<div className='absolute inset-0 pointer-events-none'>
									{[...Array(6)].map((_, i) => (
										<div
											key={i}
											className='absolute w-2 h-2 bg-white rounded-full opacity-60 animate-ping'
											style={{
												left: `${20 + i * 15}%`,
												top: `${30 + (i % 2) * 40}%`,
												animationDelay: `${i * 200}ms`,
												animationDuration: '1s',
											}}
										></div>
									))}
								</div>
							)}
						</div>
					</div>

					{/* Controls */}
					<div className='flex justify-center gap-4'>
						{!isCompleted ? (
							<button
								onClick={onTogglePlay}
								className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center gap-2 ${
									isPlaying
										? 'bg-red-500 hover:bg-red-600 text-white'
										: 'bg-green-500 hover:bg-green-600 text-white'
								}`}
							>
								{isPlaying ? (
									<>
										<Pause className='w-5 h-5' />
										<span>Пауза</span>
									</>
								) : (
									<>
										<Play className='w-5 h-5' />
										<span>Воспроизвести</span>
									</>
								)}
							</button>
						) : (
							<button
								onClick={() => {
									setIsCompleted(false)
									setCurrentStep(0)
									onTogglePlay()
								}}
								className='px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold transition-all duration-200 flex items-center gap-2'
							>
								<RotateCcw className='w-5 h-5' />
								<span>Повторить</span>
							</button>
						)}
						<button
							onClick={() => {
								setIsCompleted(false)
								setCurrentStep(0)
								setIsAnimating(false)
							}}
							className='flex items-center gap-1.5 px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-semibold transition-all duration-200'
						>
							<RotateCcw className='w-5 h-5' />
							<span>Сброс</span>
						</button>
					</div>
				</div>

				{/* Steps Timeline */}
				<div className='space-y-4'>
					<h4 className='text-lg font-semibold text-gray-800 mb-4'>
						Этапы процесса:
					</h4>
					<div className='space-y-3  overflow-y-auto'>
						{steps.map((step, index) => (
							<div
								key={step.id}
								onClick={() => handleStepClick(index)}
								className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-300 transform ${
									index < currentStep || (isCompleted && index === currentStep)
										? 'border-green-300 bg-green-50'
										: index === currentStep
										? 'border-blue-500 bg-blue-50 shadow-lg'
										: 'border-gray-200 bg-white hover:border-gray-300'
								}`}
							>
								<div className='flex items-center gap-3'>
									<div
										className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
											index < currentStep ||
											(isCompleted && index === currentStep)
												? 'bg-green-500 text-white'
												: index === currentStep
												? 'bg-blue-500 text-white animate-pulse'
												: 'bg-gray-300 text-gray-600'
										}`}
									>
										{index < currentStep ||
										(isCompleted && index === currentStep) ? (
											<CheckCircle className='w-4 h-4' />
										) : (
											index + 1
										)}
									</div>
									<div className='flex-1'>
										<h5 className='font-semibold text-gray-800'>
											{step.title}
										</h5>
										<p className='text-sm text-gray-600'>{step.description}</p>
									</div>
									{index === currentStep && isAnimating && (
										<div className='w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin'></div>
									)}
								</div>
							</div>
						))}
					</div>
				</div>
			</div>

			{/* Data Transformation Animation */}
			<div className='mt-8 mb-8'>
				<DataTransformationAnimation
					data={data}
					currentStep={currentStep}
					isAnimating={isAnimating}
					onAnimationComplete={() => {
						setIsAnimating(false)
						setTimeout(() => {
							setCurrentStep(prev => {
								const nextStep = prev + 1
								if (nextStep >= steps.length) {
									setIsCompleted(true)
									return prev // Не менять currentStep, чтобы избежать повторного запуска
								}
								return nextStep
							})
						}, 25)
					}}
					currentStepTitle={steps[currentStep]?.title}
				/>
			</div>

			{/* Process Status Bar */}
			<div className='mt-8'>
				<h4 className='text-lg font-semibold text-gray-800 mb-4 text-center'>
					Ход выполнения процесса:
				</h4>
				<div className='flex justify-center items-center gap-2'>
					{steps.map((step, index) => (
						<React.Fragment key={step.id}>
							{/* Иконка этапа */}
							<div
								className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 ${
									index === currentStep
										? 'bg-blue-500 text-white scale-110 shadow-lg animate-pulse'
										: index < currentStep ||
										  (isCompleted && index <= currentStep)
										? 'bg-green-500 text-white'
										: 'bg-gray-300 text-gray-600'
								}`}
							>
								{step.icon}
							</div>

							{/* Линия соединения */}
							{index < steps.length - 1 && (
								<div className='relative'>
									{/* Фоновая линия */}
									<div className='w-16 h-1 bg-gray-300 rounded-full'></div>
									{/* Активная линия */}
									<div
										className={`absolute top-0 left-0 h-1 rounded-full transition-all duration-500 ${
											index < currentStep ||
											(isCompleted && index <= currentStep)
												? 'w-16 bg-green-400'
												: 'w-0 bg-blue-400'
										}`}
									></div>
								</div>
							)}
						</React.Fragment>
					))}
				</div>

				{/* Статус текста */}
				<div className='text-center mt-4'>
					{isCompleted ? (
						<p className='text-green-600 font-semibold'>
							✓ Процесс завершен! Теперь можно просматривать этапы.
						</p>
					) : isAnimating ? (
						<p className='text-blue-600 font-semibold'>
							🔄 Выполняется этап: {steps[currentStep]?.title}
						</p>
					) : (
						<p className='text-gray-600'>
							Нажмите &quot;Воспроизвести&quot; для запуска процесса
						</p>
					)}
				</div>
			</div>

			{/* Кнопка для показа детального объяснения */}
			<div className='mt-8 text-center' ref={tooltipsRef}>
				{!showInteractiveTooltips ? (
					<button
						onClick={() => {
							setShowInteractiveTooltips(true)
							// Скролл к блоку подсказок через небольшую задержку
							setTimeout(() => {
								tooltipsRef.current?.scrollIntoView({
									behavior: 'smooth',
									block: 'start',
								})
							}, 100)
						}}
						className='w-full px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white rounded-lg font-semibold transition-all duration-200 flex items-center gap-2 mx-auto shadow-lg hover:shadow-xl transform hover:scale-105'
					>
						<Info className='w-5 h-5' />
						<span>Показать детальное объяснение</span>
					</button>
				) : (
					<div className='space-y-4'>
						<div className='flex justify-center mb-4'>
							<button
								onClick={() => setShowInteractiveTooltips(false)}
								className='px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold transition-all duration-200 flex items-center gap-2'
							>
								<span>❌ Скрыть объяснение</span>
							</button>
						</div>
						<InteractiveTooltips
							data={data}
							currentStep={currentStep}
							isVisible={showInteractiveTooltips}
							onStepChange={step => setCurrentStep(step)}
						/>
					</div>
				)}
			</div>
		</div>
	)
}

export default StepByStepVisualization
