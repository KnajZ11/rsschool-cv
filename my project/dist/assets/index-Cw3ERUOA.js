(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))s(n);new MutationObserver(n=>{for(const o of n)if(o.type==="childList")for(const i of o.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&s(i)}).observe(document,{childList:!0,subtree:!0});function e(n){const o={};return n.integrity&&(o.integrity=n.integrity),n.referrerPolicy&&(o.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?o.credentials="include":n.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function s(n){if(n.ep)return;n.ep=!0;const o=e(n);fetch(n.href,o)}})();const D="monthlyData";function S(){const a=localStorage.getItem(D);if(!a)return{};try{return JSON.parse(a)}catch{return{}}}function E(a){localStorage.setItem(D,JSON.stringify(a))}function p(a){return S()[a]||null}function h(a,t){const e=S();e[a]=t,E(e)}function m(a){const t=p(a);if(t)return t;const e={monthKey:a,employees:[],projects:[],timestamp:Date.now()};return h(a,e),e}const y=()=>Date.now().toString(36)+Math.random().toString(36).slice(2,11);function I(a){const[t,e]=a.split("-").map(Number),s=new Date(t,e,0).getDate();let n=0;for(let o=1;o<=s;o++){const i=new Date(t,e-1,o).getDay();i!==0&&i!==6&&n++}return n}function N(a,t){const e=I(t),[s,n]=t.split("-").map(Number),o=a.vacationDays.filter(i=>{const c=new Date(s,n-1,i).getDay();return c!==0&&c!==6}).length;return e>0?(e-o)/e:0}function L(a){return a.capacity===0?0:a.budget/a.capacity}function v(a,t,e){const s=a.assignments.find(o=>o.projectId===t);if(!s)return 0;const n=N(a,e);return s.capacity*s.fitness*n}function f(a,t,e){const s=v(a,t.id,e.monthKey),n=e.employees.reduce((r,c)=>r+v(c,t.id,e.monthKey),0),o=Math.max(t.capacity,n);return o===0?0:t.budget/o*s}function g(a,t){const e=a.assignments.find(s=>s.projectId===t);return e?a.salary*Math.max(.5,e.capacity):0}function $(a){return a.salary*.5}function M(a){return a.projects.reduce((t,e)=>t+a.employees.reduce((s,n)=>s+f(n,e,a),0),0)}function q(a){return a.employees.reduce((t,e)=>e.assignments.length>0?t+e.assignments.reduce((s,n)=>s+g(e,n.projectId),0):t+$(e),0)}function K(a){return M(a)-q(a)}function x(a,t){const e=m(a);e.employees.push({...t,id:y(),assignments:[],vacationDays:[]}),h(a,e)}function C(a,t,e){const s=p(a);if(!s)return;const n=s.employees.findIndex(o=>o.id===t);n!==-1&&(s.employees[n]={...s.employees[n],...e},h(a,s))}function B(a,t){const e=p(a);e&&(e.employees=e.employees.filter(s=>s.id!==t),h(a,e))}function F(a,t){const e=m(a);e.projects.push({...t,id:y()}),h(a,e)}function k(a,t,e){const s=p(a);if(!s)return;const n=s.projects.findIndex(o=>o.id===t);n!==-1&&(s.projects[n]={...s.projects[n],...e,id:t},h(a,s))}function P(a,t){const e=p(a);e&&(e.projects=e.projects.filter(s=>s.id!==t),e.employees.forEach(s=>{s.assignments=s.assignments.filter(n=>n.projectId!==t)}),h(a,e))}function T(a,t,e,s,n){const o=p(a);if(!o)return{success:!1,error:"Месяц не инициализирован"};const i=o.employees.find(r=>r.id===t);return i?i.assignments.some(r=>r.projectId===e)?{success:!1,error:"Уже назначен"}:(i.assignments.push({employeeId:t,projectId:e,capacity:s,fitness:n}),h(a,o),{success:!0}):{success:!1,error:"Сотрудник не найден"}}function A(a,t,e){const s=p(a);if(!s)return;const n=s.employees.find(o=>o.id===t);n&&(n.assignments=n.assignments.filter(o=>o.projectId!==e),h(a,s))}function H(a,t,e){const s=p(a);if(!s)return;const n=s.employees.find(o=>o.id===t);n&&(n.vacationDays=[...e].sort((o,i)=>o-i),h(a,s))}function O(a,t){const e=p(a);if(!e)return!1;const s=new Map,n=e.projects.map(i=>{const r=y();return s.set(i.id,r),{...i,id:r}}),o=e.employees.map(i=>{const r=y();return{...i,id:r,vacationDays:[],assignments:i.assignments.map(c=>({...c,employeeId:r,projectId:s.get(c.projectId)||c.projectId}))}});return h(t,{monthKey:t,employees:o,projects:n,timestamp:Date.now()}),!0}class R{constructor(t,e,s){this.container=t,this.currentKey=e,this.onChange=s,this.render()}render(){this.container.innerHTML="";const t=document.createElement("div");t.className="month-selector-controls",this.select=document.createElement("select");const e=[2024,2025,2026],s=["01","02","03","04","05","06","07","08","09","10","11","12"];for(const o of e)for(const i of s){const r=`${o}-${i}`,c=document.createElement("option");c.value=r,c.textContent=`${o} / ${i}`,r===this.currentKey&&(c.selected=!0),this.select.appendChild(c)}this.select.addEventListener("change",()=>{this.currentKey=this.select.value,this.onChange(this.currentKey)});const n=document.createElement("button");n.textContent="📋 Copy from previous month",n.className="btn-copy",n.addEventListener("click",()=>{const[o,i]=this.currentKey.split("-").map(Number),r=new Date(o,i-2),c=`${r.getFullYear()}-${String(r.getMonth()+1).padStart(2,"0")}`;O(c,this.currentKey)?(this.onChange(this.currentKey),alert(`Данные успешно скопированы из ${c}`)):alert(`Нет данных за предыдущий месяц (${c})`)}),t.appendChild(this.select),t.appendChild(n),this.container.appendChild(t)}}class w{constructor(t,e,s){this.monthKey=t,this.onSave=e,this.employee=s}show(){var i,r,c,u;const t=document.getElementById("modal-overlay"),e=document.getElementById("modal-content"),s=!!this.employee,n=["junior","middle","senior","lead","architect","BO"];e.innerHTML=`
      <h3>${s?"Редактировать":"Добавить"} сотрудника</h3>
      <form id="emp-form">
        <label>Имя: 
          <input name="firstName" value="${((i=this.employee)==null?void 0:i.firstName)||""}" required>
        </label>
        <label>Фамилия: 
          <input name="lastName" value="${((r=this.employee)==null?void 0:r.lastName)||""}" required>
        </label>
        <label>Дата рождения: 
          <input type="date" name="birthDate" value="${((c=this.employee)==null?void 0:c.birthDate)||""}" required>
        </label>
        <label>Позиция: 
          <select name="position" required>
            ${n.map(l=>{var d;return`
              <option value="${l}" ${((d=this.employee)==null?void 0:d.position)===l?"selected":""}>
                ${l.toUpperCase()}
              </option>
            `}).join("")}
          </select>
        </label>
        <label>Зарплата ($): 
          <input type="number" name="salary" value="${((u=this.employee)==null?void 0:u.salary)||""}" required min="1">
        </label>
        
        <div class="modal-actions-inline" style="margin-top: 20px">
          <button type="submit" class="btn-primary">${s?"Сохранить":"Создать"}</button>
        </div>
      </form>
    `,t.style.display="flex";const o=e.querySelector("#emp-form");o.onsubmit=l=>{l.preventDefault();const d=new FormData(o),b={firstName:d.get("firstName"),lastName:d.get("lastName"),birthDate:d.get("birthDate"),position:d.get("position"),salary:Number(d.get("salary"))};s&&this.employee?C(this.monthKey,this.employee.id,b):x(this.monthKey,b),t.style.display="none",this.onSave()}}}class U{constructor(t,e,s){this.monthKey=t,this.employeeId=e,this.onUpdate=s,this.currentData=m(t)}show(){const t=document.getElementById("modal-overlay"),e=document.getElementById("modal-content"),s=this.currentData.employees.find(n=>n.id===this.employeeId);s&&(t.style.display="flex",e.innerHTML=`
      <h3>Проекты сотрудника: ${s.lastName}</h3>
      <div id="current-assignments">
        ${this.renderAssignments(s.assignments)}
      </div>
      
      <hr style="margin: 20px 0; border: 0; border-top: 1px solid #eee;">
      
      <h4>Добавить новое назначение</h4>
      <form id="assign-form">
        <label>Проект
          <select name="projectId" required>
            ${this.currentData.projects.map(n=>`<option value="${n.id}">${n.projectName}</option>`).join("")}
          </select>
        </label>
        <label>Загрузка (0.1 - 1.5)
          <input type="number" name="capacity" min="0.1" max="1.5" step="0.1" value="0.5" required>
        </label>
        <label>Коэффициент (0 - 1.0)
          <input type="number" name="fitness" min="0" max="1" step="0.1" value="1.0" required>
        </label>
        <button type="submit" style="margin-top: 10px; width: 100%;">Добавить проект</button>
      </form>
    `,this.initEvents(e))}renderAssignments(t){return t.length===0?'<p class="text-muted">Нет активных проектов</p>':`
      <table class="employee-list">
        ${t.map(e=>{const s=this.currentData.projects.find(n=>n.id===e.projectId);return`
            <tr>
              <td>${(s==null?void 0:s.projectName)||"Удаленный проект"}</td>
              <td>${e.capacity} / ${e.fitness}</td>
              <td><button class="btn-delete" data-project-id="${e.projectId}">✕</button></td>
            </tr>
          `}).join("")}
      </table>
    `}initEvents(t){const e=t.querySelector("#assign-form");e.onsubmit=s=>{s.preventDefault();const n=new FormData(e),o=parseFloat(n.get("capacity")),i=T(this.monthKey,this.employeeId,n.get("projectId"),o,parseFloat(n.get("fitness")));i.success?(this.onUpdate(),this.show()):alert(i.error)},t.querySelectorAll(".btn-delete").forEach(s=>{s.onclick=()=>{const n=s.dataset.projectId;A(this.monthKey,this.employeeId,n),this.onUpdate(),this.show()}})}}class W{constructor(t,e,s){this.monthKey=t,this.employeeId=e,this.onSave=s;const[n,o]=t.split("-").map(Number);this.daysInMonth=new Date(n,o,0).getDate();const r=m(t).employees.find(c=>c.id===e);this.selectedDays=new Set((r==null?void 0:r.vacationDays)||[])}show(){const t=document.getElementById("modal-overlay"),e=document.getElementById("modal-content");t.style.display="flex",e.innerHTML=`
      <h3>Выберите дни отпуска</h3>
      <div class="vacation-calendar" id="calendar-grid">
        ${this.generateCalendarHTML()}
      </div>
      <div class="modal-actions-inline" style="margin-top: 20px">
        <button id="save-vacation">Сохранить</button>
      </div>
    `,e.querySelector("#calendar-grid").addEventListener("click",n=>{const o=n.target.closest(".day");if(!o)return;const i=parseInt(o.dataset.day);this.selectedDays.has(i)?(this.selectedDays.delete(i),o.classList.remove("selected")):(this.selectedDays.add(i),o.classList.add("selected"))}),e.querySelector("#save-vacation").onclick=()=>{const n=Array.from(this.selectedDays).sort((o,i)=>o-i);H(this.monthKey,this.employeeId,n),t.style.display="none",this.onSave()}}generateCalendarHTML(){const t=["Пн","Вт","Ср","Чт","Пт","Сб","Вс"],[e,s]=this.monthKey.split("-").map(Number),n=new Date(e,s-1,1).getDay(),o=n===0?6:n-1;let i=t.map(r=>`<div class="day-header">${r}</div>`).join("");for(let r=0;r<o;r++)i+='<div class="empty"></div>';for(let r=1;r<=this.daysInMonth;r++){const c=this.selectedDays.has(r);i+=`
        <button type="button" class="day ${c?"selected":""}" data-day="${r}">
          ${r}
        </button>
      `}return i}}class Y{constructor(t){this.currentData=null,this.monthKey="",this.sortState={field:"name",direction:"asc"},this.container=t,this.renderBase()}renderBase(){this.container.innerHTML=`
      <table class="employee-list">
        <thead>
          <tr>
            <th class="sortable" data-field="name">Сотрудник</th>
            <th>Загрузка</th>
            <th>Доход ($)</th>
            <th>Стоимость ($)</th>
            <th>Профит ($)</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody></tbody>
      </table>
    `,this.tbody=this.container.querySelector("tbody"),this.container.querySelector("thead").addEventListener("click",t=>{const e=t.target.closest("th");e!=null&&e.dataset.field&&this.handleSort(e.dataset.field)})}update(t,e){this.currentData=t,this.monthKey=e,this.refresh()}refresh(){if(!this.currentData)return;this.container.querySelectorAll("th.sortable").forEach(e=>{const s=e.dataset.field;e.classList.toggle("active",s===this.sortState.field),s===this.sortState.field&&(e.classList.toggle("asc",this.sortState.direction==="asc"),e.classList.toggle("desc",this.sortState.direction==="desc"))});let t=[...this.currentData.employees];this.applySort(t),this.tbody.innerHTML="",t.forEach(e=>{this.tbody.appendChild(this.buildRow(e))})}buildRow(t){const e=document.createElement("tr"),s=t.assignments.reduce((c,u)=>c+u.capacity,0),n=s>1.2?"overload":s<.5?"warning":"normal";let o=0,i=0;t.assignments.length>0?t.assignments.forEach(c=>{var l;const u=(l=this.currentData)==null?void 0:l.projects.find(d=>d.id===c.projectId);u&&this.currentData&&(o+=f(t,u,this.currentData),i+=g(t,c.projectId))}):i=$(t);const r=o-i;return e.innerHTML=`
      <td>
        <strong>${t.lastName} ${t.firstName}</strong><br>
        <span class="badge">${(t.position||"N/A").toUpperCase()}</span>
        <small style="display:block; color: gray;">Возраст: ${this.calculateAge(t.birthDate)}</small>
      </td>
      <td>
        <div class="capacity-bar" style="cursor: pointer" title="Управлять проектами">
          <div class="capacity-fill ${n}" style="width: ${Math.min(s/1.5*100,100)}%"></div>
        </div>
        <small>${s.toFixed(1)} / 1.5</small>
      </td>
      <td>${Math.round(o).toLocaleString()}</td>
      <td title="${t.assignments.length===0?"Скамейка (50%)":"Проектная стоимость"}">
        ${Math.round(i).toLocaleString()}
      </td>
      <td class="${r>=0?"positive":"negative"}">
        <strong>${Math.round(r).toLocaleString()}</strong>
      </td>
      <td>
        <button class="btn-edit" title="Редактировать">✎</button>
        <button class="btn-vacation" title="Отпуска">📅</button>
        <button class="btn-delete" title="Удалить">✕</button>
      </td>
    `,e.querySelector(".capacity-bar").onclick=()=>{new U(this.monthKey,t.id,()=>window.app.update()).show()},e.querySelector(".btn-vacation").onclick=()=>{new W(this.monthKey,t.id,()=>window.app.update()).show()},e.querySelector(".btn-edit").onclick=()=>{new w(this.monthKey,()=>window.app.update(),t).show()},e.querySelector(".btn-delete").onclick=()=>{confirm(`Удалить сотрудника ${t.lastName}?`)&&(B(this.monthKey,t.id),window.app.update())},e}handleSort(t){this.sortState.field===t?this.sortState.direction=this.sortState.direction==="asc"?"desc":"asc":(this.sortState.field=t,this.sortState.direction="asc"),this.refresh()}applySort(t){const{field:e,direction:s}=this.sortState,n=s==="asc"?1:-1;t.sort((o,i)=>{let r,c;return e==="name"?(r=o.lastName,c=i.lastName):e==="age"?(r=o.birthDate,c=i.birthDate):(r=o[e],c=i[e]),r<c?-1*n:r>c?1*n:0})}calculateAge(t){if(!t)return 0;const e=new Date(t),s=new Date;let n=s.getFullYear()-e.getFullYear();const o=s.getMonth()-e.getMonth();return(o<0||o===0&&s.getDate()<e.getDate())&&n--,isNaN(n)?0:n}}class j{constructor(t,e,s){this.monthKey=t,this.onSave=e,this.project=s}show(){var o,i,r,c;const t=document.getElementById("modal-overlay"),e=document.getElementById("modal-content"),s=!!this.project;e.innerHTML=`
      <h3>${s?"Редактировать проект":"Новый проект"}</h3>
      <form id="project-form">
        <label>Название проекта *
          <input type="text" name="projectName" required value="${((o=this.project)==null?void 0:o.projectName)||""}">
        </label>

        <label>Компания / Заказчик *
          <input type="text" name="companyName" required value="${((i=this.project)==null?void 0:i.companyName)||""}">
        </label>

        <label>Бюджет ($) *
          <input type="number" name="budget" min="0" step="0.01" required value="${((r=this.project)==null?void 0:r.budget)||""}">
        </label>

        <label>Требуемая ёмкость (capacity) *
          <input type="number" name="capacity" min="0.1" step="0.1" required value="${((c=this.project)==null?void 0:c.capacity)||1}">
        </label>

        <div class="modal-actions-inline" style="margin-top: 20px">
          <button type="submit">${s?"Сохранить изменения":"Создать проект"}</button>
        </div>
      </form>
    `,t.style.display="flex";const n=e.querySelector("#project-form");n.onsubmit=u=>{u.preventDefault();const l=new FormData(n),d={projectName:l.get("projectName"),companyName:l.get("companyName"),budget:parseFloat(l.get("budget")),capacity:parseFloat(l.get("capacity"))};s&&this.project?k(this.monthKey,this.project.id,d):F(this.monthKey,d),t.style.display="none",this.onSave()}}}class V{constructor(t){this.currentData=null,this.monthKey="",this.sortState={field:"projectName",direction:"asc"},t.innerHTML=`
      <table class="project-list">
        <thead>
          <tr>
            <th class="sortable" data-field="projectName">Название</th>
            <th class="sortable" data-field="budget">Бюджет</th>
            <th>Ставка</th>
            <th>Профит</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody id="project-tbody"></tbody>
      </table>
    `,this.tbody=t.querySelector("#project-tbody"),this.initSort()}update(t,e){this.currentData=t,this.monthKey=e,this.refresh()}refresh(){if(!this.currentData)return;let t=[...this.currentData.projects];this.applySort(t),this.tbody.innerHTML="",t.forEach(e=>{this.tbody.appendChild(this.buildRow(e))}),this.updateSortHeaders()}buildRow(t){const e=document.createElement("tr"),s=this.calculateProjectStats(t.id),n=s.revenue-s.cost,o=L(t);return e.innerHTML=`
      <td><strong>${t.projectName}</strong><br><small>${t.companyName}</small></td>
      <td>$${t.budget.toLocaleString()}</td>
      <td>$${o.toFixed(0)}</td>
      <td class="${n>=0?"positive":"negative"}">
        $${n.toLocaleString(void 0,{minimumFractionDigits:2})}
      </td>
      <td>
        <button class="btn-edit" title="Редактировать">✎</button>
        <button class="btn-delete" title="Удалить">✕</button>
      </td>
    `,e.querySelector(".btn-edit").onclick=()=>{new j(this.monthKey,()=>window.app.update(),t).show()},e.querySelector(".btn-delete").onclick=()=>{confirm(`Удалить проект "${t.projectName}"?`)&&(P(this.monthKey,t.id),window.app.update())},e}calculateProjectStats(t){var n;let e=0,s=0;return(n=this.currentData)==null||n.employees.forEach(o=>{var r;if(o.assignments.find(c=>c.projectId===t)){const c=(r=this.currentData)==null?void 0:r.projects.find(u=>u.id===t);c&&(e+=f(o,c,this.currentData),s+=g(o,c.id))}}),{revenue:e,cost:s}}initSort(){var t,e;(e=(t=this.tbody.parentElement)==null?void 0:t.querySelector("thead"))==null||e.addEventListener("click",s=>{const n=s.target.closest("th");if(n&&n.classList.contains("sortable")){const o=n.dataset.field;this.sortState.direction=this.sortState.field===o&&this.sortState.direction==="asc"?"desc":"asc",this.sortState.field=o,this.refresh()}})}applySort(t){const{field:e,direction:s}=this.sortState;t.sort((n,o)=>{const i=n[e],r=o[e],c=s==="asc"?1:-1;return i<r?-1*c:i>r?1*c:0})}updateSortHeaders(){var t;(t=this.tbody.parentElement)==null||t.querySelectorAll("th.sortable").forEach(e=>{const s=e.dataset.field;e.classList.toggle("active",s===this.sortState.field),s===this.sortState.field&&(e.classList.toggle("asc",this.sortState.direction==="asc"),e.classList.toggle("desc",this.sortState.direction==="desc"))})}}class J{constructor(){this.monthKey="";const t=new Date;this.monthKey=`${t.getFullYear()}-${String(t.getMonth()+1).padStart(2,"0")}`,m(this.monthKey),this.profitDisplay=document.getElementById("total-profit"),this.employeeList=new Y(document.getElementById("employee-list")),this.projectList=new V(document.getElementById("project-list")),this.initEvents(),this.update()}initEvents(){const t=document.getElementById("modal-overlay");document.getElementById("add-employee-btn").onclick=()=>{new w(this.monthKey,()=>this.update()).show()},document.getElementById("add-project-btn").onclick=()=>{new j(this.monthKey,()=>this.update()).show()},document.getElementById("modal-close").onclick=()=>{t.style.display="none"},t.onclick=e=>{e.target===t&&(t.style.display="none")},new R(document.getElementById("month-selector-container"),this.monthKey,e=>{this.monthKey=e,this.update()})}update(){const t=m(this.monthKey),e=K(t);this.employeeList.update(t,this.monthKey),this.projectList.update(t,this.monthKey),this.profitDisplay.textContent=`${e.toLocaleString()} $`,this.profitDisplay.className=e>=0?"positive":"negative"}}const G=new J;window.app=G;
