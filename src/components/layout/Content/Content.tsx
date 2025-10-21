'use client'

import { geistMono, geistSans } from '@/app/layout'
import { PropsWithChildren } from 'react'

export function Content({ children }: PropsWithChildren<unknown>) {
	// const [timeStamp, setTimeStamp] = useState(0)
	// useEffect(() => {
	// 	if (timeStamp !== 0) {
	// 		localStorage.setItem('timeStamp', timeStamp.toString())
	// 	}
	// }, [])
	return (
		<div
			// onMouseMove={e => setTimeStamp(e.timeStamp)}
			className={`${geistSans.variable} ${geistMono.variable} antialiased w-full h-full`}
		>
			{children}
		</div>
	)
}
