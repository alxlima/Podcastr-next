//[slug]- este arquivo tem por objetivo normer os links de episodio com apelido amigavel

import { format, parseISO} from 'date-fns';
import  ptBR  from 'date-fns/locale/pt-BR';
import { GetStaticPaths, GetStaticProps } from 'next';
import { api } from '../../services/api';
import Image  from 'next/image';
import Link from 'next/link';
import { convertDurationToTimeString } from '../../utils/convertDurationToTimeString';
  
import styles from './episode.module.scss';
import { usePlayer } from '../../contexts/PlayerContext';
import React from 'react';
import Head  from 'next/head';

// tipagem de array de episodios
type Episode = {
   id: string;
   title: string;
   thumbnail: string;
   members: string;
   duration: number;
   durationAsString: string;
   url: string;
   publishedAt: Date;
   description: string;
}

//tipagem de episodios do capitulos
type EpisodeProps = {
   episode: Episode;
}

export default function Episode( { episode }: EpisodeProps) {
  const { play } = usePlayer();
     return (
        <div className={styles.episode}>
            <Head> 
              <title>{episode.title} |🎵 Podcastr</title>
            </Head>

           <div className={styles.thumbnailContainer}>
              <Link href="/" >
                <button type="button">
                  <img src="/arrow-left.svg" alt="Voltar" />
                </button>
              </Link>
              <Image 
               width={700} 
               height={160}
               src={episode.thumbnail}
               objectFit='cover' 
              />
             <button type="button" onClick={()=>play(episode)}>
               <img src="/play.svg" alt="Tocar episódio" />
             </button>    
          </div>
         
         <header>
            <h1> {episode.title}</h1>
            <span>{episode.members}</span>
            <span>{episode.publishedAt}</span>
            <span>{episode.durationAsString}</span>
         </header>

         <div 
           className={styles.description} 
           dangerouslySetInnerHTML={{__html: episode.description}} /> 
      </div> //[dangerouslySetInnerHTML] - seto perigosamente o conteudo html, recomendado para paginas estacticas neste caso.
   )
}

export const getStaticPaths: GetStaticPaths =async ()=> { //[getStaticPaths] - uso para paginas statica dinamincas [nome] ex: [slug]
   const { data }= await api.get('episodes', { //[api.get]- pego Url padrão da Api em services/api.ts 
      params: {
        _limit: 2,           //[?_limit=12]- limito registro de podcast para retornar
        _sort: 'published_at',//[&_sort]- ordenação  [published_at]- ordeno por data publicação,
        _order:'desc'         //[&_order=desc]-ordem decrescente 
      }
   }) 
   
   const paths =  data.map(episode => {
    return {
       params: {
         slug: episode.id
      }
    }
   })

   return {
      paths,
      fallback:'blocking'
   }
}

export const getStaticProps:GetStaticProps = async (ctx) => { //[ctx]-contexto userRouter()
  const { slug } = ctx.params;

  const { data } = await api.get(`/episodes/${slug}`) 

  const episode = {
    id: data.id,      
    title: data.title,
    thumbnail: data.thumbnail,
    members: data.members,
    publishedAt: format(parseISO(data.published_at),'d MMM yy',{locale: ptBR }), //locale:ptBr - import in date-fns".
    duration: Number(data.duration),
    description:data.description,
    durationAsString: convertDurationToTimeString(Number(data.file.duration)),
    url: data.file.url,
  }

   return {
      props: {
        episode,
      },
      revalidate: 60 * 60 * 24, // revalido carregamento desta pagina cada 24horas   
   }
}

function playerContext(playerContext: any, arg1: { episode: Episode; }): {} {
   throw new Error('Function not implemented.');
}
