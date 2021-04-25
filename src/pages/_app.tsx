import '../styles/global.scss'// inporto css, in styles

import { Header } from '../components/Header' // importa para todas telas do meu app
import { Player } from '../components/Player';
import { PlayerContext } from '../contexts/PlayerContext';

import styles from '../styles/app.module.scss';
import React, { useState } from 'react';


function MyApp({ Component, pageProps }) {
  const [episodeList, setEpisodeList] = useState([]);
  const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  
  function play(episode ){
    setEpisodeList([episode]);
    setCurrentEpisodeIndex(0);
    setIsPlaying(true);
  }

  function togglePlay(){ // [togglePlay]-se estiver tocando pauso, senão play
    setIsPlaying(!isPlaying); //[! se não for play set play]
  }  

  function setPlayingState(state: boolean) { // validar se estado play esta tocanco ou não
   setIsPlaying(state);
  }

  return (
   <PlayerContext.Provider value={{ episodeList, currentEpisodeIndex, play, isPlaying, togglePlay, setPlayingState }}>
     <div className={styles.wrapper}>
       <main>
        <Header />
        <Component {...pageProps} />

       </main>
       <Player />
     </div>
    </PlayerContext.Provider>
  )
}

export default MyApp
