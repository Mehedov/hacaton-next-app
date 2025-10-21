import { RNGData } from '@/types/RNGData.type'
import { Node, Edge } from '@xyflow/react'
import { Dispatch, SetStateAction } from 'react'

export const animateGraph = (
	data: RNGData,
	setNodes: Dispatch<SetStateAction<Node[]>>,
	setEdges: Dispatch<SetStateAction<Edge[]>>
) => {
	setTimeout(() => {
		setNodes(nds =>
			nds.map(n =>
				n.id === '1'
					? {
							...n,
							data: {
								...n.data,
								label: 'Генерация энтропии',
								details: `Источники: ${data.entropySources.join(', ')}`,
							},
							style: { opacity: 1 },
					  }
					: n
			)
		)
		setEdges(eds =>
			eds.map(e => (e.id === 'e1-2' ? { ...e, animated: true } : e))
		)
	}, 1000)

	setTimeout(() => {
		setNodes(nds =>
			nds.map(n =>
				n.id === '2'
					? {
							...n,
							data: {
								...n.data,
								label: 'Сервер (комбинирование)',
								details: `Комбинировано: ${data.combinedEntropy.slice(
									0,
									20
								)}...`,
							},
							style: { opacity: 1 },
					  }
					: n
			)
		)
		setEdges(eds =>
			eds.map(e => (e.id === 'e2-3' ? { ...e, animated: true } : e))
		)
	}, 2000)

	setTimeout(() => {
		setNodes(nds =>
			nds.map(n =>
				n.id === '3'
					? {
							...n,
							data: {
								...n.data,
								label: 'Хэширование (SHA-256)',
								details: `Хэш: ${data.hash.slice(0, 20)}...`,
							},
							style: { opacity: 1 },
					  }
					: n
			)
		)
		setEdges(eds =>
			eds.map(e => (e.id === 'e3-4' ? { ...e, animated: true } : e))
		)
	}, 3000)

	setTimeout(() => {
		setNodes(nds =>
			nds.map(n =>
				n.id === '4'
					? {
							...n,
							data: {
								...n.data,
								label: 'Финальное число',
								details: `Число: ${data.randomNumber}`,
							},
							style: { opacity: 1, borderColor: 'red' },
					  }
					: n
			)
		)
	}, 4000)
}
