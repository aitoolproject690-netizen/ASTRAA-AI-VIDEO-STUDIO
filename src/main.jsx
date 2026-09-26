import React,{useEffect,useMemo,useState} from "react";
import {createRoot} from "react-dom/client";
import {LayoutDashboard,Film,Users,Image,Clapperboard,Clock,Download,Plus,Trash2,Search,ChevronRight,Play,Save,Menu,X,MoreVertical} from "lucide-react";
import "./styles.css";

const seed={projects:[],characters:[],backgrounds:[],scenes:[]};
const load=()=>{try{return JSON.parse(localStorage.getItem("astraa_v1"))||seed}catch{return seed}};
const uid=()=>crypto.randomUUID?.()||Date.now().toString(36)+Math.random().toString(36).slice(2);

function App(){
 const [db,setDb]=useState(load); const [page,setPage]=useState("Dashboard"); const [selected,setSelected]=useState(null); const [mobile,setMobile]=useState(false);
 useEffect(()=>localStorage.setItem("astraa_v1",JSON.stringify(db)),[db]);
 const project=db.projects.find(p=>p.id===selected);
 const nav=[["Dashboard",LayoutDashboard],["Projects",Film],["Characters",Users],["Backgrounds",Image],["Scenes",Clapperboard],["Timeline",Clock],["Export",Download]];
 const addProject=()=>{const p={id:uid(),name:"Untitled Episode",description:"",ratio:"16:9",created:Date.now()};setDb(d=>({...d,projects:[p,...d.projects]}));setSelected(p.id);setPage("Scenes")};
 const addItem=(type)=>{
   const labels={characters:"New Character",backgrounds:"New Background",scenes:"New Scene"};
   const item={id:uid(),name:labels[type],description:"",projectId:selected||null,...(type==="scenes"?{duration:5,title:"New Scene",dialogue:"",prompt:"",status:"Draft",order:db.scenes.length}: {})};
   setDb(d=>({...d,[type]:[item,...d[type]]}));
 };
 const del=(type,id)=>setDb(d=>({...d,[type]:d[type].filter(x=>x.id!==id)}));
 return <div className="app">
  <aside className={mobile?"sidebar open":"sidebar"}><div className="brand"><div className="logo">A</div><div><b>ASTRAA</b><span>AI VIDEO STUDIO</span></div><button className="close" onClick={()=>setMobile(false)}><X/></button></div>
   <nav>{nav.map(([n,I])=><button className={page===n?"nav active":"nav"} onClick={()=>{setPage(n);setMobile(false)}} key={n}><I size={19}/><span>{n}</span></button>)}</nav>
   <div className="sideBottom"><div className="pro">STUDIO MVP<br/><small>AI engines can be connected later</small></div></div>
  </aside>
  <main><header><button className="hamb" onClick={()=>setMobile(true)}><Menu/></button><div><div className="crumb">ASTRAA / {page.toUpperCase()}</div><h1>{page}</h1></div><button className="save" onClick={()=>localStorage.setItem("astraa_v1",JSON.stringify(db))}><Save size={16}/> Saved locally</button></header>
   <section className="content">
    {page==="Dashboard"&&<Dashboard db={db} addProject={addProject} setPage={setPage}/>}
    {page==="Projects"&&<Projects db={db} addProject={addProject} setSelected={setSelected} setPage={setPage} del={del}/>}
    {page==="Characters"&&<Library title="Characters" type="characters" db={db} add={()=>addItem("characters")} del={del} icon="👤"/>}
    {page==="Backgrounds"&&<Library title="Backgrounds" type="backgrounds" db={db} add={()=>addItem("backgrounds")} del={del} icon="🏞️"/>}
    {page==="Scenes"&&<Scenes db={db} project={project} selected={selected} setDb={setDb} add={()=>addItem("scenes")} del={del} />}
    {page==="Timeline"&&<Timeline db={db} project={project}/>}
    {page==="Export"&&<Export db={db} project={project}/>}
   </section>
  </main>
 </div>
}

function Dashboard({db,addProject,setPage}){return <><div className="hero"><div><div className="tag">CREATIVE CONTROL CENTER</div><h2>Turn stories into<br/><em>cinematic worlds.</em></h2><p>Build characters, scenes and timelines in one mobile-friendly studio.</p><button className="primary" onClick={addProject}><Plus/> New Project</button></div><div className="orb">✦</div></div><div className="stats"><Stat n={db.projects.length} t="Projects"/><Stat n={db.characters.length} t="Characters"/><Stat n={db.scenes.length} t="Scenes"/><Stat n={db.scenes.reduce((a,s)=>a+Number(s.duration||0),0)+"s"} t="Timeline"/></div><div className="sectionHead"><h3>Recent Projects</h3><button onClick={()=>setPage("Projects")}>View all <ChevronRight size={16}/></button></div>{db.projects.length?<div className="grid">{db.projects.slice(0,4).map(p=><ProjectCard key={p.id} p={p}/>)}</div>:<Empty icon="🎬" title="Your studio is empty" text="Create your first episode and start building scenes." action={addProject} label="Create project"/>}</>}
function Stat({n,t}){return <div className="stat"><strong>{n}</strong><span>{t}</span></div>}
function Projects({db,addProject,setSelected,setPage,del}){return <><div className="toolbar"><div className="search"><Search size={17}/><input placeholder="Search projects..."/></div><button className="primary small" onClick={addProject}><Plus/> New Project</button></div>{db.projects.length?<div className="grid">{db.projects.map(p=><div className="card projectCard" key={p.id}><div className="thumb">🎬<span>16:9</span></div><div className="cardbody"><h3>{p.name}</h3><p>{p.description||"No description yet"}</p><div className="row"><button className="ghost" onClick={()=>{setSelected(p.id);setPage("Scenes")}}>Open project <ChevronRight size={15}/></button><button className="iconbtn danger" onClick={()=>del("projects",p.id)}><Trash2 size={16}/></button></div></div></div>)}</div>:<Empty icon="📽️" title="No projects yet" text="Start your first cartoon episode." action={addProject} label="New project"/>}</>}
function ProjectCard({p}){return <div className="card"><div className="thumb">🎬<span>{p.ratio}</span></div><div className="cardbody"><h3>{p.name}</h3><p>{p.description||"Ready to build"}</p></div></div>}
function Library({title,type,db,add,del,icon}){let arr=db[type];return <><div className="toolbar"><div><p className="muted">Reusable assets for consistent production.</p></div><button className="primary small" onClick={add}><Plus/> Add {title.slice(0,-1)}</button></div>{arr.length?<div className="assetGrid">{arr.map(x=><div className="asset" key={x.id}><div className="assetImg">{icon}</div><div><h3>{x.name}</h3><p>{x.description||"Add details in the next edit pass."}</p></div><button className="iconbtn danger" onClick={()=>del(type,x.id)}><Trash2 size={16}/></button></div>)}</div>:<Empty icon={icon} title={"No "+title.toLowerCase()} text="Create reusable assets for your stories." action={add} label={"Add "+title.slice(0,-1)}/>}</>}
function Scenes({db,project,selected,setDb,add,del}){let scenes=db.scenes.filter(s=>s.projectId===selected);const update=(id,k,v)=>setDb(d=>({...d,scenes:d.scenes.map(s=>s.id===id?{...s,[k]:v}:s)}));return <>{!project?<Empty icon="🎞️" title="Select or create a project" text="Open a project first, then build its scenes."/>:<><div className="workspaceHead"><div><span className="tag">PROJECT</span><h2>{project.name}</h2></div><button className="primary small" onClick={add}><Plus/> Add Scene</button></div>{scenes.length?<div className="sceneList">{scenes.sort((a,b)=>a.order-b.order).map((s,i)=><div className="scene" key={s.id}><div className="sceneNo">{String(i+1).padStart(2,"0")}</div><div className="sceneMain"><input className="titleInput" value={s.title||s.name} onChange={e=>update(s.id,"title",e.target.value)}/><div className="sceneFields"><label>Duration <input type="number" min="1" value={s.duration} onChange={e=>update(s.id,"duration",e.target.value)}/> sec</label><label>Dialogue<textarea value={s.dialogue} onChange={e=>update(s.id,"dialogue",e.target.value)} placeholder="Character dialogue..."/></label><label>Visual prompt<textarea value={s.prompt} onChange={e=>update(s.id,"prompt",e.target.value)} placeholder="Describe the cinematic shot..."/></label></div></div><button className="iconbtn danger" onClick={()=>del("scenes",s.id)}><Trash2 size={17}/></button></div>)}</div>:<Empty icon="🎬" title="No scenes yet" text="Create scene 01 and start directing." action={add} label="Add first scene"/>}</>}</>}
function Timeline({db,project}){let ss=db.scenes.filter(s=>s.projectId===project?.id).sort((a,b)=>a.order-b.order), total=ss.reduce((a,s)=>a+Number(s.duration||0),0);return <>{!project?<Empty icon="⏱️" title="No project selected" text="Open a project to view its timeline."/>:<><div className="timelineTop"><div><span className="tag">EDIT TIMELINE</span><h2>{project.name}</h2></div><div className="total"><b>{total}s</b><span>Total duration</span></div></div><div className="track"><div className="ruler">{Array.from({length:Math.max(5,Math.ceil(total/5)+1)},(_,i)=><span key={i}>{i*5}s</span>)}</div><div className="blocks">{ss.map((s,i)=><div className="block" style={{width:Math.max(100,Number(s.duration||5)*28)}} key={s.id}><b>{i+1}</b><span>{s.title||"Scene"}</span><small>{s.duration}s</small></div>)}</div></div></>}</>}
function Export({db,project}){let ss=db.scenes.filter(s=>s.projectId===project?.id), total=ss.reduce((a,s)=>a+Number(s.duration||0),0);return <>{!project?<Empty icon="📦" title="Nothing to export" text="Select a project first."/>:<div className="export"><div className="exportIcon">✦</div><span className="tag">EXPORT CENTER</span><h2>{project.name}</h2><p>Production summary is ready. Real image, video and voice engines can be connected to this workflow later.</p><div className="summary"><div><span>Scenes</span><b>{ss.length}</b></div><div><span>Duration</span><b>{total}s</b></div><div><span>Format</span><b>{project.ratio}</b></div></div><button className="primary" disabled><Download/> AI Export Engine — Coming next</button><small className="muted">No fake generation: this button stays disabled until a real generation service is connected.</small></div>}</>}
function Empty({icon,title,text,action,label}){return <div className="empty"><div>{icon}</div><h2>{title}</h2><p>{text}</p>{action&&<button className="primary small" onClick={action}><Plus/>{label}</button>}</div>}
createRoot(document.getElementById("root")).render(<App/>);
