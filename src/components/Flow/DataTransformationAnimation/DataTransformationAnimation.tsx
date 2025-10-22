'use client'

import React, { useState, useEffect } from 'react'
import { IServerResponse } from '@/types/generate.type'

interface DataTransformationAnimationProps {
	data: IServerResponse | null
	currentStep: number
	isAnimating: boolean
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

const DataTransformationAnimation: React.FC<DataTransformationAnimationProps> = ({
	data,
	currentStep,
	isAnimating,
}) => {
	const [dataBlocks, setDataBlocks] = useState<DataBlock[]>([])
	const [animationPhase, setAnimationPhase] = useState<'input' | 'processing' | 'output'>('input')

	// Создание блоков данных на основе текущего этапа
	useEffect(() => {
		if (!data || !isAnimating) return

		const steps = [
			{ name: 'entropy', data: data.outputLayer.entropyData.data, color: '#ef4444' },
			{ name: 'genesis', data: data.outputLayer.genesisHash, color: '#8b5cf6' },
			{ name: 'uuid', data: data.outputLayer.requestUUID, color: '#22c55e' },
			{ name: 'salt', data: data.outputLayer.extraSalt, color: '#f59e0b' },
			{ name: 'combined', data: 'combined_hash', color: '#06b6d4' },
			{ name: 'output', data: data.outputLayer.outputValues, color: '#10b981' },
		]

		const currentStepData = steps[currentStep]
		if (!currentStepData) return

		// Создаем блоки данных для текущего этапа
		const blocks: DataBlock[] = []
		const blockCount = Math.min(String(currentStepData.data).length, 8)

		for (let i = 0; i < blockCount; i++) {
			blocks.push({
				id: `block-${currentStep}-${i}`,
				content: String(currentStepData.data)[i] || '?',
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
	}, [data, currentStep, isAnimating])

	// Анимация трансформации
	useEffect(() => {
		if (dataBlocks.length === 0 || !isAnimating) return

		const phases = ['input', 'processing', 'output'] as const
		let phaseIndex = 0

		const phaseInterval = setInterval(() => {
			setAnimationPhase(phases[phaseIndex % phases.length])
			phaseIndex++

			if (phaseIndex >= phases.length * 2) {
				clearInterval(phaseInterval)
			}
		}, 800)

		return () => clearInterval(phaseInterval)
	}, [dataBlocks, isAnimating])

	// Анимация блоков данных
	useEffect(() => {
		if (dataBlocks.length === 0) return

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
							targetY = 70 + Math.random() * 20
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

	if (!data || dataBlocks.length === 0) {
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
		<div className='relative w-full h-80 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg border-2 border-indigo-200 overflow-hidden'>
			{/* Заголовок */}
			<div className='absolute top-4 left-4 z-10'>
				<h4 className='text-gray-800 text-lg font-bold mb-1'>
					🔄 Трансформация данных
				</h4>
				<p className='text-gray-600 text-sm'>
					Фаза: {getPhaseDescription()}
				</p>
			</div>

			{/* Области этапов */}
			<div className='absolute inset-0'>
				{/* Входная зона */}
				<div className='absolute top-4 left-4 right-4 h-16 bg-blue-100 rounded-lg border-2 border-blue-300 border-dashed'>
					<div className='flex items-center justify-center h-full text-blue-600 font-semibold'>
						📥 Входные данные
					</div>
				</div>

				{/* Зона обработки */}
				<div className='absolute top-24 left-4 right-4 h-16 bg-purple-100 rounded-lg border-2 border-purple-300 border-dashed'>
					<div className='flex items-center justify-center h-full text-purple-600 font-semibold'>
						⚙️ Обработка
					</div>
				</div>

				{/* Выходная зона */}
				<div className='absolute bottom-4 left-4 right-4 h-16 bg-green-100 rounded-lg border-2 border-green-300 border-dashed'>
					<div className='flex items-center justify-center h-full text-green-600 font-semibold'>
						📤 Результат
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
						<linearGradient id='processingGradient' x1='0%' y1='0%' x2='100%' y2='0%'>
							<stop offset='0%' stopColor='#8b5cf6' stopOpacity={0.3} />
							<stop offset='50%' stopColor='#8b5cf6' stopOpacity={0.8} />
							<stop offset='100%' stopColor='#8b5cf6' stopOpacity={0.3} />
						</linearGradient>
					</defs>

					{/* Линии обработки */}
					{dataBlocks.map((block, index) => (
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
								left: `${20 + (i * 5)}%`,
								top: `${35 + Math.sin(i) * 10}%`,
								animationDelay: `${i * 100}ms`,
								animationDuration: '1.5s',
							}}
						/>
					))}
				</div>
			)}

			{/* Индикатор прогресса трансформации */}
			<div className='absolute bottom-4 right-4'>
				<div className='bg-white bg-opacity-90 rounded-lg p-3 shadow-lg'>
					<div className='flex items-center gap-2 text-sm text-gray-700'>
						<div className='w-3 h-3 bg-blue-500 rounded-full animate-pulse'></div>
						<span>Этап {currentStep + 1}/6</span>
					</div>
				</div>
			</div>
		</div>
	)
}

export default DataTransformationAnimation