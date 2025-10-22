'use client'

import React, { useEffect, useState, useCallback } from 'react'
import { IServerResponse } from '@/types/generate.type'
import { Waves, Activity } from 'lucide-react'

interface EntropyFlowVisualizationProps {
	data: IServerResponse | null
	isActive: boolean
}

interface Particle {
	id: number
	x: number
	y: number
	vx: number
	vy: number
	life: number
	maxLife: number
	size: number
	color: string
}

const EntropyFlowVisualization: React.FC<EntropyFlowVisualizationProps> = ({
	data,
	isActive,
}) => {
	const [particles, setParticles] = useState<Particle[]>([])

	// Создание частиц энтропии
	const createEntropyParticles = useCallback(() => {
		if (!data || !isActive) return

		const newParticles: Particle[] = []
		const entropyData = data.outputLayer.entropyData.data

		// Создаем частицы на основе энтропийных данных (уменьшено количество)
		for (let i = 0; i < 8; i++) {
			const entropyChar = entropyData[i % entropyData.length]
			const entropyValue = entropyChar.charCodeAt(0)

			newParticles.push({
				id: Date.now() + i,
				x: Math.random() * 100,
				y: -10,
				vx: (entropyValue % 10 - 5) * 0.5,
				vy: 2 + Math.random() * 3,
				life: 0,
				maxLife: 100 + (entropyValue % 50),
				size: 2 + (entropyValue % 8),
				color: `hsl(${entropyValue % 360}, 70%, 60%)`,
			})
		}

		setParticles(prev => [...prev, ...newParticles])
	}, [data, isActive])

	// Анимация частиц
	useEffect(() => {
		if (!isActive) {
			setParticles([])
			return
		}

		const animate = () => {
			setParticles(prevParticles => {
				const updatedParticles = prevParticles
					.map(particle => ({
						...particle,
						x: particle.x + particle.vx,
						y: particle.y + particle.vy,
						life: particle.life + 1,
						vx: particle.vx * 0.99, // Замедление
						vy: particle.vy * 0.98,
					}))
					.filter(particle => particle.life < particle.maxLife && particle.y < 110)

				return updatedParticles
			})

			requestAnimationFrame(animate)
		}

		const interval = setInterval(createEntropyParticles, 300)
		const frameId = requestAnimationFrame(animate)

		return () => {
			clearInterval(interval)
			if (frameId) {
				cancelAnimationFrame(frameId)
			}
		}
	}, [isActive, data, createEntropyParticles])

	// Генерация волн энтропии
	const generateEntropyWaves = () => {
		if (!data || !isActive) return null

		const entropyData = data.outputLayer.entropyData.data
		const waveCount = Math.min(entropyData.length, 20)

		return (
			<div className='absolute inset-0 overflow-hidden pointer-events-none'>
				{[...Array(waveCount)].map((_, index) => {
					const entropyChar = entropyData[index]
					const entropyValue = entropyChar.charCodeAt(0)
					const delay = (index * 100) % 3000
					const duration = 2000 + (entropyValue % 1000)

					return (
						<div
							key={index}
							className='absolute bottom-0 left-1/2 transform -translate-x-1/2'
							style={{
								animation: `entropyWave ${duration}ms ease-in-out ${delay}ms`,
							}}
						>
							{/* Волна энтропии */}
							<div
								className='w-96 h-1 rounded-full opacity-30 animate-pulse'
								style={{
									background: `linear-gradient(90deg, 
										${`hsl(${entropyValue % 360}, 70%, 50%)`}, 
										${`hsl(${(entropyValue + 60) % 360}, 70%, 60%)`}, 
										${`hsl(${(entropyValue + 120) % 360}, 70%, 50%)`})`,
									boxShadow: `0 0 20px ${`hsl(${entropyValue % 360}, 70%, 50%)`}`,
								}}
							></div>

							{/* Частицы-искры */}
							<div className='absolute top-0 left-1/2 transform -translate-x-1/2'>
								{[...Array(3)].map((_, sparkIndex) => (
									<div
										key={sparkIndex}
										className='absolute w-1 h-1 bg-yellow-300 rounded-full animate-ping'
										style={{
											left: `${-20 + sparkIndex * 8}px`,
											animationDelay: `${sparkIndex * 100}ms`,
											animationDuration: '0.8s',
										}}
									></div>
								))}
							</div>
						</div>
					)
				})}
			</div>
		)
	}

	if (!data || !isActive) {
		return null
	}

	return (
		<div className='relative w-full h-64 bg-gradient-to-t from-gray-900 via-gray-800 to-transparent overflow-hidden'>
			{/* Заголовок */}
			<div className='absolute top-4 left-4 z-10'>
				<h4 className='text-white text-lg font-bold mb-1 flex items-center gap-2'>
					<Waves className="w-5 h-5" />
					<span>Поток энтропии</span>
				</h4>
				<p className='text-gray-300 text-sm'>
					Визуализация энтропийных данных от NIST
				</p>
			</div>

			{/* Энтропийные волны */}
			{generateEntropyWaves()}

			{/* Плавающие частицы */}
			<div className='absolute inset-0'>
				{particles.map(particle => (
					<div
						key={particle.id}
						className='absolute rounded-full transition-opacity duration-200'
						style={{
							left: `${particle.x}%`,
							top: `${particle.y}%`,
							width: `${particle.size}px`,
							height: `${particle.size}px`,
							backgroundColor: particle.color,
							opacity: (1 - particle.life / particle.maxLife) * 0.8,
							boxShadow: `0 0 ${particle.size * 2}px ${particle.color}`,
						}}
					/>
				))}
			</div>

			{/* Индикатор источника энтропии */}
			<div className='absolute bottom-4 right-4'>
				<div className='bg-black bg-opacity-50 text-white px-3 py-2 rounded-lg text-sm'>
					<div className='flex items-center gap-2'>
						<Activity className="w-4 h-4 text-green-400" />
						<span>Источник: {data.outputLayer.entropyData.url}</span>
					</div>
				</div>
			</div>

			{/* CSS для анимации волн */}
			<style jsx>{`
				@keyframes entropyWave {
					0% {
						transform: translateX(-50%) scaleX(0) scaleY(0);
						opacity: 0;
					}
					10% {
						opacity: 1;
					}
					50% {
						transform: translateX(-50%) scaleX(1) scaleY(1);
						opacity: 0.8;
					}
					100% {
						transform: translateX(-50%) scaleX(2) scaleY(0.5);
						opacity: 0;
					}
				}
			`}</style>
		</div>
	)
}

export default EntropyFlowVisualization