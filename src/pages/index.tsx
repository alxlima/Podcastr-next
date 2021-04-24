import { GetStaticProps } from 'next';
import Image from 'next/image'; //[Image]-- otimizar o carregamento Atomatico tamanho imagens não vetor do projeto, imagem externas link
                                //ex: Image width={192} height={192} - largura e altura que carrego a imagem no html
import { format, parseISO } from 'date-fns'; //[parseISO]- pego String e converto date no js.
import ptBR from 'date-fns/locale/pt-BR';
import { api } from '../services/api';
import { convertDurationToTimeString } from '../utils/convertDurationToTimeString';
 
import styles from './home.module.scss'
import React from 'react';

 // tipagem de array de episodios
 type Episode = {
    id: string;
    title: string;
    thumbnail: string;
    description: string;
    members: string;
    duration: number;
    durationAsString: string;
    url: string;
    publishedAt: Date;
 }
 
 type HomeProps ={ // Recebo propriedades que o home recebe dados API- Server.Json
  latestEpisodes: Episode[]; 
  allEpisodes: Episode[]; // [Episode[]- é array episodes podCast, 
                          // Array <Episode> - outro forma de declara array 
 }

 export default function Home({ latestEpisodes , allEpisodes }: HomeProps) {
  return ( //retorno cada episodios do podcast 
    <div className={styles.homepage}> 
       <section className={styles.latestEpisodes}>
         <h2>Últimos lançamentos</h2> 
         <ul>
           {latestEpisodes.map(episode => {
              return (
                <li key={episode.id}> 
                   <Image 
                    width={192} 
                    height={192} 
                    src={episode.thumbnail} 
                    alt={episode.title} 
                    objectFit="cover"
                    /> 

                   <div className={styles.episodeDetails}>
                     <a href=""> {episode.title} </a>
                      <p>{episode.members}</p>
                      <span>{episode.publishedAt}</span>
                      <span>{episode.durationAsString}</span>
                   </div>
                     <button type="button">
                       <img src="/play-green.svg" alt="Tocar episódio" />
                     </button>
                </li>
              )
           })}  
         </ul>
       </section>
       <section className={styles.allEpisodes}>
         <h2>Todos epiódios</h2>    

         <table cellSpacing={0}>  
           <thead>
             <th></th>
             <th>Podcast</th>
             <th>Integrantes</th>
             <th>Data</th>
             <th>Duração</th>
             <th></th>
           </thead>
           <tbody>
              {allEpisodes.map(episode =>{
                return (
                  <tr key={episode.id}>
                    <td>
                      <Image
                       width={120}
                       height={120}
                       src={episode.thumbnail}
                       alt={episode.title}
                       objectFit='cover' //contain ou cover
                      />
                    </td>
                    <td>
                      <a href="">{episode.title}</a>
                    </td>
                    <td>{episode.members}</td>
                    <td>{episode.publishedAt}</td>
                    <td>{episode.durationAsString}</td>
                    <td>
                      <button type="button">
                        <img src="/play-green.svg" alt="Tocar epísodio" />
                      </button>
                    </td>
                  </tr>
                )
              })}
           </tbody>
         </table>
       </section>
    </div>
  )
}

//Consumindo API 3° SSG - Static Side Generation
//Neste modelo a requisição ja é carregada pagina staticamente não necessitando ser carregado por todos usuarios WebBrowser melhoria de performace. 
export const getStaticProps:GetStaticProps = async() =>{  //[async] - transformo função em assincrona
  //[getStatucPropos] --  dados Pops diponiveis estaticamente no browser
  const { data }= await api.get('episodes', { //[api.get]- pego Url padrão da Api em services/api.ts 
     params: {
       _limit: 12,           //[?_limit=12]- limito registro de podcast para retornar
       _sort: 'published_at',//[&_sort]- ordenação  [published_at]- ordeno por data publicação,
       _order:'desc'         //[&_order=desc]-ordem decrescente 
     }
  }) 
       
  // formatar os Dados (data) dentro de server.json 
  const episodes = data.map( episode => { //[map]-retorna registros percorrendo os mesmos similar ao forEach, porem ele retorna
        return { 
      id: episode.id,      
      title: episode.title,
      thumbnail: episode.thumbnail,
      members: episode.members,
      publishedAt: format(parseISO(episode.published_at),'d MMM yy',{locale: ptBR}), //locale:ptBr - import in date-fns".
      duration: Number(episode.duration),
      description:episode.description,
      durationAsString: convertDurationToTimeString(Number(episode.file.duration)),
      url: episode.file.url,
    //"type": "audio/x-m4a",
    }
  })

  
  const latestEpisodes = episodes.slice(0,2);// [slice]-pego 2 episodios da posição 0 a 2 - ultimos episodios 
  const allEpisodes = episodes.slice(2, episodes.length); //pego da posição 2 até o tamanho restante de episodios
  
  return { 
   props: {
    latestEpisodes, // passo Data(dados),episodes campos já formatados e ultimos 2 episodios na posição
    allEpisodes,   // passo Data(dados),episodes campos já formatados todos episodios restantes, em server.json 
   },
   revalidate: 60 * 60 * 8 // [revalidate] tempo de intervalo em segundos de quando revalido o acesso a pagina
                           // a cada 8 horas  1 chamada feita na API http://localhost:3333/episodes 
  }

}


// Exemplos 
//3 formas de consumir um API com next
//1° SPA - Singol page aplication
//2° SSR - Server side Rendering
//3° SSG - Static Side Generation


//consumindo API 1°forma  SPA - Singol page aplicatio
//import { useEffect } from "react"
// export default function Home() {
//   //console.log(props.episodes)
//  
//   // useEffect(()=> {
//   //   fetch('http://localhost:3333/episodes')
//   //   .then(response => response.json())
//   //   .then(data =>console.log(data))
//   // },[])  // este modelo é utlizado, porem não é ideal para pre carregar paginas
//   return (
//       <h1>Index</h1>
//   )
// }

//Consumindo API 2 °forma SSR - Server side Rendering
//Neste modelo a requisição ja é carregada antes na camada do Next.js e não no WebBrowser, otimizando velocidade no carregamento do pagina.
// export async function getServerSideProps(){  //[async] - transformo função em assincrona
//                                              //[getServerSidePropos] --  dados Pops diponiveis antes de carregar browser
//      const response= await fetch('http://localhost:3333/episodes')
//      const data = await response.json()
//      return { 
//        props: {
//          episodes: data,
//        }
//      }
// }
