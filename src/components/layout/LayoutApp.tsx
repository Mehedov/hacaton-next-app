'use client'

import { Layout, theme } from 'antd'
import { PropsWithChildren } from 'react'

const { Header, Content } = Layout

const items = Array.from({ length: 15 }).map((_, index) => ({
	key: index + 1,
	label: `nav ${index + 1}`,
}))

const LayoutApp = ({ children }: PropsWithChildren) => {
	const {
		token: { colorBgContainer, borderRadiusLG },
	} = theme.useToken()

	return (
		<Layout>
			<Content className='min-h-screen' style={{ padding: '0 48px' }}>
				<div
					style={{
						background: colorBgContainer,
						minHeight: 280,
						padding: 24,
						borderRadius: borderRadiusLG,
						margin: '16px 0',
					}}
				>
					{children}
				</div>
			</Content>
		</Layout>
	)
}

export default LayoutApp
