// =============================================
// Nordic Air CMS — Admin Panel Logic
// NO external SDK — uses direct fetch to Supabase REST API
// =============================================
'use strict';

// ---- Content Schema ----
const SECTIONS = [
  {
    id: 'contacts', title: 'Контакты',
    subtitle: 'Телефоны, адрес, часы работы — обновляются на всех страницах сайта',
    fields: [
      { key: 'global.phone',       label: 'Телефон (отображение)',    type: 'text', default: '+7 (931) 634-00-87' },
      { key: 'global.phone_href',  label: 'Телефон href (ссылка)',     type: 'text', default: 'tel:+79316340087' },
      { key: 'global.hours',       label: 'Часы работы (коротко)',     type: 'text', default: 'Пн–Вс: 9:00–21:00' },
      { key: 'global.hours_full',  label: 'Часы работы (полные)',      type: 'text', default: 'Понедельник–Воскресенье: 9:00–21:00' },
      { key: 'global.address',     label: 'Адрес',                    type: 'text', default: 'Санкт-Петербург и Ленинградская область' },
      { key: 'global.email',       label: 'Email',                    type: 'text', default: 'ahdpuxe@mail.ru' },
      { key: 'global.telegram',    label: 'Telegram ссылка',          type: 'text', default: 'https://t.me/+79316340087' },
      { key: 'global.whatsapp',    label: 'WhatsApp ссылка',          type: 'text', default: 'https://wa.me/79316340087' },
      { key: 'global.reviews_url', label: 'Яндекс.Отзывы — ссылка',  type: 'text', default: 'https://yandex.com/profile/61772118377/?ll=29.608975%2C59.337122&z=7' },
    ]
  },
  {
    id: 'main', title: 'Главная',
    subtitle: 'Тексты главной страницы: уведомление, герой-блок и призыв к действию',
    fields: [
      { key: 'index.notice',           label: 'Строка-уведомление (шапка)',      type: 'text',     default: 'Сезон начался! Цены растут каждые 3 дня — зафиксируйте свою цену прямо сейчас' },
      { key: 'index.hero.title',       label: 'Hero — заголовок (h1)',           type: 'textarea', default: 'Климатический комфорт под ключ' },
      { key: 'index.hero.subtitle',    label: 'Hero — подзаголовок',             type: 'textarea', default: 'Продажа, монтаж и обслуживание кондиционеров, тепловых насосов и систем вентиляции. Работаем без посредников — только профессионалы с опытом от 10 лет.' },
      { key: 'index.hero.btn1',        label: 'Hero — кнопка «Рассчитать»',     type: 'text',     default: 'Получить расчёт бесплатно' },
      { key: 'index.hero.btn2',        label: 'Hero — кнопка «Посмотреть»',     type: 'text',     default: 'Наши работы' },
      { key: 'index.about.title',      label: 'О компании — заголовок блока',   type: 'text',     default: 'Работаем только с профессионалами, без посредников' },
      { key: 'index.about.text1',      label: 'О компании — первый абзац',      type: 'textarea', default: 'С 2011 года мы устанавливаем климатические системы в Санкт-Петербурге и области. Нет менеджеров и раздутого штата — только инженеры-монтажники с опытом от 10 лет.' },
      { key: 'index.about.text2',      label: 'О компании — второй абзац',      type: 'textarea', default: 'Руководитель компании Андрей Утищев лично разрабатывает проект и контролирует каждый монтаж. Вы общаетесь напрямую с исполнителем — никаких недопониманий.' },
      { key: 'index.about.b1.title',   label: 'О компании — пункт 1 заголовок', type: 'text',     default: 'Официальный дилер 12+ брендов' },
      { key: 'index.about.b1.desc',    label: 'О компании — пункт 1 текст',     type: 'text',     default: 'Ballu, Tosot, Euroklimat и другие. Прямые поставки без переплат дилерам.' },
      { key: 'index.about.b2.title',   label: 'О компании — пункт 2 заголовок', type: 'text',     default: 'Договор с фиксированной ценой' },
      { key: 'index.about.b2.desc',    label: 'О компании — пункт 2 текст',     type: 'text',     default: 'Никаких скрытых доплат. Стоимость зафиксирована до начала работ.' },
      { key: 'index.about.b3.title',   label: 'О компании — пункт 3 заголовок', type: 'text',     default: 'Рейтинг 5.0 на Яндексе' },
      { key: 'index.about.b3.desc',    label: 'О компании — пункт 3 текст',     type: 'text',     default: 'Сотни довольных клиентов — квартиры, офисы, производства, медицинские центры.' },
      { key: 'index.cta.title',        label: 'CTA-блок — заголовок',           type: 'text',     default: 'Готовы обсудить ваш проект?' },
      { key: 'index.cta.desc',         label: 'CTA-блок — описание',            type: 'textarea', default: 'Получите бесплатный расчёт стоимости в течение 15 минут. Работаем 7 дней в неделю, с 9:00 до 21:00.' },
    ]
  },
  {
    id: 'promotions', title: 'Акции',
    subtitle: 'Управление акционными карточками: тексты, цены, сроки, изображения',
    promoGroups: [1, 2, 3, 4],
    fields: [
      { key: 'promo.1.badge',     label: 'Бейдж',            type: 'text',     default: 'Хит сезона',          group: 1 },
      { key: 'promo.1.title',     label: 'Название акции',   type: 'text',     default: 'Кондиционер под ключ', group: 1 },
      { key: 'promo.1.desc',      label: 'Описание',         type: 'textarea', default: 'Кондиционер Ballu / Tosot + монтаж + все расходники + гарантия 3 года. Быстрая установка за 1 день.', group: 1 },
      { key: 'promo.1.old_price', label: 'Старая цена',      type: 'text',     default: 'от 22 500 ₽',          group: 1 },
      { key: 'promo.1.new_price', label: 'Новая цена',       type: 'text',     default: 'от 18 000 ₽',          group: 1 },
      { key: 'promo.1.deadline',  label: 'Срок (ISO дата)',  type: 'text',     default: '2026-09-01T00:00:00',  group: 1, hint: 'Формат: ГГГГ-ММ-ДДTчч:мм:сс' },
      { key: 'promo.1.image',     label: 'Изображение',      type: 'image',    bucket: 'cms-images',            group: 1 },

      { key: 'promo.2.badge',     label: 'Бейдж',            type: 'text',     default: 'Рекомендуем',          group: 2 },
      { key: 'promo.2.title',     label: 'Название акции',   type: 'text',     default: 'Мульти-сплит для квартиры', group: 2 },
      { key: 'promo.2.desc',      label: 'Описание',         type: 'textarea', default: 'Одна внешняя + 2 внутренних блока. Климат в двух комнатах одновременно. Тихая работа от 19 дБ.', group: 2 },
      { key: 'promo.2.old_price', label: 'Старая цена',      type: 'text',     default: 'от 58 000 ₽',          group: 2 },
      { key: 'promo.2.new_price', label: 'Новая цена',       type: 'text',     default: 'от 49 000 ₽',          group: 2 },
      { key: 'promo.2.deadline',  label: 'Срок (ISO дата)',  type: 'text',     default: '2026-08-15T00:00:00',  group: 2, hint: 'Формат: ГГГГ-ММ-ДДTчч:мм:сс' },
      { key: 'promo.2.image',     label: 'Изображение',      type: 'image',    bucket: 'cms-images',            group: 2 },

      { key: 'promo.3.badge',     label: 'Бейдж',            type: 'text',     default: 'Сезонная',             group: 3 },
      { key: 'promo.3.title',     label: 'Название акции',   type: 'text',     default: 'ТО кондиционера',      group: 3 },
      { key: 'promo.3.desc',      label: 'Описание',         type: 'textarea', default: 'Полный сервис: чистка фильтров, промывка теплообменника, дозаправка фреоном, проверка электроники.', group: 3 },
      { key: 'promo.3.old_price', label: 'Старая цена',      type: 'text',     default: 'от 3 300 ₽',           group: 3 },
      { key: 'promo.3.new_price', label: 'Новая цена',       type: 'text',     default: 'от 3 000 ₽',           group: 3 },
      { key: 'promo.3.deadline',  label: 'Срок (ISO дата)',  type: 'text',     default: '2026-10-01T00:00:00',  group: 3, hint: 'Формат: ГГГГ-ММ-ДДTчч:мм:сс' },
      { key: 'promo.3.image',     label: 'Изображение',      type: 'image',    bucket: 'cms-images',            group: 3 },

      { key: 'promo.4.badge',     label: 'Бейдж',            type: 'text',     default: 'Комплекс',             group: 4 },
      { key: 'promo.4.title',     label: 'Название акции',   type: 'text',     default: 'Вентиляция + кондиционер', group: 4 },
      { key: 'promo.4.desc',      label: 'Описание',         type: 'textarea', default: 'Комплексный заказ: система вентиляции и кондиционирования в одном проекте. Один монтаж — двойная экономия.', group: 4 },
      { key: 'promo.4.old_price', label: 'Старая цена',      type: 'text',     default: 'от 79 000 ₽',          group: 4 },
      { key: 'promo.4.new_price', label: 'Новая цена',       type: 'text',     default: 'от 69 500 ₽',          group: 4 },
      { key: 'promo.4.deadline',  label: 'Срок (ISO дата)',  type: 'text',     default: '2026-09-15T00:00:00',  group: 4, hint: 'Формат: ГГГГ-ММ-ДДTчч:мм:сс' },
      { key: 'promo.4.image',     label: 'Изображение',      type: 'image',    bucket: 'cms-images',            group: 4 },
    ]
  },
  {
    id: 'services', title: 'Услуги',
    subtitle: 'Заголовки и подзаголовки страниц услуг',
    fields: [
      { key: 'services.ac.hero_title',   label: 'Кондиционеры — заголовок страницы',    type: 'text',     default: 'Кондиционеры в Санкт-Петербурге' },
      { key: 'services.ac.hero_sub',     label: 'Кондиционеры — подзаголовок',          type: 'textarea', default: 'Продажа, монтаж и обслуживание сплит-систем любого типа. Более 1000 моделей в наличии. Монтаж за 1 день — от 18 000 ₽ под ключ.' },
      { key: 'services.heat.hero_title', label: 'Тепловые насосы — заголовок страницы', type: 'text',     default: 'Тёплый дом — даже если нет газа' },
      { key: 'services.heat.hero_sub',   label: 'Тепловые насосы — подзаголовок',       type: 'textarea', default: 'Тепловые насосы воздух-воздух для частных домов, офисов и складов. Работают при −30°C, экономят электроэнергию в 4 раза. Монтаж за 1 день.' },
      { key: 'services.vent.hero_title', label: 'Вентиляция — заголовок страницы',      type: 'text',     default: 'Вентиляция под ключ в Санкт-Петербурге' },
      { key: 'services.vent.hero_sub',   label: 'Вентиляция — подзаголовок',            type: 'textarea', default: 'Проектирование и монтаж приточно-вытяжных систем с рекуперацией. Квартиры, дома, офисы, рестораны, производство. Бесплатный проект при заказе монтажа.' },
    ]
  },
  {
    id: 'about', title: 'О компании',
    subtitle: 'Информация о компании, данные руководителя и его фото',
    fields: [
      { key: 'about.hero.title',       label: 'О компании — заголовок страницы', type: 'text',     default: 'О компании Nordic Air' },
      { key: 'about.hero.subtitle',    label: 'О компании — подзаголовок',       type: 'textarea', default: 'С 2011 года устанавливаем климатические системы в Санкт-Петербурге и области. Только профессионалы, без посредников — результат говорит за нас.' },
      { key: 'about.founder.name',     label: 'Имя руководителя',                type: 'text',     default: 'Андрей Утищев' },
      { key: 'about.founder.position', label: 'Должность руководителя',          type: 'text',     default: 'Основатель и руководитель' },
      { key: 'about.founder.bio',      label: 'О руководителе (текст)',          type: 'textarea', default: 'У нас нет менеджеров и раздутого штата. Только профессионалы по монтажу. Со мной вы будете общаться — именно я разрабатываю проект и контролирую монтаж.' },
      { key: 'about.founder.photo',    label: 'Фото руководителя',               type: 'image',    bucket: 'cms-images' },
    ]
  },
];

const TAB_META = {
  contacts:   { title: 'Контакты',   subtitle: 'Редактирование контактной информации сайта' },
  main:       { title: 'Главная',    subtitle: 'Тексты главной страницы' },
  promotions: { title: 'Акции',      subtitle: 'Управление акционными карточками' },
  services:   { title: 'Услуги',     subtitle: 'Заголовки страниц услуг' },
  about:      { title: 'О компании', subtitle: 'Информация о компании и руководителе' },
};

// ---- State ----
var SB_URL = '';
var SB_KEY = '';
var accessToken = null;
var currentUser = null;
var contentCache = {};
var activeTab = 'contacts';
var toastTimer = null;

// ---- Init ----
document.addEventListener('DOMContentLoaded', function () {
  if (!window.CMS_CONFIG || window.CMS_CONFIG.supabaseUrl === 'YOUR_SUPABASE_PROJECT_URL') {
    showLoginError('Ошибка: заполните js/cms-config.js');
    document.getElementById('login-btn').disabled = true;
    return;
  }
  SB_URL = window.CMS_CONFIG.supabaseUrl.replace(/\/$/, '');
  SB_KEY = window.CMS_CONFIG.supabaseKey;

  // Enter key in password field
  var pwField = document.getElementById('login-password');
  if (pwField) pwField.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') handleLogin();
  });

  // Try restore session from localStorage
  checkStoredSession();
});

// ---- Supabase fetch helpers ----
function sbFetch(path, options) {
  var opts = options || {};
  var headers = Object.assign({
    'apikey': SB_KEY,
    'Authorization': 'Bearer ' + (accessToken || SB_KEY),
    'Content-Type': 'application/json',
  }, opts.headers || {});
  return fetch(SB_URL + path, Object.assign({}, opts, { headers: headers }));
}

// ---- Session ----
async function checkStoredSession() {
  showLoading(true);
  var token = localStorage.getItem('cms_token');
  if (!token) { showLoading(false); showLoginScreen(); return; }

  try {
    var res = await fetch(SB_URL + '/auth/v1/user', {
      headers: { 'apikey': SB_KEY, 'Authorization': 'Bearer ' + token }
    });
    if (res.ok) {
      accessToken = token;
      currentUser = await res.json();
      await enterApp();
    } else {
      localStorage.removeItem('cms_token');
      showLoginScreen();
    }
  } catch (e) {
    showLoginScreen();
  } finally {
    showLoading(false);
  }
}

// ---- Login ----
async function handleLogin() {
  var email = (document.getElementById('login-email').value || '').trim();
  var password = document.getElementById('login-password').value || '';
  var btn = document.getElementById('login-btn');

  if (!email || !password) {
    showLoginError('Введите email и пароль.');
    return;
  }

  btn.disabled = true;
  btn.textContent = 'Вхожу...';
  document.getElementById('login-error').classList.remove('visible');

  try {
    var res = await fetch(SB_URL + '/auth/v1/token?grant_type=password', {
      method: 'POST',
      headers: { 'apikey': SB_KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email, password: password })
    });

    var data = await res.json();

    if (!res.ok) {
      var msg = data.error_description || data.msg || data.message || 'Неверный email или пароль';
      showLoginError(msg);
      btn.disabled = false;
      btn.textContent = 'Войти в панель управления';
      return;
    }

    accessToken = data.access_token;
    currentUser = data.user;
    localStorage.setItem('cms_token', accessToken);
    await enterApp();

  } catch (err) {
    var debugUrl = SB_URL ? SB_URL.replace('https://', '').split('.')[0] : '(URL не задан!)';
    showLoginError('Ошибка сети: ' + err.message + ' [проект: ' + debugUrl + ']');
    btn.disabled = false;
    btn.textContent = 'Войти в панель управления';
  }
}

function showLoginError(msg) {
  var el = document.getElementById('login-error');
  el.textContent = msg;
  el.classList.add('visible');
}

function showLoginScreen() {
  document.getElementById('login-screen').style.display = 'flex';
  var btn = document.getElementById('login-btn');
  btn.disabled = false;
  btn.textContent = 'Войти в панель управления';
}

// ---- Logout ----
function logout() {
  if (accessToken) {
    fetch(SB_URL + '/auth/v1/logout', {
      method: 'POST',
      headers: { 'apikey': SB_KEY, 'Authorization': 'Bearer ' + accessToken }
    }).catch(function () {});
  }
  localStorage.removeItem('cms_token');
  accessToken = null;
  currentUser = null;
  contentCache = {};
  document.getElementById('app').classList.remove('visible');
  showLoginScreen();
}

// ---- Enter App ----
async function enterApp() {
  document.getElementById('login-screen').style.display = 'none';
  document.getElementById('app').classList.add('visible');
  if (currentUser && currentUser.email) {
    document.getElementById('sidebar-email').textContent = currentUser.email;
  }
  showLoading(true);
  await loadAllContent();
  showLoading(false);
  renderTab(activeTab);
}

// ---- Load Content ----
async function loadAllContent() {
  try {
    var res = await sbFetch('/rest/v1/content?select=key,value,type');
    if (!res.ok) return;
    var rows = await res.json();
    contentCache = {};
    (rows || []).forEach(function (r) { contentCache[r.key] = r.value || ''; });
  } catch (e) {
    console.warn('[CMS] loadAllContent error:', e);
  }
}

// ---- Upsert content rows ----
async function upsertRows(rows) {
  var res = await sbFetch('/rest/v1/content', {
    method: 'POST',
    headers: { 'Prefer': 'resolution=merge-duplicates' },
    body: JSON.stringify(rows)
  });
  if (!res.ok) {
    var err = await res.json().catch(function () { return {}; });
    throw new Error(err.message || err.error || ('HTTP ' + res.status));
  }
}

// ---- Tab Switching ----
function switchTab(tabId) {
  activeTab = tabId;
  document.querySelectorAll('.sidebar-link').forEach(function (link) {
    link.classList.toggle('active', link.dataset.tab === tabId);
  });
  var meta = TAB_META[tabId];
  if (meta) {
    document.getElementById('topbar-title').textContent = meta.title;
    document.getElementById('topbar-subtitle').textContent = meta.subtitle;
  }
  renderTab(tabId);
}

// ---- Render Tab ----
function renderTab(tabId) {
  var section = SECTIONS.find(function (s) { return s.id === tabId; });
  if (!section) return;
  var contentArea = document.getElementById('content-area');
  contentArea.innerHTML = tabId === 'promotions'
    ? renderPromotionsTab(section)
    : renderStandardTab(section);
}

function renderStandardTab(section) {
  var fieldsHTML = section.fields.map(renderField).join('');
  return '<div class="section-panel">' +
    '<div class="panel-header"><div>' +
    '<div class="panel-title">' + escHtml(section.title) + '</div>' +
    '<div class="text-muted mt-4">' + escHtml(section.subtitle || '') + '</div>' +
    '</div></div>' +
    '<div class="panel-body"><div class="field-group single">' + fieldsHTML + '</div></div>' +
    '<div class="panel-footer">' +
    '<span class="save-status" id="save-status-' + section.id + '"></span>' +
    '<button class="btn btn-save" onclick="saveSection(\'' + section.id + '\')">' +
    '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>' +
    ' Сохранить раздел</button></div></div>';
}

function renderPromotionsTab(section) {
  var groups = section.promoGroups || [1, 2, 3, 4];
  var groupsHTML = groups.map(function (num) {
    var gFields = section.fields.filter(function (f) { return f.group === num; });
    return '<div class="promo-section-group">' +
      '<div class="promo-group-header"><div class="promo-group-number">' + num + '</div>Акция № ' + num + '</div>' +
      '<div class="promo-group-body"><div class="field-group single">' +
      gFields.map(renderField).join('') +
      '</div></div></div>';
  }).join('');
  return '<div class="section-panel">' +
    '<div class="panel-header"><div>' +
    '<div class="panel-title">' + escHtml(section.title) + '</div>' +
    '<div class="text-muted mt-4">' + escHtml(section.subtitle || '') + '</div>' +
    '</div></div>' +
    '<div class="panel-body">' + groupsHTML + '</div>' +
    '<div class="panel-footer">' +
    '<span class="save-status" id="save-status-' + section.id + '"></span>' +
    '<button class="btn btn-save" onclick="saveSection(\'' + section.id + '\')">' +
    '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>' +
    ' Сохранить все акции</button></div></div>';
}

function renderField(field) {
  var currentValue = contentCache[field.key] !== undefined && contentCache[field.key] !== ''
    ? contentCache[field.key]
    : (field.default || '');
  var inputId = 'field-' + field.key.replace(/\./g, '_');
  if (field.type === 'image') return renderImageField(field, currentValue, inputId);
  var hint = field.hint ? '<div class="field-hint">' + escHtml(field.hint) + '</div>' : '';
  if (field.type === 'textarea') {
    return '<div class="field-item">' +
      '<label class="form-label" for="' + inputId + '">' + escHtml(field.label) + '</label>' +
      '<textarea class="form-input" id="' + inputId + '" data-key="' + escHtml(field.key) + '" rows="3">' + escHtml(currentValue) + '</textarea>' +
      hint + '</div>';
  }
  return '<div class="field-item">' +
    '<label class="form-label" for="' + inputId + '">' + escHtml(field.label) + '</label>' +
    '<input class="form-input" type="text" id="' + inputId + '" data-key="' + escHtml(field.key) + '" value="' + escHtml(currentValue) + '">' +
    hint + '</div>';
}

function renderImageField(field, currentValue, inputId) {
  var hasImage = currentValue && currentValue.startsWith('http');
  var previewId = inputId + '_preview';
  var progressId = inputId + '_progress';
  var fileInputId = inputId + '_file';
  var placeholder = hasImage ? '' :
    '<div class="image-preview-placeholder">' +
    '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>' +
    '<span>Нет изображения</span></div>';
  var urlDisplay = '<div class="image-url-input" id="' + inputId + '_url"' + (hasImage ? '' : ' style="display:none"') + '>' + escHtml(currentValue) + '</div>';
  return '<div class="field-item">' +
    '<label class="form-label">' + escHtml(field.label) + '</label>' +
    '<div class="image-upload-wrapper">' +
    '<div class="image-preview" id="' + previewId + '_wrap">' +
    '<img id="' + previewId + '" src="' + (hasImage ? escHtml(currentValue) : '') + '" alt="Изображение" class="' + (hasImage ? 'loaded' : '') + '" onerror="this.classList.remove(\'loaded\')" onload="this.classList.add(\'loaded\')">' +
    placeholder + '</div>' +
    '<div class="image-upload-actions">' +
    '<label class="btn-upload" for="' + fileInputId + '">' +
    '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg> Загрузить фото</label>' +
    '<input type="file" id="' + fileInputId + '" accept="image/*" style="display:none" data-key="' + escHtml(field.key) + '" data-bucket="' + escHtml(field.bucket || 'cms-images') + '" data-preview="' + previewId + '" data-progress="' + progressId + '" onchange="handleImageUpload(this)">' +
    '<div class="upload-progress" id="' + progressId + '"><div class="spinner"></div><span>Загружаю...</span></div>' +
    '</div>' + urlDisplay +
    '<input type="hidden" id="' + inputId + '" data-key="' + escHtml(field.key) + '" value="' + escHtml(currentValue) + '">' +
    '</div></div>';
}

// ---- Image Upload (direct REST, no SDK) ----
async function handleImageUpload(fileInput) {
  var file = fileInput.files[0];
  if (!file) return;
  var key = fileInput.dataset.key;
  var bucket = fileInput.dataset.bucket || 'cms-images';
  var previewId = fileInput.dataset.preview;
  var progressId = fileInput.dataset.progress;

  if (!file.type.startsWith('image/')) { showToast('Выберите файл изображения', 'error'); return; }
  if (file.size > 10 * 1024 * 1024) { showToast('Файл слишком большой (макс 10 МБ)', 'error'); return; }

  var progressEl = document.getElementById(progressId);
  if (progressEl) progressEl.classList.add('visible');
  fileInput.disabled = true;

  try {
    var ext = (file.name.split('.').pop() || 'jpg').toLowerCase();
    var filename = key.replace(/\./g, '/') + '_' + Date.now() + '.' + ext;

    var uploadRes = await fetch(SB_URL + '/storage/v1/object/' + bucket + '/' + filename, {
      method: 'POST',
      headers: {
        'apikey': SB_KEY,
        'Authorization': 'Bearer ' + accessToken,
        'Content-Type': file.type,
        'x-upsert': 'true'
      },
      body: file
    });

    if (!uploadRes.ok) {
      var errData = await uploadRes.json().catch(function () { return {}; });
      throw new Error(errData.message || errData.error || ('Upload HTTP ' + uploadRes.status));
    }

    var publicUrl = SB_URL + '/storage/v1/object/public/' + bucket + '/' + filename;

    var fieldInputId = 'field-' + key.replace(/\./g, '_');
    var hiddenInput = document.getElementById(fieldInputId);
    if (hiddenInput) hiddenInput.value = publicUrl;

    var previewImg = document.getElementById(previewId);
    if (previewImg) {
      previewImg.src = publicUrl;
      previewImg.classList.add('loaded');
      var ph = previewImg.parentElement && previewImg.parentElement.querySelector('.image-preview-placeholder');
      if (ph) ph.remove();
    }
    var urlEl = document.getElementById(fieldInputId + '_url');
    if (urlEl) { urlEl.textContent = publicUrl; urlEl.style.display = ''; }

    contentCache[key] = publicUrl;
    await upsertRows([{ key: key, value: publicUrl, type: 'image' }]);
    showToast('Фото загружено и сохранено!', 'success');
  } catch (err) {
    showToast('Ошибка загрузки: ' + err.message, 'error');
  } finally {
    if (progressEl) progressEl.classList.remove('visible');
    fileInput.disabled = false;
    fileInput.value = '';
  }
}

// ---- Save Section ----
async function saveSection(sectionId) {
  var section = SECTIONS.find(function (s) { return s.id === sectionId; });
  if (!section) return;

  var saveBtn = document.querySelector('[onclick="saveSection(\'' + sectionId + '\')"]');
  var statusEl = document.getElementById('save-status-' + sectionId);

  if (saveBtn) {
    saveBtn.disabled = true;
    saveBtn.innerHTML = '<div class="spinner" style="border-color:rgba(255,255,255,.3);border-top-color:#fff;width:14px;height:14px;border-width:2px;display:inline-block;"></div> Сохраняю...';
  }
  if (statusEl) statusEl.textContent = '';

  try {
    var rows = [];
    section.fields.forEach(function (field) {
      var inputId = 'field-' + field.key.replace(/\./g, '_');
      var el = document.getElementById(inputId);
      if (!el) return;
      var value = el.value || '';
      rows.push({ key: field.key, value: value, type: field.type === 'image' ? 'image' : 'text' });
      contentCache[field.key] = value;
    });

    if (rows.length === 0) { showToast('Нет данных для сохранения', 'error'); return; }

    await upsertRows(rows);
    showToast('Сохранено!', 'success');
    if (statusEl) {
      statusEl.textContent = 'Сохранено ' + new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
      statusEl.style.color = 'var(--green)';
    }
  } catch (err) {
    showToast('Ошибка: ' + err.message, 'error');
    if (statusEl) { statusEl.textContent = 'Ошибка сохранения'; statusEl.style.color = 'var(--red)'; }
  } finally {
    if (saveBtn) {
      saveBtn.disabled = false;
      saveBtn.innerHTML = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg> ' +
        (sectionId === 'promotions' ? 'Сохранить все акции' : 'Сохранить раздел');
    }
  }
}

// ---- Toast ----
function showToast(message, type) {
  var toast = document.getElementById('toast');
  var msgEl = document.getElementById('toast-message');
  var iconEl = document.getElementById('toast-icon');
  toast.classList.remove('success', 'error', 'visible');
  msgEl.textContent = message;
  if (type === 'success') {
    toast.classList.add('success');
    iconEl.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>';
  } else {
    toast.classList.add('error');
    iconEl.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>';
  }
  void toast.offsetWidth;
  toast.classList.add('visible');
  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(function () { toast.classList.remove('visible'); }, 4000);
}

// ---- Loading Overlay ----
function showLoading(visible) {
  document.getElementById('loading-overlay').style.display = visible ? 'flex' : 'none';
}

// ---- Change Password ----
function showChangePassword() {
  document.getElementById('new-pw').value = '';
  document.getElementById('new-pw2').value = '';
  document.getElementById('pw-error').style.display = 'none';
  document.getElementById('pw-modal').style.display = 'flex';
}
function closePwModal() { document.getElementById('pw-modal').style.display = 'none'; }

async function doChangePassword() {
  var pw1 = document.getElementById('new-pw').value;
  var pw2 = document.getElementById('new-pw2').value;
  var errEl = document.getElementById('pw-error');
  var btn = document.getElementById('pw-save-btn');

  errEl.style.display = 'none';
  if (pw1.length < 6) { errEl.textContent = 'Пароль должен быть не менее 6 символов'; errEl.style.display = 'block'; return; }
  if (pw1 !== pw2) { errEl.textContent = 'Пароли не совпадают'; errEl.style.display = 'block'; return; }

  btn.disabled = true; btn.textContent = 'Сохраняю...';
  try {
    var res = await fetch(SB_URL + '/auth/v1/user', {
      method: 'PUT',
      headers: { 'apikey': SB_KEY, 'Authorization': 'Bearer ' + accessToken, 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: pw1 })
    });
    if (!res.ok) { var e = await res.json().catch(function(){return{};}); throw new Error(e.message || 'Ошибка'); }
    closePwModal();
    showToast('Пароль успешно изменён!', 'success');
  } catch (e) {
    errEl.textContent = 'Ошибка: ' + e.message; errEl.style.display = 'block';
  } finally {
    btn.disabled = false; btn.textContent = 'Сохранить';
  }
}

// ---- HTML escape ----
function escHtml(str) {
  if (str === null || str === undefined) return '';
  return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
}

// ---- Expose globals ----
window.switchTab = switchTab;
window.saveSection = saveSection;
window.handleImageUpload = handleImageUpload;
window.logout = logout;
window.handleLogin = handleLogin;
window.showChangePassword = showChangePassword;
window.closePwModal = closePwModal;
window.doChangePassword = doChangePassword;
