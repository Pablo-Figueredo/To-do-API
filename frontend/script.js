const API_URL = 'http://localhost:3000/tarefa';
const USERS_API_URL = 'http://localhost:3000/user';
const LOGIN_API_URL = 'http://localhost:3000/user/login';
const REGISTER_API_URL = 'http://localhost:3000/user';
const DEMO_TASKS_KEY = 'todo-api-demo-tasks';
const DEMO_USERS_KEY = 'todo-api-demo-users';
const demoUser = { _id: 'demo-admin', nome: 'Visitante da demonstração', email: 'demo@example.com', role: 'admin' };
const demoTasks = [
  { id: 'demo-1', titulo: 'Conectar o banco às rotas', concluida: true },
  { id: 'demo-2', titulo: 'Testar a criação de tarefas', concluida: false },
  { id: 'demo-3', titulo: 'Planejar a próxima entrega', concluida: false }
];
const demoUsers = [
  demoUser,
  { _id: 'demo-user-1', nome: 'Ana Costa', email: 'ana@example.com', role: 'user' },
  { _id: 'demo-user-2', nome: 'Bruno Lima', email: 'bruno@example.com', role: 'user' }
];

let tasks = JSON.parse(localStorage.getItem('todo-api-tasks') || 'null') || demoTasks;
let currentFilter = 'all';
let apiAvailable = false;
let users = [];
let session = JSON.parse(sessionStorage.getItem('todo-api-session') || 'null');
let demoMode = session?.demo === true;
const savedTheme = localStorage.getItem('todo-api-theme') || 'aurora';

function readDemoData(key, fallback) {
  const saved = JSON.parse(localStorage.getItem(key) || 'null');
  return Array.isArray(saved) ? saved : fallback.map((item) => ({ ...item }));
}

function saveDemoData() {
  localStorage.setItem(DEMO_TASKS_KEY, JSON.stringify(tasks));
  localStorage.setItem(DEMO_USERS_KEY, JSON.stringify(users));
}

function setTheme(theme) {
  document.body.dataset.theme = theme;
  localStorage.setItem('todo-api-theme', theme);
  document.querySelectorAll('.theme-button').forEach((button) => {
    button.classList.toggle('active', button.dataset.themeChoice === theme);
  });
}

const save = () => localStorage.setItem('todo-api-tasks', JSON.stringify(tasks));
const setApiStatus = (connected) => {
  apiAvailable = connected;
  document.querySelector('#status-text').textContent = connected ? 'API conectada' : 'Modo demonstração';
  document.querySelector('.dot').style.background = connected ? '#2c9b70' : '#ef806c';
};
const authHeaders = () => session?.token ? { Authorization: `Bearer ${session.token}` } : {};
const loggedUser = () => session?.user || session || {};
const isAdmin = () => loggedUser().role === 'admin';
const visibleTasks = () => tasks.filter((task) => currentFilter === 'all' || (currentFilter === 'done' ? task.concluida : !task.concluida));

function render() {
  const completed = tasks.filter((task) => task.concluida).length;
  document.querySelector('#total').textContent = tasks.length;
  document.querySelector('#pending').textContent = tasks.length - completed;
  document.querySelector('#done').textContent = completed;
  document.querySelector('#progress').textContent = tasks.length ? Math.round(completed / tasks.length * 100) + '%' : '0%';
  document.querySelector('#task-count').textContent = `${tasks.length} ${tasks.length === 1 ? 'item' : 'itens'}`;
  const list = document.querySelector('#task-list');
  const filtered = visibleTasks();
  list.innerHTML = filtered.length ? filtered.map((task) => `
    <article class="task ${task.concluida ? 'done' : ''}">
      <button class="check" data-toggle="${task._id || task.id}" aria-label="Alternar tarefa">✓</button>
      <p class="task-title">${escapeHtml(task.titulo)}</p>
      <button class="delete" data-delete="${task._id || task.id}" aria-label="Excluir tarefa">×</button>
    </article>`).join('') : '<div class="empty"><div class="empty-icon">✓</div><strong>Nada por aqui ainda.</strong>Adicione uma tarefa ou troque o filtro.</div>';
}

function escapeHtml(value) {
  return String(value).replace(/[&<>'"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[char]));
}

function renderUsers(message = '') {
  const list = document.querySelector('#user-list');
  document.querySelector('#user-count').textContent = `${users.length} ${users.length === 1 ? 'cadastrado' : 'cadastrados'}`;

  if (message) {
    list.innerHTML = `<div class="user-empty"><strong>Não foi possível carregar.</strong>${escapeHtml(message)}</div>`;
    return;
  }

  list.innerHTML = users.length ? users.map((user) => `
    <article class="user-card">
      <div class="user-avatar">${escapeHtml((user.nome || '?').charAt(0).toUpperCase())}</div>
      <div class="user-details">
        <strong>${escapeHtml(user.nome || 'Nome não informado')}</strong>
        <span>${escapeHtml(user.email || 'E-mail não informado')}</span>
      </div>
      <span class="user-id">${escapeHtml(user._id || '')}</span>
      ${isAdmin() && user.role !== 'admin' ? `<button class="user-delete" data-user-delete="${escapeHtml(user._id)}" aria-label="Excluir ${escapeHtml(user.nome || 'usuário')}" title="Excluir usuário">×</button>` : ''}
    </article>`).join('') : '<div class="user-empty"><strong>Nenhum usuário cadastrado.</strong>Os usuários criados pela API aparecerão aqui.</div>';
}

async function loadUsers() {
  const button = document.querySelector('#refresh-users');
  button.disabled = true;
  button.classList.add('loading');
  try {
    const response = await fetch(USERS_API_URL, { headers: authHeaders() });
    if (!response.ok) throw new Error('Verifique se a API está disponível.');
    const remoteUsers = await response.json();
    users = Array.isArray(remoteUsers) ? remoteUsers : [];
    renderUsers();
  } catch (error) {
    renderUsers(error.message);
  } finally {
    button.disabled = false;
    button.classList.remove('loading');
  }
}

function showApplication() {
  document.querySelector('#login-screen').hidden = true;
  document.querySelectorAll('.app-view').forEach((element) => { element.hidden = false; });
  document.querySelector('#logged-user').textContent = loggedUser().nome || '';
  document.querySelector('#admin-tab').hidden = !isAdmin();
  document.querySelector('#admin-panel').hidden = true;
  document.querySelector('#task-view').hidden = false;
  render();
  if (demoMode) {
    setApiStatus(false);
    loadDemoData();
  } else {
    tryApi();
  }
}

function loadDemoData() {
  tasks = readDemoData(DEMO_TASKS_KEY, demoTasks);
  users = readDemoData(DEMO_USERS_KEY, demoUsers);
  render();
  renderUsers();
}

function showLogin(message = '') {
  document.querySelector('#login-screen').hidden = false;
  document.querySelectorAll('.app-view').forEach((element) => { element.hidden = true; });
  document.querySelector('#login-message').textContent = message;
}

function selectAccessTab(tab) {
  const loginTab = document.querySelector('#login-tab');
  const registerTab = document.querySelector('#register-tab');
  const loginForm = document.querySelector('#login-form');
  const registerForm = document.querySelector('#register-form');
  const showingLogin = tab === 'login';
  loginTab.classList.toggle('active', showingLogin);
  registerTab.classList.toggle('active', !showingLogin);
  loginTab.setAttribute('aria-selected', String(showingLogin));
  registerTab.setAttribute('aria-selected', String(!showingLogin));
  loginForm.hidden = !showingLogin;
  registerForm.hidden = showingLogin;
}

document.querySelector('#login-tab').addEventListener('click', () => selectAccessTab('login'));
document.querySelector('#register-tab').addEventListener('click', () => selectAccessTab('register'));

document.querySelector('#login-form').addEventListener('submit', async (event) => {
  event.preventDefault();
  const loginForm = event.currentTarget;
  const form = new FormData(loginForm);
  const message = document.querySelector('#login-message');
  message.textContent = 'Verificando acesso...';
  try {
    const response = await fetch(LOGIN_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: form.get('email'), senha: form.get('senha') })
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.mensagem || 'E-mail ou senha inválidos.');
    session = result.token ? result : { user: result };
    demoMode = false;
    sessionStorage.setItem('todo-api-session', JSON.stringify(session));
    loginForm.reset();
    showApplication();
  } catch (error) {
    message.textContent = error.message || 'Não foi possível entrar.';
  }
});

document.querySelector('#demo-login').addEventListener('click', () => {
  demoMode = true;
  users = readDemoData(DEMO_USERS_KEY, demoUsers);
  tasks = readDemoData(DEMO_TASKS_KEY, demoTasks);
  session = { demo: true, user: demoUser };
  sessionStorage.setItem('todo-api-session', JSON.stringify(session));
  showApplication();
});

document.querySelector('#register-form').addEventListener('submit', async (event) => {
  event.preventDefault();
  const registerForm = event.currentTarget;
  const form = new FormData(registerForm);
  const message = document.querySelector('#register-message');
  message.textContent = 'Criando usuário...';
  try {
    const response = await fetch(REGISTER_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nome: form.get('nome'),
        email: form.get('email'),
        senha: form.get('senha')
      })
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(result.mensagem || `A API recusou o cadastro (HTTP ${response.status}).`);
    registerForm.reset();
    document.querySelector('#login-email').value = result.email || form.get('email');
    selectAccessTab('login');
    document.querySelector('#login-message').textContent = 'Usuário criado. Agora faça login.';
  } catch (error) {
    message.textContent = error.message === 'Failed to fetch'
      ? 'Não foi possível conectar à API. Execute npm run dev.'
      : error.message || 'Não foi possível criar o usuário.';
  }
});

document.querySelector('#logout-button').addEventListener('click', () => {
  session = null;
  demoMode = false;
  sessionStorage.removeItem('todo-api-session');
  showLogin();
});

document.querySelector('#admin-tab').addEventListener('click', () => {
  document.querySelector('#task-view').hidden = true;
  document.querySelector('#admin-panel').hidden = false;
  loadUsers();
});

document.querySelector('#back-to-tasks').addEventListener('click', () => {
  document.querySelector('#admin-panel').hidden = true;
  document.querySelector('#task-view').hidden = false;
});

document.querySelector('#user-list').addEventListener('click', async (event) => {
  const userId = event.target.dataset.userDelete;
  if (!userId || !isAdmin()) return;
  if (!window.confirm('Excluir este usuário? As tarefas dele também deixarão de ser acessíveis.')) return;

  if (demoMode) {
    users = users.filter((user) => user._id !== userId);
    saveDemoData();
    renderUsers();
    return;
  }

  try {
    const response = await fetch(`${USERS_API_URL}/${userId}`, {
      method: 'DELETE',
      headers: authHeaders()
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(result.mensagem || 'Não foi possível excluir o usuário.');
    users = users.filter((user) => user._id !== userId);
    renderUsers();
  } catch (error) {
    window.alert(error.message || 'Não foi possível excluir o usuário.');
  }
});

async function tryApi() {
  if (demoMode) return;
  try {
    const response = await fetch(API_URL, { headers: authHeaders() });
    if (!response.ok) throw new Error('API indisponível');
    const remoteTasks = await response.json();
    if (Array.isArray(remoteTasks)) tasks = remoteTasks.map((task) => ({ ...task, concluida: Boolean(task.concluida) }));
    setApiStatus(true);
    save(); render();
  } catch (error) {
    setApiStatus(false);
  }
}

document.querySelector('#task-form').addEventListener('submit', async (event) => {
  event.preventDefault();
  const input = document.querySelector('#title');
  const title = input.value.trim();
  if (!title) return;
  if (demoMode) {
    tasks.push({ id: `demo-${Date.now()}`, titulo: title, concluida: false });
    saveDemoData();
    input.value = '';
    render();
    return;
  }
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...authHeaders() },
      body: JSON.stringify({ titulo: title })
    });
    if (!response.ok) throw new Error('Não foi possível criar a tarefa');
    tasks.push(await response.json());
    setApiStatus(true);
  } catch (error) {
    setApiStatus(false);
    tasks.push({ id: Date.now(), titulo: title, concluida: false });
  }
  input.value = ''; save(); render();
});

document.querySelector('#task-list').addEventListener('click', async (event) => {
  const toggleId = event.target.dataset.toggle;
  const deleteId = event.target.dataset.delete;
  if (toggleId) {
    const task = tasks.find((item) => String(item._id || item.id) === String(toggleId));
    if (task) {
      const concluida = !task.concluida;
      if (demoMode) {
        task.concluida = concluida;
        saveDemoData();
        render();
        return;
      }
      if (apiAvailable) {
        try {
          const response = await fetch(`${API_URL}/${task._id || task.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', ...authHeaders() },
            body: JSON.stringify({ titulo: task.titulo, concluida })
          });
          if (!response.ok) throw new Error('Não foi possível atualizar a tarefa');
          Object.assign(task, await response.json());
        } catch (error) {
          setApiStatus(false);
          task.concluida = concluida;
        }
      } else task.concluida = concluida;
    }
  }
  if (deleteId) {
    if (demoMode) {
      tasks = tasks.filter((item) => String(item._id || item.id) !== String(deleteId));
      saveDemoData();
      render();
      return;
    }
    if (apiAvailable) {
      try {
        const response = await fetch(`${API_URL}/${deleteId}`, { method: 'DELETE', headers: authHeaders() });
        if (!response.ok) throw new Error('Não foi possível excluir a tarefa');
      } catch (error) {
        setApiStatus(false);
      }
    }
    tasks = tasks.filter((item) => String(item._id || item.id) !== String(deleteId));
  }
  save(); render();
});

document.querySelectorAll('.filter').forEach((button) => button.addEventListener('click', () => {
  currentFilter = button.dataset.filter;
  document.querySelectorAll('.filter').forEach((item) => item.classList.toggle('active', item === button));
  render();
}));

document.querySelectorAll('.theme-button').forEach((button) => button.addEventListener('click', () => {
  setTheme(button.dataset.themeChoice);
}));

document.querySelector('#refresh-users').addEventListener('click', loadUsers);

setTheme(savedTheme);
if (session) {
  if (session.demo) {
    demoMode = true;
    loadDemoData();
  }
  showApplication();
}
else showLogin();
