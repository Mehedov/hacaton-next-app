'use client'

import { IDataNode, IServerResponse } from '@/types/generate.type'
import { Copy, Database, Info, InfoIcon } from 'lucide-react'
import React, { useEffect, useState } from 'react'

interface ServerDataVisualizationProps {
	data: IServerResponse | null
	isLoading?: boolean
	error?: string | null
}

const ServerDataVisualization: React.FC<ServerDataVisualizationProps> = ({
	data,
	isLoading = false,
	error = null,
}) => {
	const [visibleCards, setVisibleCards] = useState<Set<string>>(new Set())

	useEffect(() => {
		if (data) {
			setVisibleCards(new Set())

			// Анимация появления карточек с задержкой
			const cards = formatDataNodes(data)
			cards.forEach((card, index) => {
				setTimeout(() => {
					setVisibleCards(prev => new Set([...prev, card.id]))
				}, index * 150) // 150ms между появлениями карточек
			})
		}
	}, [data])
	if (isLoading) {
		return (
			<div className='w-full max-w-6xl mx-auto p-5'>
				<div className='flex flex-col items-center justify-center p-10 text-gray-600'>
					<div className='w-10 h-10 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin mb-4'></div>
					<p className='text-lg'>Получение данных от сервера...</p>
				</div>
			</div>
		)
	}

	if (error) {
		return (
			<div className='w-full max-w-6xl mx-auto p-5'>
				<div className='flex flex-col items-center justify-center p-10 text-red-600 text-center'>
					<div className='text-2xl mb-4'>⚠️</div>
					<p className='text-lg max-w-md'>{error}</p>
				</div>
			</div>
		)
	}

	if (!data) {
		return (
			<div className='w-full max-w-6xl mx-auto p-5'>
				<div className='flex items-center justify-center p-10 text-gray-600 text-center'>
					<p className='text-lg text-gray-400'>
						Нажмите Сгенерировать для получения данных
					</p>
				</div>
			</div>
		)
	}

	const formatDataNodes = (data: IServerResponse): IDataNode[] => {
		console.log(data.inputLayer.clientUUID)
		return [
			{
				id: 'clientUUID',
				label: 'UUID Клиента',
				value: data.inputLayer.clientUUID,
				type: 'string',
				description: 'Уникальный идентификатор клиента',
			},
			{
				id: 'interval',
				label: 'Интервал',
				value: data.inputLayer.interval,
				type: 'interval',
				description: 'Диапазон генерируемых чисел',
			},
			{
				id: 'count',
				label: 'Количество',
				value: data.inputLayer.count,
				type: 'number',
				description: 'Количество случайных чисел для генерации',
			},
			{
				id: 'entropyId',
				label: 'Entropy ID',
				value: data.outputLayer.entropy.entropyId,
				type: 'string',
				description: 'Идентификатор энтропийных данных',
			},
			{
				id: 'entropyData',
				label: 'Данные энтропии',
				value: data.outputLayer.entropy.data,
				type: 'string',
				description: 'Аппаратные энтропийные данные',
			},
			{
				id: 'entropyUrl',
				label: 'Источник энтропии',
				value: data.outputLayer.entropy.url,
				type: 'string',
				description: 'URL источника энтропийных данных',
			},
			{
				id: 'genesisHash',
				label: 'Genesis Hash',
				value: data.outputLayer.genesisHash,
				type: 'string',
				description: 'Начальный хэш блокчейна',
			},
			{
				id: 'outputValues',
				label: 'Сгенерированные значения',
				value: data.outputLayer.outputValues,
				type: 'array',
				description: 'Массив сгенерированных случайных чисел',
			},
		]
	}

	const renderValue = (node: IDataNode) => {
		switch (node.type) {
			case 'string':
				return (
					<div className='font-mono text-sm p-3 bg-gray-50 rounded-lg border'>
						{node.id === 'extraSalt' || node.id === 'entropyData' ? (
							<div className='flex items-center gap-2'>
								<span
									className='flex-1 text-gray-700 text-xs break-all'
									title={String(node.value)}
								>
									{String(node.value).substring(0, 16)}...
								</span>
								<button
									className='bg-blue-600 text-white px-2 py-1 rounded text-xs hover:bg-blue-700 transition-colors'
									onClick={() =>
										navigator.clipboard.writeText(String(node.value))
									}
									title='Копировать полное значение'
								>
									<Copy className='w-3 h-3' />
								</button>
							</div>
						) : node.id === 'entropyUrl' ? (
							<a
								href={String(node.value)}
								target='_blank'
								rel='noopener noreferrer'
								className='text-blue-600 hover:text-blue-800 underline break-all'
							>
								{String(node.value)}
							</a>
						) : (
							<span
								className='text-gray-800 break-all'
								title={String(node.value)}
							>
								{String(node.value).length > 50
									? `${node.value}`
									: String(node.value)}
							</span>
						)}
					</div>
				)
			case 'number':
				return (
					<div className='text-green-600 font-semibold text-xl text-center p-3 bg-green-50 rounded-lg border border-green-200'>
						{node.value}
					</div>
				)
			case 'interval':
				return (
					<div className='text-orange-600 font-semibold text-lg text-center p-3 bg-orange-50 rounded-lg border border-orange-200'>
						[{String(node.value).replace(',', ', ')}]
					</div>
				)
			case 'array':
				const values = node.value as number[]
				const displayedArrayValues = values.length > 100 ? values.slice(0, 5) : values
				return (
					<div className='flex flex-col gap-3'>
						<div className='flex flex-wrap gap-2'>
							{displayedArrayValues.map((val, index) => (
								<span
									key={index}
									className='bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium text-center min-w-[35px]'
								>
									{val}
								</span>
							))}
							{values.length > 100 && (
								<span className='text-gray-400 text-xs mt-1'>
									... и {values.length - 5} скрыто
								</span>
							)}
						</div>
						<div className='text-gray-600 text-sm text-center pt-2 border-t border-gray-200'>
							Всего: {values.length} значений
						</div>
					</div>
				)
			default:
				return (
					<div className='font-mono text-sm text-gray-800'>
						{String(node.value)}
					</div>
				)
		}
	}

	return (
		<div className='w-full max-w-6xl mx-auto p-5'>
			<div className='text-center mb-8 pb-4 border-b-2 border-gray-200'>
				<h3 className='text-gray-800 text-2xl font-semibold mb-2'>
					<div className='flex items-center justify-center gap-1.5 mb-2'>
						<Database /> Данные от сервера
					</div>
				</h3>
				<div className='text-gray-500 text-sm'>
					{new Date().toLocaleString('ru-RU')}
				</div>
			</div>

			<div className='flex flex-col gap-6'>
				<div className='bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-lg'>
					<h4 className='text-lg font-medium mb-5'>Входные данные</h4>
					<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5'>
						{formatDataNodes(data)
							.filter(
								node =>
									node.id === 'clientUUID' ||
									node.id === 'interval' ||
									node.id === 'count'
							)
							.map((node, index) => (
								<div
									key={node.id}
									className={`bg-white rounded-xl p-5 shadow-lg transition-all duration-300 transform ${
										visibleCards.has(node.id)
											? 'opacity-100 translate-y-0 scale-100'
											: 'opacity-0 translate-y-5 scale-95'
									} hover:translate-y-[-4px] hover:shadow-xl hover:border-blue-500 border-2 border-transparent`}
									style={{
										transitionDelay: `${index * 150}ms`,
									}}
								>
									<div className='flex justify-between items-center mb-3'>
										<span className='font-semibold text-gray-800'>
											{node.label}
										</span>
										<div
											className='w-5 h-5borderflex items-center justify-center text-xs text-gray-500 cursor-help  transition-colors'
											title={node.description}
										>
											<Info className='w-5 h-5' />
										</div>
									</div>
									{renderValue(node)}
								</div>
							))}
					</div>
				</div>

				{/* Подробная схема алгоритма сервера */}
				<div className='bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl shadow-lg p-6 border border-indigo-200'>
					<h4 className='text-lg font-medium mb-5 text-gray-800 flex items-center gap-2'>
						<div className='w-3 h-3 bg-indigo-500 rounded-full animate-pulse'></div>
						Подробная схема алгоритма сервера
					</h4>

					{/* Процесс серверного алгоритма */}
					<div className='space-y-4'>
						{/* Шаг 1: Получение и декодирование энтропии */}
						<div className='bg-white rounded-lg p-4 border-l-4 border-blue-500 shadow-sm'>
							<div className='flex items-center gap-3 mb-2'>
								<div className='w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold'>
									1
								</div>
								<h5 className='font-semibold text-gray-800'>
									Декодирование энтропии
								</h5>
							</div>
							<div className='ml-11 space-y-2'>
								<p className='text-sm text-gray-600'>
									<strong>encryptedEntropy</strong> декодируется приватным ключом
									сервера
								</p>
								<div className='bg-gray-900 text-green-400 p-3 rounded font-mono text-xs'>
									<div className='text-blue-300'>Input:</div>
									<div className='text-yellow-300 ml-2'>
										encryptedEntropy = &quot;
										{data.inputLayer.encryptedEntropy.substring(0, 16)}...&quot;
									</div>
									<div className='text-blue-300 mt-1'>Process:</div>
									<div className='text-green-300 ml-2'>
										decrypt(encryptedEntropy, privateKey) → entropyId
									</div>
								</div>
							</div>
						</div>

						{/* Шаг 2: Получение данных энтропии */}
						<div className='bg-white rounded-lg p-4 border-l-4 border-purple-500 shadow-sm'>
							<div className='flex items-center gap-3 mb-2'>
								<div className='w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold'>
									2
								</div>
								<h5 className='font-semibold text-gray-800'>
									Получение энтропийных данных
								</h5>
							</div>
							<div className='ml-11 space-y-2'>
								<p className='text-sm text-gray-600'>
									Сервер получает истинно случайные данные от внешнего источника
									энтропии
								</p>
								<div className='bg-gray-900 text-green-400 p-3 rounded font-mono text-xs'>
									<div className='text-blue-300'>Source:</div>
									<div className='text-yellow-300 ml-2'>Hardware Entropy</div>
									<div className='text-blue-300 mt-1'>Data:</div>
									<div className='text-green-300 ml-2 break-all'>
										{data.outputLayer.entropy.data.substring(0, 32)}...
									</div>
									<div className='text-blue-300 mt-1'>URL:</div>
									<div className='text-purple-300 ml-2 break-all'>
										<a
											href={data.outputLayer.entropy.url}
											target='_blank'
											rel='noopener noreferrer'
											className='underline'
										>
											{data.outputLayer.entropy.url}
										</a>
									</div>
								</div>
							</div>
						</div>

						{/* Шаг 3: Генерация Genesis Hash */}
						<div className='bg-white rounded-lg p-4 border-l-4 border-green-500 shadow-sm'>
							<div className='flex items-center gap-3 mb-2'>
								<div className='w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold'>
									3
								</div>
								<h5 className='font-semibold text-gray-800'>
									Генерация Genesis Hash
								</h5>
							</div>
							<div className='ml-11 space-y-2'>
								<p className='text-sm text-gray-600'>
									Комбинирование энтропийных данных с клиентским UUID через
									SHA-512
								</p>
								<div className='bg-gray-900 text-green-400 p-3 rounded font-mono text-xs'>
									<div className='text-blue-300'>Algorithm:</div>
									<div className='text-yellow-300 ml-2'>SHA-512</div>
									<div className='text-blue-300 mt-1'>Input:</div>
									<div className='text-green-300 ml-2'>data + clientUUID</div>
									<div className='text-blue-300 mt-1'>Output:</div>
									<div className='text-red-300 ml-2 break-all'>
										genesisHash = &quot;
										{data.outputLayer.genesisHash.substring(0, 32)}...&quot;
									</div>
									<div className='text-gray-400 text-xs mt-2 ml-2'>
										&#47;&#47; Защищает от подбора хэша злоумышленниками
									</div>
								</div>
							</div>
						</div>

						{/* Шаг 4: Генерация случайных чисел */}
						<div className='bg-white rounded-lg p-4 border-l-4 border-orange-500 shadow-sm'>
							<div className='flex items-center gap-3 mb-2'>
								<div className='w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-bold'>
									4
								</div>
								<h5 className='font-semibold text-gray-800'>
									Генерация случайных чисел
								</h5>
							</div>
							<div className='ml-11 space-y-2'>
								<p className='text-sm text-gray-600'>
									Генерация детерминированных случайных чисел в указанном
									диапазоне
								</p>
								<div className='bg-gray-900 text-green-400 p-3 rounded font-mono text-xs'>
									<div className='text-blue-300'>Parameters:</div>
									<div className='text-yellow-300 ml-2'>
										Range: [{data.inputLayer.interval[0]},{' '}
										{data.inputLayer.interval[1]}]
									</div>
									<div className='text-yellow-300 ml-2'>
										Count: {data.inputLayer.count} numbers
									</div>
									<div className='text-blue-300 mt-1'>Seed:</div>
									<div className='text-green-300 ml-2'>
										genesisHash (512-bit)
									</div>
									<div className='text-blue-300 mt-1'>Result:</div>
									<div className='flex flex-wrap gap-1 mt-2'>
										{data.outputLayer.outputValues.length > 100
											? data.outputLayer.outputValues.slice(0, 5).map((val, idx) => (
													<span
														key={idx}
														className='bg-orange-600 text-white px-2 py-1 rounded text-xs'
													>
														{val}
													</span>
												))
											: data.outputLayer.outputValues.map((val, idx) => (
													<span
														key={idx}
														className='bg-orange-600 text-white px-2 py-1 rounded text-xs'
													>
														{val}
													</span>
												))}
										{data.outputLayer.outputValues.length > 100 && (
											<span className='text-gray-400 text-xs mt-1'>
												... и {data.outputLayer.outputValues.length - 5} скрыто
											</span>
										)}
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>

				<div className='bg-white rounded-xl shadow-lg p-6'>
					<h4 className='text-lg font-medium mb-5 text-gray-800'>
						Выходные данные
					</h4>
					<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5'>
						{formatDataNodes(data)
							.filter(
								node =>
									node.id !== 'clientUUID' &&
									node.id !== 'interval' &&
									node.id !== 'count'
							)
							.map((node, index) => (
								<div
									key={node.id}
									className={`bg-white rounded-xl p-5 shadow-lg border-2 transition-all duration-300 transform ${
										visibleCards.has(node.id)
											? 'opacity-100 translate-y-0 scale-100 border-gray-200'
											: 'opacity-0 translate-y-5 scale-95 border-transparent'
									} hover:translate-y-[-4px] hover:shadow-xl hover:border-blue-500`}
									style={{
										transitionDelay: `${(index + 3) * 150}ms`,
									}}
								>
									<div className='flex justify-between items-center mb-3'>
										<span className='font-semibold text-gray-800'>
											{node.label}
										</span>
										<div
											className='w-5 h-5 flex items-center justify-center text-xs text-gray-500 cursor-help transition-colors'
											title={node.description}
										>
											<InfoIcon className='w-5 h-5 ' />
										</div>
									</div>
									{renderValue(node)}
								</div>
							))}
					</div>
				</div>
			</div>
		</div>
	)
}

export default ServerDataVisualization
