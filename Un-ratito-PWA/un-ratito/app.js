'use strict';
const KEY = 'un-ratito.tasks.v1';
const $ = (selector) => document.querySelector(selector);
let tasks = [];
let filter = 'all';
let toastTimer;
function announce(text) {
  $('#message').textContent = text;
  $('#message').hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { $('#message').hidden = true; }, 5000);
}
function validTasks(value) {
  return Array.isArray(value) && value.length <= 5000 && value.every(task =>
    task && typeof task.id === 'string' && task.id.length <= 100 &&
    typeof task.text === 'string' && task.text.trim().length > 0 && task.text.length <= 180 && typeof task.done === 'boolean') &&
    new Set(value.map(task => task.id)).size === value.length;
}
try {
  const saved = localStorage.getItem(KEY);
  if (saved) {
    const parsed = JSON.parse(saved);
    if (!validTasks(parsed)) throw new Error('Formato inválido');
    tasks = parsed;
  }
} catch {
  announce('No se pudieron leer tus tareas. No se ha borrado el guardado anterior.');
}
function commit(next) {
  try { localStorage.setItem(KEY, JSON.stringify(next)); }
  catch { announce('No se pudo guardar. Libera espacio o permite el almacenamiento del sitio.'); return false; }
  tasks = next;
  render();
  return true;
}
function render() {
  const completed = tasks.filter(task => task.done).length;
  const pending = tasks.length - completed;
  $('#count').textContent = `${pending} ${pending === 1 ? 'pendiente' : 'pendientes'}`;
  $('#progress-label').textContent = tasks.length ? `${completed} de ${tasks.length} hechas · cada paso cuenta` : 'Tu próximo paso empieza aquí';
  const percentage = tasks.length ? Math.round(completed / tasks.length * 100) : 0;
  $('#progress').style.width = `${percentage}%`;
  $('.progress-track').setAttribute('aria-valuenow', percentage);
  const visible = tasks.filter(task => filter === 'all' || (filter === 'done' ? task.done : !task.done));
  $('#tasks').replaceChildren();
  for (const task of visible) {
    const item = document.createElement('li');
    item.className = `task${task.done ? ' done' : ''}`;
    const label = document.createElement('label');
    const check = document.createElement('input');
    check.type = 'checkbox'; check.checked = task.done;
    check.addEventListener('change', () => {
      const saved = commit(tasks.map(entry => entry.id === task.id ? { ...entry, done: check.checked } : entry));
      if (!saved) check.checked = task.done;
      const replacement = [...$('#tasks').querySelectorAll('input')].find(input => input.dataset.id === task.id);
      if (replacement) replacement.focus();
    });
    check.dataset.id = task.id;
    const text = document.createElement('span');
    text.className = 'task-text'; text.textContent = task.text;
    label.append(check, text);
    const remove = document.createElement('button');
    remove.type = 'button'; remove.className = 'delete'; remove.textContent = '×';
    remove.setAttribute('aria-label', `Eliminar: ${task.text}`);
    remove.addEventListener('click', () => {
      if (commit(tasks.filter(entry => entry.id !== task.id))) { announce('Tarea eliminada.'); $('#task-input').focus(); }
    });
    item.append(label, remove); $('#tasks').append(item);
  }
  $('#empty').hidden = visible.length > 0;
  $('#empty h3').textContent = filter === 'done' ? 'Cada paso tendrá su momento.' : filter === 'active' && tasks.length ? 'Por ahora, todo hecho.' : 'Un poquito de espacio mental.';
  $('#empty p').textContent = filter === 'done' ? 'Aquí aparecerán las tareas que completes.' : filter === 'active' && tasks.length ? 'Disfruta de este ratito para ti.' : 'Añade tu primera tarea. Puede ser algo pequeño.';
  $('#clear').hidden = completed === 0;
}
$('#add-form').addEventListener('submit', event => {
  event.preventDefault();
  const text = $('#task-input').value.trim();
  if (!text) { $('#task-input').focus(); return; }
  if (tasks.length >= 5000) { announce('La lista está llena. Guarda una copia y elimina algunas tareas.'); return; }
  const id = typeof crypto.randomUUID === 'function' ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  if (commit([{ id, text, done: false }, ...tasks])) {
    $('#task-input').value = '';
    if (filter === 'done') setFilter('active');
    $('#task-input').focus(); announce('Tarea añadida y guardada.');
  }
});
function setFilter(value) {
  filter = value;
  document.querySelectorAll('[data-filter]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.filter === filter)));
  render();
}
document.querySelectorAll('[data-filter]').forEach(button => button.addEventListener('click', () => setFilter(button.dataset.filter)));
$('#clear').addEventListener('click', () => {
  if (confirm('¿Quieres borrar todas las tareas hechas?')) commit(tasks.filter(task => !task.done));
});
$('#export').addEventListener('click', () => {
  const blob = new Blob([JSON.stringify({ app: 'un-ratito', version: 1, tasks }, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a'); link.href = url; link.download = `un-ratito-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.append(link); link.click(); link.remove(); setTimeout(() => URL.revokeObjectURL(url), 60000);
  announce('Copia preparada. Guárdala en tus archivos.');
});
$('#import').addEventListener('change', async event => {
  const file = event.target.files[0]; if (!file) return;
  try {
    if (file.size > 5000000) throw new Error('Archivo demasiado grande');
    const backup = JSON.parse(await file.text());
    if (backup.app !== 'un-ratito' || backup.version !== 1 || !validTasks(backup.tasks)) throw new Error('Formato inválido');
    if (confirm(`Se sustituirá tu lista por ${backup.tasks.length} tareas de la copia. ¿Continuar?`)) {
      if (commit(backup.tasks.map(({ id, text, done }) => ({ id, text, done })))) announce('Copia importada y guardada.');
    }
  } catch { announce('No se pudo importar. Elige una copia válida de Un ratito.'); }
  event.target.value = '';
});
function connection() {
  $('#connection').textContent = navigator.onLine ? 'Con conexión' : 'Sin conexión';
  $('#connection').classList.toggle('offline', !navigator.onLine);
}
window.addEventListener('online', connection); window.addEventListener('offline', connection);
window.addEventListener('storage', event => {
  if (event.key !== KEY && event.key !== null) return;
  try { const next = JSON.parse(localStorage.getItem(KEY) || '[]'); if (validTasks(next)) { tasks = next; render(); } } catch { /* Keep current view if another tab writes invalid data. */ }
});
$('#date').textContent = new Intl.DateTimeFormat('es', { weekday: 'long', day: 'numeric', month: 'long' }).format(new Date()).toUpperCase();
connection(); render();
if ('serviceWorker' in navigator && window.isSecureContext) {
  navigator.serviceWorker.register('./sw.js').then(() => navigator.serviceWorker.ready).then(() => {
    $('#offline-status').textContent = 'Lista para usar sin conexión. Abre también la app instalada una vez con internet antes de probar el modo avión.';
  }).catch(() => { $('#offline-status').textContent = 'No se pudo preparar el modo sin conexión. Vuelve a abrir esta página con internet y bajo HTTPS.'; });
} else {
  $('#offline-status').textContent = 'Para instalarla y activar el modo sin conexión, abre la app bajo HTTPS (o localhost en Windows).';
}
