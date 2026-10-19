const courses=window.termSixCourses;
const analyses=window.courseAnalysis;
const byCode=new Map(analyses.map(analysis=>[analysis.code,analysis]));
const groups=[...new Set(courses.map(course=>course.group))];
const groupMenu=document.querySelector("#analysis-groups");
const groupOptions=document.querySelector("#analysis-group-options");
const groupSummary=document.querySelector("#analysis-group-summary");
const componentMenu=document.querySelector("#analysis-components");
const componentOptions=document.querySelector("#component-options");
const componentSummary=document.querySelector("#component-summary");
const search=document.querySelector("#analysis-search");
const credit=document.querySelector("#analysis-credit");
const midFilter=document.querySelector("#mid-filter");
const endFilter=document.querySelector("#end-filter");
const componentMatch=document.querySelector("#component-match");
const body=document.querySelector("#analysis-body");
const resultCount=document.querySelector("#analysis-results");
const componentTypes=["Quiz","Mid-Term","End-Term Exam","Project","Assignment / Case","Class Participation"];

function addOptions(container,values){
  for(const value of values){const label=document.createElement("label");label.className="filter-option";label.innerHTML=`<input type="checkbox" value="${value}"><span>${value}</span>`;container.append(label)}
}
addOptions(groupOptions,groups);
addOptions(componentOptions,componentTypes);
document.querySelector("#analysis-count").textContent=analyses.length;
document.querySelector("#normal-count").textContent=analyses.filter(analysis=>analysis.total===100).length;
document.querySelector("#flag-count").textContent=analyses.filter(analysis=>analysis.note).length;
function selectedValues(container){return [...container.querySelectorAll("input:checked")].map(input=>input.value)}
function hasMid(analysis){return analysis.mid!==null||/mid[ -]?term/i.test(analysis.breakdown)}
function hasEnd(analysis){return analysis.end!==null||/end[ -]?term|final exam/i.test(analysis.breakdown)}
function componentFlags(analysis){
  const text=analysis.breakdown.toLowerCase();
  return {
    "Quiz":analysis.quiz!==null||/\bquizzes?\b/.test(text),
    "Mid-Term":hasMid(analysis),
    "End-Term Exam":hasEnd(analysis),
    "Project":analysis.project!==null||/\bprojects?\b|presentations?|white paper/.test(text),
    "Assignment / Case":analysis.assignment!==null||/assignments?|cases?|reflection notes?|learning diary/.test(text),
    "Class Participation":analysis.participation!==null||/participation|class discussion|case discussion|engagement/.test(text)
  };
}
function componentLines(analysis){
  return analysis.breakdown.split(/;\s*/).map(line=>{
    const prose=line.search(/\.\s/);
    if(prose>=0)line=line.slice(0,prose);
    return line.replace(/\.$/,"").trim();
  }).filter(Boolean);
}
function updateSummaries(){
  const chosenGroups=selectedValues(groupOptions),chosenComponents=selectedValues(componentOptions);
  groupSummary.textContent=chosenGroups.length?`${chosenGroups.length} group${chosenGroups.length===1?"":"s"} selected`:"All academic groups";
  componentSummary.textContent=chosenComponents.length?`${chosenComponents.length} component${chosenComponents.length===1?"":"s"} selected`:"All components";
}
function render(){
  const query=search.value.trim().toLowerCase();
  const chosenGroups=selectedValues(groupOptions);
  const chosenComponents=selectedValues(componentOptions);
  const rows=courses.map(course=>({course,analysis:byCode.get(course.code)})).filter(row=>row.analysis);
  const filtered=rows.filter(({course,analysis})=>{
    const searchable=`${course.code} ${course.title} ${course.group} ${course.instructors} ${analysis.breakdown} ${analysis.note||""}`.toLowerCase();
    const flags=componentFlags(analysis);
    const componentMatchOk=!chosenComponents.length||(componentMatch.value==="all"?chosenComponents.every(name=>flags[name]):chosenComponents.some(name=>flags[name]));
    return (!query||searchable.includes(query))&&(!chosenGroups.length||chosenGroups.includes(course.group))&&(!credit.value||String(course.credits)===credit.value)&&(!midFilter.value||(midFilter.value==="yes"?hasMid(analysis):!hasMid(analysis)))&&(!endFilter.value||(endFilter.value==="yes"?hasEnd(analysis):!hasEnd(analysis)))&&componentMatchOk;
  });
  resultCount.textContent=filtered.length;
  body.replaceChildren(...filtered.map(({course,analysis})=>{
    const tr=document.createElement("tr");
    const lines=componentLines(analysis).map(line=>`<div class="component-line">${line}</div>`).join("");
    tr.innerHTML=`<td class="course-cell"><div class="table-code">${course.code} · ${course.credits} cr</div><div class="table-title">${course.title}</div><div class="group-cell">${course.group}</div></td><td class="instructor-cell">${course.instructors||"—"}</td><td class="component-lines">${lines}</td><td class="note-cell">${analysis.note||""}</td><td class="outline-cell">${course.outline?`<a class="table-link" target="_blank" rel="noopener" href="viewer.html?file=${encodeURIComponent(course.outline)}">View ↗</a>`:"—"}</td>`;
    return tr;
  }));
  if(!filtered.length){const tr=document.createElement("tr");tr.innerHTML='<td class="empty-row" colspan="5">No courses match these filters.</td>';body.append(tr)}
}
groupOptions.addEventListener("change",()=>{updateSummaries();render()});
componentOptions.addEventListener("change",()=>{updateSummaries();render()});
for(const control of [search,credit,midFilter,endFilter,componentMatch])control.addEventListener(control===search?"input":"change",render);
document.querySelector('[data-clear="analysis-groups"]').addEventListener("click",()=>{groupOptions.querySelectorAll("input").forEach(input=>input.checked=false);updateSummaries();render()});
document.querySelector('[data-clear="analysis-components"]').addEventListener("click",()=>{componentOptions.querySelectorAll("input").forEach(input=>input.checked=false);updateSummaries();render()});
document.querySelector("#analysis-reset").addEventListener("click",()=>{search.value="";credit.value="";midFilter.value="";endFilter.value="";componentMatch.value="any";for(const container of [groupOptions,componentOptions])container.querySelectorAll("input").forEach(input=>input.checked=false);updateSummaries();render()});
document.addEventListener("click",event=>{if(!groupMenu.contains(event.target))groupMenu.open=false;if(!componentMenu.contains(event.target))componentMenu.open=false});
updateSummaries();
render();
