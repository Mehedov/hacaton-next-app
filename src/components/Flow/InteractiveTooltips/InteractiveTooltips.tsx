'use client'

import { IServerResponse } from '@/types/generate.type'
import {
	Book,
	BookOpen,
	CheckCircle,
	ChevronLeft,
	ChevronRight,
	Dices,
	Lightbulb,
	Link,
	List,
	Microscope,
	RefreshCw,
	Target,
	Zap,
} from 'lucide-react'
import React, { ReactNode, useState } from 'react'

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
	icon: ReactNode
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
				title: 'Сбор аппаратной энтропии',
				content:
					'Аппаратная энтропия — это истинная случайность, полученная от физических процессов в оборудовании. Наш API сервис предоставляет эти данные для максимальной непредсказуемости.',
				technical:
					'Аппаратные генераторы энтропии используют физические процессы, такие как тепловой шум, квантовые эффекты или радиоактивный распад. Данные проходят через криптографическую верификацию для обеспечения аутентичности.',
				examples: [
					'Тепловой шум в процессоре',
					'Квантовые флуктуации',
					'Электромагнитные помехи',
					'Физические датчики случайности',
				],
				icon: <Link className='w-6 h-6 text-white' />,
				color: '#ef4444',
			},
			{
				id: 'genesis-hash',
				title: 'Genesis Hash (SHA-512)',
				content:
					'Genesis Hash — это результат хэширования энтропийных данных с дополнительной солью с использованием SHA-512.',
				technical:
					'Процесс включает комбинирование аппаратной энтропии с криптографической солью и применение SHA-512. Это создаёт уникальный хэш, который служит основой для дальнейшей обработки.',
				examples: [
					'SHA-512 хэширование',
					'Добавление криптографической соли',
					'Комбинирование энтропии',
					'Создание seed для генератора',
				],
				icon: <Zap className='w-6 h-6 text-white' />,
				color: '#8b5cf6',
			},
			{
				id: 'uuid-generation',
				title: 'Генерация UUID',
				content:
					'UUID (Universally Unique Identifier) генерируется на клиенте для обеспечения уникальности каждого запроса.',
				technical:
					'UUID v4 генерируется с использованием криптографически сильного псевдослучайного генератора. Версия 4 UUID содержит 122 бита случайности и добавляется к Genesis Hash.',
				examples: [
					'550e8400-e29b-41d4-a716-446655440000',
					'123e4567-e89b-12d3-a456-426614174000',
					'Клиентский UUID',
					'Уникальность запроса',
				],
				icon: <Dices className='w-6 h-6 text-white' />,
				color: '#22c55e',
			},
			{
				id: 'hash-combination',
				title: 'Комбинирование хэшей',
				content:
					'Genesis Hash и клиентский UUID объединяются с помощью криптографической хэш-функции для создания финального seed.',
				technical:
					'Используется SHA-256 для детерминированного комбинирования Genesis Hash и UUID. Функция avalanche effect обеспечивает максимальную чувствительность к входным изменениям.',
				examples: [
					'SHA-256 комбинирование',
					'Genesis Hash + UUID',
					'Создание финального seed',
					'Криптографическое смешивание',
				],
				icon: <Link className='w-6 h-6 text-white' />,
				color: '#06b6d4',
			},
			{
				id: 'final-output',
				title: 'Генерация результата',
				content:
					'Финальные случайные числа генерируются в указанном диапазоне и количестве на основе комбинированного хэша.',
				technical:
					'Алгоритм использует комбинированный хэш как seed для детерминированного псевдослучайного генератора. Обеспечивается равномерное распределение в заданном интервале.',
				examples: [
					'Числа в диапазоне [10, 100]',
					'Криптографическая случайность',
					'Равномерное распределение',
					'Массив случайных значений',
				],
				icon: <Target className='w-6 h-6 text-white' />,
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
					<BookOpen className='w-8 h-8' />
					<span>Детальное обьяснение</span>
				</h3>
				<p className='text-gray-600'>
					Детальное объяснение каждого этапа генерации случайных чисел
				</p>
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
									className='w-12 h-12 rounded-full flex items-center justify-center'
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
								<Book className='w-5 h-5' />
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
										<Book className='w-4 h-4' />
										<span>Простое объяснение</span>
									</>
								) : (
									<>
										<Microscope className='w-4 h-4' />
										<span>Технические детали</span>
									</>
								)}
							</button>
						</div>

						{/* Техническая информация */}
						{showTechnical && (
							<div className='space-y-3'>
								<h5 className='font-semibold text-gray-800 mb-2 flex items-center gap-2'>
									<Microscope className='w-5 h-5' />
									<span>Технические детали:</span>
								</h5>

								<div className='bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm overflow-x-auto border border-gray-700'>
									<div className='text-gray-400 mb-2'>
										{/* Technical Implementation */}
									</div>
									<div className='text-green-300'>
										Process:{' '}
										<span className='text-yellow-300'>
											{currentTooltip.title}
										</span>
									</div>
									<div className='text-green-300'>
										Method:{' '}
										<span className='text-blue-300'>
											Cryptographic algorithms
										</span>
									</div>
									<div className='text-green-300'>
										Security:{' '}
										<span className='text-purple-300'>High-grade entropy</span>
									</div>
									<div className='text-green-300'>
										Standard:{' '}
										<span className='text-red-300'>
											Industry best practices
										</span>
									</div>
									<div className='text-green-300 mt-2'>
										{/* Implementation details */}
									</div>
									<div className='text-green-300'>
										const <span className='text-blue-300'>process</span> ={' '}
										<span className='text-yellow-300'>executeStep</span>(
										<span className='text-purple-300'>{currentStep + 1}</span>);
									</div>
									<div className='text-green-300'>
										const <span className='text-blue-300'>result</span> ={' '}
										<span className='text-blue-300'>process</span>.
										<span className='text-yellow-300'>generate</span>();
									</div>
									<div className='text-gray-400 mt-2'>
										{/* {currentTooltip.technical} */}
									</div>
								</div>
							</div>
						)}

						{/* Примеры */}
						<div className='bg-green-50 p-4 rounded-lg border-l-4 border-green-400'>
							<h5 className='font-semibold text-gray-800 mb-3 flex items-center gap-2'>
								<Lightbulb className='w-5 h-5' />
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
								<RefreshCw className='w-5 h-5' />
								<span>Навигация по этапам:</span>
							</h5>
							<div className='grid grid-cols-2 gap-2'>
								<button
									onClick={() => onStepChange?.(Math.max(0, currentStep - 1))}
									disabled={currentStep === 0}
									className='px-3 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white rounded-lg text-sm font-medium transition-colors duration-200 flex items-center justify-center gap-1'
								>
									<ChevronLeft className='w-4 h-4' />
									<span>Назад</span>
								</button>
								<button
									onClick={() =>
										onStepChange?.(
											Math.min(tooltips.length - 1, currentStep + 1)
										)
									}
									disabled={currentStep === tooltips.length - 1}
									className='px-3 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white rounded-lg text-sm font-medium transition-colors duration-200 flex items-center justify-center gap-1'
								>
									<span>Вперёд</span>
									<ChevronRight className='w-4 h-4' />
								</button>
							</div>
						</div>

						{/* Список всех этапов */}
						<div className='bg-gray-50 rounded-lg p-4 '>
							<h5 className='font-semibold text-gray-800 mb-3 flex items-center gap-2'>
								<List className='w-5 h-5' />
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
													<CheckCircle className='w-4 h-4' />
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
											{tooltip.icon}
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
