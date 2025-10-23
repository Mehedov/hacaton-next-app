'use client'

import { IServerResponse } from '@/types/generate.type'
import {
	ArrowRightLeft,
	CheckCircle,
	Download,
	Loader2,
	Settings,
	Upload,
} from 'lucide-react'
import React, { useEffect, useRef, useState } from 'react'

interface DataTransformationAnimationProps {
	data: IServerResponse | null
	currentStep: number
	isAnimating: boolean
	onAnimationComplete?: () => void
	currentStepTitle?: string
}

interface DataBlock {
	id: string
	content: string
	x: number
	y: number
	targetX: number
	targetY: number
	color: string
	size: number
}

const generateLogForPhase = (
	phase: 'input' | 'processing' | 'output',
	step: number,
	data: IServerResponse | null
): string => {
	if (!data) return ''

	const steps = [
		{ name: 'entropy', data: data.outputLayer.entropy.data, color: '#ef4444' },
		{ name: 'uuid', data: data.inputLayer.clientUUID, color: '#22c55e' },
		{ name: 'request', data: data.outputLayer.requestUUID, color: '#06b6d4' },
		{ name: 'genesis', data: data.outputLayer.genesisHash, color: '#8b5cf6' },
		{ name: 'output', data: data.outputLayer.outputValues, color: '#10b981' },
	]

	const currentStepData = steps[step]
	if (!currentStepData) return ''

	const timestamp = new Date().toLocaleTimeString('ru-RU')
	const dataStr = String(currentStepData.data).substring(0, 10)

	switch (phase) {
		case 'input':
			return `[${timestamp}] Сбор данных: Загрузка ${currentStepData.name} (${dataStr}...)`
		case 'processing':
			return `[${timestamp}] Обработка: Трансформация ${currentStepData.name} с применением алгоритма`
		case 'output':
			return `[${timestamp}] Генерация результата: Сложение ${currentStepData.name} с предыдущими данными`
		default:
			return ''
	}
}

const getLogsForPhase = (
	phase: 'input' | 'processing' | 'output',
	step: number,
	data: IServerResponse | null,
	currentStepTitle?: string
): string[] => {
	if (!data) return [`${new Date().toLocaleTimeString('ru-RU')} Ошибка: Нет данных`]

	const timestamp = new Date().toLocaleTimeString('ru-RU')
	const stepTitle = currentStepTitle || `Шаг ${step + 1}`

	// Уникальные логи для каждого currentStep по схеме алгоритма
	switch (step) {
		case 0: // Получение энтропии
			switch (phase) {
				case 'input':
					return [
						`[${timestamp}] ${stepTitle}: Инициализация GET запроса`,
						`[${timestamp}] ${stepTitle}: Отправка запроса на получение энтропии`,
						`[${timestamp}] ${stepTitle}: Получение entropyHash и encryptedEntropy`,
					]
				case 'processing':
					return [
						`[${timestamp}] ${stepTitle}: Валидация полученных данных`,
						`[${timestamp}] ${stepTitle}: Декодирование encryptedEntropy`,
						`[${timestamp}] ${stepTitle}: Данные энтропии готовы`,
					]
				case 'output':
					return [
						`[${timestamp}] ${stepTitle}: Entropy Hash: ${data.outputLayer.entropy.entropyId ? data.outputLayer.entropy.entropyId.substring(0, 20) + '...' : 'N/A'}`,
						`[${timestamp}] ${stepTitle}: Encrypted Entropy: ${data.inputLayer.encryptedEntropy ? data.inputLayer.encryptedEntropy.substring(0, 20) + '...' : 'N/A'}`,
						`[${timestamp}] ${stepTitle}: Entropy URL: ${data.outputLayer.entropy.url || 'N/A'}`,
					]
				default:
					return [`[${timestamp}] ${stepTitle}: Обработка завершена`]
			}
		case 1: // Подготовка запроса
			switch (phase) {
				case 'input':
					return [
						`[${timestamp}] ${stepTitle}: Сбор параметров запроса`,
						`[${timestamp}] ${stepTitle}: Client UUID: ${data.inputLayer.clientUUID ? data.inputLayer.clientUUID.substring(0, 15) + '...' : 'N/A'}`,
						`[${timestamp}] ${stepTitle}: Интервал: [${data.inputLayer.interval ? data.inputLayer.interval[0] : 'N/A'}, ${data.inputLayer.interval ? data.inputLayer.interval[1] : 'N/A'}]`,
					]
				case 'processing':
					return [
						`[${timestamp}] ${stepTitle}: Валидация параметров`,
						`[${timestamp}] ${stepTitle}: Подготовка POST запроса`,
						`[${timestamp}] ${stepTitle}: Параметры готовы для отправки`,
					]
				case 'output':
					return [
						`[${timestamp}] ${stepTitle}: Количество: ${data.inputLayer.count}`,
						`[${timestamp}] ${stepTitle}: Request UUID: ${data.outputLayer.requestUUID ? data.outputLayer.requestUUID.substring(0, 15) + '...' : 'N/A'}`,
						`[${timestamp}] ${stepTitle}: Запрос подготовлен`,
					]
				default:
					return [`[${timestamp}] ${stepTitle}: Обработка завершена`]
			}
		case 2: // Отправка запроса
			switch (phase) {
				case 'input':
					return [
						`[${timestamp}] ${stepTitle}: Инициализация POST запроса`,
						`[${timestamp}] ${stepTitle}: Endpoint: https://enthropy.bgitu-compass.ru/fullChain/GenerateRandomNumbers`,
						`[${timestamp}] ${stepTitle}: Отправка данных на сервер`,
					]
				case 'processing':
					return [
						`[${timestamp}] ${stepTitle}: Сервер получает запрос`,
						`[${timestamp}] ${stepTitle}: Аутентификация клиента`,
						`[${timestamp}] ${stepTitle}: Обработка запроса`,
					]
				case 'output':
					return [
						`[${timestamp}] ${stepTitle}: Запрос отправлен успешно`,
						`[${timestamp}] ${stepTitle}: Ожидание ответа сервера`,
						`[${timestamp}] ${stepTitle}: Соединение установлено`,
					]
				default:
					return [`[${timestamp}] ${stepTitle}: Обработка завершена`]
			}
		case 3: // Обработка на сервере
			switch (phase) {
				case 'input':
					return [
						`[${timestamp}] ${stepTitle}: Получение данных для хэширования`,
						`[${timestamp}] ${stepTitle}: Entropy Data: ${data.outputLayer.entropy.data ? data.outputLayer.entropy.data.substring(0, 20) + '...' : 'N/A'}`,
						`[${timestamp}] ${stepTitle}: Client UUID: ${data.inputLayer.clientUUID ? data.inputLayer.clientUUID.substring(0, 15) + '...' : 'N/A'}`,
					]
				case 'processing':
					return [
						`[${timestamp}] ${stepTitle}: Применение SHA-512 алгоритма`,
						`[${timestamp}] ${stepTitle}: Генерация Genesis Hash`,
						`[${timestamp}] ${stepTitle}: Вычисление случайных чисел`,
					]
				case 'output':
					return [
						`[${timestamp}] ${stepTitle}: Genesis Hash: ${data.outputLayer.genesisHash ? data.outputLayer.genesisHash.substring(0, 20) + '...' : 'N/A'}`,
						`[${timestamp}] ${stepTitle}: Диапазон: [${data.inputLayer.interval ? data.inputLayer.interval[0] : 'N/A'}, ${data.inputLayer.interval ? data.inputLayer.interval[1] : 'N/A'}]`,
						`[${timestamp}] ${stepTitle}: Количество: ${data.inputLayer.count || 'N/A'}`,
					]
				default:
					return [`[${timestamp}] ${stepTitle}: Обработка завершена`]
			}
		case 4: // Получение результатов
			switch (phase) {
				case 'input':
					return [
						`[${timestamp}] ${stepTitle}: Получение ответа от сервера`,
						`[${timestamp}] ${stepTitle}: Валидация genesisHash`,
						`[${timestamp}] ${stepTitle}: Проверка случайных чисел`,
					]
				case 'processing':
					return [
						`[${timestamp}] ${stepTitle}: Обработка финальных данных`,
						`[${timestamp}] ${stepTitle}: Подготовка ответа клиенту`,
						`[${timestamp}] ${stepTitle}: Верификация результатов`,
					]
				case 'output':
					const outputValues = data.outputLayer.outputValues || []
					const displayValues = outputValues.length > 10
						? outputValues.slice(0, 5).join(', ') + `... (+${outputValues.length - 5} еще)`
						: outputValues.join(', ') || 'N/A'

					return [
						`[${timestamp}] ${stepTitle}: Финальные случайные числа: ${displayValues}`,
						`[${timestamp}] ${stepTitle}: Entropy URL: ${data.outputLayer.entropy.url || 'N/A'}`,
						`[${timestamp}] ${stepTitle}: Процесс генерации завершен`,
					]
				default:
					return [`[${timestamp}] ${stepTitle}: Обработка завершена`]
			}
		default:
			return [`[${timestamp}] ${stepTitle}: Неизвестный этап`]
	}
}

const DataTransformationAnimation: React.FC<
	DataTransformationAnimationProps
> = ({
	data,
	currentStep,
	isAnimating,
	onAnimationComplete,
	currentStepTitle,
}) => {
	const [dataBlocks, setDataBlocks] = useState<DataBlock[]>([])
	const [animationPhase, setAnimationPhase] = useState<
		'input' | 'processing' | 'output'
	>('input')
	const [logs, setLogs] = useState<string[]>([])
	const logsRef = useRef<HTMLDivElement>(null)

	// Создание блоков данных на основе текущего этапа
	useEffect(() => {
		if (!data) return

		const steps = [
			{
				name: 'entropy',
				data: data.outputLayer.entropy.data,
				color: '#ef4444',
			},
			{ name: 'uuid', data: data.inputLayer.clientUUID, color: '#22c55e' },
			{ name: 'request', data: data.outputLayer.requestUUID, color: '#06b6d4' },
			{ name: 'genesis', data: data.outputLayer.genesisHash, color: '#8b5cf6' },
			{ name: 'output', data: data.outputLayer.outputValues, color: '#10b981' },
		]

		const currentStepData = steps[currentStep]
		if (!currentStepData) return

		// Создаем блоки данных для текущего этапа
		const blocks: DataBlock[] = []
		const dataLength = String(currentStepData.data || 'default').length
		const blockCount = Math.max(1, Math.min(dataLength, 8)) // Минимум 1 блок

		for (let i = 0; i < blockCount; i++) {
			blocks.push({
				id: `block-${currentStep}-${i}`,
				content: dataLength > 0 ? String(currentStepData.data)[i] || '?' : '?',
				x: Math.random() * 100,
				y: Math.random() * 100,
				targetX: 50 + (i - blockCount / 2) * 10,
				targetY: 50,
				color: currentStepData.color,
				size: 20 + Math.random() * 15,
			})
		}

		setDataBlocks(blocks)
		setAnimationPhase('input')
		// Не очищать логи, чтобы сохранить все этапы
	}, [data, currentStep])

	// Анимация трансформации
	useEffect(() => {
		if (!isAnimating) return

		const phases: ('input' | 'processing' | 'output')[] = [
			'input',
			'processing',
			'output',
		]
		let currentPhaseIndex = 0

		// Не очищать логи, чтобы сохранить все этапы

		const runPhase = (phase: 'input' | 'processing' | 'output') => {
			setAnimationPhase(phase)

			// Получаем логи для фазы
			const logsForPhase = getLogsForPhase(
				phase,
				currentStep,
				data,
				currentStepTitle
			)

			// Добавляем логи с задержкой
			logsForPhase.forEach((log, index) => {
				setTimeout(() => {
					setLogs(prev => [...prev, log])
				}, index * 200) // 0.2 секунды между логами
			})

			// После всех логов, перейти к следующей фазе
			const timeoutDuration = Math.max(500, logsForPhase.length * 200 + 300)
			setTimeout(() => {
				currentPhaseIndex++
				if (currentPhaseIndex < phases.length) {
					runPhase(phases[currentPhaseIndex])
				} else {
					// Остановить после 1 цикла
					setAnimationPhase('output')
					// Сигнализировать о завершении
					onAnimationComplete?.()
				}
			}, timeoutDuration) // Дополнительная задержка после логов
		}

		// Начать с первой фазы
		runPhase(phases[0])
	}, [isAnimating, currentStep, data])

	// Автоматический скролл к низу при добавлении логов
	useEffect(() => {
		if (logsRef.current) {
			logsRef.current.scrollTop = logsRef.current.scrollHeight
		}
	}, [logs])

	// Анимация блоков данных
	useEffect(() => {

		const animate = () => {
			setDataBlocks(prevBlocks =>
				prevBlocks.map(block => {
					let targetX = block.targetX
					let targetY = block.targetY

					switch (animationPhase) {
						case 'input':
							targetX = Math.random() * 100
							targetY = Math.random() * 100
							break
						case 'processing':
							targetX = 50
							targetY = 30
							break
						case 'output':
							targetX = 50 + (Math.random() - 0.5) * 20
							targetY = 55 + Math.random() * 15
							break
					}

					return {
						...block,
						x: block.x + (targetX - block.x) * 0.1,
						y: block.y + (targetY - block.y) * 0.1,
					}
				})
			)
		}

		const animationFrame = requestAnimationFrame(animate)
		return () => cancelAnimationFrame(animationFrame)
	}, [animationPhase])

	if (!data) {
		return null
	}

	const getPhaseDescription = () => {
		switch (animationPhase) {
			case 'input':
				return 'Сбор данных'
			case 'processing':
				return 'Обработка данных'
			case 'output':
				return 'Генерация результата'
		}
	}

	return (
		<div className='relative w-full h-96 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg border-2 border-indigo-200 overflow-hidden'>
			{/* Заголовок */}
			<div className='absolute top-4 left-4 z-10'>
				<h4 className='text-gray-800 text-lg font-bold mb-1 flex items-center gap-2'>
					<ArrowRightLeft className='w-6 h-6' />
					<span>Трансформация этапов процесса</span>
				</h4>
				<p className='text-gray-600 text-sm'>Фаза: {getPhaseDescription()}</p>
			</div>

			{/* Области этапов */}
			<div className='absolute inset-0'>
				{/* Входная зона */}
				<div className='absolute top-4 left-4 right-4 h-16 bg-blue-100 rounded-lg border-2 border-blue-300 border-dashed'>
					<div className='flex items-center justify-center h-full text-blue-600 font-semibold gap-2'>
						<Upload className='w-5 h-5' />
						<span>Входные данные</span>
					</div>
				</div>

				{/* Зона обработки */}
				<div className='absolute top-24 left-4 right-4 h-16 bg-purple-100 rounded-lg border-2 border-purple-300 border-dashed'>
					<div className='flex items-center justify-center h-full text-purple-600 font-semibold gap-2'>
						<Settings className='w-5 h-5' />
						<span>Обработка</span>
					</div>
				</div>

				{/* Выходная зона */}
				<div className='absolute bottom-29 left-4 right-4 h-16 bg-green-100 rounded-lg border-2 border-green-300 border-dashed'>
					<div className='flex items-center justify-center h-full text-green-600 font-semibold gap-2'>
						<Download className='w-5 h-5' />
						<span>Результат</span>
					</div>
				</div>
			</div>

			{/* Анимированные блоки данных */}
			<div className='absolute inset-0'>
				{dataBlocks.map(block => (
					<div
						key={block.id}
						className='absolute rounded-lg border-2 flex items-center justify-center font-mono font-bold text-white shadow-lg transition-all duration-300'
						style={{
							left: `${block.x}%`,
							top: `${block.y}%`,
							width: `${block.size}px`,
							height: `${block.size}px`,
							backgroundColor: block.color,
							borderColor: block.color,
							transform: 'translate(-50%, -50%)',
							boxShadow: `0 0 ${block.size / 2}px ${block.color}80`,
						}}
					>
						{block.content}
					</div>
				))}
			</div>

			{/* Соединительные линии */}
			{animationPhase === 'processing' && (
				<svg className='absolute inset-0 w-full h-full pointer-events-none'>
					<defs>
						<linearGradient
							id='processingGradient'
							x1='0%'
							y1='0%'
							x2='100%'
							y2='0%'
						>
							<stop offset='0%' stopColor='#8b5cf6' stopOpacity={0.3} />
							<stop offset='50%' stopColor='#8b5cf6' stopOpacity={0.8} />
							<stop offset='100%' stopColor='#8b5cf6' stopOpacity={0.3} />
						</linearGradient>
					</defs>

					{/* Линии обработки */}
					{dataBlocks.map(block => (
						<g key={`line-${block.id}`}>
							{/* Линия от блока к центру обработки */}
							<line
								x1={`${block.x}%`}
								y1={`${block.y}%`}
								x2='50%'
								y2='32%'
								stroke='#8b5cf6'
								strokeWidth='2'
								strokeDasharray='5,5'
								opacity='0.6'
								className='animate-pulse'
							>
								<animate
									attributeName='stroke-dashoffset'
									values='0;-10'
									dur='1s'
									repeatCount='indefinite'
								/>
							</line>

							{/* Пульсирующий круг в центре */}
							<circle
								cx='50%'
								cy='32%'
								r='8'
								fill='none'
								stroke='#8b5cf6'
								strokeWidth='2'
								opacity='0.8'
								className='animate-ping'
							/>
						</g>
					))}
				</svg>
			)}

			{/* Частицы трансформации */}
			{animationPhase === 'processing' && (
				<div className='absolute inset-0'>
					{[...Array(12)].map((_, i) => (
						<div
							key={i}
							className='absolute w-2 h-2 bg-purple-400 rounded-full opacity-60 animate-ping'
							style={{
								left: `${20 + i * 5}%`,
								top: `${35 + Math.sin(i) * 10}%`,
								animationDelay: `${i * 100}ms`,
								animationDuration: '1.5s',
							}}
						/>
					))}
				</div>
			)}

			{/* Индикатор прогресса трансформации */}
			<div className='absolute bottom-33 right-4'>
				<div className='bg-white bg-opacity-90 rounded-lg p-3 shadow-lg'>
					<div className='flex items-center gap-2 text-sm text-gray-700'>
						{isAnimating ? (
							<Loader2 className='w-4 h-4 text-blue-500 animate-spin' />
						) : (
							<CheckCircle className='w-4 h-4 text-green-500' />
						)}
						<span>
							{isAnimating ? `Этап ${currentStep + 1}/5` : 'Процесс завершен'}
						</span>
					</div>
				</div>
			</div>

			{/* Логи в стиле терминала */}
			<div
				ref={logsRef}
				className='absolute bottom-0 left-0 right-0 h-25 bg-gray-900 text-green-400 p-2 font-mono text-xs overflow-y-auto border-t border-gray-700'
			>
				<div className='mb-1 text-gray-500'>Terminal Logs:</div>
				{logs.map((log, index) => (
					<div key={index} className='mb-1'>
						{log}
					</div>
				))}
				{logs.length === 0 && (
					<div className='text-gray-500'>Ожидание начала процесса...</div>
				)}
			</div>
		</div>
	)
}

export default DataTransformationAnimation
