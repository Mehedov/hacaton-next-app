'use client'

import Flow from '@/components/Flow/Flow'
import { generateRandomBinary } from '@/service/generate.service'
import { useQuery } from '@tanstack/react-query'
import { Button, Card } from 'antd'
import { useState } from 'react'

export default function Page() {
	const [isGenerating, setIsGenerating] = useState(false)
	const [rngData, setRngData] = useState(null)
	const { data } = useQuery({
		queryKey: ['generate'],
		queryFn: () => generateRandomBinary(),
	})

	console.log(data)
	const generateNumber = async () => {
		setIsGenerating(true)
		const res = await fetch('/api/generate', { method: 'POST' })
		const data = await res.json()
		setRngData(data)
		setIsGenerating(false)
	}

	return (
		<div className='p-4 w-full'>
			<Card title='Генерация случайных чисел' className='w-[1150px]'>
				<div className='flex flex-col items-center space-y-4'>
					<Button
						onClick={generateNumber}
						disabled={isGenerating}
						className='hover:bg-primary'
					>
						{isGenerating ? 'Генерация...' : 'Генерировать'}
					</Button>
					<Card title='Визуализация процесса' className='w-full'>
						{/* <RNGGraph data={rngData} /> */}
						<Flow />
					</Card>
				</div>
			</Card>
		</div>
	)
}
