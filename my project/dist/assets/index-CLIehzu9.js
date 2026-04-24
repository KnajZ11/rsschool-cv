(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))s(n);new MutationObserver(n=>{for(const o of n)if(o.type==="childList")for(const i of o.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&s(i)}).observe(document,{childList:!0,subtree:!0});function e(n){const o={};return n.integrity&&(o.integrity=n.integrity),n.referrerPolicy&&(o.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?o.credentials="include":n.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function s(n){if(n.ep)return;n.ep=!0;const o=e(n);fetch(n.href,o)}})();const j="monthlyData";function E(){const a=localStorage.getItem(j);if(!a)return{};try{return JSON.parse(a)}catch{return{}}}function x(a){localStorage.setItem(j,JSON.stringify(a))}function m(a){return E()[a]||null}function u(a,t){const e=E();e[a]=t,x(e)}function f(a){const t=m(a);if(t)return t;const e={monthKey:a,employees:[],projects:[],timestamp:Date.now()};return u(a,e),e}const D=()=>Date.now().toString(36)+Math.random().toString(36).slice(2,11);function K(a){const[t,e]=a.split("-").map(Number),s=new Date(t,e,0).getDate();let n=0;for(let o=1;o<=s;o++){const i=new Date(t,e-1,o).getDay();i!==0&&i!==6&&n++}return n||22}function q(a,t){const e=K(t),[s,n]=t.split("-").map(Number),o=(a.vacationDays||[]).filter(i=>{const c=new Date(s,n-1,i).getDay();return c!==0&&c!==6}).length;return Math.max(0,(e-o)/e)}function w(a,t,e){var o;const s=(o=a.assignments)==null?void 0:o.find(i=>i.projectId===t);if(!s)return 0;const n=q(a,e);return(s.capacity||0)*(s.fitness||0)*n}function S(a,t,e){const s=w(a,t.id,e.monthKey),n=e.employees.reduce((r,c)=>r+w(c,t.id,e.monthKey),0),o=Math.max(t.capacity||0,n);return o===0?0:(t.budget||0)/o*s}function $(a,t){var s;const e=(s=a.assignments)==null?void 0:s.find(n=>n.projectId===t);return e?(a.salary||0)*Math.max(.5,e.capacity||0):0}function I(a){return(a.salary||0)*.5}function C(a){return!a.projects||!a.employees?0:a.projects.reduce((t,e)=>t+a.employees.reduce((s,n)=>s+S(n,e,a),0),0)}function B(a){return a.employees?a.employees.reduce((t,e)=>(e.assignments||[]).length>0?t+e.assignments.reduce((s,n)=>s+$(e,n.projectId),0):t+I(e),0):0}function F(a){return C(a)-B(a)}function k(a,t){const e=f(a),s={...t,id:D(),assignments:[],vacationDays:[]};e.employees=[...e.employees,s],u(a,e)}function P(a,t,e){const s=m(a);s&&(s.employees=s.employees.map(n=>n.id===t?{...n,...e}:n),u(a,s))}function T(a,t){const e=m(a);e&&(e.employees=e.employees.filter(s=>s.id!==t),u(a,e))}function A(a,t){const e=f(a),s={...t,id:D()};e.projects=[...e.projects,s],u(a,e)}function H(a,t,e){const s=m(a);s&&(s.projects=s.projects.map(n=>n.id===t?{...n,...e}:n),u(a,s))}function O(a,t){const e=m(a);e&&(e.projects=e.projects.filter(s=>s.id!==t),e.employees=e.employees.map(s=>({...s,assignments:s.assignments.filter(n=>n.projectId!==t)})),u(a,e))}function N(a,t,e,s,n){const o=m(a);if(!o)return{success:!1,error:"Месяц не инициализирован"};const i=o.employees.find(r=>r.id===t);return i?i.assignments.some(r=>r.projectId===e)?{success:!1,error:"Уже назначен на этот проект"}:(i.assignments.push({employeeId:t,projectId:e,capacity:s,fitness:n}),u(a,o),{success:!0}):{success:!1,error:"Сотрудник не найден"}}function R(a,t,e){const s=m(a);s&&(s.employees=s.employees.map(n=>n.id===t?{...n,assignments:n.assignments.filter(o=>o.projectId!==e)}:n),u(a,s))}function U(a,t,e){const s=m(a);s&&(s.employees=s.employees.map(n=>n.id===t?{...n,vacationDays:[...e].sort((o,i)=>o-i)}:n),u(a,s))}function Y(a,t){const e=m(a);if(!e)return!1;const s=new Map,n=e.projects.map(i=>{const r=D();return s.set(i.id,r),{...i,id:r}}),o=e.employees.map(i=>{const r=D();return{...i,id:r,vacationDays:[],assignments:i.assignments.map(c=>({...c,employeeId:r,projectId:s.get(c.projectId)||c.projectId}))}});return u(t,{monthKey:t,employees:o,projects:n,timestamp:Date.now()}),!0}class W{constructor(t,e,s){this.container=t,this.currentKey=e,this.onChange=s,this.render()}render(){this.container.innerHTML="";const t=document.createElement("div");t.className="month-selector-controls",this.select=document.createElement("select");const e=[2024,2025,2026],s=["01","02","03","04","05","06","07","08","09","10","11","12"];for(const o of e)for(const i of s){const r=`${o}-${i}`,c=document.createElement("option");c.value=r,c.textContent=`${o} / ${i}`,r===this.currentKey&&(c.selected=!0),this.select.appendChild(c)}this.select.addEventListener("change",()=>{this.currentKey=this.select.value,this.onChange(this.currentKey)});const n=document.createElement("button");n.textContent="📋 Copy from previous month",n.className="btn-copy",n.addEventListener("click",()=>{const[o,i]=this.currentKey.split("-").map(Number),r=new Date(o,i-2),c=`${r.getFullYear()}-${String(r.getMonth()+1).padStart(2,"0")}`;Y(c,this.currentKey)?(this.onChange(this.currentKey),alert(`Данные успешно скопированы из ${c}`)):alert(`Нет данных за предыдущий месяц (${c})`)}),t.appendChild(this.select),t.appendChild(n),this.container.appendChild(t)}}class L{constructor(t,e,s){this.monthKey=t,this.onSave=e,this.employee=s}show(){var h,l,d,g;const t=document.getElementById("modal-overlay"),e=document.getElementById("modal-content"),s=!!this.employee,n=["junior","middle","senior","lead","architect","BO"],o=new Date,i=new Date(o.getFullYear()-18,o.getMonth(),o.getDate()).toISOString().split("T")[0];e.innerHTML=`
      <h3>${s?"Редактировать":"Добавить"} сотрудника</h3>
      <form id="emp-form">
        <label>Имя: 
          <input name="firstName" value="${((h=this.employee)==null?void 0:h.firstName)||""}" required>
        </label>
        <label>Фамилия: 
          <input name="lastName" value="${((l=this.employee)==null?void 0:l.lastName)||""}" required>
        </label>
        <label>Дата рождения (18+): 
          <input type="date" name="birthDate" 
            value="${((d=this.employee)==null?void 0:d.birthDate)||""}" 
            max="${i}" 
            required>
        </label>
        <label>Позиция: 
          <select name="position" required>
            ${n.map(y=>{var p;return`
              <option value="${y}" ${((p=this.employee)==null?void 0:p.position)===y?"selected":""}>
                ${y.toUpperCase()}
              </option>
            `}).join("")}
          </select>
        </label>
        <label>Зарплата ($): 
          <input type="number" name="salary" value="${((g=this.employee)==null?void 0:g.salary)||""}" required min="1">
        </label>
        
        <div id="form-error" style="color: var(--danger-color); font-size: 0.85rem; margin-bottom: 10px;"></div>

        <div class="modal-actions-inline" style="margin-top: 20px">
          <button type="submit" class="btn-primary">${s?"Сохранить":"Создать"}</button>
        </div>
      </form>
    `,t.style.display="flex";const r=e.querySelector("#emp-form"),c=e.querySelector("#form-error");r.onsubmit=y=>{y.preventDefault();const p=new FormData(r),b=p.get("birthDate");if(b>i){c.textContent="Сотрудник должен быть старше 18 лет.";return}const v={firstName:p.get("firstName"),lastName:p.get("lastName"),birthDate:b,position:p.get("position"),salary:Number(p.get("salary"))};s&&this.employee?P(this.monthKey,this.employee.id,v):k(this.monthKey,v),t.style.display="none",this.onSave()}}}class V{constructor(t,e,s){this.monthKey=t,this.employeeId=e,this.onUpdate=s}show(){const t=document.getElementById("modal-overlay"),e=document.getElementById("modal-content"),s=f(this.monthKey),n=s.employees.find(o=>o.id===this.employeeId);n&&(t.style.display="flex",e.innerHTML=`
      <h3>Проекты сотрудника: ${n.lastName}</h3>
      <div id="current-assignments">
        ${this.renderAssignments(n.assignments,s)}
      </div>
      
      <hr style="margin: 20px 0; border: 0; border-top: 1px solid #eee;">
      
      <h4>Добавить новое назначение</h4>
      <form id="assign-form">
        <label>Проект
          <select name="projectId" required>
            <option value="" disabled selected>Выберите проект...</option>
            ${s.projects.map(o=>`<option value="${o.id}">${o.projectName}</option>`).join("")}
          </select>
        </label>
        <label>Загрузка (0.1 - 1.5)
          <input type="number" name="capacity" min="0.1" max="1.5" step="0.1" value="1.0" required>
        </label>
        <label>Фитнес-фактор (0 - 1.0)
          <input type="number" name="fitness" min="0" max="1" step="0.01" value="1.0" required>
        </label>
        <button type="submit" style="margin-top: 10px; width: 100%;">Добавить проект</button>
      </form>
    `,this.initEvents(e))}renderAssignments(t,e){return t.length===0?'<p class="text-muted">Нет активных проектов</p>':`
      <table class="employee-list">
        <thead>
          <tr>
            <th>Проект</th>
            <th>Cap/Fit</th>
            <th>Удалить</th>
          </tr>
        </thead>
        <tbody>
          ${t.map(s=>{const n=e.projects.find(o=>o.id===s.projectId);return`
              <tr>
                <td>${(n==null?void 0:n.projectName)||"Удаленный проект"}</td>
                <td>${s.capacity} / ${s.fitness}</td>
                <td><button class="btn-delete" data-project-id="${s.projectId}">✕</button></td>
              </tr>
            `}).join("")}
        </tbody>
      </table>
    `}initEvents(t){const e=t.querySelector("#assign-form");e.onsubmit=s=>{s.preventDefault();const n=new FormData(e),o=N(this.monthKey,this.employeeId,n.get("projectId"),parseFloat(n.get("capacity")),parseFloat(n.get("fitness")));o.success?(this.onUpdate(),this.show()):alert(o.error)},t.querySelectorAll(".btn-delete").forEach(s=>{s.onclick=()=>{const n=s.dataset.projectId;R(this.monthKey,this.employeeId,n),this.onUpdate(),this.show()}})}}class J{constructor(t,e,s){this.monthKey=t,this.employeeId=e,this.onSave=s;const[n,o]=t.split("-").map(Number);this.daysInMonth=new Date(n,o,0).getDate();const r=f(t).employees.find(c=>c.id===e);this.selectedDays=new Set((r==null?void 0:r.vacationDays)||[])}show(){const t=document.getElementById("modal-overlay"),e=document.getElementById("modal-content");t.style.display="flex",e.innerHTML=`
      <h3>Выберите дни отпуска</h3>
      <div class="vacation-calendar" id="calendar-grid">
        ${this.generateCalendarHTML()}
      </div>
      <div class="modal-actions-inline" style="margin-top: 20px">
        <button id="save-vacation">Сохранить</button>
      </div>
    `,e.querySelector("#calendar-grid").addEventListener("click",n=>{const o=n.target.closest(".day");if(!o)return;const i=parseInt(o.dataset.day);this.selectedDays.has(i)?(this.selectedDays.delete(i),o.classList.remove("selected")):(this.selectedDays.add(i),o.classList.add("selected"))}),e.querySelector("#save-vacation").onclick=()=>{const n=Array.from(this.selectedDays).sort((o,i)=>o-i);U(this.monthKey,this.employeeId,n),t.style.display="none",this.onSave()}}generateCalendarHTML(){const t=["Пн","Вт","Ср","Чт","Пт","Сб","Вс"],[e,s]=this.monthKey.split("-").map(Number),n=new Date(e,s-1,1).getDay(),o=n===0?6:n-1;let i=t.map(r=>`<div class="day-header">${r}</div>`).join("");for(let r=0;r<o;r++)i+='<div class="empty"></div>';for(let r=1;r<=this.daysInMonth;r++){const c=this.selectedDays.has(r);i+=`
        <button type="button" class="day ${c?"selected":""}" data-day="${r}">
          ${r}
        </button>
      `}return i}}class z{constructor(t){this.currentData=null,this.monthKey="",this.sortState={field:"name",direction:"asc"},this.container=t,this.renderBase()}renderBase(){this.container.innerHTML=`
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
    `,this.tbody=this.container.querySelector("tbody"),this.container.querySelector("thead").addEventListener("click",t=>{const e=t.target.closest("th");e!=null&&e.dataset.field&&this.handleSort(e.dataset.field)})}update(t,e){this.currentData=t,this.monthKey=e,this.refresh()}refresh(){if(!this.currentData)return;this.container.querySelectorAll("th.sortable").forEach(e=>{const s=e.dataset.field;e.classList.toggle("active",s===this.sortState.field),s===this.sortState.field&&(e.classList.toggle("asc",this.sortState.direction==="asc"),e.classList.toggle("desc",this.sortState.direction==="desc"))});let t=[...this.currentData.employees];this.applySort(t),this.tbody.innerHTML="",t.forEach(e=>{this.tbody.appendChild(this.buildRow(e))})}buildRow(t){const e=document.createElement("tr"),s=t.assignments.reduce((c,h)=>c+h.capacity,0),n=s>1.2?"overload":s<.5?"warning":"normal";let o=0,i=0;t.assignments.length>0?t.assignments.forEach(c=>{var l;const h=(l=this.currentData)==null?void 0:l.projects.find(d=>d.id===c.projectId);h&&this.currentData&&(o+=S(t,h,this.currentData),i+=$(t,c.projectId))}):i=I(t);const r=o-i;return e.innerHTML=`
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
    `,e.querySelector(".capacity-bar").onclick=()=>{new V(this.monthKey,t.id,()=>window.app.update()).show()},e.querySelector(".btn-vacation").onclick=()=>{new J(this.monthKey,t.id,()=>window.app.update()).show()},e.querySelector(".btn-edit").onclick=()=>{new L(this.monthKey,()=>window.app.update(),t).show()},e.querySelector(".btn-delete").onclick=()=>{confirm(`Удалить сотрудника ${t.lastName}?`)&&(T(this.monthKey,t.id),window.app.update())},e}handleSort(t){this.sortState.field===t?this.sortState.direction=this.sortState.direction==="asc"?"desc":"asc":(this.sortState.field=t,this.sortState.direction="asc"),this.refresh()}applySort(t){const{field:e,direction:s}=this.sortState,n=s==="asc"?1:-1;t.sort((o,i)=>{let r,c;return e==="name"?(r=o.lastName,c=i.lastName):e==="age"?(r=o.birthDate,c=i.birthDate):(r=o[e],c=i[e]),r<c?-1*n:r>c?1*n:0})}calculateAge(t){if(!t)return 0;const e=new Date(t),s=new Date;let n=s.getFullYear()-e.getFullYear();const o=s.getMonth()-e.getMonth();return(o<0||o===0&&s.getDate()<e.getDate())&&n--,isNaN(n)?0:n}}class M{constructor(t,e,s){this.monthKey=t,this.onSave=e,this.project=s}show(){var i,r,c,h;const t=document.getElementById("modal-overlay"),e=document.getElementById("modal-content"),s=!!this.project,n=f(this.monthKey);e.innerHTML=`
      <h3>${s?"Редактировать проект":"Новый проект"}</h3>
      <form id="project-form">
        <label>Название проекта *
          <input type="text" name="projectName" required value="${((i=this.project)==null?void 0:i.projectName)||""}">
        </label>

        <label>Компания / Заказчик *
          <input type="text" name="companyName" required value="${((r=this.project)==null?void 0:r.companyName)||""}">
        </label>

        <label>Бюджет проекта ($) *
          <input type="number" name="budget" min="1" step="0.01" required value="${((c=this.project)==null?void 0:c.budget)||""}">
        </label>

        <label title="Целевое количество сотрудников. Влияет на доходность.">
          Требуемая ёмкость (capacity) *
          <input type="number" name="capacity" min="0.1" step="0.1" required value="${((h=this.project)==null?void 0:h.capacity)||1}">
        </label>

        <!-- Блок быстрого назначения сотрудника (только при создании) -->
        ${s?"":`
        <div style="background: #f9f9f9; padding: 12px; border-radius: 8px; margin: 15px 0; border: 1px dashed #ccc;">
          <h4 style="margin: 0 0 10px 0;">Назначить сотрудника сразу</h4>
          <label>Выбрать из команды:
            <select name="initialEmployeeId">
              <option value="">-- Не назначать --</option>
              ${n.employees.map(l=>`
                <option value="${l.id}">${l.lastName} ${l.firstName} (ЗП: ${l.salary})</option>
              `).join("")}
            </select>
          </label>
          <label>Загрузка (capacity):
            <input type="number" name="empLoad" min="0.1" max="1.5" step="0.1" value="1.0">
          </label>
        </div>
        `}

        <div class="modal-actions-inline" style="margin-top: 20px">
          <button type="submit" class="btn-primary">${s?"Сохранить изменения":"Создать проект"}</button>
        </div>
      </form>
    `,t.style.display="flex";const o=e.querySelector("#project-form");o.onsubmit=l=>{l.preventDefault();const d=new FormData(o),g={projectName:d.get("projectName"),companyName:d.get("companyName"),budget:parseFloat(d.get("budget"))||0,capacity:parseFloat(d.get("capacity"))||1};if(s&&this.project)H(this.monthKey,this.project.id,g);else{A(this.monthKey,g);const y=f(this.monthKey),p=y.projects[y.projects.length-1],b=d.get("initialEmployeeId"),v=parseFloat(d.get("empLoad"));b&&p&&N(this.monthKey,b,p.id,v,1)}t.style.display="none",this.onSave()}}}class G{constructor(t){this.currentData=null,this.monthKey="",this.sortState={field:"projectName",direction:"asc"},t.innerHTML=`
      <table class="project-list">
        <thead>
          <tr>
            <th class="sortable" data-field="projectName">Проект</th>
            <th class="sortable" data-field="budget">Бюджет</th>
            <th>Загрузка (Real/Cap)</th>
            <th>Профит</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody id="project-tbody"></tbody>
      </table>
    `,this.tbody=t.querySelector("#project-tbody"),this.initSort()}update(t,e){this.currentData=t,this.monthKey=e,this.refresh()}refresh(){if(!this.currentData)return;let t=[...this.currentData.projects];this.applySort(t),this.tbody.innerHTML="",t.forEach(e=>{this.tbody.appendChild(this.buildRow(e))}),this.updateSortHeaders()}buildRow(t){const e=document.createElement("tr"),s=this.calculateProjectStats(t.id),n=s.revenue-s.cost;return e.innerHTML=`
      <td>
        <strong>${t.projectName}</strong><br>
        <small>${t.companyName}</small>
      </td>
      <td>$${t.budget.toLocaleString()}</td>
      <td>
        <span title="Реальная загрузка / Требуемая емкость">
          ${s.totalRealCapacity.toFixed(1)} / ${t.capacity||1}
        </span>
      </td>
      <td class="${n>=0?"positive":"negative"}">
        <strong>$${Math.round(n).toLocaleString()}</strong>
      </td>
      <td>
        <button class="btn-edit" title="Редактировать">✎</button>
        <button class="btn-delete" title="Удалить">✕</button>
      </td>
    `,e.querySelector(".btn-edit").onclick=()=>{new M(this.monthKey,()=>window.app.update(),t).show()},e.querySelector(".btn-delete").onclick=()=>{confirm(`Удалить проект "${t.projectName}"?`)&&(O(this.monthKey,t.id),window.app.update())},e}calculateProjectStats(t){let e=0,s=0,n=0;if(!this.currentData)return{revenue:e,cost:s,totalRealCapacity:n};const o=this.currentData.projects.find(i=>i.id===t);return o?(this.currentData.employees.forEach(i=>{const r=i.assignments.find(c=>c.projectId===t);r&&(e+=S(i,o,this.currentData),s+=$(i,o.id),n+=r.capacity)}),{revenue:e,cost:s,totalRealCapacity:n}):{revenue:e,cost:s,totalRealCapacity:n}}initSort(){var e;const t=(e=this.tbody.parentElement)==null?void 0:e.querySelector("thead");t&&t.addEventListener("click",s=>{const n=s.target.closest("th");if(n&&n.classList.contains("sortable")){const o=n.dataset.field;this.sortState.direction=this.sortState.field===o&&this.sortState.direction==="asc"?"desc":"asc",this.sortState.field=o,this.refresh()}})}applySort(t){const{field:e,direction:s}=this.sortState,n=s==="asc"?1:-1;t.sort((o,i)=>{const r=o[e],c=i[e];return r<c?-1*n:r>c?1*n:0})}updateSortHeaders(){var t;(t=this.tbody.parentElement)==null||t.querySelectorAll("th.sortable").forEach(e=>{const s=e.dataset.field;e.classList.toggle("active",s===this.sortState.field),s===this.sortState.field&&(e.classList.toggle("asc",this.sortState.direction==="asc"),e.classList.toggle("desc",this.sortState.direction==="desc"))})}}class _{constructor(){this.monthKey="";const t=new Date;this.monthKey=`${t.getFullYear()}-${String(t.getMonth()+1).padStart(2,"0")}`,f(this.monthKey),this.profitDisplay=document.getElementById("total-profit"),this.employeeList=new z(document.getElementById("employee-list")),this.projectList=new G(document.getElementById("project-list")),this.initEvents(),this.update()}initEvents(){const t=document.getElementById("modal-overlay");document.getElementById("add-employee-btn").onclick=()=>{new L(this.monthKey,()=>this.update()).show()},document.getElementById("add-project-btn").onclick=()=>{new M(this.monthKey,()=>this.update()).show()},document.getElementById("modal-close").onclick=()=>{t.style.display="none"},t.onclick=e=>{e.target===t&&(t.style.display="none")},new W(document.getElementById("month-selector-container"),this.monthKey,e=>{this.monthKey=e,this.update()})}update(){const t=f(this.monthKey),e=F(t);this.employeeList.update(t,this.monthKey),this.projectList.update(t,this.monthKey),this.profitDisplay.textContent=`${e.toLocaleString()} $`,this.profitDisplay.className=e>=0?"positive":"negative"}}const Q=new _;window.app=Q;
