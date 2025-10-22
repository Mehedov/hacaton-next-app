'use client'

import React, { useEffect, useRef } from 'react'

interface SoundEffectsProps {
	isActive: boolean
	currentStep: number
	eventType?: 'step_change' | 'data_transform' | 'completion' | 'error'
}

const SoundEffects: React.FC<SoundEffectsProps> = ({
	isActive,
	currentStep,
	eventType = 'step_change',
}) => {
	const audioContextRef = useRef<AudioContext | null>(null)

	useEffect(() => {
		// Инициализация AudioContext
		if (typeof window !== 'undefined' && !audioContextRef.current) {
			audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
		}
	}, [])

	useEffect(() => {
		if (!isActive || !audioContextRef.current) return

		// Создание звукового эффекта на основе типа события
		playSoundEffect(eventType, currentStep)
	}, [isActive, currentStep, eventType])

	const playSoundEffect = (type: string, step: number) => {
		if (!audioContextRef.current) return

		const context = audioContextRef.current
		const oscillator = context.createOscillator()
		const gainNode = context.createGain()

		// Настройка звука в зависимости от типа события
		let frequency: number
		let duration: number
		let waveType: OscillatorType = 'sine'

		switch (type) {
			case 'step_change':
				frequency = 220 + (step * 50) // Разная частота для каждого шага
				duration = 200
				waveType = 'triangle'
				break
			case 'data_transform':
				frequency = 440 + (step * 30)
				duration = 300
				waveType = 'sawtooth'
				break
			case 'completion':
				frequency = 660
				duration = 500
				waveType = 'sine'
				break
			case 'error':
				frequency = 150
				duration = 400
				waveType = 'square'
				break
			default:
				frequency = 330
				duration = 200
		}

		// Настройка осциллятора
		oscillator.type = waveType
		oscillator.frequency.setValueAtTime(frequency, context.currentTime)

		// Настройка усилителя для затухания
		gainNode.gain.setValueAtTime(0.1, context.currentTime)
		gainNode.gain.exponentialRampToValueAtTime(0.01, context.currentTime + duration / 1000)

		// Подключение узлов
		oscillator.connect(gainNode)
		gainNode.connect(context.destination)

		// Воспроизведение
		oscillator.start(context.currentTime)
		oscillator.stop(context.currentTime + duration / 1000)
	}

	const triggerVibration = (pattern: number[]) => {
		if (typeof window !== 'undefined' && 'vibrate' in navigator) {
			navigator.vibrate(pattern)
		}
	}

	// Вибрация при смене шагов
	useEffect(() => {
		if (isActive) {
			triggerVibration([50, 50, 50]) // Короткая вибрация
		}
	}, [currentStep, isActive])

	// Специальная вибрация для завершения
	useEffect(() => {
		if (isActive && eventType === 'completion') {
			triggerVibration([100, 50, 100, 50, 200]) // Длинная вибрация успеха
		}
	}, [eventType, isActive])

	// Заглушка для компонента - звуковые эффекты работают в фоне
	return null
}

export default SoundEffects