// Este arquivo e resposavel pelas configurações por volta da aplicação
import Document, { Html, Head, Main, NextScript }from 'next/document';

export default class MyDocument extends Document {
  render(){ // retorno objetos tag para renderir paginas
    return(
       <Html>
           
         <Head>
         <link rel="preconnect" href="https://fonts.gstatic.com" /> 
         <link href="https://fonts.googleapis.com/css2?family=Inter&family=Lexend:wght@500;600&display=swap" rel="stylesheet" />
         </Head>

          <body>  
              <Main />
              <NextScript />
          </body>
 
       </Html>
    );
  }
}