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
		id: 'annotation-1',
		type: 'annotation',
		draggable: false,
		selectable: false,
		data: {
			label: 'This is a "node"',
			arrowStyle: 'arrow-bottom-right',
		},
		position: { x: -65, y: -50 },
		measured: { width: 200, height: 50 },
		style: {
			opacity: 1,
		},
	},
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
		id: 'annotation-api',
		type: 'annotation',
		draggable: false,
		selectable: false,
		data: {
			label: 'NIST API provides entropy data',
			arrowStyle: 'arrow-bottom-right',
		},
		position: { x: 50, y: -170 },
		measured: { width: 200, height: 50 },
		style: {
			opacity: 1,
		},
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
		id: 'annotation-entropy',
		type: 'annotation',
		draggable: false,
		selectable: false,
		data: {
			label: 'Entropy from NIST API',
			arrowStyle: 'arrow-top-left',
		},
		position: { x: -100, y: -20 },
		measured: { width: 200, height: 50 },
		style: {
			opacity: 1,
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
		markerEnd: {
			type: MarkerType.ArrowClosed,
			width: 20,
			height: 20,
			color: '#FF0072',
		},
	},
	{
		id: 'annotation-genesis',
		type: 'annotation',
		draggable: false,
		selectable: false,
		data: {
			label: 'Initial blockchain hash',
			arrowStyle: 'arrow-top-right',
		},
		position: { x: 350, y: -50 },
		measured: { width: 200, height: 50 },
		style: {
			opacity: 1,
		},
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
		id: 'annotation-out',
		type: 'annotation',
		draggable: false,
		selectable: false,
		data: {
			label: 'Output of entropy processing',
			arrowStyle: 'arrow-bottom-left',
		},
		position: { x: 600, y: -150 },
		style: {
			opacity: 1,
		},
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
		id: 'annotation-entropy-uuid',
		type: 'annotation',
		draggable: false,
		selectable: false,
		data: {
			label: 'Combined entropy and UUID',
			arrowStyle: 'arrow-top-left',
		},
		position: { x: 850, y: -50 },
		style: {
			opacity: 1,
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
		id: 'annotation-uuid-server',
		type: 'annotation',
		draggable: false,
		selectable: false,
		data: {
			label: 'Server-generated UUID',
			arrowStyle: 'arrow-top-left',
		},
		position: { x: -100, y: 180 },
		style: {
			opacity: 1,
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
		id: 'annotation-extra-salt',
		type: 'annotation',
		draggable: false,
		selectable: false,
		data: {
			label: 'Additional salt for security',
			arrowStyle: 'arrow-top-left',
		},
		position: { x: 150, y: 180 },
		style: {
			opacity: 1,
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
		id: 'annotation-uuid-client',
		type: 'annotation',
		draggable: false,
		selectable: false,
		data: {
			label: 'Client-generated UUID',
			arrowStyle: 'arrow-top-left',
		},
		position: { x: 350, y: 180 },
		style: {
			opacity: 1,
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
		id: 'annotation-uuid-hash',
		type: 'annotation',
		draggable: false,
		selectable: false,
		data: {
			label: 'Hash of server UUID',
			arrowStyle: 'arrow-bottom-right',
		},
		position: { x: 50, y: 280 },
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
	{
		id: 'annotation-client',
		type: 'annotation',
		draggable: false,
		selectable: false,
		data: {
			label: 'End client application',
			arrowStyle: 'arrow-bottom-left',
		},
		position: { x: 150, y: 280 },
	},
]

export const initialEdges = [
	{
		id: 'e1-2',
		source: '1-1',
		target: '1-2',
		type: 'smoothstep',
		style: { opacity: 0, strokeWidth: undefined, stroke: undefined },
	},
	{
		id: 'e1-3',
		source: '1-2',
		target: '2-2',
		type: 'smoothstep',
	},
	{
		id: 'e2-3',
		source: '2-2',
		target: '3-2',
		type: 'smoothstep',
		markerEnd: {
			type: MarkerType.ArrowClosed,
		},
		style: { opacity: 0, strokeWidth: undefined, stroke: undefined },
	},
	{
		id: 'e3-4',
		source: '3-2',
		target: '4-2',
		type: 'smoothstep',
		markerEnd: {
			type: MarkerType.ArrowClosed,
		},
		style: { opacity: 0, strokeWidth: undefined, stroke: undefined },
	},
	{
		id: 'e5-0-5-2',
		source: '5-0',
		target: '5-2',
		type: 'smoothstep',
		markerEnd: {
			type: MarkerType.ArrowClosed,
		},
		style: { opacity: 0, strokeWidth: undefined, stroke: undefined },
	},
	{
		id: 'e5-2-5-1',
		source: '5-2',
		target: '5-1',
		type: 'smoothstep',
		markerEnd: {
			type: MarkerType.ArrowClosed,
		},
		style: { opacity: 0, strokeWidth: undefined, stroke: undefined },
	},
	{
		id: 'e5-2',
		source: '5-2',
		target: '2-2',
		type: 'smoothstep',
		markerEnd: {
			type: MarkerType.ArrowClosed,
		},
		style: { opacity: 0, strokeWidth: undefined, stroke: undefined },
	},
	{
		id: 'e5-3-5-0',
		target: '5-0',
		source: '5-3',
		type: 'smoothstep',
		markerEnd: {
			type: MarkerType.ArrowClosed,
		},
		style: { opacity: 0, strokeWidth: undefined, stroke: undefined },
	},
	{
		id: 'e5-4-5-3',
		source: '5-4',
		target: '5-3',
		type: 'smoothstep',
		markerEnd: {
			type: MarkerType.ArrowClosed,
		},
		style: { opacity: 0, strokeWidth: undefined, stroke: undefined },
	},
	{
		id: 'e5-1-5-5',
		source: '5-1',
		target: '5-5',
		type: 'smoothstep',
		markerEnd: {
			type: MarkerType.ArrowClosed,
		},
		style: { opacity: 0, strokeWidth: undefined, stroke: undefined },
	},
	{
		id: 'e5-3-5-5',
		source: '5-5',
		target: '5-3',
		type: 'smoothstep',
		markerEnd: {
			type: MarkerType.ArrowClosed,
		},
		style: { opacity: 0, strokeWidth: undefined, stroke: undefined },
	},
	{
		id: 'e5-1-2-2',
		source: '5-1',
		target: '2-2',
		type: 'smoothstep',
		markerEnd: {
			type: MarkerType.ArrowClosed,
			width: 20,
			height: 20,
			color: '#FF0072',
		},
		style: {
			strokeWidth: 2,
			stroke: '#FF0072',
			opacity: 0,
		},
	},
]