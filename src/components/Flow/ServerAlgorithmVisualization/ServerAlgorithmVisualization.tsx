'use client'

import { IServerResponse } from '@/types/generate.type'
import { ArrowRight, Database, Hash, Server, Shield, Zap } from 'lucide-react'
import React from 'react'

interface ServerAlgorithmVisualizationProps {
	data: IServerResponse | null
	isVisible?: boolean
}

const ServerAlgorithmVisualization: React.FC<
	ServerAlgorithmVisualizationProps
> = ({ data, isVisible = true }) => {
	if (!data || !isVisible) {
		return null
	}

	return (
		<div className='w-full'>
			<div className='bg-gray-50 px-4 py-2 border-b border-gray-200 rounded-t-lg'>
				<h3 className='text-lg font-semibold text-gray-800 flex items-center gap-2'>
					<Zap className='w-5 h-5 text-blue-600' />
					Графическая схема алгоритма сервера
				</h3>
				<p className='text-sm text-gray-600'>
					Визуальное представление процесса генерации случайных чисел
				</p>
			</div>

			<div className='p-6 bg-white rounded-b-lg'>
				{/* Графическая схема в виде блоков с линиями */}
				<div className='relative'>
					{/* Горизонтальные линии для соединения блоков */}
					<div className='absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-green-400 via-cyan-400 via-purple-400 via-pink-400 via-yellow-400 via-emerald-400 to-red-400 transform -translate-y-1/2 z-0 hidden xl:block'></div>

					{/* Стрелочки для горизонтальных линий */}
					<div className='absolute top-1/2 transform -translate-y-1/2 z-0 hidden xl:block'>
						<div className='absolute left-[14%] w-0 h-0 border-l-[8px] border-l-green-400 border-t-[4px] border-t-transparent border-b-[4px] border-b-transparent'></div>
						<div className='absolute left-[28%] w-0 h-0 border-l-[8px] border-l-cyan-400 border-t-[4px] border-t-transparent border-b-[4px] border-b-transparent'></div>
						<div className='absolute left-[42%] w-0 h-0 border-l-[8px] border-l-purple-400 border-t-[4px] border-t-transparent border-b-[4px] border-b-transparent'></div>
						<div className='absolute left-[56%] w-0 h-0 border-l-[8px] border-l-pink-400 border-t-[4px] border-t-transparent border-b-[4px] border-b-transparent'></div>
						<div className='absolute left-[70%] w-0 h-0 border-l-[8px] border-l-yellow-400 border-t-[4px] border-t-transparent border-b-[4px] border-b-transparent'></div>
						<div className='absolute left-[84%] w-0 h-0 border-l-[8px] border-l-emerald-400 border-t-[4px] border-t-transparent border-b-[4px] border-b-transparent'></div>
					</div>

					{/* Вертикальные линии для мобильной версии */}
					<div className='xl:hidden space-y-4'>
						{/* Линии между парами блоков с стрелочками */}
						<div className='flex justify-center items-center gap-2'>
							<div className='w-12 h-0.5 bg-green-400'></div>
							<div className='w-0 h-0 border-l-[6px] border-l-green-400 border-t-[3px] border-t-transparent border-b-[3px] border-b-transparent'></div>
							<div className='w-12 h-0.5 bg-cyan-400'></div>
						</div>
						<div className='flex justify-center items-center gap-2'>
							<div className='w-12 h-0.5 bg-cyan-400'></div>
							<div className='w-0 h-0 border-l-[6px] border-l-cyan-400 border-t-[3px] border-t-transparent border-b-[3px] border-b-transparent'></div>
							<div className='w-12 h-0.5 bg-purple-400'></div>
						</div>
						<div className='flex justify-center items-center gap-2'>
							<div className='w-12 h-0.5 bg-purple-400'></div>
							<div className='w-0 h-0 border-l-[6px] border-l-purple-400 border-t-[3px] border-t-transparent border-b-[3px] border-b-transparent'></div>
							<div className='w-12 h-0.5 bg-pink-400'></div>
						</div>
						<div className='flex justify-center items-center gap-2'>
							<div className='w-12 h-0.5 bg-pink-400'></div>
							<div className='w-0 h-0 border-l-[6px] border-l-pink-400 border-t-[3px] border-t-transparent border-b-[3px] border-b-transparent'></div>
							<div className='w-12 h-0.5 bg-yellow-400'></div>
						</div>
						<div className='flex justify-center items-center gap-2'>
							<div className='w-12 h-0.5 bg-yellow-400'></div>
							<div className='w-0 h-0 border-l-[6px] border-l-yellow-400 border-t-[3px] border-t-transparent border-b-[3px] border-b-transparent'></div>
							<div className='w-12 h-0.5 bg-emerald-400'></div>
						</div>
						<div className='flex justify-center items-center gap-2'>
							<div className='w-12 h-0.5 bg-emerald-400'></div>
							<div className='w-0 h-0 border-l-[6px] border-l-emerald-400 border-t-[3px] border-t-transparent border-b-[3px] border-b-transparent'></div>
							<div className='w-12 h-0.5 bg-red-400'></div>
						</div>
					</div>

					{/* Блоки этапов */}
					<div className='relative z-10 flex justify-between items-center'>
						{/* Клиент */}
						<div className='flex flex-col items-center'>
							<div className='w-16 h-16 bg-green-500 rounded-full flex items-center justify-center text-white mb-3 shadow-lg'>
								<Database className='w-8 h-8' />
							</div>
							<div className='bg-green-50 border-2 border-green-200 rounded-lg p-3 text-center shadow-sm w-full'>
								<h4 className='font-semibold text-green-800 text-sm mb-1'>
									Клиент
								</h4>
								<p className='text-xs text-green-600 mb-2'>Отправка запроса</p>
								<div className='space-y-1'>
									<div className='text-xs text-green-700'>
										UUID: {data.inputLayer.clientUUID.substring(0, 8)}...
									</div>
									<div className='text-xs text-green-700'>
										[{data.inputLayer.interval[0]},{' '}
										{data.inputLayer.interval[1]}]
									</div>
									<div className='text-xs text-green-700'>
										Кол-во: {data.inputLayer.count}
									</div>
								</div>
							</div>
						</div>

						{/* Сервер получает запрос */}
						<div className='flex flex-col items-center'>
							<div className='w-16 h-16 bg-cyan-500 rounded-full flex items-center justify-center text-white mb-3 shadow-lg'>
								<Server className='w-8 h-8' />
							</div>
							<div className='bg-cyan-50 border-2 border-cyan-200 rounded-lg p-3 text-center shadow-sm w-full'>
								<h4 className='font-semibold text-cyan-800 text-sm mb-1'>
									Сервер
								</h4>
								<p className='text-xs text-cyan-600 mb-2'>Получение запроса</p>
								<div className='space-y-1'>
									<div className='text-xs text-cyan-700'>Валидация</div>
									<div className='text-xs text-cyan-700'>Аутентификация</div>
									<div className='text-xs text-cyan-700'>Подготовка</div>
								</div>
							</div>
						</div>

						{/* Декодирование энтропии */}
						{/* <div className='flex flex-col items-center'>
							<div className='w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center text-white mb-3 shadow-lg'>
								<Key className='w-8 h-8' />
							</div>
							<div className='bg-purple-50 border-2 border-purple-200 rounded-lg p-3 text-center shadow-sm w-full'>
								<h4 className='font-semibold text-purple-800 text-sm mb-1'>
									Декодирование
								</h4>
								<p className='text-xs text-purple-600 mb-2'>
									Расшифровка энтропии
								</p>
								<div className='space-y-1'>
									<div className='text-xs text-purple-700'>Приватный ключ</div>
									<div className='text-xs text-purple-700'>
										encryptedEntropy:{' '}
										{data.inputLayer.encryptedEntropy.substring(0, 12)}...
									</div>
									<div className='text-xs text-purple-700'>→ entropyId </div>
								</div>
							</div>
						</div> */}

						{/* Получение данных энтропии */}
						<div className='flex flex-col items-center'>
							<div className='w-16 h-16 bg-pink-500 rounded-full flex items-center justify-center text-white mb-3 shadow-lg'>
								<Shield className='w-8 h-8' />
							</div>
							<div className='bg-pink-50 border-2 border-pink-200 rounded-lg p-3 text-center shadow-sm w-full'>
								<h4 className='font-semibold text-pink-800 text-sm mb-1'>
									Энтропия
								</h4>
								<p className='text-xs text-pink-600 mb-2'>Источник данных</p>
								<div className='space-y-1'>
									<div className='text-xs text-pink-700'>Linux</div>
									<div className='text-xs text-pink-700'>Hardware Entropy</div>
									<div className='text-xs text-pink-700'>
										Данные: {data.outputLayer.entropy.data.substring(0, 16)}...
									</div>
								</div>
							</div>
						</div>

						{/* Генерация Genesis Hash */}
						<div className='flex flex-col items-center'>
							<div className='w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center text-white mb-3 shadow-lg'>
								<Hash className='w-8 h-8' />
							</div>
							<div className='bg-yellow-50 border-2 border-yellow-200 rounded-lg p-3 text-center shadow-sm w-full'>
								<h4 className='font-semibold text-yellow-800 text-sm mb-1'>
									Genesis Hash
								</h4>
								<p className='text-xs text-yellow-600 mb-2'>
									SHA-512 хэширование
								</p>
								<div className='space-y-1'>
									<div className='text-xs text-yellow-700'>
										Алгоритм: SHA-512
									</div>
									<div className='text-xs text-yellow-700'>
										Вход: entropy + UUID
									</div>
									<div className='text-xs text-yellow-700'>
										Выход: {data.outputLayer.genesisHash.substring(0, 8)}...
									</div>
								</div>
							</div>
						</div>

						{/* Генерация случайных чисел */}
						<div className='flex flex-col items-center'>
							<div className='w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center text-white mb-3 shadow-lg'>
								<Zap className='w-8 h-8' />
							</div>
							<div className='bg-emerald-50 border-2 border-emerald-200 rounded-lg p-3 text-center shadow-sm w-full'>
								<h4 className='font-semibold text-emerald-800 text-sm mb-1'>
									Случайные числа
								</h4>
								<p className='text-xs text-emerald-600 mb-2'>
									Генерация в диапазоне
								</p>
								<div className='space-y-1'>
									<div className='text-xs text-emerald-700'>
										Диапазон: [{data.inputLayer.interval[0]},{' '}
										{data.inputLayer.interval[1]}]
									</div>
									<div className='text-xs text-emerald-700'>
										Количество: {data.inputLayer.count}
									</div>
								</div>
							</div>
						</div>

						{/* Возврат результата */}
						<div className='flex flex-col items-center'>
							<div className='w-16 h-16 bg-red-500 rounded-full flex items-center justify-center text-white mb-3 shadow-lg'>
								<ArrowRight className='w-8 h-8' />
							</div>
							<div className='bg-red-50 border-2 border-red-200 rounded-lg p-3 text-center shadow-sm w-full'>
								<h4 className='font-semibold text-red-800 text-sm mb-1'>
									Ответ клиенту
								</h4>
								<p className='text-xs text-red-600 mb-2'>
									Раскрытие данных для верификации
								</p>
								<div className='space-y-1'>
									<div className='text-xs text-red-700'>случайные числа</div>
									<div className='text-xs text-red-700'>decoded entropy</div>
									<div className='text-xs text-red-700'>entropyURL</div>
									<div className='text-xs text-red-700'>genesisHash</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default ServerAlgorithmVisualization
