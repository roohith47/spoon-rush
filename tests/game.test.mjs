import ts from 'typescript';
import fs from 'node:fs';
import assert from 'node:assert/strict';
const output=ts.transpileModule(fs.readFileSync('lib/game.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022}}).outputText;
const {player,begin,act,publicState}=await import('data:text/javascript;base64,'+Buffer.from(output).toString('base64'));
const ps=Array.from({length:4},(_,i)=>player('Player '+i,crypto.randomUUID()));
const r={code:'ABCDE',host:ps[0].id,players:ps,phase:'lobby',round:0,dealer:0,deck:[],discard:[],grabs:[],loser:null,winner:null};
assert.throws(()=>act(r,ps[1],'start'),/host/);act(r,ps[0],'start');assert.equal(ps[0].hand.length,3);assert.equal(ps[1].hand.length,4);
const all=()=>[...r.deck,...r.discard,...ps.flatMap(p=>[...p.hand,...p.queue,...(p.view?[p.view]:[])])];
for(let n=0;n<130;n++){for(const p of ps){try{act(r,p,'inspect')}catch(e){assert.match(e.message,/Waiting|No incoming/);continue;}act(r,p,'pass',p.view.id);assert.equal(all().length,52);assert.equal(new Set(all().map(c=>c.id)).size,52);}}
assert.equal(publicState(r,ps[0]).players[1].hand,undefined);assert.equal(JSON.stringify(publicState(r,ps[0])).includes(ps[1].token),false);
ps[0].hand=[1,2,3].map((x)=>({id:'test'+x,rank:9,suit:'♠'}));ps[0].view={id:'test4',rank:9,suit:'♥'};act(r,ps[0],'grab');assert.equal(r.grabs.length,1);act(r,ps[0],'grab');assert.equal(r.grabs.length,1);act(r,ps[1],'grab');act(r,ps[2],'grab');assert.equal(r.phase,'roundover');assert.equal(ps[3].alive,false);assert.throws(()=>act(r,ps[1],'next'),/host/);act(r,ps[0],'next');assert.equal(r.round,2);assert.equal(r.dealer,1);assert.equal(ps[1].hand.length,3);assert.equal(ps[3].hand.length,0);assert.equal(all().length,52);assert.throws(()=>act(r,ps[3],'inspect'),/active round/);
// Complete the tournament and verify rematch restores every player.
while(r.phase!=='finished'){const live=ps.filter(p=>p.alive);live[0].hand=[0,1,2,3].map((_,i)=>({id:'win'+i,rank:8,suit:'♠'}));live[0].view=null;for(const p of live.slice(0,-1))act(r,p,'grab');if(r.phase==='roundover')act(r,ps[0],'next');}
assert.ok(r.winner);act(r,ps[0],'rematch');assert.equal(r.round,1);assert.equal(ps.filter(p=>p.alive).length,4);assert.equal(all().length,52);
console.log('PASS: card conservation across 520 moves, recycling, hidden state, host controls, dealer rotation, elimination, winner and rematch.');
