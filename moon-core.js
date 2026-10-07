// Shared moon maths + content (used by the page and by the daily reminder script)
const R=Math.PI/180,n=x=>((x%360)+360)%360,sn=x=>Math.sin(x*R);
function moon(t){
  const d=t/864e5+2440587.5-2451545;
  const g=n(357.529+0.98560028*d);
  const ls=n(280.459+0.98564736*d+1.915*sn(g)+0.02*sn(2*g));
  const L=218.316+13.176396*d,M=134.963+13.064993*d,F=93.272+13.22935*d,D=297.85+12.190749*d;
  const lm=n(L+6.289*sn(M)+1.274*sn(2*D-M)+0.658*sn(2*D)+0.214*sn(2*M)-0.186*sn(g)-0.114*sn(2*F));
  const e=n(lm-ls);
  return{e,k:(1-Math.cos(e*R))/2*100,lon:lm,wax:e<180};
}
// next time the Sun-Moon angle hits target (0 = new, 180 = full), refined to ~1 minute
function nextEvent(from,target){
  let p=n(moon(from).e-target);
  for(let t=from+36e5;t<from+32*864e5;t+=36e5){
    const c=n(moon(t).e-target);
    if(p>340&&c<20){
      let lo=t-36e5,hi=t;
      for(let i=0;i<12;i++){const mid=(lo+hi)/2;n(moon(mid).e-target)>180?lo=mid:hi=mid}
      return hi;
    }
    p=c;
  }
}
const PH=["New Moon","Waxing Crescent","First Quarter","Waxing Gibbous","Full Moon","Waning Gibbous","Last Quarter","Waning Crescent"];
const EMO=["🌑","🌒","🌓","🌔","🌕","🌖","🌗","🌘"];
const phaseOf=e=>Math.round(e/45)%8;
const SIGN=["Aries","Taurus","Gemini","Cancer","Leo","Virgo","Libra","Scorpio","Sagittarius","Capricorn","Aquarius","Pisces"];
const SIGNTXT=["bold starts and initiative","comfort, steadiness and the senses","curiosity, talking and learning","home, feelings and nurturing","creativity and self-expression","order, health and practical detail","balance, partnership and harmony","depth, honesty and transformation","freedom, travel and big-picture thinking","discipline, structure and long goals","community, ideas and originality","intuition, rest and imagination"];
const NOTES=[
"A blank page. Traditionally the time to set intentions and plant seeds. Keep things quiet and write down what you want to grow this cycle.",
"Energy begins to build. Take the first small steps on your intentions, gather what you need, and make plans. Be patient with early progress.",
"A moment of tension and decision. Obstacles often show up now, so commit, take action, and adjust your approach where needed.",
"Refine and fine-tune. Edit, improve and keep going. Trust the process, because the payoff is close.",
"Peak light and peak emotion. Traditionally for manifesting, celebrating, giving thanks and noticing what has come to fruition. Feelings can run high, so prioritise rest.",
"Share and give thanks. Pass on what you have learned, reflect on the cycle and express gratitude.",
"Time to release. Let go of habits, clutter or grudges that no longer serve you, forgive, and clear space.",
"Rest and surrender. Slow down, recover and cleanse, and prepare quietly for the next new moon."];
// Traditional full moon names (Old Farmer's Almanac style) by month; a 2nd full moon in one month is a Blue Moon
const FM=[["Wolf","instinct, protection, setting the tone for the year"],["Snow","stillness, patience and rest"],["Worm","thaw and renewal as the ground wakes up"],["Pink","blossoming and fresh starts"],["Flower","abundance, beauty and joy"],["Strawberry","sweetness, love and early rewards"],["Buck","strength, growth and confidence"],["Sturgeon","gratitude, nourishment and abundance"],["Harvest","reaping rewards, gathering and balance"],["Hunter's","preparing for winter, focus and letting go of excess"],["Beaver","building security, home and preparation"],["Cold","reflection, closure and time with loved ones"]];
const BLUE=["Blue","a rare extra moon: do the thing you usually put off"];
function fullMoons(year){
  const out=[],end=Date.UTC(year+1,0,1),seen={};
  for(let t=Date.UTC(year,0,1);;){
    const ev=nextEvent(t,180);if(!ev||ev>=end)break;
    const mo=new Date(ev).getUTCMonth(),f=seen[mo]?BLUE:FM[mo];seen[mo]=1;
    out.push({t:ev,name:f[0],theme:f[1]});t=ev+864e5;
  }
  return out;
}
const fullMoonInfo=ts=>fullMoons(new Date(ts).getUTCFullYear()).find(f=>Math.abs(f.t-ts)<36e5)||{name:"Full",theme:""};
if(typeof module!=="undefined")module.exports={moon,nextEvent,PH,EMO,phaseOf,SIGN,SIGNTXT,NOTES,fullMoons,fullMoonInfo,fullMoonTonight};
// "Full moon tonight" alert, using Dubai/Fujairah time (UTC+4, no daylight saving)
const TZ=4*36e5;
function fullMoonTonight(ts){
  const start=Math.floor((ts+TZ)/864e5)*864e5-TZ; // start of today in Dubai time
  const ev=nextEvent(start-36e5,180);
  if(!ev||ev<start||ev>=start+864e5)return null;
  const info=fullMoonInfo(ev);
  const hhmm=new Date(ev+TZ).toISOString().slice(11,16);
  return "🌕 Full moon tonight: the "+info.name+" Moon, exact at "+hhmm;
}
