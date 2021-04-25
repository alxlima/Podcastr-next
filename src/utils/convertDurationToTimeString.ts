
// função para calcular duração de cada podcast
export function convertDurationToTimeString(duration: number) {
  const hours = Math.floor(duration / 3600) //Math.floor - arrendodar pra baixo  - hora [60 * 60]= 3600
  const minutes = Math.floor((duration % 3600) / 60); //[(duration % 3600)]- pego minutos sobram divisão hora e divido por 60
  const seconds = duration % 60; //[%] resto da divisão duration por 60 
  
  const timeString = [hours, minutes, seconds] // array de duration
     .map(unit => String(unit).padStart(2,'0')) //[map]-percorro o array, [padStart(2,'0')-cada 2 caract adiciono 0, ex: 01, fixando 2 caracter sempre ]
     .join(':') //adiono [ : ] para unir valores tempo.
     
  return timeString;
}  