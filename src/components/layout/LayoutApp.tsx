'use client'

import { Layout, theme } from 'antd'
import { PropsWithChildren } from 'react'

const { Content } = Layout

const LayoutApp = ({ children }: PropsWithChildren) => {
	const {
		token: { colorBgContainer, borderRadiusLG },
	} = theme.useToken()

	return (
		<Layout>
			<Content className='min-h-screen' style={{ padding: '0 24px' }}>
				<div
					style={{
						background: colorBgContainer,
						minHeight: 280,
						padding: 12,
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
