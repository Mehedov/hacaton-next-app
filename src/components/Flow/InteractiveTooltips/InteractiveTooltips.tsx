'use client'

import { IServerResponse } from '@/types/generate.type'
import {
	ArrowRightLeft,
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
				id: 'get-entropy',
				title: 'Получение энтропии',
				content:
					'Клиент получает хэш энтропийных данных и зашифрованную энтропию от сервера. Эти данные служат основой для генерации случайных чисел и обеспечивают криптографическую безопасность.',
				technical:
					'GET запрос к https://enthropy.bgitu-compass.ru/getEntropyHash возвращает entropyHash (хэш данных энтропии) и cryptedEntropy (зашифрованная энтропия). Хэш позволяет верифицировать подлинность данных энтропии, а зашифрованная энтропия идентифицирует конкретный набор данных для генерации.',
				examples: [
					'GET /getEntropyHash',
					'{"entropyHash": "a1b2c3...", "cryptedEntropy": "def456..."}',
					'Верификация подлинности энтропии',
					'Идентификация источника энтропии',
				],
				icon: <Link className='w-6 h-6 text-white' />,
				color: '#ef4444',
			},
			{
				id: 'prepare-request',
				title: 'Подготовка запроса',
				content:
					'Клиент формирует запрос с уникальным идентификатором, диапазоном чисел и количеством. Зашифрованная энтропия связывает запрос с конкретным источником случайности.',
				technical:
					'Генерируется clientUUID для обеспечения уникальности запроса. Определяются параметры: interval (диапазон значений) и count (количество чисел). CryptedEntropy обеспечивает связь с конкретным источником энтропии для последующей верификации.',
				examples: [
					'clientUUID: "550e8400-e29b-41d4-a716-446655440000"',
					'interval: [1, 100]',
					'count: 10',
					'Подготовка параметров запроса',
				],
				icon: <Dices className='w-6 h-6 text-white' />,
				color: '#22c55e',
			},
			{
				id: 'send-request',
				title: 'Отправка запроса',
				content:
					'Сформированный запрос отправляется на сервер для генерации случайных чисел. Все параметры передаются в одном POST запросе.',
				technical:
					'POST запрос к https://enthropy.bgitu-compass.ru/fullChain/GenerateRandomNumbers содержит clientUUID, interval, count и cryptedEntropy. Сервер использует эти параметры для генерации детерминированных, но непредсказуемых случайных чисел.',
				examples: [
					'POST /fullChain/GenerateRandomNumbers',
					'{"clientUUID": "...", "interval": [1,100], "count": 10}',
					'Передача параметров на сервер',
					'Инициация процесса генерации',
				],
				icon: <ArrowRightLeft className='w-6 h-6 text-white' />,
				color: '#06b6d4',
			},
			{
				id: 'server-processing',
				title: 'Обработка на сервере',
				content:
					'Сервер генерирует Genesis Hash путём хэширования энтропийных данных с клиентским UUID. Это обеспечивает криптографическую связь между источником энтропии и клиентом.',
				technical:
					'Создаётся комбинация строки data (из энтропии) + clientUUID, которая хэшируется через SHA-512. Полученный genesisHash служит основой для генерации outputValues. Процесс предотвращает подбор хэша злоумышленниками с любой стороны.',
				examples: [
					'SHA-512 хэширование',
					'data + clientUUID комбинирование',
					'genesisHash: "f4a3b2c1..."',
					'Криптографическая защита от подбора',
				],
				icon: <Zap className='w-6 h-6 text-white' />,
				color: '#8b5cf6',
			},
			{
				id: 'receive-results',
				title: 'Получение результатов',
				content:
					'Клиент получает сгенерированные случайные числа, ссылку на источник энтропии и Genesis Hash. Эти данные позволяют верифицировать подлинность результата.',
				technical:
					'Ответ содержит outputValues (массив случайных чисел), entropyURL (ссылка на ресурс энтропии) и genesisHash. EntropyURL позволяет проверить источник данных энтропии, а genesisHash подтверждает правильность генерации.',
				examples: [
					'outputValues: [15, 67, 23, 89, 42]',
					'entropyURL: "https://..."',
					'genesisHash: "f4a3b2c1..."',
					'Верификация результата',
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

								<div className='bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm overflow-x-auto border border-gray-700 text-left'>
									<div className='text-gray-400 mb-2'>
										{/* Technical Implementation Details */}
									</div>

									{(() => {
										switch (currentTooltip.id) {
											case 'get-entropy':
												return (
													<>
														<div className='text-green-300'>
															Endpoint:{' '}
															<span className='text-yellow-300'>
																GET /getEntropyHash
															</span>
														</div>
														<div className='text-green-300'>
															Response:{' '}
															<span className='text-blue-300'>
																&#123;entropyHash, cryptedEntropy&#125;
															</span>
														</div>
														<div className='text-green-300'>
															Security:{' '}
															<span className='text-purple-300'>
																Hash verification
															</span>
														</div>
														<div className='text-green-300'>
															Entropy:{' '}
															<span className='text-red-300'>
																Hardware RNG sources
															</span>
														</div>
													</>
												)

											case 'prepare-request':
												return (
													<>
														<div className='text-green-300'>
															Parameters:{' '}
															<span className='text-yellow-300'>
																clientUUID, interval, count
															</span>
														</div>
														<div className='text-green-300'>
															UUID:{' '}
															<span className='text-blue-300'>
																v4 (122-bit randomness)
															</span>
														</div>
														<div className='text-green-300'>
															Range:{' '}
															<span className='text-purple-300'>
																[start, endInclusive]
															</span>
														</div>
														<div className='text-green-300'>
															Entropy:{' '}
															<span className='text-red-300'>
																Previously obtained
															</span>
														</div>
													</>
												)

											case 'send-request':
												return (
													<>
														<div className='text-green-300'>
															Method:{' '}
															<span className='text-yellow-300'>POST</span>
														</div>
														<div className='text-green-300'>
															URL:{' '}
															<span className='text-blue-300'>
																/fullChain/GenerateRandomNumbers
															</span>
														</div>
														<div className='text-green-300'>
															Headers:{' '}
															<span className='text-purple-300'>
																Content-Type: application/json
															</span>
														</div>
														<div className='text-green-300'>
															Body:{' '}
															<span className='text-red-300'>
																JSON parameters
															</span>
														</div>
													</>
												)

											case 'server-processing':
												return (
													<>
														<div className='text-green-300'>
															Hash:{' '}
															<span className='text-yellow-300'>
																SHA-512 algorithm
															</span>
														</div>
														<div className='text-green-300'>
															Input:{' '}
															<span className='text-blue-300'>
																data + clientUUID
															</span>
														</div>
														<div className='text-green-300'>
															Output:{' '}
															<span className='text-purple-300'>
																genesisHash (512-bit)
															</span>
														</div>
														<div className='text-green-300'>
															Security:{' '}
															<span className='text-red-300'>
																Avalanche effect
															</span>
														</div>
													</>
												)

											case 'receive-results':
												return (
													<>
														<div className='text-green-300'>
															Values:{' '}
															<span className='text-yellow-300'>
																Array of numbers
															</span>
														</div>
														<div className='text-green-300'>
															URL:{' '}
															<span className='text-blue-300'>
																entropyURL for verification
															</span>
														</div>
														<div className='text-green-300'>
															Hash:{' '}
															<span className='text-purple-300'>
																genesisHash confirmation
															</span>
														</div>
														<div className='text-green-300'>
															Distribution:{' '}
															<span className='text-red-300'>
																Uniform in range
															</span>
														</div>
													</>
												)

											default:
												return (
													<>
														<div className='text-green-300'>
															Process:{' '}
															<span className='text-yellow-300'>
																{currentTooltip.title}
															</span>
														</div>
														<div className='text-green-300'>
															Status:{' '}
															<span className='text-blue-300'>
																Processing...
															</span>
														</div>
													</>
												)
										}
									})()}
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
										className={`p-3 rounded-lg border-2 cursor-pointer transition-all duration-300 text-left ${
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
