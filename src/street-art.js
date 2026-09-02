// Fit the generated source pieces TO the established street template.
// The source does not choose where doors, furniture or actors collide.
export const STREET_ART_PIECES=[
  {id:"house",source:[0,0,165,128],target:[28,0,130,113]},
  {id:"parkWall",source:[166,0,172,120],target:[190,0,110,91]},
  {id:"eastHouse",source:[338,0,142,126],target:[335,0,115,109]},
  {id:"notice",source:[120,129,27,38],target:[155,115,21,49]},
  {id:"bench",source:[154,148,35,22],target:[147,166,48,30]},
  {id:"busShelter",source:[346,127,80,59],target:[348,111,91,69]},
  {id:"busPost",source:[323,126,13,57],target:[323,108,10,83]}
];
export function composeStreetArt(image,makeCanvas){
  const canvas=makeCanvas();canvas.width=480;canvas.height=270;
  const c=canvas.getContext("2d");c.imageSmoothingEnabled=false;
  // A repeated source paving tile, rather than an enlarged flat material cell.
  for(let y=0;y<270;y+=40)for(let x=0;x<480;x+=96)c.drawImage(image,190,191,96,40,x,y,96,40);
  for(let x=0;x<480;x+=64){
    for(let y=0;y<91;y+=20)c.drawImage(image,210,14,64,20,x,y,64,20);
    c.drawImage(image,181,122,64,17,x,112,64,17);
    c.drawImage(image,190,239,64,24,x,239,64,24);
  }
  c.drawImage(image,200,123,22,17,231,91,22,38);
  for(const piece of STREET_ART_PIECES)c.drawImage(image,...piece.source,...piece.target);
  return canvas;
}
