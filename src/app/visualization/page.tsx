'use client'

import ServerAlgorithmVisualization from '@/components/Flow/ServerAlgorithmVisualization/ServerAlgorithmVisualization'
import ServerDataVisualization from '@/components/Flow/ServerDataVisualization/ServerDataVisualization'
import SoundEffects from '@/components/Flow/SoundEffects/SoundEffects'
import StepByStepVisualization from '@/components/Flow/StepByStepVisualization/StepByStepVisualization'
import { IServerResponse } from '@/types/generate.type'
import {
	CheckCircle,
	Database,
	Home,
	Link as LinkIcon,
	Theater,
} from 'lucide-react'
import Link from 'next/link'
import { Suspense, useEffect, useState } from 'react'
import Cookies from 'js-cookie'

function VisualizationContent() {
	const [data, setData] = useState<IServerResponse | null>(null)
	const [isAnimationPlaying, setIsAnimationPlaying] = useState(false)
	const [currentStep, setCurrentStep] = useState(0)
	const [showTooltips, setShowTooltips] = useState(false)

	// Получаем данные из localStorage
	useEffect(() => {
		const dataParam = localStorage.getItem('visualizationData')
		if (dataParam) {
			try {
				const parsedData = JSON.parse(dataParam)
				setData(parsedData)
				// Очищаем localStorage после использования
				localStorage.removeItem('visualizationData')
			} catch (error) {
				console.error('Ошибка парсинга данных:', error)
			}
		}
	}, [])

	const handleToggleAnimation = () => {
		setIsAnimationPlaying(!isAnimationPlaying)
	}

	const handleStepChange = (step: number) => {
		setCurrentStep(step)
	}

	if (!data) {
		return (
			<div className='min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center'>
				<div className='text-center'>
					<div className='w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4'></div>
					<h2 className='text-2xl font-bold text-gray-800 mb-2'>
						Загрузка визуализации
					</h2>
					<p className='text-gray-600'>Нет данных для отображения</p>
				</div>
			</div>
		)
	}

	return (
		<div className='min-h-screen from-slate-50 to-blue-50'>
			{/* Навигация */}
			<div className='bg-white shadow-sm border-b'>
				<div className='max-w-7xl mx-auto px-6 py-4'>
					<div className='flex items-center justify-between'>
						<div>
							<h1 className='text-2xl font-bold text-gray-800 flex items-center gap-2'>
								<Theater className='w-8 h-8 text-purple-600' />
								<span>Визуализация процесса генерации</span>
							</h1>
							<p className='text-gray-600 mt-1'>
								Пошаговое объяснение алгоритма случайных чисел
							</p>
						</div>
						<div className='flex gap-3'>
							<Link
								href='/'
								className='px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold transition-colors duration-200 flex items-center gap-2'
							>
								<Home className='w-5 h-5' />
								<span>На главную</span>
							</Link>
						</div>
					</div>
				</div>
			</div>

			{/* Основное содержимое */}
			<div className='w-full max-w-none mx-auto px-8 py-8 space-y-8'>
				{/* Информация о генерации вверху */}
				<div className='bg-gradient-to-br mt-16 rounded-xl p-8'>
					<div className='max-w-none mx-auto'>
						{/* Заголовок блока */}
						<div className='text-center mb-8'>
							<h3 className='text-3xl font-bold mb-2'>
								<span className='bg-bg-clip-text text-black'>
									Информация о генерации
								</span>
							</h3>
							<div className='w-24 h-1 bg-gradient-to-r from-black to-black mx-auto rounded-full'></div>
						</div>

						{/* Основной блок информации в стиле терминала */}
						<div className='bg-gray-900 border border-gray-600 rounded-xl p-8 shadow-2xl'>
							<div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
								{/* Данные генерации */}
								<div className='text-center lg:text-left'>
									<div className='flex items-center justify-center lg:justify-start gap-3 mb-4'>
										<div className='w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg'>
											<Database className='w-7 h-7 text-white' />
										</div>
										<h4 className='text-xl font-semibold text-gray-200'>
											Данные генерации
										</h4>
									</div>
									<div className='space-y-4'>
										<div className='bg-gray-800 border border-blue-400/30 rounded-lg p-4 hover:border-blue-400/50 transition-colors duration-300'>
											<div className='text-sm font-medium text-blue-400 mb-2 uppercase tracking-wider'>
												Диапазон чисел
											</div>
											<div className='text-xl font-bold text-blue-300'>
												[{data.inputLayer.interval[0]},{' '}
												{data.inputLayer.interval[1]}]
											</div>
										</div>
										<div className='bg-gray-800 border border-green-400/30 rounded-lg p-4 hover:border-green-400/50 transition-colors duration-300'>
											<div className='text-sm font-medium text-green-400 mb-2 uppercase tracking-wider'>
												Количество
											</div>
											<div className='text-xl font-bold text-green-300'>
												{data.inputLayer.count != 1
													? `${data.inputLayer.count} чисел`
													: `${data.inputLayer.count} число`}
											</div>
										</div>
									</div>
								</div>

								{/* Источники энтропии */}
								<div className='text-center lg:text-left'>
									<div className='flex items-center justify-center lg:justify-start gap-3 mb-4'>
										<div className='w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg'>
											<LinkIcon className='w-7 h-7 text-white' />
										</div>
										<h4 className='text-xl font-semibold text-gray-200'>
											Источники энтропии
										</h4>
									</div>
									<div className='space-y-4'>
										<div className='bg-gray-800 border border-purple-400/30 rounded-lg p-4 hover:border-purple-400/50 transition-colors duration-300'>
											<div className='text-sm font-medium text-purple-400 mb-2 uppercase tracking-wider'>
												Аппаратная энтропия
											</div>
											<div className='text-xl font-bold text-purple-300'>
												Hardware Entropy API
											</div>
										</div>
										<div className='bg-gray-800 border border-indigo-400/30 rounded-lg p-4 hover:border-indigo-400/50 transition-colors duration-300'>
											<div className='text-sm font-medium text-indigo-400 mb-2 uppercase tracking-wider'>
												Криптографическое хэширование
											</div>
											<div className='text-xl font-bold text-indigo-300'>
												Genesis Hash (SHA-512)
											</div>
										</div>
									</div>
								</div>

								{/* Результат */}
								<div className='text-center lg:text-left'>
									<div className='flex items-center justify-center lg:justify-start gap-3 mb-4'>
										<div className='w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-500 rounded-xl flex items-center justify-center shadow-lg'>
											<CheckCircle className='w-7 h-7 text-white' />
										</div>
										<h4 className='text-xl font-semibold text-gray-200'>
											Результат генерации
										</h4>
									</div>
									<div className='space-y-4'>
										<div className='bg-gray-800 border border-emerald-400/30 rounded-lg p-4 hover:border-emerald-400/50 transition-colors duration-300'>
											<div className='text-sm font-medium text-emerald-400 mb-2 uppercase tracking-wider'>
												Генерация
											</div>
											<div className='text-xl font-bold text-emerald-300'>
												✓ Успешно завершена
											</div>
										</div>
										<div className='bg-gray-800 border border-gray-400/30 rounded-lg p-4 hover:border-gray-400/50 transition-colors duration-300'>
											<div className='text-sm font-medium text-gray-400 mb-2 uppercase tracking-wider'>
												Криптографическая безопасность
											</div>
											<div className='text-xl font-bold text-gray-300'>
												Высокий уровень
											</div>
										</div>
									</div>
								</div>
							</div>

							{/* Дополнительная информация */}
							<div className='mt-8 pt-6 border-t border-gray-600'>
								<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
									<div className='bg-gradient-to-r from-gray-800 to-gray-700 border border-blue-400/20 rounded-lg p-4 hover:border-blue-400/40 transition-colors duration-300'>
										<h5 className='font-semibold text-blue-400 mb-2 flex items-center gap-2'>
											<div className='w-2 h-2 bg-blue-400 rounded-full'></div>
											Клиентский UUID
										</h5>
										<p className='text-sm text-gray-300 font-mono break-all'>
											{data.inputLayer.clientUUID}
										</p>
									</div>
									<div className='bg-gradient-to-r from-gray-800 to-gray-700 border border-purple-400/20 rounded-lg p-4 hover:border-purple-400/40 transition-colors duration-300'>
										<h5 className='font-semibold text-purple-400 mb-2 flex items-center gap-2'>
											<div className='w-2 h-2 bg-purple-400 rounded-full'></div>
											Entropy Hash
										</h5>
										<p className='text-sm text-gray-300 font-mono break-all'>
											{Cookies.get('entropyHash')}
										</p>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* Две колонки для дополнительных визуализаций (сверху) */}
				{/* Поток энтропии */}

				{/* Server Data Visualization - Подробная схема алгоритма сервера */}
				<div className='bg-white rounded-2xl p-8'>
					<ServerDataVisualization
						data={data}
						isLoading={false}
						error={null}
					/>
				</div>

				{/* Server Algorithm Visualization - Графическая схема алгоритма */}
				<div className='bg-white rounded-2xl p-8'>
					<ServerAlgorithmVisualization
						data={data}
						isVisible={true}
					/>
				</div>

				{/* Пошаговая визуализация (снизу) */}
				<div className='bg-white rounded-2xl p-8'>
					<StepByStepVisualization
						data={data}
						isPlaying={isAnimationPlaying}
						onTogglePlay={handleToggleAnimation}
					/>
				</div>

				{/* Звуковые эффекты */}
				<SoundEffects
					isActive={isAnimationPlaying}
					currentStep={currentStep}
					eventType={isAnimationPlaying ? 'step_change' : 'completion'}
				/>
			</div>
		</div>
	)
}

export default function VisualizationPage() {
	return (
		<Suspense
			fallback={
				<div className='min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center'>
					<div className='text-center'>
						<div className='w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4'></div>
						<h2 className='text-2xl font-bold text-gray-800 mb-2'>
							Загрузка визуализации
						</h2>
						<p className='text-gray-600'>Подготовка данных...</p>
					</div>
				</div>
			}
		>
			<VisualizationContent />
		</Suspense>
	)
}
