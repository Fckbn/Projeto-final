const AUTH_KEY = 'acantosCurrentUser';
const USERS_KEY = 'acantosUsers';
const RESERVATIONS_KEY = 'acantosReservations';
const MENU_ITEMS_KEY = 'acantosMenuItems';
const ADMIN_USER = { name: 'Administrador', email: 'admin', password: 'admin' };

const menuCategories = {
  almoco: 'Almoço',
  bebidas: 'Bebidas',
  lanches: 'Lanches / Petiscos'
};

const authModal = document.getElementById('authModal');
const openLoginBtn = document.getElementById('openLoginBtn');
const openRegisterBtn = document.getElementById('openRegisterBtn');
const closeModalBtn = document.getElementById('closeModalBtn');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const switchButtons = document.querySelectorAll('.switch-btn');
const dashboardSection = document.getElementById('dashboard');
const userNameLabel = document.getElementById('userNameLabel');
const userEmailLabel = document.getElementById('userEmailLabel');
const reservationForm = document.getElementById('reservationForm');
const reservationList = document.getElementById('reservationList');
const menuForm = document.getElementById('menuForm');
const menuManagerList = document.getElementById('menuManagerList');
const menuItemsList = document.getElementById('menuItemsList');
const menuTabs = document.querySelectorAll('.menu-tab');
const menuAdminSection = document.getElementById('menuAdminSection');
const mobileNav = document.getElementById('mobileNav');
const menuToggle = document.getElementById('menuToggle');
const mobileNavClose = document.getElementById('mobileNavClose');
const logoutBtn = document.getElementById('logoutBtn');
const toast = document.getElementById('toast');

let activeMenuCategory = 'almoco';

function showToast(message, isError = false) {
  toast.textContent = message;
  toast.classList.remove('hidden', 'error');
  if (isError) {
    toast.classList.add('error');
  }
  clearTimeout(showToast.timeout);
  showToast.timeout = setTimeout(() => toast.classList.add('hidden'), 2600);
}

function openModal(mode = 'login') {
  authModal.classList.remove('hidden');
  authModal.setAttribute('aria-hidden', 'false');
  setActiveMode(mode);
}

function closeModal() {
  authModal.classList.add('hidden');
  authModal.setAttribute('aria-hidden', 'true');
}

function setActiveMode(mode) {
  switchButtons.forEach((button) => {
    const isActive = button.dataset.mode === mode;
    button.classList.toggle('active', isActive);
  });

  loginForm.classList.toggle('hidden', mode !== 'login');
  registerForm.classList.toggle('hidden', mode !== 'register');
}

function getUsers() {
  return JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
}

function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function getCurrentUser() {
  const stored = localStorage.getItem(AUTH_KEY);
  return stored ? JSON.parse(stored) : null;
}

function saveCurrentUser(user) {
  localStorage.setItem(AUTH_KEY, JSON.stringify(user));
}

function clearCurrentUser() {
  localStorage.removeItem(AUTH_KEY);
}

function getMenuItems() {
  const storedItems = localStorage.getItem(MENU_ITEMS_KEY);
  if (!storedItems) {
    const defaultItems = [
      {
        id: crypto.randomUUID(),
        name: 'Prato executivo',
        description: 'Arroz, salada e opção de carne ou peixe.',
        category: 'almoco',
        price: 34.9,
        available: true
      },
      {
        id: crypto.randomUUID(),
        name: 'Hambúrguer artesanal',
        description: 'Pão brioche, carne, queijo e molho da casa.',
        category: 'lanches',
        price: 29.9,
        available: true
      },
      {
        id: crypto.randomUUID(),
        name: 'Caipirinha',
        description: 'Limão, cachaça e açúcar com opção de frutas.',
        category: 'bebidas',
        price: 22,
        available: true
      }
    ];
    localStorage.setItem(MENU_ITEMS_KEY, JSON.stringify(defaultItems));
    return defaultItems;
  }

  return JSON.parse(storedItems);
}

function saveMenuItems(items) {
  localStorage.setItem(MENU_ITEMS_KEY, JSON.stringify(items));
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

async function hashPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
}

function getReservations(userEmail) {
  const allReservations = JSON.parse(localStorage.getItem(RESERVATIONS_KEY) || '[]');
  return allReservations.filter((reservation) => reservation.userEmail === userEmail);
}

function saveReservations(reservations) {
  localStorage.setItem(RESERVATIONS_KEY, JSON.stringify(reservations));
}

function setActiveMenuTab() {
  menuTabs.forEach((button) => {
    button.classList.toggle('active', button.dataset.category === activeMenuCategory);
  });
}

function renderMenuSection() {
  const items = getMenuItems().filter((item) => item.available && item.category === activeMenuCategory);
  if (items.length === 0) {
    menuItemsList.innerHTML = '<article class="menu-item-card"><p>Nenhum item disponível nesta categoria no momento.</p></article>';
    return;
  }

  menuItemsList.innerHTML = items
    .map(
      (item) => `
        <article class="menu-item-card">
          <div class="menu-item-header">
            <h3>${escapeHtml(item.name)}</h3>
            ${item.price !== undefined ? `<span class="menu-item-price">R$ ${Number(item.price).toFixed(2).replace('.', ',')}</span>` : ''}
          </div>
          <p>${escapeHtml(item.description || 'Item preparado com carinho no Acantos Bar.')}</p>
        </article>
      `
    )
    .join('');
}

function renderMenuManager() {
  const items = getMenuItems();
  if (items.length === 0) {
    menuManagerList.innerHTML = '<p class="reservation-item">Nenhum item cadastrado ainda.</p>';
    return;
  }

  menuManagerList.innerHTML = items
    .map(
      (item) => `
        <article class="reservation-item menu-manager-item">
          <div class="menu-manager-meta">
            <strong>${escapeHtml(item.name)}</strong>
            <p>${escapeHtml(item.description || 'Sem descrição')}</p>
            <p>${menuCategories[item.category] || item.category} • R$ ${Number(item.price || 0).toFixed(2).replace('.', ',')}</p>
          </div>
          <div class="menu-manager-actions">
            <button class="toggle-btn ${item.available ? 'active' : ''}" data-action="toggle" data-id="${item.id}" type="button">
              ${item.available ? 'Ativo' : 'Inativo'}
            </button>
          </div>
        </article>
      `
    )
    .join('');
}

function renderDashboard() {
  const user = getCurrentUser();
  if (!user) {
    dashboardSection.classList.add('hidden');
    return;
  }

  dashboardSection.classList.remove('hidden');
  userNameLabel.textContent = `Olá, ${user.name}`;
  userEmailLabel.textContent = user.email;
  renderReservations();
  renderMenuManager();
}

function renderReservations() {
  const user = getCurrentUser();
  if (!user) {
    reservationList.innerHTML = '';
    return;
  }

  const reservations = getReservations(user.email);
  if (reservations.length === 0) {
    reservationList.innerHTML = '<p class="reservation-item">Nenhuma reserva cadastrada ainda.</p>';
    return;
  }

  reservationList.innerHTML = reservations
    .slice()
    .reverse()
    .map(
      (reservation) => `
        <article class="reservation-item">
          <strong>${reservation.date} às ${reservation.time}</strong>
          <p>${reservation.guests} pessoa(s)</p>
          <p>${reservation.notes || 'Sem observações'}</p>
        </article>
      `
    )
    .join('');
}

function setAuthButtonState() {
  const user = getCurrentUser();
  const isAdmin = user?.email === ADMIN_USER.email;
  openLoginBtn.textContent = user ? 'Sair' : 'Entrar';
  openRegisterBtn.classList.toggle('hidden', !!user || isAdmin);
  menuAdminSection.classList.toggle('hidden', !isAdmin);
}

openLoginBtn.addEventListener('click', () => {
  const user = getCurrentUser();
  if (user) {
    clearCurrentUser();
    setAuthButtonState();
    renderDashboard();
    showToast('Você saiu da conta.');
    return;
  }
  openModal('login');
});

menuToggle.addEventListener('click', () => {
  mobileNav.classList.remove('hidden');
  menuToggle.setAttribute('aria-expanded', 'true');
});

mobileNavClose.addEventListener('click', () => {
  mobileNav.classList.add('hidden');
  menuToggle.setAttribute('aria-expanded', 'false');
});

document.querySelectorAll('#mobileNav a').forEach((link) => {
  link.addEventListener('click', () => {
    const category = link.dataset.category;
    if (category) {
      activeMenuCategory = category;
      setActiveMenuTab();
      renderMenuSection();
    }
    mobileNav.classList.add('hidden');
    menuToggle.setAttribute('aria-expanded', 'false');
  });
});

openRegisterBtn.addEventListener('click', () => {
  openModal('register');
});

closeModalBtn.addEventListener('click', closeModal);

authModal.addEventListener('click', (event) => {
  if (event.target === authModal) {
    closeModal();
  }
});

switchButtons.forEach((button) => {
  button.addEventListener('click', () => setActiveMode(button.dataset.mode));
});

menuTabs.forEach((button) => {
  button.addEventListener('click', () => {
    activeMenuCategory = button.dataset.category;
    setActiveMenuTab();
    renderMenuSection();
  });
});

loginForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const email = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value;

  if (email === ADMIN_USER.email && password === ADMIN_USER.password) {
    saveCurrentUser({ id: 'admin', name: ADMIN_USER.name, email: ADMIN_USER.email });
    setAuthButtonState();
    renderDashboard();
    closeModal();
    loginForm.reset();
    showToast('Bem-vindo, administrador!');
    return;
  }

  const users = getUsers();
  const user = users.find((storedUser) => storedUser.email === email);
  if (!user) {
    showToast('Nenhuma conta encontrada com este e-mail.', true);
    return;
  }

  const hashedPassword = await hashPassword(password);
  if (user.password !== hashedPassword) {
    showToast('Senha incorreta. Tente novamente.', true);
    return;
  }

  saveCurrentUser({ id: user.id, name: user.name, email: user.email });
  setAuthButtonState();
  renderDashboard();
  closeModal();
  loginForm.reset();
  showToast(`Bem-vindo, ${user.name}!`);
});

registerForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const name = document.getElementById('registerName').value.trim();
  const email = document.getElementById('registerEmail').value.trim();
  const password = document.getElementById('registerPassword').value;

  if (password.length < 6) {
    showToast('A senha precisa ter ao menos 6 caracteres.', true);
    return;
  }

  const users = getUsers();
  const existingUser = users.find((storedUser) => storedUser.email === email);
  if (existingUser) {
    showToast('Este e-mail já está cadastrado.', true);
    return;
  }

  const hashedPassword = await hashPassword(password);
  const newUser = {
    id: crypto.randomUUID(),
    name,
    email,
    password: hashedPassword
  };

  users.push(newUser);
  saveUsers(users);
  saveCurrentUser({ id: newUser.id, name: newUser.name, email: newUser.email });
  setAuthButtonState();
  renderDashboard();
  closeModal();
  registerForm.reset();
  showToast('Conta criada com sucesso!');
});

reservationForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const user = getCurrentUser();
  if (!user) {
    showToast('Faça login para reservar.', true);
    return;
  }

  const reservation = {
    id: crypto.randomUUID(),
    userEmail: user.email,
    date: document.getElementById('reservationDate').value,
    time: document.getElementById('reservationTime').value,
    guests: document.getElementById('reservationGuests').value,
    notes: document.getElementById('reservationNotes').value.trim()
  };

  const reservations = JSON.parse(localStorage.getItem(RESERVATIONS_KEY) || '[]');
  reservations.push(reservation);
  saveReservations(reservations);
  reservationForm.reset();
  renderReservations();
  showToast('Reserva registrada com sucesso!');
});

menuForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const user = getCurrentUser();
  if (!user || user.email !== ADMIN_USER.email) {
    showToast('Apenas administradores podem gerenciar o cardápio.', true);
    return;
  }

  const items = getMenuItems();
  items.push({
    id: crypto.randomUUID(),
    name: document.getElementById('menuName').value.trim(),
    description: document.getElementById('menuDescription').value.trim(),
    category: document.getElementById('menuCategory').value,
    price: Number(document.getElementById('menuPrice').value || 0),
    available: document.getElementById('menuAvailable').checked
  });

  saveMenuItems(items);
  menuForm.reset();
  document.getElementById('menuAvailable').checked = true;
  renderMenuSection();
  renderMenuManager();
  showToast('Item adicionado ao cardápio!');
});

menuManagerList.addEventListener('click', (event) => {
  const button = event.target.closest('button[data-action="toggle"]');
  if (!button) {
    return;
  }

  const items = getMenuItems();
  const targetItem = items.find((item) => item.id === button.dataset.id);
  if (targetItem) {
    targetItem.available = !targetItem.available;
    saveMenuItems(items);
    renderMenuSection();
    renderMenuManager();
    showToast(targetItem.available ? 'Item ativado no cardápio.' : 'Item desativado do cardápio.');
  }
});

logoutBtn.addEventListener('click', () => {
  clearCurrentUser();
  setAuthButtonState();
  renderDashboard();
  showToast('Você saiu da conta.');
});

window.addEventListener('DOMContentLoaded', () => {
  setActiveMenuTab();
  renderMenuSection();
  setAuthButtonState();
  renderDashboard();
});
