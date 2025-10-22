'use client'

import EntropyFlowVisualization from '@/components/Flow/EntropyFlowVisualization/EntropyFlowVisualization'
import InteractiveTooltips from '@/components/Flow/InteractiveTooltips/InteractiveTooltips'
import SoundEffects from '@/components/Flow/SoundEffects/SoundEffects'
import StepByStepVisualization from '@/components/Flow/StepByStepVisualization/StepByStepVisualization'
import { IServerResponse } from '@/types/generate.type'
import {
	CheckCircle,
	Database,
	HelpCircle,
	Home,
	Link as LinkIcon,
	Theater,
} from 'lucide-react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function VisualizationPage() {
	const searchParams = useSearchParams()
	const [data, setData] = useState<IServerResponse | null>(null)
	const [isAnimationPlaying, setIsAnimationPlaying] = useState(false)
	const [currentStep, setCurrentStep] = useState(0)
	const [showTooltips, setShowTooltips] = useState(false)

	// Получаем данные из URL параметров
	useEffect(() => {
		const dataParam = searchParams.get('data')
		if (dataParam) {
			try {
				const parsedData = JSON.parse(decodeURIComponent(dataParam))
				setData(parsedData)
			} catch (error) {
				console.error('Ошибка парсинга данных:', error)
			}
		}
	}, [searchParams])

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
		<div className='min-h-screen bg-gradient-to-br from-slate-50 to-blue-50'>
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
							<button
								onClick={() => setShowTooltips(!showTooltips)}
								className={`flex items-center gap-1.5 px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${
									showTooltips
										? 'bg-purple-500 hover:bg-purple-600 text-white'
										: 'bg-gray-200 hover:bg-gray-300 text-gray-700'
								}`}
							>
								{showTooltips ? (
									<>
										<span>Скрыть подсказки</span>
										<HelpCircle className='w-5 h-5' />
									</>
								) : (
									<>
										<HelpCircle className='w-5 h-5' />
										<span>Показать подсказки</span>
									</>
								)}
							</button>
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
			<div className='w-full mx-auto px-6 py-8 space-y-8'>
				{/* Две колонки для дополнительных визуализаций (сверху) */}
				{/* Поток энтропии */}
				<div className='bg-white rounded-2xl shadow-lg p-8'>
					<h3 className='text-xl font-bold text-gray-800 mb-6 text-center'>
						🌊 Визуализация потока энтропии
					</h3>
					<EntropyFlowVisualization data={data} isActive={isAnimationPlaying} />
				</div>

				{/* Пошаговая визуализация (снизу) */}
				<div className='bg-white rounded-2xl shadow-lg p-8'>
					<StepByStepVisualization
						data={data}
						isPlaying={isAnimationPlaying}
						onTogglePlay={handleToggleAnimation}
					/>
				</div>

				{/* Интерактивные подсказки */}
				{showTooltips && (
					<div className='bg-white rounded-2xl shadow-lg p-8 border-2 border-purple-200'>
						<InteractiveTooltips
							data={data}
							currentStep={currentStep}
							isVisible={showTooltips}
							onStepChange={handleStepChange}
						/>
					</div>
				)}

				{/* Звуковые эффекты */}
				<SoundEffects
					isActive={isAnimationPlaying}
					currentStep={currentStep}
					eventType={isAnimationPlaying ? 'step_change' : 'completion'}
				/>
			</div>

			{/* Футер с информацией */}
			<div className='bg-white border-t mt-16'>
				<div className='max-w-7xl mx-auto px-6 py-8'>
					<div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
						<div className='text-center'>
							<h4 className='font-semibold text-gray-800 mb-2 flex items-center gap-2'>
								<Database className='w-5 h-5' />
								<span>Данные генерации</span>
							</h4>
							<p className='text-sm text-gray-600'>
								Диапазон: [{data.inputLayer.interval[0]},{' '}
								{data.inputLayer.interval[1]}]
							</p>
							<p className='text-sm text-gray-600'>
								Количество: {data.inputLayer.count} чисел
							</p>
						</div>
						<div className='text-center'>
							<h4 className='font-semibold text-gray-800 mb-2 flex items-center gap-2'>
								<LinkIcon className='w-5 h-5' />
								<span>Источники энтропии</span>
							</h4>
							<p className='text-sm text-gray-600'>NIST API + Genesis Hash</p>
							<p className='text-sm text-gray-600'>
								Дополнительная соль: {data.outputLayer.extraSalt.length}{' '}
								символов
							</p>
						</div>
						<div className='text-center'>
							<h4 className='font-semibold text-gray-800 mb-2 flex items-center gap-2'>
								<CheckCircle className='w-5 h-5' />
								<span>Результат</span>
							</h4>
							<p className='text-sm text-gray-600'>
								Генерация завершена успешно
							</p>
							<p className='text-sm text-gray-600'>
								Время: {new Date().toLocaleTimeString('ru-RU')}
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
