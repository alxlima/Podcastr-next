
import Image from 'next/image';
import { useContext, useRef , useEffect } from 'react';
import Slider from 'rc-slider'; // importa bibliteca rc-slider par o player
import 'rc-slider/assets/index.css'; // importar estilização pádrao dentro do pacote rc-slider

import { PlayerContext } from '../../contexts/PlayerContext';

import styles from './styles.module.scss'; // importo o Sas Css em componentes\Header

export  function Player() { //removido  default - deve ajustar chaves no import {Player}
  const audioRef = useRef<HTMLAudioElement>(null); // [useRef] -crio elemento audio de referencia html no react
  
  const {
    episodeList, 
    currentEpisodeIndex, 
    isPlaying, 
    togglePlay,
    setPlayingState
  } = useContext(PlayerContext) // add contexts ao componente player
  
  // crio evento de play e pause sobre elemento html useREf em audioRef
  useEffect(() => {
     if (!audioRef.current){ //[current] é o valor da referencia
       return; //se não tiver valor, retono nada.
     }
     if (isPlaying){ //se tiver valor, e for true.
       audioRef.current.play(); // pego valor do audio executa na função play
     }else{ //se tiver valor, e isPlaying for false.
       audioRef.current.pause(); // pauso audio
     }
  },[isPlaying])


   // determinar episodio que esta tocando
  const episode = episodeList[currentEpisodeIndex];

  return( 
      <div className={styles.playerContainer}>

        <header>
          <img src="/playing.svg" alt="Tocando agora" />
           <strong>Tocando agora</strong>
        </header>

         { episode ? ( 
            <div className={styles.currentEpisode}>
              <Image 
               width={592}
               height={592} 
               src={episode.thumbnail}
               objectFit='cover'
             />
             <strong>{episode.title}</strong>
             <span>{episode.members}</span>
          </div>
           ) : (
            <div className={styles.emptyPlayer}>
            <strong>Selecione um podcast para ouvir</strong>
            </div>
           ) }
        
        <footer className={!episode ? styles.empty :''}> 
          <div className={styles.progress}>
            <span>00:00</span>
            <div className={styles.slider} >
               { episode ? (
                 <Slider 
                   trackStyle={{ backgroundColor: '#04d361'}}// [trackStyle]-add cor corpo barra no style com /progresso
                   railStyle={{ backgroundColor:'#9f75ff'}}  // [railStyle]-add cor corpo barra no style sem /progresso
                   handleStyle={{ borderColor:'#04d361', borderWidth: 4}}  // [trackStyle]-add cor corpo barra no style sem /progresso
                 />
               ) : (
                  <div className={styles.emptySlider} />  
               ) }
            </div>
            <span>00:00</span>
          </div>
          { episode && (
           <audio 
             src={episode.url}//passo endereço do episodio podcast
             ref={audioRef} // recebo o elektro ref html do audio
             autoPlay //quando selecionar o episodio ja começa tocar
             onPlay={()=> setPlayingState(true)}// executo função verifica estado audioPlay esta tocando
             onPause={()=> setPlayingState(false)}
            />
          )}
          <div className={styles.buttons}>
            <button type="button" disabled={!episode}> 
              <img src="/shuffle.svg" alt="Embaralhar" />
            </button>
            <button type="button" disabled={!episode}>
              <img src="/play-previous.svg" alt="Tocar anterior" />
            </button>
            <button type="button" 
              className={styles.playButton} 
              disabled={!episode}
              onClick={togglePlay}
            >
              { isPlaying 
               ? <img src="/pause.svg" alt="Tocar" />
               : <img src="/play.svg" alt="Tocar" />
               }
            </button>
            <button type="button" disabled={!episode}>
              <img src="/play-next.svg" alt="Tocar proxima" />
            </button>
            <button type="button" disabled={!episode}>
              <img src="/repeat.svg" alt="Repetir" />
            </button>

          </div>
        </footer>

      </div> 
    );

}