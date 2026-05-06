(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))s(n);new MutationObserver(n=>{for(const o of n)if(o.type==="childList")for(const i of o.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&s(i)}).observe(document,{childList:!0,subtree:!0});function e(n){const o={};return n.integrity&&(o.integrity=n.integrity),n.referrerPolicy&&(o.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?o.credentials="include":n.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function s(n){if(n.ep)return;n.ep=!0;const o=e(n);fetch(n.href,o)}})();const D="monthlyData";function S(){const a=localStorage.getItem(D);if(!a)return{};try{return JSON.parse(a)}catch{return{}}}function x(a){localStorage.setItem(D,JSON.stringify(a))}function m(a){return S()[a]||null}function p(a,t){const e=S();e[a]=t,x(e)}function y(a){const t=m(a);if(t)return t;const e={monthKey:a,employees:[],projects:[],timestamp:Date.now()};return p(a,e),e}const f=()=>Date.now().toString(36)+Math.random().toString(36).slice(2,11);function L(a){const[t,e]=a.split("-").map(Number),s=new Date(t,e,0).getDate();let n=0;for(let o=1;o<=s;o++){const i=new Date(t,e-1,o).getDay();i!==0&&i!==6&&n++}return n||22}function I(a,t){const e=L(t),[s,n]=t.split("-").map(Number),o=(a.vacationDays||[]).filter(i=>{const r=new Date(s,n-1,i).getDay();return r!==0&&r!==6}).length;return Math.max(0,(e-o)/e)}function v(a,t,e){const s=a.assignments?.find(o=>o.projectId===t);if(!s)return 0;const n=I(a,e);return(s.capacity||0)*(s.fitness||0)*n}function g(a,t,e){const s=v(a,t.id,e.monthKey),n=e.employees.reduce((c,r)=>c+v(r,t.id,e.monthKey),0),o=Math.max(t.capacity||0,n);return o===0?0:(t.budget||0)/o*s}function N(a,t){const e=a.assignments?.find(s=>s.projectId===t);return e?(a.salary||0)*(e.capacity||0):0}function w(a){const t=a.salary||0,s=(a.assignments||[]).reduce((c,r)=>c+(r.capacity||0),0),n=s*t,i=Math.max(0,1-s)*t*.5;return n+i}function C(a){return!a.projects||!a.employees?0:a.projects.reduce((t,e)=>t+a.employees.reduce((s,n)=>s+g(n,e,a),0),0)}function M(a){return a.employees?a.employees.reduce((t,e)=>t+w(e),0):0}function K(a){return C(a)-M(a)}function q(a,t){const e=y(a),s={...t,id:f(),assignments:[],vacationDays:[]};e.employees=[...e.employees,s],p(a,e)}function k(a,t,e){const s=m(a);s&&(s.employees=s.employees.map(n=>n.id===t?{...n,...e}:n),p(a,s))}function F(a,t){const e=m(a);e&&(e.employees=e.employees.filter(s=>s.id!==t),p(a,e))}function B(a,t){const e=y(a),s={...t,id:f()};e.projects=[...e.projects,s],p(a,e)}function P(a,t,e){const s=m(a);s&&(s.projects=s.projects.map(n=>n.id===t?{...n,...e}:n),p(a,s))}function T(a,t){const e=m(a);e&&(e.projects=e.projects.filter(s=>s.id!==t),e.employees=e.employees.map(s=>({...s,assignments:s.assignments.filter(n=>n.projectId!==t)})),p(a,e))}function $(a,t,e,s,n){const o=m(a);if(!o)return{success:!1,error:"Месяц не инициализирован"};const i=o.employees.find(c=>c.id===t);return i?i.assignments.some(c=>c.projectId===e)?{success:!1,error:"Уже назначен на этот проект"}:(i.assignments.push({projectId:e,capacity:s,fitness:n}),p(a,o),{success:!0}):{success:!1,error:"Сотрудник не найден"}}function A(a,t,e){const s=m(a);s&&(s.employees=s.employees.map(n=>n.id===t?{...n,assignments:n.assignments.filter(o=>o.projectId!==e)}:n),p(a,s))}function O(a,t,e){const s=m(a);s&&(s.employees=s.employees.map(n=>n.id===t?{...n,vacationDays:[...e].sort((o,i)=>o-i)}:n),p(a,s))}function H(a,t){const e=m(a);if(!e)return!1;const s=new Map,n=e.projects.map(i=>{const c=f();return s.set(i.id,c),{...i,id:c}}),o=e.employees.map(i=>{const c=f();return{...i,id:c,vacationDays:[],assignments:i.assignments.map(r=>({projectId:s.get(r.projectId)||r.projectId,capacity:r.capacity,fitness:r.fitness}))}});return p(t,{monthKey:t,employees:o,projects:n,timestamp:Date.now()}),!0}class R{container;currentKey;onChange;select;constructor(t,e,s){this.container=t,this.currentKey=e,this.onChange=s,this.render()}render(){this.container.innerHTML="";const t=document.createElement("div");t.style.display="flex",t.style.gap="10px",t.style.alignItems="center",this.select=document.createElement("select");const e=[2024,2025,2026];for(const n of e)for(let o=1;o<=12;o++){const i=String(o).padStart(2,"0"),c=`${n}-${i}`,r=document.createElement("option");r.value=c,r.textContent=`${n} / ${i}`,c===this.currentKey&&(r.selected=!0),this.select.appendChild(r)}this.select.addEventListener("change",()=>{this.currentKey=this.select.value,this.onChange(this.currentKey)});const s=document.createElement("button");s.textContent="📋 Copy prev month",s.className="btn-copy",s.addEventListener("click",()=>{const n=m(this.currentKey);if(n&&(n.employees.length>0||n.projects.length>0)&&!confirm("В текущем месяце уже есть данные. Копирование полностью удалит их и заменит данными из прошлого месяца. Продолжить?"))return;const[o,i]=this.currentKey.split("-").map(Number),c=new Date(o,i-2),r=`${c.getFullYear()}-${String(c.getMonth()+1).padStart(2,"0")}`;H(r,this.currentKey)?this.onChange(this.currentKey):alert(`Нет данных для копирования за предыдущий период (${r})`)}),t.appendChild(this.select),t.appendChild(s),this.container.appendChild(t)}}class j{constructor(t,e,s){this.monthKey=t,this.onSave=e,this.employee=s}show(){const t=document.getElementById("modal-overlay"),e=document.getElementById("modal-content"),s=!!this.employee,n=["junior","middle","senior","lead","architect","BO"],o=new Date,i=new Date(o.getFullYear()-18,o.getMonth(),o.getDate()).toISOString().split("T")[0];e.innerHTML=`
      <h3>${s?"Редактировать":"Добавить"} сотрудника</h3>
      <form id="emp-form">
        <label>Имя: 
          <input name="firstName" value="${this.employee?.firstName||""}" required placeholder="Имя">
        </label>
        <label>Фамилия: 
          <input name="lastName" value="${this.employee?.lastName||""}" required placeholder="Фамилия">
        </label>
        <label>Дата рождения: 
          <input type="date" name="birthDate" 
            value="${this.employee?.birthDate||""}" 
            max="${i}" 
            required>
        </label>
        <label>Позиция: 
          <select name="position" required>
            ${n.map(l=>`
              <option value="${l}" ${this.employee?.position===l?"selected":""}>
                ${l.toUpperCase()}
              </option>
            `).join("")}
          </select>
        </label>
        <label>Зарплата ($): 
          <input type="number" name="salary" value="${this.employee?.salary||""}" required min="1" step="1">
        </label>
        
        <div id="form-error" style="color: var(--danger-color); font-size: 0.85rem; margin: 10px 0;"></div>

        <div class="modal-actions" style="margin-top: 20px">
          <button type="submit" class="btn-primary" style="width: 100%">${s?"Сохранить изменения":"Создать сотрудника"}</button>
        </div>
      </form>
    `,t.style.display="flex";const c=e.querySelector("#emp-form"),r=e.querySelector("#form-error");c.onsubmit=l=>{l.preventDefault();const d=new FormData(c),h=d.get("birthDate"),u=Number(d.get("salary"));if(h>i){r.textContent="Сотрудник должен быть совершеннолетним (18+).";return}if(u<=0){r.textContent="Зарплата должна быть положительным числом.";return}const b={firstName:d.get("firstName").trim(),lastName:d.get("lastName").trim(),birthDate:h,position:d.get("position"),salary:u};try{s&&this.employee?k(this.monthKey,this.employee.id,b):q(this.monthKey,b),t.style.display="none",this.onSave()}catch{r.textContent="Ошибка при сохранении данных."}}}}class U{constructor(t,e,s){this.monthKey=t,this.employeeId=e,this.onUpdate=s}show(){const t=document.getElementById("modal-overlay"),e=document.getElementById("modal-content"),s=y(this.monthKey),n=s.employees.find(i=>i.id===this.employeeId);if(!n)return;const o=s.projects.filter(i=>!n.assignments.some(c=>c.projectId===i.id));t.style.display="flex",e.innerHTML=`
      <h3>Проекты сотрудника: ${n.lastName} ${n.firstName}</h3>
      <div id="current-assignments">
        ${this.renderAssignments(n.assignments,s)}
      </div>
      
      <hr style="margin: 20px 0; border: 0; border-top: 1px solid #eee;">
      
      <h4>Добавить новое назначение</h4>
      <form id="assign-form">
        <label>Проект
          <select name="projectId" required>
            <option value="" disabled selected>${o.length?"Выберите проект...":"Нет доступных проектов"}</option>
            ${o.map(i=>`<option value="${i.id}">${i.projectName}</option>`).join("")}
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
        <button type="submit" ${o.length===0?"disabled":""} style="margin-top: 15px; width: 100%;">
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
          ${t.map(s=>`
              <tr style="border-bottom: 1px solid #eee;">
                <td style="padding: 8px;">${e.projects.find(o=>o.id===s.projectId)?.projectName||'<span style="color:red">Удален</span>'}</td>
                <td style="text-align: center; padding: 8px;">
                  <span class="badge-cap">${s.capacity.toFixed(1)}</span> / 
                  <span class="badge-fit">${s.fitness.toFixed(2)}</span>
                </td>
                <td style="text-align: right; padding: 8px;">
                  <button class="btn-delete-small" data-project-id="${s.projectId}" title="Удалить назначение">✕</button>
                </td>
              </tr>
            `).join("")}
        </tbody>
      </table>
    `}initEvents(t){const e=t.querySelector("#assign-form");e&&(e.onsubmit=s=>{s.preventDefault();const n=new FormData(e),o=$(this.monthKey,this.employeeId,n.get("projectId"),parseFloat(n.get("capacity")),parseFloat(n.get("fitness")));o.success?(this.onUpdate(),this.show()):alert(o.error)}),t.querySelectorAll(".btn-delete-small").forEach(s=>{s.onclick=()=>{const n=s.dataset.projectId;confirm("Удалить назначение сотрудника на этот проект?")&&(A(this.monthKey,this.employeeId,n),this.onUpdate(),this.show())}})}}class W{selectedDays;daysInMonth;monthKey;employeeId;onSave;constructor(t,e,s){this.monthKey=t,this.employeeId=e,this.onSave=s;const[n,o]=t.split("-").map(Number);this.daysInMonth=new Date(n,o,0).getDate();const c=y(t).employees.find(r=>r.id===e);this.selectedDays=new Set(c?.vacationDays||[])}show(){const t=document.getElementById("modal-overlay"),e=document.getElementById("modal-content");t.style.display="flex",e.innerHTML=`
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
    `,e.querySelector("#calendar-grid").addEventListener("click",n=>{const o=n.target.closest(".day-checkbox");if(!o||o.classList.contains("off"))return;const i=parseInt(o.dataset.day);this.selectedDays.has(i)?(this.selectedDays.delete(i),o.classList.remove("selected")):(this.selectedDays.add(i),o.classList.add("selected"))}),e.querySelector("#save-vacation").onclick=()=>{const n=Array.from(this.selectedDays).sort((o,i)=>o-i);O(this.monthKey,this.employeeId,n),t.style.display="none",this.onSave()}}generateCalendarHTML(){const t=["Пн","Вт","Ср","Чт","Пт","Сб","Вс"],[e,s]=this.monthKey.split("-").map(Number);let o=new Date(e,s-1,1).getDay();const i=o===0?6:o-1;let c=t.map(r=>`<div class="day-header">${r}</div>`).join("");for(let r=0;r<i;r++)c+='<div class="day-checkbox off"></div>';for(let r=1;r<=this.daysInMonth;r++){const l=new Date(e,s-1,r),d=l.getDay()===0||l.getDay()===6,h=this.selectedDays.has(r);c+=`
        <div class="day-checkbox day ${h?"selected":""} ${d?"weekend":""}" 
             data-day="${r}"
             style="${d?"background: #fff0f0; border-color: #ffdadb;":""}">
          ${r}
        </div>
      `}return c}}class Y{container;tbody;currentData=null;monthKey="";sortState={field:"name",direction:"asc"};constructor(t){this.container=t,this.renderBase()}renderBase(){this.container.innerHTML=`
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
    `,this.tbody=this.container.querySelector("tbody"),this.container.querySelector("thead").addEventListener("click",t=>{const e=t.target.closest("th");e?.dataset.field&&this.handleSort(e.dataset.field)})}update(t,e){this.currentData=t,this.monthKey=e,this.refresh()}refresh(){if(!this.currentData)return;this.container.querySelectorAll("th.sortable").forEach(e=>{const s=e.dataset.field;e.classList.toggle("active",s===this.sortState.field),s===this.sortState.field&&(e.classList.toggle("asc",this.sortState.direction==="asc"),e.classList.toggle("desc",this.sortState.direction==="desc"))});let t=[...this.currentData.employees];this.applySort(t),this.tbody.innerHTML="",t.forEach(e=>{this.tbody.appendChild(this.buildRow(e))})}buildRow(t){const e=document.createElement("tr"),s=t.assignments.reduce((r,l)=>r+l.capacity,0),n=s>1.2?"overload":s<.5?"warning":"normal";let o=0;t.assignments.forEach(r=>{const l=this.currentData?.projects.find(d=>d.id===r.projectId);l&&this.currentData&&(o+=g(t,l,this.currentData))});const i=w(t),c=o-i;return e.innerHTML=`
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
    `,e.querySelector(".capacity-bar").onclick=()=>{new U(this.monthKey,t.id,()=>window.app.update()).show()},e.querySelector(".btn-vacation").onclick=()=>{new W(this.monthKey,t.id,()=>window.app.update()).show()},e.querySelector(".btn-edit").onclick=()=>{new j(this.monthKey,()=>window.app.update(),t).show()},e.querySelector(".btn-delete").onclick=()=>{confirm(`Удалить сотрудника ${t.lastName}?`)&&(F(this.monthKey,t.id),window.app.update())},e}handleSort(t){this.sortState.field===t?this.sortState.direction=this.sortState.direction==="asc"?"desc":"asc":(this.sortState.field=t,this.sortState.direction="asc"),this.refresh()}applySort(t){const{field:e,direction:s}=this.sortState,n=s==="asc"?1:-1;t.sort((o,i)=>{let c,r;return e==="name"?(c=o.lastName,r=i.lastName):e==="age"?(c=o.birthDate,r=i.birthDate):(c=o[e],r=i[e]),c<r?-1*n:c>r?1*n:0})}calculateAge(t){if(!t)return 0;const e=new Date(t),s=new Date;let n=s.getFullYear()-e.getFullYear();const o=s.getMonth()-e.getMonth();return(o<0||o===0&&s.getDate()<e.getDate())&&n--,isNaN(n)?0:n}}class E{constructor(t,e,s){this.monthKey=t,this.onSave=e,this.project=s}show(){const t=document.getElementById("modal-overlay"),e=document.getElementById("modal-content"),s=!!this.project,n=y(this.monthKey);e.innerHTML=`
      <h3>${s?"Редактировать проект":"Новый проект"}</h3>
      <form id="project-form">
        <label>Название проекта *
          <input type="text" name="projectName" required value="${this.project?.projectName||""}">
        </label>

        <label>Компания / Заказчик *
          <input type="text" name="companyName" required value="${this.project?.companyName||""}">
        </label>

        <label>Бюджет проекта ($) *
          <input type="number" name="budget" min="1" step="0.01" required value="${this.project?.budget||""}">
        </label>

        <label title="Целевое количество сотрудников. Влияет на доходность.">
          Требуемая ёмкость (capacity) *
          <input type="number" name="capacity" min="0.1" step="0.1" required value="${this.project?.capacity||1}">
        </label>

        <!-- Блок быстрого назначения сотрудника (только при создании) -->
        ${s?"":`
        <div style="background: #f9f9f9; padding: 12px; border-radius: 8px; margin: 15px 0; border: 1px dashed #ccc;">
          <h4 style="margin: 0 0 10px 0;">Назначить сотрудника сразу</h4>
          <label>Выбрать из команды:
            <select name="initialEmployeeId">
              <option value="">-- Не назначать --</option>
              ${n.employees.map(i=>`
                <option value="${i.id}">${i.lastName} ${i.firstName} (ЗП: ${i.salary})</option>
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
    `,t.style.display="flex";const o=e.querySelector("#project-form");o.onsubmit=i=>{i.preventDefault();const c=new FormData(o),r={projectName:c.get("projectName"),companyName:c.get("companyName"),budget:parseFloat(c.get("budget"))||0,capacity:parseFloat(c.get("capacity"))||1};if(s&&this.project)P(this.monthKey,this.project.id,r);else{B(this.monthKey,r);const l=y(this.monthKey),d=l.projects[l.projects.length-1],h=c.get("initialEmployeeId"),u=parseFloat(c.get("empLoad"));h&&d&&$(this.monthKey,h,d.id,u,1)}t.style.display="none",this.onSave()}}}class V{tbody;currentData=null;monthKey="";sortState={field:"projectName",direction:"asc"};constructor(t){t.innerHTML=`
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
    `,e.querySelector(".btn-edit").onclick=()=>{new E(this.monthKey,()=>window.app.update(),t).show()},e.querySelector(".btn-delete").onclick=()=>{confirm(`Удалить проект "${t.projectName}"?`)&&(T(this.monthKey,t.id),window.app.update())},e}calculateProjectStats(t){let e=0,s=0,n=0;if(!this.currentData)return{revenue:e,cost:s,totalRealCapacity:n};const o=this.currentData.projects.find(i=>i.id===t);return o?(this.currentData.employees.forEach(i=>{const c=i.assignments.find(r=>r.projectId===t);c&&(e+=g(i,o,this.currentData),s+=N(i,o.id),n+=c.capacity)}),{revenue:e,cost:s,totalRealCapacity:n}):{revenue:e,cost:s,totalRealCapacity:n}}initSort(){const t=this.tbody.parentElement?.querySelector("thead");t&&t.addEventListener("click",e=>{const s=e.target.closest("th");if(s&&s.classList.contains("sortable")){const n=s.dataset.field;this.sortState.direction=this.sortState.field===n&&this.sortState.direction==="asc"?"desc":"asc",this.sortState.field=n,this.refresh()}})}applySort(t){const{field:e,direction:s}=this.sortState,n=s==="asc"?1:-1;t.sort((o,i)=>{const c=o[e],r=i[e];return c<r?-1*n:c>r?1*n:0})}updateSortHeaders(){this.tbody.parentElement?.querySelectorAll("th.sortable").forEach(t=>{const e=t.dataset.field;t.classList.toggle("active",e===this.sortState.field),e===this.sortState.field&&(t.classList.toggle("asc",this.sortState.direction==="asc"),t.classList.toggle("desc",this.sortState.direction==="desc"))})}}class z{monthKey="";employeeList;projectList;profitDisplay;constructor(){const t=new Date;this.monthKey=`${t.getFullYear()}-${String(t.getMonth()+1).padStart(2,"0")}`,y(this.monthKey);const e=document.getElementById("total-profit"),s=document.getElementById("employee-list"),n=document.getElementById("project-list");if(!e||!s||!n)throw new Error("Критические элементы DOM не найдены. Проверьте index.html");this.profitDisplay=e,this.employeeList=new Y(s),this.projectList=new V(n),this.initEvents(),this.update()}initEvents(){const t=document.getElementById("modal-overlay"),e=document.getElementById("add-employee-btn"),s=document.getElementById("add-project-btn"),n=document.getElementById("modal-close"),o=document.getElementById("month-selector-container");if(!t||!e||!s||!n||!o){console.warn("Некоторые элементы управления не найдены");return}e.addEventListener("click",()=>{new j(this.monthKey,()=>this.update()).show()}),s.addEventListener("click",()=>{new E(this.monthKey,()=>this.update()).show()}),n.addEventListener("click",()=>{t.style.display="none"}),t.addEventListener("click",i=>{i.target===t&&(t.style.display="none")}),new R(o,this.monthKey,i=>{this.monthKey=i,this.update()})}update(){const t=y(this.monthKey),e=K(t);this.employeeList.update(t,this.monthKey),this.projectList.update(t,this.monthKey),this.profitDisplay.textContent=`${e.toLocaleString()} $`,this.profitDisplay.className=e>=0?"positive":"negative"}}document.addEventListener("DOMContentLoaded",()=>{const a=new z;window.app=a});
//# sourceMappingURL=index-D2wW2eC4.js.map
