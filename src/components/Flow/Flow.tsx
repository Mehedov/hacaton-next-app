import {
	Background,
	MarkerType,
	Node,
	Position,
	ReactFlow,
	useConnection,
} from '@xyflow/react'

import { useCallback, useState, useEffect } from 'react'
import { AnnotationNode } from './AnnotationNode'

import '@xyflow/react/dist/style.css'

const nodeTypes = {
	annotation: AnnotationNode,
}

const connectionAnnotation = {
	id: 'connection-annotation',
	type: 'annotation',
	selectable: false,
	data: {
		label: 'this is a "connection"',
		arrowStyle: 'arrow-top-left',
	},
	position: { x: 0, y: 0 },
}

const initialNodes = [
	{
		id: '1-1',
		type: 'default',
		data: {
			label: 'API Nist',
		},
		position: { x: 0, y: -150 },
		sourcePosition: Position.Bottom,
		targetPosition: Position.Top,
	},
	{
		id: '1-2',
		type: 'default',
		data: {
			label: 'Entropy',
		},
		position: { x: 0, y: 0 },
		sourcePosition: Position.Right,
		targetPosition: Position.Top,
		style: {
			backgroundColor: '#ef4444',
			color: 'white',
			border: '2px solid #dc2626',
		},
	},
	{
		id: '2-2',
		type: 'default',
		data: {
			label: 'Genesis Hash',
		},
		position: { x: 300, y: 0 },
		sourcePosition: Position.Right,
		targetPosition: Position.Left,
	},
	{
		id: '3-2',
		type: 'default',
		data: {
			label: 'Out',
		},
		position: { x: 550, y: -200 },
		sourcePosition: Position.Right,
		targetPosition: Position.Left,
	},
	{
		id: '4-2',
		type: 'default',
		data: {
			label: 'Entropy + UUID',
		},
		position: { x: 800, y: 0 },
		sourcePosition: Position.Right,
		targetPosition: Position.Left,
		style: {
			backgroundColor: '#8b5cf6',
			color: 'white',
			border: '2px solid #7c3aed',
		},
	},
	{
		id: '5-0',
		type: 'default',
		data: {
			label: 'UUID Server',
		},
		position: { x: 0, y: 150 },
		sourcePosition: Position.Right,
		targetPosition: Position.Bottom,
		style: {
			backgroundColor: '#ef4444',
			color: 'white',
			border: '2px solid #dc2626',
		},
	},
	{
		id: '5-2',
		type: 'default',
		data: {
			label: 'extra_salt',
		},
		position: { x: 200, y: 150 },
		sourcePosition: Position.Right,
		targetPosition: Position.Left,
		style: {
			backgroundColor: '#22c55e',
			color: 'white',
			border: '2px solid #16a34a',
		},
	},
	{
		id: '5-1',
		type: 'default',
		data: {
			label: 'UUID Client',
		},
		position: { x: 400, y: 150 },
		targetPosition: Position.Left,
		style: {
			backgroundColor: '#22c55e',
			color: 'white',
			border: '2px solid #16a34a',
		},
	},
	{
		id: '5-3',
		type: 'default',
		data: {
			label: 'UUID Server hash',
		},
		position: { x: 0, y: 250 },
		sourcePosition: Position.Top,
		targetPosition: Position.Right,
		style: {
			backgroundColor: '#ef4444',
			color: 'white',
			border: '2px solid #dc2626',
		},
	},
	{
		id: '5-5',
		type: 'default',
		data: {
			label: 'Client',
		},
		position: { x: 200, y: 250 },
		sourcePosition: Position.Left,
		targetPosition: Position.Right,
		style: {
			backgroundColor: '#22c55e',
			color: 'white',
			border: '2px solid #16a34a',
		},
	},
]

const initialEdges = [
	{
		id: 'e1-2',
		source: '1-1',
		target: '1-2',
		// label: 'edge label',
		type: 'smoothstep',
	},
	{
		id: 'e1-3',
		source: '1-2',
		target: '2-2',
		type: 'smoothstep',
		markerEnd: {
			type: MarkerType.ArrowClosed,
		},
	},
	{
		id: 'e2-3',
		source: '2-2',
		target: '3-2',
		type: 'smoothstep',
		markerEnd: {
			type: MarkerType.ArrowClosed,
		},
	},
	{
		id: 'e3-4',
		source: '3-2',
		target: '4-2',
		type: 'smoothstep',
		markerEnd: {
			type: MarkerType.ArrowClosed,
		},
	},
	{
		id: 'e5-0-5-2',
		source: '5-0',
		target: '5-2',
		type: 'smoothstep',
		markerEnd: {
			type: MarkerType.ArrowClosed,
		},
	},
	{
		id: 'e5-2-5-1',
		source: '5-2',
		target: '5-1',
		type: 'smoothstep',
		markerEnd: {
			type: MarkerType.ArrowClosed,
		},
	},
	{
		id: 'e5-2',
		source: '5-2',
		target: '2-2',
		type: 'smoothstep',
		markerEnd: {
			type: MarkerType.ArrowClosed,
		},
	},
	{
		id: 'e5-3-5-0',
		target: '5-0',
		source: '5-3',
		type: 'smoothstep',
		markerEnd: {
			type: MarkerType.ArrowClosed,
		},
	},
	{
		id: 'e5-4-5-3',
		source: '5-4',
		target: '5-3',
		type: 'smoothstep',
		markerEnd: {
			type: MarkerType.ArrowClosed,
		},
	},
	{
		id: 'e5-1-5-5',
		source: '5-1',
		target: '5-5',
		type: 'smoothstep',
		markerEnd: {
			type: MarkerType.ArrowClosed,
		},
	},
	{
		id: 'e5-3-5-5',
		source: '5-5',
		target: '5-3',
		type: 'smoothstep',
		markerEnd: {
			type: MarkerType.ArrowClosed,
		},
	},
]

export default function Flow() {
	const [nodes, setNodes] = useState<Node[]>(initialNodes.map(node => ({ ...node, style: { ...node.style, opacity: 0 } })))
	const [edges, setEdges] = useState(initialEdges)
	const [visibleNodes, setVisibleNodes] = useState<string[]>([])
	const connection = useConnection()

	useEffect(() => {
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
	}, [])

	// Обновляем opacity узлов на основе visibleNodes
	useEffect(() => {
		setNodes(prevNodes =>
			prevNodes.map(node => ({
				...node,
				style: {
					...node.style,
					opacity: visibleNodes.includes(node.id) ? 1 : 0,
					transition: 'opacity 0.5s ease-in-out'
				}
			}))
		)
	}, [visibleNodes])
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
		<div style={{ width: '100%', height: '400px' }} onMouseMove={onMouseMove}>
			<ReactFlow
				nodes={nodes}
				edges={edges}
				nodeTypes={nodeTypes}
				onConnectEnd={onConnectEnd}
				fitView
				preventScrolling={false}
			>
				<Background />
			</ReactFlow>
		</div>
	)
}
