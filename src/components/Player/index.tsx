
import Image from 'next/image';
import { useRef , useEffect, useState } from 'react';
import Slider from 'rc-slider'; // importa bibliteca rc-slider par o player
import 'rc-slider/assets/index.css'; // importar estilização pádrao dentro do pacote rc-slider

import { usePlayer } from '../../contexts/PlayerContext';

import styles from './styles.module.scss'; // importo o Sas Css em componentes\Header
import { convertDurationToTimeString } from '../../utils/convertDurationToTimeString';

export  function Player() { //removido  default - deve ajustar chaves no import {Player}
  const audioRef = useRef<HTMLAudioElement>(null); // [useRef] -crio elemento audio de referencia html no react
  const [ progress, setProgress ] = useState(0);

  const {
    episodeList, 
    currentEpisodeIndex, 
    isPlaying,
    isLooping,
    isShuffling,
    togglePlay,
    toggleLoop,
    toggleShuffle,
    setPlayingState,
    playNext,
    playPrevious,
    hasNext,
    hasPrevious,
    clearPlayingState,
  } = usePlayer();   // add contexts ao componente player - useContext(PlayerContext)
  
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

  
   //dispara valor de progress do episodios
   function setupProgressListener(){
     audioRef.current.currentTime = 0;

     audioRef.current.addEventListener('timeupdate', () => {
       setProgress(Math.floor(audioRef.current.currentTime)); //retorna o tempo atual do player tocando
     });
   }
   // recebo parametros da valor numero de posição do status progress teve alteração no slider
   function handleSeek(amount: number){
    audioRef.current.currentTime = amount;
    setProgress(amount);
   }
   
   function handleEpisodeEnded() { // verificar se o episode finalizou
     if(hasNext){
        playNext()
     }else {
      clearPlayingState()
     }
   }

   // determinar episodio que esta tocando
  const episode = episodeList[currentEpisodeIndex]

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
          <span>{convertDurationToTimeString(progress)}</span> 
            <div className={styles.slider} >
               { episode ? (
                 <Slider 
                   max={episode.duration} // numero de segundos que tenho no episodio
                   value={progress}//tempo que o audio esta sendo reproduzido
                   onChange={handleSeek} // movimento a barra de status progress slider
                   trackStyle={{ backgroundColor: '#04d361'}}// [trackStyle]-add cor corpo barra no style com /progresso
                   railStyle={{ backgroundColor:'#9f75ff'}}  // [railStyle]-add cor corpo barra no style sem /progresso
                   handleStyle={{ borderColor:'#04d361', borderWidth: 4}}  // [trackStyle]-add cor corpo barra no style sem /progresso
                 />
               ) : (
                  <div className={styles.emptySlider} />  
               ) }
            </div>
           <span> {convertDurationToTimeString(episode?.duration ?? 0)}</span>
          </div>
          { episode && (
           <audio 
             src={episode.url}//passo endereço do episodio podcast
             ref={audioRef} // recebo o elektro ref html do audio
             autoPlay //quando selecionar o episodio ja começa tocar
             loop= {isLooping}  //quando seleciona tocar o mesmo episodio continuamente
             onEnded={handleEpisodeEnded} //executado quando audio chegar ao fim
             onPlay={()=> setPlayingState(true)}// executo função verifica estado audioPlay esta tocando
             onPause={()=> setPlayingState(false)}
             onLoadedMetadata={setupProgressListener} //dispara assim que player consegue carregar dados do episorio 
            />
          )}
          <div className={styles.buttons}>
            <button 
             type="button" 
             disabled={!episode || episodeList.length == 1}// desabilito caso for só um episodio
             onClick={toggleShuffle}
             className={isShuffling ? styles.isActive : ''}
            > 
              <img src="/shuffle.svg" alt="Embaralhar" />
            </button>
            <button type="button" onClick={playPrevious} disabled={!episode || !hasPrevious} >
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
            <button type="button" onClick={playNext} disabled={!episode || !hasNext} >
              <img src="/play-next.svg" alt="Tocar proxima" />
            </button>
            <button 
              type="button" 
              disabled={!episode}
              onClick={toggleLoop}
              className={isLooping ? styles.isActive : ''}
            >
              <img src="/repeat.svg" alt="Repetir" />
            </button>

          </div>
        </footer>

      </div> 
    );

}