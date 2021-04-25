import '../styles/global.scss'// inporto css, in styles

import { Header } from '../components/Header' // importa para todas telas do meu app
import { Player } from '../components/Player';

import styles from '../styles/app.module.scss';

function MyApp({ Component, pageProps }) {
  return (
    <div className={styles.wrapper}>
      <main>
      <Header />
      <Component {...pageProps} />

      </main>
      <Player />
    </div>
  )
}

export default MyApp
