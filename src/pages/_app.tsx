import '../styles/global.scss'// inporto css, in styles

import { Header } from '../components/Header' // importa para todas telas do meu app
import { Player } from '../components/Player';
//import { PlayerContext } from '../contexts/PlayerContext';

import styles from '../styles/app.module.scss';
import { PlayerContextProvider } from '../contexts/PlayerContext';
//import React, { useState } from 'react';


function MyApp({ Component, pageProps }) {
 return (

   <PlayerContextProvider>
     <div className={styles.wrapper}>
       <main>
        <Header />
        <Component {...pageProps} />
       </main>
       <Player />
     </div>
   </PlayerContextProvider>  
  )
}

export default MyApp
