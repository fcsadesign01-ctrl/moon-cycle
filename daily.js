// Writes today.txt, the text your iPhone reminder shows each morning
const C=require("./moon-core.js");
const [y,mo,d]=new Date().toLocaleDateString("en-CA",{timeZone:"Asia/Dubai"}).split("-").map(Number);
const t=Date.UTC(y,mo-1,d,8);                 // midday in Dubai
const m=C.moon(t),p=C.phaseOf(m.e),si=Math.floor(m.lon/30);
const nf=C.nextEvent(t,180),nn=C.nextEvent(t,0);
const fmt=ts=>new Date(ts).toLocaleDateString("en",{weekday:"short",day:"numeric",month:"short",timeZone:"Asia/Dubai"});
const fi=C.fullMoonInfo(nf);
let body=`Moon in ${C.SIGN[si]}. ${C.NOTES[p]}\nNext full moon: ${fi.name} Moon, ${fmt(nf)}. Next new moon: ${fmt(nn)}.`;
const title=`${C.EMO[p]} ${C.PH[p]} · ${Math.round(m.k)}%`;
require("fs").writeFileSync("today.txt",title+"\n"+body+"\n");
console.log(title+"\n"+body);
