'use client';
import {useEffect,useRef,useState,type CSSProperties} from 'react';
export default function IncomingPile({count,inspecting,busy,onInspect}:{count:number;inspecting:boolean;busy:boolean;onInspect:()=>void}){
 const previous=useRef(count),serial=useRef(0),[arrivals,setArrivals]=useState<{id:number;delay:number}[]>([]);
 useEffect(()=>{const added=count-previous.current;if(added>0&&!window.matchMedia('(prefers-reduced-motion: reduce)').matches){const next=Array.from({length:Math.min(added,5)},(_,i)=>({id:++serial.current,delay:i*110}));setArrivals(a=>[...a,...next].slice(-10));}previous.current=count;},[count]);
 return <><div className={`incoming-stack ${count?'has-cards':'is-empty'} ${arrivals.length?'is-arriving':''}`}>
 {Array.from({length:Math.min(Math.max(count-1,0),4)},(_,i)=><div aria-hidden="true" key={i} className="stack-layer" style={{'--layer':i+1} as CSSProperties}/>)}
 <button className="card-back incoming-top" disabled={busy||inspecting||!count} onClick={onInspect} aria-label={count?`${count} incoming card${count===1?'':'s'}. ${inspecting?'Pass your open card first.':'Tap to inspect.'}`:'No incoming cards. Waiting for the player on your left.'}>
 <span aria-hidden="true">{count?'✳':'↓'}</span><b>{count?(inspecting?'Pass first':'Tap to peek'):'Waiting…'}</b>
 </button>
 {count>0&&<span className="pile-count" aria-hidden="true">{count}</span>}
 {arrivals.map(a=><div key={a.id} className="arriving-card" style={{animationDelay:`${a.delay}ms`,'--flight-order':a.id%3} as CSSProperties} onAnimationEnd={()=>setArrivals(items=>items.filter(x=>x.id!==a.id))} aria-hidden="true"><span>✳</span><b>{inspecting?'Pass first':'Tap to peek'}</b></div>)}
 </div><small className={`pile-status ${count?'ready':''}`} role="status" aria-live="polite" aria-atomic="true">{count?`${count} card${count===1?'':'s'} waiting`:'No cards yet'}</small></>;
}
