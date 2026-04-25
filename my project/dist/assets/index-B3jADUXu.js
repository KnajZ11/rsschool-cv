(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))s(n);new MutationObserver(n=>{for(const a of n)if(a.type==="childList")for(const i of a.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&s(i)}).observe(document,{childList:!0,subtree:!0});function e(n){const a={};return n.integrity&&(a.integrity=n.integrity),n.referrerPolicy&&(a.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?a.credentials="include":n.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function s(n){if(n.ep)return;n.ep=!0;const a=e(n);fetch(n.href,a)}})();const j="monthlyData";function E(){const o=localStorage.getItem(j);if(!o)return{};try{return JSON.parse(o)}catch{return{}}}function M(o){localStorage.setItem(j,JSON.stringify(o))}function u(o){return E()[o]||null}function h(o,t){const e=E();e[o]=t,M(e)}function f(o){const t=u(o);if(t)return t;const e={monthKey:o,employees:[],projects:[],timestamp:Date.now()};return h(o,e),e}const D=()=>Date.now().toString(36)+Math.random().toString(36).slice(2,11);function C(o){const[t,e]=o.split("-").map(Number),s=new Date(t,e,0).getDate();let n=0;for(let a=1;a<=s;a++){const i=new Date(t,e-1,a).getDay();i!==0&&i!==6&&n++}return n||22}function K(o,t){const e=C(t),[s,n]=t.split("-").map(Number),a=(o.vacationDays||[]).filter(i=>{const r=new Date(s,n-1,i).getDay();return r!==0&&r!==6}).length;return Math.max(0,(e-a)/e)}function w(o,t,e){var a;const s=(a=o.assignments)==null?void 0:a.find(i=>i.projectId===t);if(!s)return 0;const n=K(o,e);return(s.capacity||0)*(s.fitness||0)*n}function S(o,t,e){const s=w(o,t.id,e.monthKey),n=e.employees.reduce((c,r)=>c+w(r,t.id,e.monthKey),0),a=Math.max(t.capacity||0,n);return a===0?0:(t.budget||0)/a*s}function q(o,t){var s;const e=(s=o.assignments)==null?void 0:s.find(n=>n.projectId===t);return e?(o.salary||0)*(e.capacity||0):0}function x(o){const t=o.salary||0,s=(o.assignments||[]).reduce((c,r)=>c+(r.capacity||0),0),n=s*t,i=Math.max(0,1-s)*t*.5;return n+i}function k(o){return!o.projects||!o.employees?0:o.projects.reduce((t,e)=>t+o.employees.reduce((s,n)=>s+S(n,e,o),0),0)}function F(o){return o.employees?o.employees.reduce((t,e)=>t+x(e),0):0}function B(o){return k(o)-F(o)}function P(o,t){const e=f(o),s={...t,id:D(),assignments:[],vacationDays:[]};e.employees=[...e.employees,s],h(o,e)}function T(o,t,e){const s=u(o);s&&(s.employees=s.employees.map(n=>n.id===t?{...n,...e}:n),h(o,s))}function A(o,t){const e=u(o);e&&(e.employees=e.employees.filter(s=>s.id!==t),h(o,e))}function O(o,t){const e=f(o),s={...t,id:D()};e.projects=[...e.projects,s],h(o,e)}function H(o,t,e){const s=u(o);s&&(s.projects=s.projects.map(n=>n.id===t?{...n,...e}:n),h(o,s))}function R(o,t){const e=u(o);e&&(e.projects=e.projects.filter(s=>s.id!==t),e.employees=e.employees.map(s=>({...s,assignments:s.assignments.filter(n=>n.projectId!==t)})),h(o,e))}function I(o,t,e,s,n){const a=u(o);if(!a)return{success:!1,error:"Месяц не инициализирован"};const i=a.employees.find(c=>c.id===t);return i?i.assignments.some(c=>c.projectId===e)?{success:!1,error:"Уже назначен на этот проект"}:(i.assignments.push({projectId:e,capacity:s,fitness:n}),h(o,a),{success:!0}):{success:!1,error:"Сотрудник не найден"}}function U(o,t,e){const s=u(o);s&&(s.employees=s.employees.map(n=>n.id===t?{...n,assignments:n.assignments.filter(a=>a.projectId!==e)}:n),h(o,s))}function W(o,t,e){const s=u(o);s&&(s.employees=s.employees.map(n=>n.id===t?{...n,vacationDays:[...e].sort((a,i)=>a-i)}:n),h(o,s))}function Y(o,t){const e=u(o);if(!e)return!1;const s=new Map,n=e.projects.map(i=>{const c=D();return s.set(i.id,c),{...i,id:c}}),a=e.employees.map(i=>{const c=D();return{...i,id:c,vacationDays:[],assignments:i.assignments.map(r=>({projectId:s.get(r.projectId)||r.projectId,capacity:r.capacity,fitness:r.fitness}))}});return h(t,{monthKey:t,employees:a,projects:n,timestamp:Date.now()}),!0}class V{constructor(t,e,s){this.container=t,this.currentKey=e,this.onChange=s,this.render()}render(){this.container.innerHTML="";const t=document.createElement("div");t.style.display="flex",t.style.gap="10px",t.style.alignItems="center",this.select=document.createElement("select");const e=[2024,2025,2026];for(const n of e)for(let a=1;a<=12;a++){const i=String(a).padStart(2,"0"),c=`${n}-${i}`,r=document.createElement("option");r.value=c,r.textContent=`${n} / ${i}`,c===this.currentKey&&(r.selected=!0),this.select.appendChild(r)}this.select.addEventListener("change",()=>{this.currentKey=this.select.value,this.onChange(this.currentKey)});const s=document.createElement("button");s.textContent="📋 Copy prev month",s.className="btn-copy",s.addEventListener("click",()=>{const n=u(this.currentKey);if(n&&(n.employees.length>0||n.projects.length>0)&&!confirm("В текущем месяце уже есть данные. Копирование полностью удалит их и заменит данными из прошлого месяца. Продолжить?"))return;const[a,i]=this.currentKey.split("-").map(Number),c=new Date(a,i-2),r=`${c.getFullYear()}-${String(c.getMonth()+1).padStart(2,"0")}`;Y(r,this.currentKey)?this.onChange(this.currentKey):alert(`Нет данных для копирования за предыдущий период (${r})`)}),t.appendChild(this.select),t.appendChild(s),this.container.appendChild(t)}}class L{constructor(t,e,s){this.monthKey=t,this.onSave=e,this.employee=s}show(){var d,l,p,g;const t=document.getElementById("modal-overlay"),e=document.getElementById("modal-content"),s=!!this.employee,n=["junior","middle","senior","lead","architect","BO"],a=new Date,i=new Date(a.getFullYear()-18,a.getMonth(),a.getDate()).toISOString().split("T")[0];e.innerHTML=`
      <h3>${s?"Редактировать":"Добавить"} сотрудника</h3>
      <form id="emp-form">
        <label>Имя: 
          <input name="firstName" value="${((d=this.employee)==null?void 0:d.firstName)||""}" required placeholder="Имя">
        </label>
        <label>Фамилия: 
          <input name="lastName" value="${((l=this.employee)==null?void 0:l.lastName)||""}" required placeholder="Фамилия">
        </label>
        <label>Дата рождения: 
          <input type="date" name="birthDate" 
            value="${((p=this.employee)==null?void 0:p.birthDate)||""}" 
            max="${i}" 
            required>
        </label>
        <label>Позиция: 
          <select name="position" required>
            ${n.map(y=>{var m;return`
              <option value="${y}" ${((m=this.employee)==null?void 0:m.position)===y?"selected":""}>
                ${y.toUpperCase()}
              </option>
            `}).join("")}
          </select>
        </label>
        <label>Зарплата ($): 
          <input type="number" name="salary" value="${((g=this.employee)==null?void 0:g.salary)||""}" required min="1" step="1">
        </label>
        
        <div id="form-error" style="color: var(--danger-color); font-size: 0.85rem; margin: 10px 0;"></div>

        <div class="modal-actions" style="margin-top: 20px">
          <button type="submit" class="btn-primary" style="width: 100%">${s?"Сохранить изменения":"Создать сотрудника"}</button>
        </div>
      </form>
    `,t.style.display="flex";const c=e.querySelector("#emp-form"),r=e.querySelector("#form-error");c.onsubmit=y=>{y.preventDefault();const m=new FormData(c),b=m.get("birthDate"),v=Number(m.get("salary"));if(b>i){r.textContent="Сотрудник должен быть совершеннолетним (18+).";return}if(v<=0){r.textContent="Зарплата должна быть положительным числом.";return}const $={firstName:m.get("firstName").trim(),lastName:m.get("lastName").trim(),birthDate:b,position:m.get("position"),salary:v};try{s&&this.employee?T(this.monthKey,this.employee.id,$):P(this.monthKey,$),t.style.display="none",this.onSave()}catch{r.textContent="Ошибка при сохранении данных."}}}}class z{constructor(t,e,s){this.monthKey=t,this.employeeId=e,this.onUpdate=s}show(){const t=document.getElementById("modal-overlay"),e=document.getElementById("modal-content"),s=f(this.monthKey),n=s.employees.find(i=>i.id===this.employeeId);if(!n)return;const a=s.projects.filter(i=>!n.assignments.some(c=>c.projectId===i.id));t.style.display="flex",e.innerHTML=`
      <h3>Проекты сотрудника: ${n.lastName} ${n.firstName}</h3>
      <div id="current-assignments">
        ${this.renderAssignments(n.assignments,s)}
      </div>
      
      <hr style="margin: 20px 0; border: 0; border-top: 1px solid #eee;">
      
      <h4>Добавить новое назначение</h4>
      <form id="assign-form">
        <label>Проект
          <select name="projectId" required>
            <option value="" disabled selected>${a.length?"Выберите проект...":"Нет доступных проектов"}</option>
            ${a.map(i=>`<option value="${i.id}">${i.projectName}</option>`).join("")}
          </select>
        </label>
        <div style="display: flex; gap: 10px; margin-top: 10px;">
          <label style="flex: 1;">Загрузка (0.1 - 1.5)
            <input type="number" name="capacity" min="0.1" max="1.5" step="0.1" value="1.0" required>
          </label>
          <label style="flex: 1;">Фитнес (0 - 1.0)
            <input type="number" name="fitness" min="0" max="1" step="0.01" value="1.0" required>
          </label>
        </div>
        <button type="submit" ${a.length===0?"disabled":""} style="margin-top: 15px; width: 100%;">
          Добавить проект
        </button>
      </form>
    `,this.initEvents(e)}renderAssignments(t,e){return t.length===0?'<p style="color: gray; text-align: center; padding: 10px;">Нет активных проектов</p>':`
      <table class="modal-table" style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr style="border-bottom: 2px solid #eee;">
            <th style="text-align: left; padding: 8px;">Проект</th>
            <th style="text-align: center; padding: 8px;">Cap / Fit</th>
            <th style="text-align: right; padding: 8px;">Удалить</th>
          </tr>
        </thead>
        <tbody>
          ${t.map(s=>{const n=e.projects.find(a=>a.id===s.projectId);return`
              <tr style="border-bottom: 1px solid #eee;">
                <td style="padding: 8px;">${(n==null?void 0:n.projectName)||'<span style="color:red">Удален</span>'}</td>
                <td style="text-align: center; padding: 8px;">
                  <span class="badge-cap">${s.capacity.toFixed(1)}</span> / 
                  <span class="badge-fit">${s.fitness.toFixed(2)}</span>
                </td>
                <td style="text-align: right; padding: 8px;">
                  <button class="btn-delete-small" data-project-id="${s.projectId}" title="Удалить назначение">✕</button>
                </td>
              </tr>
            `}).join("")}
        </tbody>
      </table>
    `}initEvents(t){const e=t.querySelector("#assign-form");e&&(e.onsubmit=s=>{s.preventDefault();const n=new FormData(e),a=I(this.monthKey,this.employeeId,n.get("projectId"),parseFloat(n.get("capacity")),parseFloat(n.get("fitness")));a.success?(this.onUpdate(),this.show()):alert(a.error)}),t.querySelectorAll(".btn-delete-small").forEach(s=>{s.onclick=()=>{const n=s.dataset.projectId;confirm("Удалить назначение сотрудника на этот проект?")&&(U(this.monthKey,this.employeeId,n),this.onUpdate(),this.show())}})}}class J{constructor(t,e,s){this.monthKey=t,this.employeeId=e,this.onSave=s;const[n,a]=t.split("-").map(Number);this.daysInMonth=new Date(n,a,0).getDate();const c=f(t).employees.find(r=>r.id===e);this.selectedDays=new Set((c==null?void 0:c.vacationDays)||[])}show(){const t=document.getElementById("modal-overlay"),e=document.getElementById("modal-content");t.style.display="flex",e.innerHTML=`
      <h3 style="margin-bottom: 10px;">Дни отпуска</h3>
      <p style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 15px;">
        Нажмите на рабочий день, чтобы отметить его как отпуск.
      </p>
      <div class="days-grid" id="calendar-grid">
        ${this.generateCalendarHTML()}
      </div>
      <div class="modal-actions" style="margin-top: 20px">
        <button id="save-vacation" class="btn-primary" style="width: 100%">Сохранить изменения</button>
      </div>
    `,e.querySelector("#calendar-grid").addEventListener("click",n=>{const a=n.target.closest(".day-checkbox");if(!a||a.classList.contains("off"))return;const i=parseInt(a.dataset.day);this.selectedDays.has(i)?(this.selectedDays.delete(i),a.classList.remove("selected")):(this.selectedDays.add(i),a.classList.add("selected"))}),e.querySelector("#save-vacation").onclick=()=>{const n=Array.from(this.selectedDays).sort((a,i)=>a-i);W(this.monthKey,this.employeeId,n),t.style.display="none",this.onSave()}}generateCalendarHTML(){const t=["Пн","Вт","Ср","Чт","Пт","Сб","Вс"],[e,s]=this.monthKey.split("-").map(Number);let a=new Date(e,s-1,1).getDay();const i=a===0?6:a-1;let c=t.map(r=>`<div class="day-header">${r}</div>`).join("");for(let r=0;r<i;r++)c+='<div class="day-checkbox off"></div>';for(let r=1;r<=this.daysInMonth;r++){const d=new Date(e,s-1,r),l=d.getDay()===0||d.getDay()===6,p=this.selectedDays.has(r);c+=`
        <div class="day-checkbox day ${p?"selected":""} ${l?"weekend":""}" 
             data-day="${r}"
             style="${l?"background: #fff0f0; border-color: #ffdadb;":""}">
          ${r}
        </div>
      `}return c}}class G{constructor(t){this.currentData=null,this.monthKey="",this.sortState={field:"name",direction:"asc"},this.container=t,this.renderBase()}renderBase(){this.container.innerHTML=`
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
    `,this.tbody=this.container.querySelector("tbody"),this.container.querySelector("thead").addEventListener("click",t=>{const e=t.target.closest("th");e!=null&&e.dataset.field&&this.handleSort(e.dataset.field)})}update(t,e){this.currentData=t,this.monthKey=e,this.refresh()}refresh(){if(!this.currentData)return;this.container.querySelectorAll("th.sortable").forEach(e=>{const s=e.dataset.field;e.classList.toggle("active",s===this.sortState.field),s===this.sortState.field&&(e.classList.toggle("asc",this.sortState.direction==="asc"),e.classList.toggle("desc",this.sortState.direction==="desc"))});let t=[...this.currentData.employees];this.applySort(t),this.tbody.innerHTML="",t.forEach(e=>{this.tbody.appendChild(this.buildRow(e))})}buildRow(t){const e=document.createElement("tr"),s=t.assignments.reduce((r,d)=>r+d.capacity,0),n=s>1.2?"overload":s<.5?"warning":"normal";let a=0;t.assignments.forEach(r=>{var l;const d=(l=this.currentData)==null?void 0:l.projects.find(p=>p.id===r.projectId);d&&this.currentData&&(a+=S(t,d,this.currentData))});const i=x(t),c=a-i;return e.innerHTML=`
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
      <td>${Math.round(a).toLocaleString()}</td>
      <td title="Включает проектную ставку и частичный бенч (50%)">
        ${Math.round(i).toLocaleString()}
      </td>
      <td class="${c>=0?"positive":"negative"}">
        <strong>${Math.round(c).toLocaleString()}</strong>
      </td>
      <td>
        <button class="btn-edit" title="Редактировать">✎</button>
        <button class="btn-vacation" title="Отпуска">📅</button>
        <button class="btn-delete" title="Удалить">✕</button>
      </td>
    `,e.querySelector(".capacity-bar").onclick=()=>{new z(this.monthKey,t.id,()=>window.app.update()).show()},e.querySelector(".btn-vacation").onclick=()=>{new J(this.monthKey,t.id,()=>window.app.update()).show()},e.querySelector(".btn-edit").onclick=()=>{new L(this.monthKey,()=>window.app.update(),t).show()},e.querySelector(".btn-delete").onclick=()=>{confirm(`Удалить сотрудника ${t.lastName}?`)&&(A(this.monthKey,t.id),window.app.update())},e}handleSort(t){this.sortState.field===t?this.sortState.direction=this.sortState.direction==="asc"?"desc":"asc":(this.sortState.field=t,this.sortState.direction="asc"),this.refresh()}applySort(t){const{field:e,direction:s}=this.sortState,n=s==="asc"?1:-1;t.sort((a,i)=>{let c,r;return e==="name"?(c=a.lastName,r=i.lastName):e==="age"?(c=a.birthDate,r=i.birthDate):(c=a[e],r=i[e]),c<r?-1*n:c>r?1*n:0})}calculateAge(t){if(!t)return 0;const e=new Date(t),s=new Date;let n=s.getFullYear()-e.getFullYear();const a=s.getMonth()-e.getMonth();return(a<0||a===0&&s.getDate()<e.getDate())&&n--,isNaN(n)?0:n}}class N{constructor(t,e,s){this.monthKey=t,this.onSave=e,this.project=s}show(){var i,c,r,d;const t=document.getElementById("modal-overlay"),e=document.getElementById("modal-content"),s=!!this.project,n=f(this.monthKey);e.innerHTML=`
      <h3>${s?"Редактировать проект":"Новый проект"}</h3>
      <form id="project-form">
        <label>Название проекта *
          <input type="text" name="projectName" required value="${((i=this.project)==null?void 0:i.projectName)||""}">
        </label>

        <label>Компания / Заказчик *
          <input type="text" name="companyName" required value="${((c=this.project)==null?void 0:c.companyName)||""}">
        </label>

        <label>Бюджет проекта ($) *
          <input type="number" name="budget" min="1" step="0.01" required value="${((r=this.project)==null?void 0:r.budget)||""}">
        </label>

        <label title="Целевое количество сотрудников. Влияет на доходность.">
          Требуемая ёмкость (capacity) *
          <input type="number" name="capacity" min="0.1" step="0.1" required value="${((d=this.project)==null?void 0:d.capacity)||1}">
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
    `,t.style.display="flex";const a=e.querySelector("#project-form");a.onsubmit=l=>{l.preventDefault();const p=new FormData(a),g={projectName:p.get("projectName"),companyName:p.get("companyName"),budget:parseFloat(p.get("budget"))||0,capacity:parseFloat(p.get("capacity"))||1};if(s&&this.project)H(this.monthKey,this.project.id,g);else{O(this.monthKey,g);const y=f(this.monthKey),m=y.projects[y.projects.length-1],b=p.get("initialEmployeeId"),v=parseFloat(p.get("empLoad"));b&&m&&I(this.monthKey,b,m.id,v,1)}t.style.display="none",this.onSave()}}}class _{constructor(t){this.currentData=null,this.monthKey="",this.sortState={field:"projectName",direction:"asc"},t.innerHTML=`
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
    `,e.querySelector(".btn-edit").onclick=()=>{new N(this.monthKey,()=>window.app.update(),t).show()},e.querySelector(".btn-delete").onclick=()=>{confirm(`Удалить проект "${t.projectName}"?`)&&(R(this.monthKey,t.id),window.app.update())},e}calculateProjectStats(t){let e=0,s=0,n=0;if(!this.currentData)return{revenue:e,cost:s,totalRealCapacity:n};const a=this.currentData.projects.find(i=>i.id===t);return a?(this.currentData.employees.forEach(i=>{const c=i.assignments.find(r=>r.projectId===t);c&&(e+=S(i,a,this.currentData),s+=q(i,a.id),n+=c.capacity)}),{revenue:e,cost:s,totalRealCapacity:n}):{revenue:e,cost:s,totalRealCapacity:n}}initSort(){var e;const t=(e=this.tbody.parentElement)==null?void 0:e.querySelector("thead");t&&t.addEventListener("click",s=>{const n=s.target.closest("th");if(n&&n.classList.contains("sortable")){const a=n.dataset.field;this.sortState.direction=this.sortState.field===a&&this.sortState.direction==="asc"?"desc":"asc",this.sortState.field=a,this.refresh()}})}applySort(t){const{field:e,direction:s}=this.sortState,n=s==="asc"?1:-1;t.sort((a,i)=>{const c=a[e],r=i[e];return c<r?-1*n:c>r?1*n:0})}updateSortHeaders(){var t;(t=this.tbody.parentElement)==null||t.querySelectorAll("th.sortable").forEach(e=>{const s=e.dataset.field;e.classList.toggle("active",s===this.sortState.field),s===this.sortState.field&&(e.classList.toggle("asc",this.sortState.direction==="asc"),e.classList.toggle("desc",this.sortState.direction==="desc"))})}}class Q{constructor(){this.monthKey="";const t=new Date;this.monthKey=`${t.getFullYear()}-${String(t.getMonth()+1).padStart(2,"0")}`,f(this.monthKey),this.profitDisplay=document.getElementById("total-profit"),this.employeeList=new G(document.getElementById("employee-list")),this.projectList=new _(document.getElementById("project-list")),this.initEvents(),this.update()}initEvents(){const t=document.getElementById("modal-overlay");document.getElementById("add-employee-btn").addEventListener("click",()=>{new L(this.monthKey,()=>this.update()).show()}),document.getElementById("add-project-btn").onclick=()=>{new N(this.monthKey,()=>this.update()).show()},document.getElementById("modal-close").onclick=()=>{t.style.display="none"},t.onclick=e=>{e.target===t&&(t.style.display="none")},new V(document.getElementById("month-selector-container"),this.monthKey,e=>{this.monthKey=e,this.update()})}update(){const t=f(this.monthKey),e=B(t);this.employeeList.update(t,this.monthKey),this.projectList.update(t,this.monthKey),this.profitDisplay.textContent=`${e.toLocaleString()} $`,this.profitDisplay.className=e>=0?"positive":"negative"}}document.addEventListener("DOMContentLoaded",()=>{const o=new Q;window.app=o});
