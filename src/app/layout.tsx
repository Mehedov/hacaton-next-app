import LayoutApp from '@/components/layout/LayoutApp'
import { ReactFlowProvider } from '@xyflow/react'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { QueryProvider } from '@/providers/QueryProvider'
import { ReduxProvider } from '@/providers/ReduxProvider'

export const geistSans = Geist({
	variable: '--font-geist-sans',
	subsets: ['latin'],
})

export const geistMono = Geist_Mono({
	variable: '--font-geist-mono',
	subsets: ['latin'],
})

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang='en'>
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased`}
			>
				<ReduxProvider>
					<ReactFlowProvider>
						<QueryProvider>
							<LayoutApp>{children}</LayoutApp>
						</QueryProvider>
					</ReactFlowProvider>
				</ReduxProvider>
			</body>
		</html>
	)
}
