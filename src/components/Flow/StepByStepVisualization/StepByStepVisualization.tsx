'use client'

import { IServerResponse } from '@/types/generate.type'
import React, { useEffect, useState } from 'react'
import {
	Link,
	Zap,
	Dices,
	FlaskConical,
	ArrowRightLeft,
	Target,
	Play,
	Pause,
	RotateCcw,
	CheckCircle,
	Rocket
} from 'lucide-react'
import DataTransformationAnimation from '../DataTransformationAnimation/DataTransformationAnimation'

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
}

const StepByStepVisualization: React.FC<StepByStepVisualizationProps> = ({
	data,
	isPlaying,
	onTogglePlay,
}) => {
	const [currentStep, setCurrentStep] = useState(0)
	const [isAnimating, setIsAnimating] = useState(false)
	const [isCompleted, setIsCompleted] = useState(false)

	const steps: ProcessStep[] = React.useMemo(() => {
		if (!data) return []

		return [
			{
				id: 'entropy-collection',
				title: 'Сбор энтропии',
				description: 'Получение случайных данных от NIST API',
				icon: <Link className="w-6 h-6" />,
				color: '#ef4444',
				duration: 2000,
				data: data.outputLayer.entropyData,
			},
			{
				id: 'genesis-hash',
				title: 'Genesis Hash',
				description: 'Использование начального хэша блокчейна',
				icon: <Zap className="w-6 h-6" />,
				color: '#8b5cf6',
				duration: 1500,
				data: data.outputLayer.genesisHash,
			},
			{
				id: 'uuid-generation',
				title: 'Генерация UUID',
				description: 'Создание уникальных идентификаторов',
				icon: <Dices className="w-6 h-6" />,
				color: '#22c55e',
				duration: 1800,
				data: {
					server: data.outputLayer.requestUUID,
					client: data.inputLayer.clientUUID,
				},
			},
			{
				id: 'salt-addition',
				title: 'Добавление соли',
				description: 'Улучшение безопасности дополнительной солью',
				icon: <FlaskConical className="w-6 h-6" />,
				color: '#f59e0b',
				duration: 1200,
				data: data.outputLayer.extraSalt,
			},
			{
				id: 'hash-combination',
				title: 'Комбинирование хэшей',
				description: 'Объединение всех данных в единый хэш',
				icon: <ArrowRightLeft className="w-6 h-6" />,
				color: '#06b6d4',
				duration: 2500,
			},
			{
				id: 'final-output',
				title: 'Генерация результата',
				description: 'Получение финальных случайных чисел',
				icon: <Target className="w-6 h-6" />,
				color: '#10b981',
				duration: 2000,
				data: data.outputLayer.outputValues,
			},
		]
	}, [data])

	useEffect(() => {
		if (!isPlaying || steps.length === 0) return

		const step = steps[currentStep]
		if (!step) return

		setIsAnimating(true)

		const timer = setTimeout(() => {
			setIsAnimating(false)
			setTimeout(() => {
				setCurrentStep(prev => {
					const nextStep = prev + 1
					// Если достигли конца, отмечаем как завершенное
					if (nextStep >= steps.length) {
						setIsCompleted(true)
						return steps.length - 1 // Устанавливаем на последний шаг
					}
					return nextStep
				})
			}, 300)
		}, step.duration)

		return () => clearTimeout(timer)
	}, [currentStep, isPlaying, steps])

	const handleStepClick = (stepIndex: number) => {
		// Если анимация завершена, просто переключаемся на выбранный этап для просмотра
		if (isCompleted) {
			setCurrentStep(stepIndex)
			return
		}

		// Если анимация активна или не начиналась, сбрасываем и начинаем заново
		setIsCompleted(false)
		setCurrentStep(stepIndex)
		setIsAnimating(false)

		// Если анимация была запущена, перезапускаем её
		if (isPlaying) {
			setTimeout(() => {
				onTogglePlay()
			}, 100)
		}
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
		<div className='w-full max-w-6xl mx-auto p-6 bg-gradient-to-br from-slate-50 to-blue-50 rounded-xl shadow-lg'>
			{/* Header */}
			<div className='text-center mb-8'>
				<h3 className='text-2xl font-bold text-gray-800 mb-2 flex items-center gap-2'>
					<Rocket className="w-8 h-8" />
					<span>Пошаговая визуализация процесса</span>
					{isCompleted && (
						<span className='px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full font-medium'>
							✓ Готово к просмотру
						</span>
					)}
				</h3>
				<p className='text-gray-600'>
					Следите за каждым этапом генерации случайных чисел
				</p>
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
							<div className='bg-white rounded-lg p-4 border'>
								<h5 className='font-semibold text-gray-700 mb-2'>Данные:</h5>
								<div className='text-sm font-mono text-gray-600 break-all'>
									{steps[currentStep]?.id === 'final-output' ? (
										<div className='flex flex-wrap gap-2'>
											{(steps[currentStep]?.data as number[]).map(
												(val, idx) => (
													<span
														key={idx}
														className='bg-green-100 text-green-800 px-2 py-1 rounded-full animate-pulse'
													>
														{val}
													</span>
												)
											)}
										</div>
									) : (
										<span className='block'>
											{String(steps[currentStep]?.data).substring(0, 50)}...
										</span>
									)}
								</div>
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
										<Pause className="w-5 h-5" />
										<span>Пауза</span>
									</>
								) : (
									<>
										<Play className="w-5 h-5" />
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
								<RotateCcw className="w-5 h-5" />
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
							<RotateCcw className="w-5 h-5" />
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
											index < currentStep || (isCompleted && index === currentStep)
												? 'bg-green-500 text-white'
												: index === currentStep
												? 'bg-blue-500 text-white animate-pulse'
												: 'bg-gray-300 text-gray-600'
										}`}
									>
										{index < currentStep || (isCompleted && index === currentStep) ? (
											<CheckCircle className="w-4 h-4" />
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
										: index < currentStep || (isCompleted && index <= currentStep)
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
											index < currentStep || (isCompleted && index < currentStep)
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
		</div>
	)
}

export default StepByStepVisualization
