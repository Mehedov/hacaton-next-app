'use client'

import { geistMono, geistSans } from '@/app/layout'
import { PropsWithChildren } from 'react'

export function Content({ children }: PropsWithChildren<unknown>) {
	return (
		<div
			className={`${geistSans.variable} ${geistMono.variable} antialiased w-full h-full`}
		>
			{children}
		</div>
	)
}
