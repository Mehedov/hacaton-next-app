'use client'

import {
	Background,
	MarkerType,
	Node,
	ReactFlow,
	useConnection,
} from '@xyflow/react'

import { IServerResponse } from '@/types/generate.type'
import { useCallback, useEffect, useState } from 'react'
import ServerDataVisualization from './ServerDataVisualization/ServerDataVisualization'

import '@xyflow/react/dist/style.css'
import {
	connectionAnnotation,
	initialEdges,
	initialNodes,
	nodeTypes,
} from './flow.data'

interface FlowProps {
	data: IServerResponse | null
}

export default function Flow({ data }: FlowProps) {
	const [nodes, setNodes] = useState<Node[]>(
		initialNodes.map(node => ({
			...node,
			style: {
				...node.style,
				opacity: 0,
			},
		}))
	)

	// Состояние для данных сервера
	const [serverData, setServerData] = useState<IServerResponse | null>(data)
	const [error, setError] = useState<string | null>(null)

	// Define edges type to include all possible style properties
	const [edges, setEdges] = useState<
		{
			id: string
			source: string
			target: string
			type: string
			markerEnd?: {
				type: MarkerType
				width?: number
				height?: number
				color?: string
			}
			style?: {
				opacity: number
				transition?: string
				strokeWidth?: number
				stroke?: string
			}
		}[]
	>(
		initialEdges.map(edge => ({
			...edge,
			style: {
				opacity: 0,
				...edge.style,
			},
		}))
	)

	const [visibleNodes, setVisibleNodes] = useState<string[]>([])
	const [visibleEdges, setVisibleEdges] = useState<string[]>([])
	const connection = useConnection()

	useEffect(() => {
		if (!data) return

		// Сброс анимации
		setVisibleNodes([])
		setVisibleEdges([])

		const nodeOrder = [
			'1-1', // API Nist
			'1-2', // Entropy
			'2-2', // Genesis Hash
			'5-0', // UUID Server
			'5-2', // extra_salt
			'5-1', // UUID Client
			'3-2', // Out
			'4-2', // Entropy + UUID
			'5-3', // UUID Server hash
			'5-5', // Client
		]

		nodeOrder.forEach((nodeId, index) => {
			setTimeout(() => {
				setVisibleNodes(prev => [...prev, nodeId])
			}, index * 500) // 500ms между появлениями узлов
		})

		// Порядок появления рёбер (на основе порядка узлов)
		const edgeOrder = [
			'e1-2', // API Nist -> Entropy
			'e1-3', // Entropy -> Genesis Hash
			'e5-0-5-2', // UUID Server -> extra_salt
			'e5-2-5-1', // extra_salt -> UUID Client
			'e5-2', // extra_salt -> Genesis Hash
			'e2-3', // Genesis Hash -> Out
			'e3-4', // Out -> Entropy + UUID
			'e5-3-5-0', // UUID Server hash -> UUID Server
			'e5-4-5-3', // 5-4 -> UUID Server hash
			'e5-1-5-5', // UUID Client -> Client
			'e5-3-5-5', // Client -> UUID Server hash
		]

		edgeOrder.forEach((edgeId, index) => {
			setTimeout(() => {
				setVisibleEdges(prev => [...prev, edgeId])
			}, nodeOrder.length * 500 + index * 300) // После всех узлов, 300ms между рёбрами
		})
	}, [data])

	// Обновляем opacity узлов на основе visibleNodes
	useEffect(() => {
		setNodes(prevNodes =>
			prevNodes.map(node => ({
				...node,
				style: {
					...node.style,
					opacity: visibleNodes.includes(node.id) ? 1 : 0,
					transition: 'opacity 0.5s ease-in-out',
				},
			}))
		)
	}, [visibleNodes])

	// Обновляем opacity рёбер на основе visibleEdges (используем тот же паттерн что и для узлов)
	useEffect(() => {
		setEdges(prevEdges =>
			prevEdges.map(edge => ({
				...edge,
				style: {
					...edge.style,
					opacity: visibleEdges.includes(edge.id) ? 1 : 0,
					transition: 'opacity 0.5s ease-in-out',
					strokeWidth: edge.style?.strokeWidth || undefined,
					stroke: edge.style?.stroke || undefined,
				},
			}))
		)
	}, [visibleEdges])

	useEffect(() => {
		setServerData(data)
		// Сброс анимации при новых данных
		setVisibleNodes([])
		setVisibleEdges([])
	}, [data])

	const onMouseMove = useCallback(() => {
		if (connection.inProgress) {
			const { from, to } = connection

			const nodePosition = {
				x: to.x,
				y: to.y,
			}

			setNodes(prevNodes => {
				const nodeExists = prevNodes.some(
					node => node.id === 'connection-annotation'
				)

				if (nodeExists) {
					return prevNodes.map(node =>
						node.id === 'connection-annotation'
							? {
									...node,
									position: nodePosition,
									hidden:
										Math.abs(to.y - from.y) < 25 &&
										Math.abs(to.x - from.x) < 25,
							  }
							: node
					)
				} else {
					return [
						...prevNodes,
						{
							...connectionAnnotation,
							position: nodePosition,
							hidden:
								Math.abs(to.y - from.y) < 25 && Math.abs(to.x - from.x) < 25,
						},
					]
				}
			})
		}
	}, [connection])

	const onConnectEnd = useCallback(() => {
		setNodes(prevNodes =>
			prevNodes.filter(node => node.id !== 'connection-annotation')
		)
	}, [])

	return (
		<div className='min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-5'>
			<div className='max-w-9xl mx-auto space-y-6'>
				{/* Data Visualization */}
				<div className='bg-white rounded-xl shadow-lg overflow-hidden'>
					<ServerDataVisualization
						data={serverData}
						isLoading={false}
						error={error}
					/>
				</div>
				{/* Flow Visualization */}
				{serverData && (
					<div className='bg-white rounded-xl shadow-lg p-4 h-[500px] relative overflow-hidden'>
						<ReactFlow
							nodes={nodes}
							edges={edges}
							nodeTypes={nodeTypes}
							onConnectEnd={onConnectEnd}
							fitView
							preventScrolling={false}
							className='bg-transparent'
							onMouseMove={onMouseMove}
						>
							<Background className='bg-gray-50' />
						</ReactFlow>
					</div>
				)}
			</div>
		</div>
	)
}
