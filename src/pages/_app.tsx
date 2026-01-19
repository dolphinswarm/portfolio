import Layout from '@/components/Layout';
import '@/styles/globals.scss';
import { SceneVideoProvider } from '@/context/SceneVideoContext';

import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';

import type { AppProps } from 'next/app';

config.autoAddCss = false;

const App = ({ Component, pageProps }: AppProps) => {
	return (
		<SceneVideoProvider>
			<Layout>
				<Component {...pageProps} />
			</Layout>
		</SceneVideoProvider>
	);
};

export default App;
