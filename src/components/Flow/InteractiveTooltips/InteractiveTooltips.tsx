'use client'

import React, { useState } from 'react'
import { IServerResponse } from '@/types/generate.type'
import {
	BookOpen,
	HelpCircle,
	ChevronLeft,
	ChevronRight,
	CheckCircle,
	Clock,
	ArrowRight,
	Book,
	Microscope,
	Lightbulb,
	RefreshCw,
	List,
	X
} from 'lucide-react'

interface InteractiveTooltipsProps {
	data: IServerResponse | null
	currentStep: number
	isVisible: boolean
	onStepChange?: (step: number) => void
}

interface TooltipInfo {
	id: string
	title: string
	content: string
	technical: string
	examples: string[]
	icon: string
	color: string
}

const InteractiveTooltips: React.FC<InteractiveTooltipsProps> = ({
	data,
	currentStep,
	isVisible,
	onStepChange,
}) => {
	const [showTechnical, setShowTechnical] = useState(false)

	const tooltips: TooltipInfo[] = React.useMemo(() => {
		if (!data) return []

		return [
			{
				id: 'entropy-collection',
				title: 'Сбор энтропии',
				content: 'Энтропия — это мера беспорядка и непредсказуемости. Мы получаем её от авторитетного источника NIST для обеспечения максимальной случайности.',
				technical: 'NIST Randomness Beacon предоставляет энтропийные данные на основе квантовых процессов и атмосферного шума. Каждый бит данных проходит строгую криптографическую верификацию.',
				examples: [
					'Квантовые флуктуации',
					'Атмосферный шум',
					'Радиоактивный распад',
					'Криптографические функции'
				],
				icon: '🔗',
				color: '#ef4444',
			},
			{
				id: 'genesis-hash',
				title: 'Genesis Hash',
				content: 'Начальный хэш блокчейна служит дополнительным источником энтропии и обеспечивает связь с распределённой сетью.',
				technical: 'Genesis Hash — это хэш первого блока в блокчейне. Он генерируется один раз при создании сети и остаётся неизменным, предоставляя стабильный источник энтропии.',
				examples: [
					'Блок #0 в Bitcoin',
					'Genesis блок Ethereum',
					'Первый блок любой цепочки',
					'Корневой хэш сети'
				],
				icon: '⚡',
				color: '#8b5cf6',
			},
			{
				id: 'uuid-generation',
				title: 'Генерация UUID',
				content: 'UUID (Universally Unique Identifier) создаётся как на сервере, так и на клиенте для обеспечения уникальности запроса.',
				technical: 'UUID v4 генерируется с использованием криптографически сильного псевдослучайного генератора. Версия 4 UUID содержит 122 бита случайности.',
				examples: [
					'550e8400-e29b-41d4-a716-446655440000',
					'123e4567-e89b-12d3-a456-426614174000',
					'Клиентский UUID',
					'Серверный UUID'
				],
				icon: '🎲',
				color: '#22c55e',
			},
			{
				id: 'salt-addition',
				title: 'Добавление соли',
				content: 'Дополнительная соль (extra salt) добавляется для повышения криптографической стойкости и предотвращения атак.',
				technical: 'Соль — это случайные данные, добавляемые к хэшируемым данным для предотвращения атак по словарю и rainbow table. Длина соли должна быть минимум 128 бит.',
				examples: [
					'Криптографическая соль',
					'Дополнительная энтропия',
					'Защита от коллизий',
					'Улучшение распределения'
				],
				icon: '🧂',
				color: '#f59e0b',
			},
			{
				id: 'hash-combination',
				title: 'Комбинирование хэшей',
				content: 'Все источники энтропии объединяются с помощью криптографической хэш-функции для создания единого значения.',
				technical: 'Используется SHA-256 для детерминированного комбинирования всех источников энтропии. Функция avalanche effect обеспечивает максимальную чувствительность к входным изменениям.',
				examples: [
					'SHA-256 комбинирование',
					'XOR операции',
					'Конкатенация данных',
					'Криптографическое смешивание'
				],
				icon: '🔗',
				color: '#06b6d4',
			},
			{
				id: 'final-output',
				title: 'Генерация результата',
				content: 'Финальные случайные числа генерируются в указанном диапазоне и количестве на основе комбинированной энтропии.',
				technical: 'Алгоритм использует комбинированное значение энтропии как seed для детерминированного псевдослучайного генератора. Обеспечивается равномерное распределение в заданном интервале.',
				examples: [
					'Числа в диапазоне [1, 100]',
					'Криптографическая случайность',
					'Равномерное распределение',
					'Массив случайных значений'
				],
				icon: '🎯',
				color: '#10b981',
			},
		]
	}, [data])

	const currentTooltip = tooltips[currentStep] || tooltips[0]

	if (!isVisible) {
		return null
	}

	return (
		<div className='bg-white rounded-2xl shadow-lg p-8 border-2 border-purple-200'>
			{/* Заголовок блока */}
			<div className='mb-6'>
				<h3 className='text-2xl font-bold text-gray-800 mb-2 flex items-center gap-2'>
					<BookOpen className="w-8 h-8" />
					<span>Интерактивные подсказки</span>
				</h3>
				<p className='text-gray-600'>
					Детальное объяснение каждого этапа генерации случайных чисел
				</p>
			</div>

			{/* Кнопка закрытия */}
			<div className='absolute top-4 right-4'>
				<button
					onClick={() => {
						// Здесь можно добавить логику для скрытия блока через родительский компонент
					}}
					className='w-8 h-8 bg-gray-400 hover:bg-gray-500 text-white rounded-full flex items-center justify-center font-bold transition-colors duration-200 opacity-50 cursor-not-allowed'
				>
					<X className="w-4 h-4" />
				</button>
			</div>

			{/* Содержимое блока */}
			<div className='max-h-350 overflow-y-auto'>
				{currentTooltip && (
					<div className='space-y-4'>
						{/* Заголовок этапа */}
						<div
							className='p-4 rounded-xl border-2'
							style={{
								backgroundColor: currentTooltip.color + '15',
								borderColor: currentTooltip.color,
							}}
						>
							<div className='flex items-center gap-3 mb-3'>
								<div
									className='w-12 h-12 rounded-full flex items-center justify-center text-xl'
									style={{ backgroundColor: currentTooltip.color }}
								>
									{currentTooltip.icon}
								</div>
								<div>
									<h4 className='font-bold text-gray-800 text-lg'>
										{currentTooltip.title}
									</h4>
									<div className='text-sm text-gray-600'>
										Этап {currentStep + 1} из {tooltips.length}
									</div>
								</div>
							</div>
						</div>

						{/* Основное объяснение */}
						<div className='bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400'>
							<h5 className='font-semibold text-gray-800 mb-2 flex items-center gap-2'>
								<Book className="w-5 h-5" />
								<span>Простое объяснение:</span>
							</h5>
							<p className='text-gray-700 leading-relaxed'>
								{currentTooltip.content}
							</p>
						</div>

						{/* Переключатель тех/простое */}
						<div className='flex justify-center'>
							<button
								onClick={() => setShowTechnical(!showTechnical)}
								className='px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center gap-2'
							>
								{showTechnical ? (
									<>
										<Book className="w-4 h-4" />
										<span>Простое объяснение</span>
									</>
								) : (
									<>
										<Microscope className="w-4 h-4" />
										<span>Технические детали</span>
									</>
								)}
							</button>
						</div>

						{/* Техническая информация */}
						{showTechnical && (
							<div className='bg-gray-50 p-4 rounded-lg border-l-4 border-gray-400'>
								<h5 className='font-semibold text-gray-800 mb-2 flex items-center gap-2'>
									<Microscope className="w-5 h-5" />
									<span>Технические детали:</span>
								</h5>
								<p className='text-sm text-gray-700 leading-relaxed'>
									{currentTooltip.technical}
								</p>
							</div>
						)}

						{/* Примеры */}
						<div className='bg-green-50 p-4 rounded-lg border-l-4 border-green-400'>
							<h5 className='font-semibold text-gray-800 mb-3 flex items-center gap-2'>
								<Lightbulb className="w-5 h-5" />
								<span>Примеры:</span>
							</h5>
							<div className='space-y-2'>
								{currentTooltip.examples.map((example, index) => (
									<div key={index} className='flex items-center gap-2'>
										<div className='w-2 h-2 bg-green-500 rounded-full'></div>
										<span className='text-sm text-gray-700'>{example}</span>
									</div>
								))}
							</div>
						</div>

						{/* Навигация между этапами */}
						<div className='bg-white border rounded-lg p-4'>
							<h5 className='font-semibold text-gray-800 mb-3 flex items-center gap-2'>
								<RefreshCw className="w-5 h-5" />
								<span>Навигация по этапам:</span>
							</h5>
							<div className='grid grid-cols-2 gap-2'>
								<button
									onClick={() => onStepChange?.(Math.max(0, currentStep - 1))}
									disabled={currentStep === 0}
									className='px-3 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white rounded-lg text-sm font-medium transition-colors duration-200 flex items-center justify-center gap-1'
								>
									<ChevronLeft className="w-4 h-4" />
									<span>Назад</span>
								</button>
								<button
									onClick={() => onStepChange?.(Math.min(tooltips.length - 1, currentStep + 1))}
									disabled={currentStep === tooltips.length - 1}
									className='px-3 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white rounded-lg text-sm font-medium transition-colors duration-200 flex items-center justify-center gap-1'
								>
									<span>Вперёд</span>
									<ChevronRight className="w-4 h-4" />
								</button>
							</div>
						</div>

						{/* Список всех этапов */}
						<div className='bg-gray-50 rounded-lg p-4 '>
							<h5 className='font-semibold text-gray-800 mb-3 flex items-center gap-2'>
								<List className="w-5 h-5" />
								<span>Все этапы процесса:</span>
							</h5>
							<div className='space-y-2 max-h-204 overflow-y-auto'>
								{tooltips.map((tooltip, index) => (
									<div
										key={tooltip.id}
										onClick={() => onStepChange?.(index)}
										className={`p-3 rounded-lg border-2 cursor-pointer transition-all duration-300 ${
											index === currentStep
												? 'border-blue-500 bg-blue-50'
												: 'border-gray-200 bg-white hover:border-gray-300'
										}`}
									>
										<div className='flex items-center gap-3'>
											<div
												className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
													index === currentStep
														? 'bg-blue-500 text-white'
														: 'bg-gray-300 text-gray-600'
												}`}
											>
												{index < currentStep ? (
													<CheckCircle className="w-4 h-4" />
												) : (
													index + 1
												)}
											</div>
											<div className='flex-1'>
												<h6 className='font-semibold text-gray-800 text-sm'>
													{tooltip.title}
												</h6>
												<p className='text-xs text-gray-600'>
													{tooltip.content.substring(0, 60)}...
												</p>
											</div>
											<div className='text-lg'>{tooltip.icon}</div>
										</div>
									</div>
								))}
							</div>
						</div>
					</div>
				)}
			</div>
		</div>
	)
}

export default InteractiveTooltips