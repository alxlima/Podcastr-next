import { createContext, useState, ReactNode, useContext } from 'react';

//tipogem de informação de episodio para meu context para o Player
type Episode = {
  title: string;
  members: string;
  thumbnail: string;
  duration: number;
  url: string;  

};

// tipagem de informações para dentro do meu Context
type PlayerContextData = {
    episodeList: Episode[];
    currentEpisodeIndex: number; // é o indice do episodio atual que esta tocando
    isPlaying: boolean; // indentificar se episode esta tocando
    isLooping: boolean;
    isShuffling: boolean;  
    play: (episode: Episode)=> void; 
    playList: (list: Episode[], index: number)=> void; 
    setPlayingState: (estate: boolean) => void;
    togglePlay: () => void; 
    toggleLoop: () => void; 
    toggleShuffle: () => void; 
    playNext: () => void; 
    playPrevious: () => void; 
    clearPlayingState: () => void;
    hasNext: boolean; 
    hasPrevious: boolean; 
};

// exporto tipo array de tipagem do play context
export const PlayerContext = createContext({} as PlayerContextData);

type PlayerContextProviderProps = {
  children: ReactNode; // [ReactNode]- tipagem especifica para carregar qualquer valor dentro conteudo(props) _app
}

//funcionlidades do player
export function PlayerContextProvider({ children }:PlayerContextProviderProps) { //[children]- obtenho todo conteudo(props) _app
  const [episodeList, setEpisodeList] = useState([]);
  const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLooping, setIsLooping] = useState(false);
  const [isShuffling, setIsShuffling] = useState(false);
  
  function play(episode: Episode){
    setEpisodeList([episode]);
    setCurrentEpisodeIndex(0);
    setIsPlaying(true);
  }
  
  function playList(list: Episode[], index: number){ // pego lista Episodio indice do eposidio a tocar
    setEpisodeList(list); //pego lista de episodios
    setCurrentEpisodeIndex(index); // pego episodio do indice ao proximo ser tocado
    setIsPlaying(true); // valido se esta tocando com pausa para comecar com true 
  }

  function togglePlay(){ // [togglePlay]-se estiver tocando pauso, senão play
    setIsPlaying(!isPlaying); //[! se não for play set play]
  }  

  function toggleLoop(){ // [toggleLoop]-tocando em seguencia continua
    setIsLooping(!isLooping); //[! se não for play set play e tocar o mesmo episodio continuamente]
  }
  
  function toggleShuffle(){ // [toggleLoop]-tocando em seguencia continua
    setIsShuffling(!isShuffling); //[! se não for play set play e tocar o mesmo episodio continuamente]
  }  

  function setPlayingState(state: boolean) { // validar se estado play esta tocanco ou não
   setIsPlaying(state);
  }

  function clearPlayingState() { // limpar o player
     setEpisodeList([]);
     setCurrentEpisodeIndex(0);
  }

  const hasPrevious =  currentEpisodeIndex > 0; //var obtenho episodio anterior
  const hasNext = isShuffling || (currentEpisodeIndex + 1) < episodeList.length //var obtenho proximo episodio

  function playNext(){ 
    if(isShuffling){
      const nextRandomEpisodeIndex = Math.floor(Math.random() * episodeList.length) // obtenho episodio aleatorio multiplicado pela lista geral
      setCurrentEpisodeIndex(nextRandomEpisodeIndex); // obtenho o prox. episodio apartir do indice tocando

    }else if (hasNext) {
      setCurrentEpisodeIndex(currentEpisodeIndex + 1);  // pego episodio indice que esta tocando e somo obtendo  o proxima episodio a tocar
    } 
  }

  function playPrevious(){
    if (hasPrevious){
      setCurrentEpisodeIndex(currentEpisodeIndex - 1);
    }
  }

  return (
   <PlayerContext.Provider 
    value={{ 
      episodeList, 
      currentEpisodeIndex, 
      play, 
      playList,
      playNext,
      playPrevious,
      isPlaying, 
      isLooping,
      isShuffling,
      togglePlay, 
      setPlayingState,
      hasNext,
      hasPrevious,
      toggleLoop, 
      toggleShuffle,
      clearPlayingState,
    }}
   >
    {children} 
   </PlayerContext.Provider>
  )

}


// funcion que retorna o userContex do React passando  playerContext  para usePlayer
export const usePlayer = () => {
  return useContext(PlayerContext); //faço o repasso para ser utilizado em outro componente 
}