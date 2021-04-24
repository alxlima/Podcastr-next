import format from 'date-fns/format';
import ptBR from 'date-fns/locale/pt-BR';
import styles from './styles.module.scss'; // importo o Sas Css em componentes\Header

export default function Header() {
  const currenDate = format(new Date(), 'EEEEEE, d MMMM', {
   locale: ptBR,    
  });  //[toLocaleDateString]- converto data no forma brasil
    return(                                                 // format date em: https://date-fns.org/v2.21.1/docs/format
        <header className={styles.headerContainer}> 
           <img src="/logo.svg" alt="podcastr" />

           <p> O melhor para você ouvir, sempre </p>
           <span>{currenDate}</span>
        </header>
    );

}