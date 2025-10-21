'use client' 

import { RNGData } from '@/types/RNGData.type'
import { animateGraph } from '@/utils/animateGraph.utils'
import { Background, Controls, ReactFlow, Node, Edge } from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { useEffect, useState } from 'react'

const initialNodes: Node[] = [
	{
		id: '1',
		position: { x: 100, y: 100 },
		data: { label: 'Генерация энтропии', details: '' },
		style: { opacity: 0 },
	},
	{
		id: '2',
		position: { x: 400, y: 100 },
		data: { label: 'Сервер (комбинирование)', details: '' },
		style: { opacity: 0 },
	},
	{
		id: '3',
		position: { x: 700, y: 100 },
		data: { label: 'Хэширование (SHA-256)', details: '' },
		style: { opacity: 0 },
	},
	{
		id: '4',
		position: { x: 1000, y: 100 },
		data: { label: 'Финальное число', details: '' },
		style: { opacity: 0 },
	},
]

const initialEdges: Edge[] = [
	{ id: 'e1-2', source: '1', target: '2', animated: false },
	{ id: 'e2-3', source: '2', target: '3', animated: false },
	{ id: 'e3-4', source: '3', target: '4', animated: false },
]

export default function RNGGraph({ data }: { data: RNGData | null }) {
	const [nodes, setNodes] = useState<Node[]>(initialNodes)
	const [edges, setEdges] = useState<Edge[]>(initialEdges)

	useEffect(() => {
		if (data) {
			animateGraph(data, setNodes, setEdges)
		}
	}, [data])

	return (
		<div className='h-[500px] w-full border border-secondary rounded-lg overflow-hidden'>
			<ReactFlow nodes={nodes} edges={edges} fitView>
				<Background />
				<Controls />
			</ReactFlow>
		</div>
	)
}
