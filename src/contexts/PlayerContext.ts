import { createContext} from 'react';

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
    play: (episode: Episode)=> void; 
    setPlayingState: (estate: boolean) => void;
    togglePlay: () => void; 
};

// exporto tipo array de tipagem do play context
export const PlayerContext = createContext({} as PlayerContextData);

