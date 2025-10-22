import { MarkerType, Position } from '@xyflow/react'
import AnnotationNode from './AnnotationNode/AnnotationNode'

export const nodeTypes = {
	annotation: AnnotationNode,
}

export const connectionAnnotation = {
	id: 'connection-annotation',
	type: 'annotation',
	selectable: false,
	data: {
		label: 'this is a "connection"',
		arrowStyle: 'arrow-top-left',
	},
	position: { x: 0, y: 0 },
}

export const initialNodes = [
	{
		id: '1',
		type: 'default',
		data: {
			label: 'Сервис получения аппаратной энтропии',
		},
		position: { x: 0, y: 0 },
		sourcePosition: Position.Bottom,
		targetPosition: Position.Top,
		style: {
			backgroundColor: '#ef4444',
			color: 'white',
			border: '2px solid #dc2626',
		},
	},
	{
		id: 'annotation-1',
		type: 'annotation',
		draggable: false,
		selectable: false,
		data: {
			label: 'GET /getEntropyHash',
			arrowStyle: 'arrow-bottom-right',
		},
		position: { x: 50, y: -50 },
		measured: { width: 200, height: 50 },
		style: {
			opacity: 1,
		},
	},
	{
		id: '2',
		type: 'default',
		data: {
			label: 'Entropy data',
		},
		position: { x: 0, y: 150 },
		sourcePosition: Position.Right,
		targetPosition: Position.Left,
		style: {
			backgroundColor: '#8b5cf6',
			color: 'white',
			border: '2px solid #7c3aed',
		},
	},
	{
		id: 'annotation-2',
		type: 'annotation',
		draggable: false,
		selectable: false,
		data: {
			label: 'entropyHash и cryptedEntropy',
			arrowStyle: 'arrow-top-left',
		},
		position: { x: -100, y: 130 },
		measured: { width: 200, height: 50 },
		style: {
			opacity: 1,
		},
	},
	{
		id: '3',
		type: 'default',
		data: {
			label: 'Клиент',
		},
		position: { x: 300, y: 150 },
		sourcePosition: Position.Right,
		targetPosition: Position.Left,
		style: {
			backgroundColor: '#22c55e',
			color: 'white',
			border: '2px solid #16a34a',
		},
	},
	{
		id: 'annotation-3',
		type: 'annotation',
		draggable: false,
		selectable: false,
		data: {
			label: 'POST /fullChain/GenerateRandomNumbers',
			arrowStyle: 'arrow-top-left',
		},
		position: { x: 350, y: 130 },
		measured: { width: 200, height: 50 },
		style: {
			opacity: 1,
		},
	},
	{
		id: '4',
		type: 'default',
		data: {
			label: 'Сервер',
		},
		position: { x: 600, y: 150 },
		sourcePosition: Position.Right,
		targetPosition: Position.Left,
		style: {
			backgroundColor: '#06b6d4',
			color: 'white',
			border: '2px solid #0891b2',
		},
	},
	{
		id: 'annotation-4',
		type: 'annotation',
		draggable: false,
		selectable: false,
		data: {
			label: 'Генерация genesisHash и outputValues',
			arrowStyle: 'arrow-top-left',
		},
		position: { x: 650, y: 130 },
		measured: { width: 200, height: 50 },
		style: {
			opacity: 1,
		},
	},
	{
		id: '5',
		type: 'default',
		data: {
			label: 'Комбинация чисел',
		},
		position: { x: 900, y: 150 },
		sourcePosition: Position.Right,
		targetPosition: Position.Left,
		style: {
			backgroundColor: '#10b981',
			color: 'white',
			border: '2px solid #059669',
		},
	},
	{
		id: 'annotation-5',
		type: 'annotation',
		draggable: false,
		selectable: false,
		data: {
			label: 'Выходные данные',
			arrowStyle: 'arrow-top-left',
		},
		position: { x: 950, y: 130 },
		measured: { width: 200, height: 50 },
		style: {
			opacity: 1,
		},
	},
]

export const initialEdges = [
	{
		id: 'e1-2',
		source: '1',
		target: '2',
		type: 'smoothstep',
		markerEnd: {
			type: MarkerType.ArrowClosed,
		},
	},
	{
		id: 'e2-3',
		source: '2',
		target: '3',
		type: 'smoothstep',
		markerEnd: {
			type: MarkerType.ArrowClosed,
		},
	},
	{
		id: 'e3-4',
		source: '3',
		target: '4',
		type: 'smoothstep',
		markerEnd: {
			type: MarkerType.ArrowClosed,
		},
	},
	{
		id: 'e4-5',
		source: '4',
		target: '5',
		type: 'smoothstep',
		markerEnd: {
			type: MarkerType.ArrowClosed,
		},
	},
]