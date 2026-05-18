// =============================================
// Nordic Air CMS — Admin Panel Logic
// NO external SDK — uses direct fetch to Supabase REST API
// =============================================
'use strict';

// ---- Content Schema ----
const SECTIONS = [
  // 1. КОНТАКТЫ
  {
    id: 'contacts', title: 'Контакты',
    subtitle: 'Телефоны, адрес, часы работы — обновляются на всех страницах сайта',
    fields: [
      { key: 'global.phone',       label: 'Телефон (отображение)',   type: 'text', default: '+7 (931) 634-00-87' },
      { key: 'global.phone_href',  label: 'Телефон href (ссылка)',    type: 'text', default: 'tel:+79316340087' },
      { key: 'global.hours',       label: 'Часы работы (коротко)',    type: 'text', default: 'Пн–Вс: 9:00–21:00' },
      { key: 'global.hours_full',  label: 'Часы работы (полные)',     type: 'text', default: 'Понедельник–Воскресенье: 9:00–21:00' },
      { key: 'global.address',     label: 'Адрес',                   type: 'text', default: 'Санкт-Петербург и Ленинградская область' },
      { key: 'global.email',       label: 'Email',                   type: 'text', default: 'ahdpuxe@mail.ru' },
      { key: 'global.telegram',    label: 'Telegram ссылка',         type: 'text', default: 'https://t.me/+79316340087' },
      { key: 'global.whatsapp',    label: 'WhatsApp ссылка',         type: 'text', default: 'https://wa.me/79316340087' },
      { key: 'global.reviews_url', label: 'Яндекс.Отзывы — ссылка', type: 'text', default: 'https://yandex.com/profile/61772118377/?ll=29.608975%2C59.337122&z=7' },
    ]
  },
  // 2. ГЛАВНАЯ СТРАНИЦА
  {
    id: 'main', title: 'Главная страница',
    subtitle: 'Все тексты главной страницы — герой, услуги, отзывы, FAQ, CTA',
    fields: [
      { key: 'index.notice',              label: 'Уведомление (шапка)',              type: 'html',     default: '<strong>Сезон начался!</strong> Цены растут каждые 3 дня — <a href="contacts.html">зафиксируйте свою цену прямо сейчас</a>' },
      { key: 'index.hero.eyebrow',        label: 'Hero — надпись над заголовком',    type: 'text',     default: 'Санкт-Петербург и Ленинградская область' },
      { key: 'index.hero.title',          label: 'Hero — заголовок H1',              type: 'textarea', default: 'Климатический комфорт под ключ' },
      { key: 'index.hero.subtitle',       label: 'Hero — подзаголовок',             type: 'textarea', default: 'Продажа, монтаж и обслуживание кондиционеров, тепловых насосов и систем вентиляции. Работаем без посредников — только профессионалы с опытом от 10 лет.' },
      { key: 'index.hero.btn1',           label: 'Hero — кнопка 1',                 type: 'text',     default: 'Получить расчёт бесплатно' },
      { key: 'index.hero.btn2',           label: 'Hero — кнопка 2',                 type: 'text',     default: 'Наши работы' },
      { key: 'index.hero.trust1.title',   label: 'Hero — блок 1 заголовок',         type: 'text',     default: 'Монтаж за 1 день' },
      { key: 'index.hero.trust1.span',    label: 'Hero — блок 1 подпись',           type: 'text',     default: 'Заявка сегодня — работа завтра' },
      { key: 'index.hero.trust2.title',   label: 'Hero — блок 2 заголовок',         type: 'text',     default: 'Гарантия 3 года' },
      { key: 'index.hero.trust2.span',    label: 'Hero — блок 2 подпись',           type: 'text',     default: 'На оборудование и монтаж' },
      { key: 'index.hero.trust3.title',   label: 'Hero — блок 3 заголовок',         type: 'text',     default: 'Бесплатная доставка' },
      { key: 'index.hero.trust3.span',    label: 'Hero — блок 3 подпись',           type: 'text',     default: 'По СПб и Ленинградской области' },
      { key: 'index.hero.trust4.title',   label: 'Hero — блок 4 заголовок',         type: 'text',     default: 'Работаем по договору' },
      { key: 'index.hero.trust4.span',    label: 'Hero — блок 4 подпись',           type: 'text',     default: 'Фиксированная цена, никаких сюрпризов' },
      { key: 'index.services.label',      label: 'Услуги — метка раздела',          type: 'text',     default: 'Наши направления' },
      { key: 'index.services.title',      label: 'Услуги — заголовок раздела',      type: 'text',     default: 'Полный спектр климатических решений' },
      { key: 'index.services.desc',       label: 'Услуги — описание раздела',       type: 'textarea', default: 'Три направления — одна команда профессионалов. Не нужно искать разных подрядчиков: мы решаем всё под ключ.' },
      { key: 'index.services.ac.title',   label: 'Кондиционеры — карточка заголовок',  type: 'text',     default: 'Кондиционеры' },
      { key: 'index.services.ac.desc',    label: 'Кондиционеры — карточка описание',   type: 'textarea', default: 'Продажа, монтаж и обслуживание сплит-систем любого типа. Более 1000 моделей в наличии. Подбор под ваш интерьер и бюджет.' },
      { key: 'index.services.ac.price',   label: 'Кондиционеры — цена',               type: 'text',     default: '18 000 ₽' },
      { key: 'index.services.ac.f1',      label: 'Кондиционеры — пункт 1',            type: 'text',     default: 'Настенные, кассетные, канальные' },
      { key: 'index.services.ac.f2',      label: 'Кондиционеры — пункт 2',            type: 'text',     default: 'Балансировка и заправка фреоном' },
      { key: 'index.services.ac.f3',      label: 'Кондиционеры — пункт 3',            type: 'text',     default: 'Техническое обслуживание и ремонт' },
      { key: 'index.services.ac.photo',   label: 'Кондиционеры — фото карточки',       type: 'image',    bucket: 'cms-images' },
      { key: 'index.services.heat.title', label: 'Тепл. насосы — карточка заголовок',  type: 'text',     default: 'Тепловые насосы' },
      { key: 'index.services.heat.desc',  label: 'Тепл. насосы — карточка описание',   type: 'textarea', default: 'Эффективное отопление без газа. Работают при морозах до −30°C. Экономия электроэнергии в 4 раза по сравнению с электрокотлом.' },
      { key: 'index.services.heat.price', label: 'Тепл. насосы — цена',               type: 'text',     default: '50 000 ₽' },
      { key: 'index.services.heat.f1',    label: 'Тепл. насосы — пункт 1',            type: 'text',     default: 'Тип воздух-воздух, срок службы 20 лет' },
      { key: 'index.services.heat.f2',    label: 'Тепл. насосы — пункт 2',            type: 'text',     default: 'Wi-Fi управление, умный дом' },
      { key: 'index.services.heat.f3',    label: 'Тепл. насосы — пункт 3',            type: 'text',     default: 'Летом — режим охлаждения' },
      { key: 'index.services.heat.photo', label: 'Тепловые насосы — фото карточки',    type: 'image',    bucket: 'cms-images' },
      { key: 'index.services.vent.title', label: 'Вентиляция — карточка заголовок',    type: 'text',     default: 'Вентиляция' },
      { key: 'index.services.vent.desc',  label: 'Вентиляция — карточка описание',     type: 'textarea', default: 'Проектирование и монтаж приточно-вытяжных систем с рекуперацией для квартир, домов, офисов и производств.' },
      { key: 'index.services.vent.price', label: 'Вентиляция — цена',                 type: 'text',     default: '50 000 ₽' },
      { key: 'index.services.vent.f1',    label: 'Вентиляция — пункт 1',              type: 'text',     default: 'Бесплатный проект при заказе монтажа' },
      { key: 'index.services.vent.f2',    label: 'Вентиляция — пункт 2',              type: 'text',     default: 'Рекуперация тепла, шумоглушители' },
      { key: 'index.services.vent.f3',    label: 'Вентиляция — пункт 3',              type: 'text',     default: 'Управление с телефона, автоматика' },
      { key: 'index.services.vent.photo', label: 'Вентиляция — фото карточки',         type: 'image',    bucket: 'cms-images' },
      { key: 'index.about.title',         label: 'О компании — заголовок блока',      type: 'text',     default: 'Работаем только с профессионалами, без посредников' },
      { key: 'index.about.text1',         label: 'О компании — первый абзац',         type: 'textarea', default: 'С 2011 года мы устанавливаем климатические системы в Санкт-Петербурге и области. Нет менеджеров и раздутого штата — только инженеры-монтажники с опытом от 10 лет.' },
      { key: 'index.about.text2',         label: 'О компании — второй абзац',         type: 'textarea', default: 'Руководитель компании Андрей Утищев лично разрабатывает проект и контролирует каждый монтаж. Вы общаетесь напрямую с исполнителем — никаких недопониманий.' },
      { key: 'index.about.b1.title',      label: 'О компании — пункт 1 заголовок',   type: 'text',     default: 'Официальный дилер 12+ брендов' },
      { key: 'index.about.b1.desc',       label: 'О компании — пункт 1 текст',       type: 'text',     default: 'Ballu, Tosot, Euroklimat и другие. Прямые поставки без переплат дилерам.' },
      { key: 'index.about.b2.title',      label: 'О компании — пункт 2 заголовок',   type: 'text',     default: 'Договор с фиксированной ценой' },
      { key: 'index.about.b2.desc',       label: 'О компании — пункт 2 текст',       type: 'text',     default: 'Никаких скрытых доплат. Стоимость зафиксирована до начала работ.' },
      { key: 'index.about.b3.title',      label: 'О компании — пункт 3 заголовок',   type: 'text',     default: 'Рейтинг 5.0 на Яндексе' },
      { key: 'index.about.b3.desc',       label: 'О компании — пункт 3 текст',       type: 'text',     default: 'Сотни довольных клиентов — квартиры, офисы, производства, медицинские центры.' },
      { key: 'index.about.photo',         label: 'О компании — фото блока',           type: 'image',    bucket: 'cms-images' },
      { key: 'index.why.title',           label: 'Почему мы — заголовок',            type: 'text',     default: '6 причин доверить климат Nordic Air' },
      { key: 'index.why.desc',            label: 'Почему мы — описание',             type: 'textarea', default: 'Мы думаем о деталях, которые другие упускают — именно поэтому клиенты возвращаются и рекомендуют нас.' },
      { key: 'index.why.1.title',         label: 'Причина 1 — заголовок',            type: 'text',     default: 'Монтаж за 1 день' },
      { key: 'index.why.1.desc',          label: 'Причина 1 — текст',                type: 'textarea', default: 'Заявка сегодня — установка завтра. Работаем без очередей и переносов, в том числе в выходные дни.' },
      { key: 'index.why.2.title',         label: 'Причина 2 — заголовок',            type: 'text',     default: 'Цена под ключ' },
      { key: 'index.why.2.desc',          label: 'Причина 2 — текст',                type: 'textarea', default: 'Никаких скрытых доплат за материалы, трассу или доставку. Одна цена включает всё — от оборудования до уборки после монтажа.' },
      { key: 'index.why.3.title',         label: 'Причина 3 — заголовок',            type: 'text',     default: 'Гарантия 3 года' },
      { key: 'index.why.3.desc',          label: 'Причина 3 — текст',                type: 'textarea', default: 'Гарантируем не только на оборудование, но и на сам монтаж. Что-то пошло не так — исправим бесплатно.' },
      { key: 'index.why.4.title',         label: 'Причина 4 — заголовок',            type: 'text',     default: 'Без посредников' },
      { key: 'index.why.4.desc',          label: 'Причина 4 — текст',                type: 'textarea', default: 'Собственная бригада без субподрядчиков. Один специалист ведёт вас от заявки до сдачи объекта.' },
      { key: 'index.why.5.title',         label: 'Причина 5 — заголовок',            type: 'text',     default: 'Профессиональный инструмент' },
      { key: 'index.why.5.desc',          label: 'Причина 5 — текст',                type: 'textarea', default: 'Алмазное бурение, вакуумирование трассы, манометрическая станция. Работаем аккуратно — без пыли и грязи.' },
      { key: 'index.why.6.title',         label: 'Причина 6 — заголовок',            type: 'text',     default: 'Ответ за 15 минут' },
      { key: 'index.why.6.desc',          label: 'Причина 6 — текст',                type: 'textarea', default: 'Перезваниваем в течение 15 минут после заявки. Принимаем вызовы 7 дней в неделю, с 9:00 до 21:00.' },
      { key: 'index.steps.title',         label: 'Как работаем — заголовок',         type: 'text',     default: '4 шага от заявки до комфорта' },
      { key: 'index.steps.desc',          label: 'Как работаем — описание',          type: 'textarea', default: 'Прозрачный процесс без лишних шагов. Вы всегда знаете, что происходит и когда ждать результат.' },
      { key: 'index.steps.1.title',       label: 'Шаг 1 — заголовок',               type: 'text',     default: 'Заявка или звонок' },
      { key: 'index.steps.1.desc',        label: 'Шаг 1 — описание',                type: 'textarea', default: 'Оставьте заявку на сайте или позвоните. Перезвоним в течение 15 минут и уточним задачу.' },
      { key: 'index.steps.2.title',       label: 'Шаг 2 — заголовок',               type: 'text',     default: 'Замер и расчёт' },
      { key: 'index.steps.2.desc',        label: 'Шаг 2 — описание',                type: 'textarea', default: 'Бесплатный выезд инженера. Подбираем оборудование, фиксируем цену в договоре.' },
      { key: 'index.steps.3.title',       label: 'Шаг 3 — заголовок',               type: 'text',     default: 'Монтаж' },
      { key: 'index.steps.3.desc',        label: 'Шаг 3 — описание',                type: 'textarea', default: 'Профессиональная установка в удобное для вас время. Аккуратно, без пыли, за 1 день.' },
      { key: 'index.steps.4.title',       label: 'Шаг 4 — заголовок',               type: 'text',     default: 'Сдача и гарантия' },
      { key: 'index.steps.4.desc',        label: 'Шаг 4 — описание',                type: 'textarea', default: 'Запускаем, настраиваем, объясняем управление. Выдаём гарантийный талон на 3 года.' },
      { key: 'index.reviews.title',       label: 'Отзывы — заголовок',              type: 'text',     default: '5.0 на Яндексе — не просто цифра' },
      { key: 'index.reviews.desc',        label: 'Отзывы — описание',               type: 'textarea', default: 'Читайте, что говорят реальные клиенты после завершения работ.' },
      { key: 'index.review.1.text',       label: 'Отзыв 1 — текст',                 type: 'textarea', default: '«Заказывал установку кондиционера в квартиру. Приехали точно в срок, сделали аккуратно — даже убрали за собой. Андрей лично контролировал работу. Однозначно рекомендую!»' },
      { key: 'index.review.1.name',       label: 'Отзыв 1 — имя',                   type: 'text',     default: 'Алексей К.' },
      { key: 'index.review.1.role',       label: 'Отзыв 1 — роль',                  type: 'text',     default: 'Жилая квартира, СПб' },
      { key: 'index.review.2.text',       label: 'Отзыв 2 — текст',                 type: 'textarea', default: '«Устанавливали тепловой насос в загородном доме. Без газа — теперь тепло и летом и зимой. За электричество плачу в 3 раза меньше, чем раньше с котлом. Доволен на 100%.»' },
      { key: 'index.review.2.name',       label: 'Отзыв 2 — имя',                   type: 'text',     default: 'Михаил Т.' },
      { key: 'index.review.2.role',       label: 'Отзыв 2 — роль',                  type: 'text',     default: 'Частный дом, Ленобласть' },
      { key: 'index.review.3.text',       label: 'Отзыв 3 — текст',                 type: 'textarea', default: '«Сделали вентиляцию в офисе 400 м². Всё спроектировали, согласовали, смонтировали за 2 недели. Ни одной жалобы от сотрудников — воздух свежий, тихо работает. Спасибо команде!»' },
      { key: 'index.review.3.name',       label: 'Отзыв 3 — имя',                   type: 'text',     default: 'Елена В.' },
      { key: 'index.review.3.role',       label: 'Отзыв 3 — роль',                  type: 'text',     default: 'Офисное здание, СПб' },
      { key: 'index.faq.title',           label: 'FAQ — заголовок',                 type: 'text',     default: 'Часто задаваемые вопросы' },
      { key: 'index.faq.desc',            label: 'FAQ — описание',                  type: 'textarea', default: 'Не нашли ответ? Позвоните нам — ответим на любой вопрос в течение 15 минут.' },
      { key: 'index.faq.1.q',            label: 'FAQ 1 — вопрос',                   type: 'text',     default: 'Сколько стоит установка кондиционера под ключ?' },
      { key: 'index.faq.1.a',            label: 'FAQ 1 — ответ',                    type: 'textarea', default: 'Стандартный монтаж кондиционера под ключ со всеми материалами начинается от 18 000 ₽. Цена зависит от типа и мощности оборудования, длины трассы, сложности объекта. Точный расчёт — бесплатно после звонка или заявки на сайте.' },
      { key: 'index.faq.2.q',            label: 'FAQ 2 — вопрос',                   type: 'text',     default: 'Как быстро вы приедете после заявки?' },
      { key: 'index.faq.2.a',            label: 'FAQ 2 — ответ',                    type: 'textarea', default: 'Перезваниваем в течение 15 минут. Выезд на замер — в день обращения или на следующий день. Монтаж, как правило, выполняется в течение 1–2 рабочих дней после согласования. Работаем в выходные и праздники.' },
      { key: 'index.faq.3.q',            label: 'FAQ 3 — вопрос',                   type: 'text',     default: 'Тепловой насос — это то же самое, что кондиционер?' },
      { key: 'index.faq.3.a',            label: 'FAQ 3 — ответ',                    type: 'textarea', default: 'Тепловой насос типа «воздух-воздух» — это мощная инверторная система, оптимизированная для работы при сильных морозах (до −30°C). В отличие от бытового кондиционера, он даёт в 4–5 раз больше тепла на 1 кВт потреблённой электроэнергии и рассчитан как основной источник отопления.' },
      { key: 'index.faq.4.q',            label: 'FAQ 4 — вопрос',                   type: 'text',     default: 'Включен ли НДС в стоимость и нужна ли предоплата?' },
      { key: 'index.faq.4.a',            label: 'FAQ 4 — ответ',                    type: 'textarea', default: 'Мы — ИП на упрощённой системе налогообложения, НДС не применяется. Предоплаты для физических лиц, как правило, не требуется. Всё фиксируется в договоре: стоимость, перечень работ, сроки и гарантийные обязательства.' },
      { key: 'index.faq.5.q',            label: 'FAQ 5 — вопрос',                   type: 'text',     default: 'Выполняете ли работы на загородных объектах?' },
      { key: 'index.faq.5.a',            label: 'FAQ 5 — ответ',                    type: 'textarea', default: 'Да, работаем по всему Санкт-Петербургу и Ленинградской области. Доставка оборудования в пределах СПб — бесплатно. Для объектов в Ленобласти уточняйте условия при звонке — в большинстве случаев транспортные расходы минимальны или включены в стоимость проекта.' },
      { key: 'index.cta.title',          label: 'CTA — заголовок',                  type: 'text',     default: 'Готовы обсудить ваш проект?' },
      { key: 'index.cta.desc',           label: 'CTA — описание',                   type: 'textarea', default: 'Получите бесплатный расчёт стоимости в течение 15 минут. Работаем 7 дней в неделю, с 9:00 до 21:00.' },
      { key: 'index.portfolio.photo1',   label: 'Портфолио — фото 1',               type: 'image',    bucket: 'cms-images' },
      { key: 'index.portfolio.photo2',   label: 'Портфолио — фото 2',               type: 'image',    bucket: 'cms-images' },
      { key: 'index.portfolio.photo3',   label: 'Портфолио — фото 3',               type: 'image',    bucket: 'cms-images' },
      { key: 'index.portfolio.photo4',   label: 'Портфолио — фото 4',               type: 'image',    bucket: 'cms-images' },
      { key: 'index.portfolio.photo5',   label: 'Портфолио — фото 5',               type: 'image',    bucket: 'cms-images' },
      { key: 'index.portfolio.photo6',   label: 'Портфолио — фото 6',               type: 'image',    bucket: 'cms-images' },
    ]
  },
  // 3. АКЦИИ
  {
    id: 'promotions', title: 'Акции',
    subtitle: 'Страница акций: заголовки страницы и карточки акций',
    promoGroups: [1, 2, 3, 4],
    fields: [
      { key: 'promos.hero.title',    label: 'Страница — заголовок H1',      type: 'text',     default: 'Акции и спецпредложения' },
      { key: 'promos.hero.sub',      label: 'Страница — подзаголовок',      type: 'textarea', default: 'Успейте воспользоваться выгодными предложениями — каждая акция имеет срок действия' },
      { key: 'promos.section.label', label: 'Секция — метка',               type: 'text',     default: 'Актуальные предложения' },
      { key: 'promos.section.title', label: 'Секция — заголовок',           type: 'text',     default: 'Специальные цены на лето 2025' },
      { key: 'promos.section.sub',   label: 'Секция — описание',            type: 'textarea', default: 'Летний сезон — лучшее время установить кондиционер. Цены действуют ограниченное время' },
      { key: 'promo.1.badge',        label: 'Бейдж',                        type: 'text',     default: 'Хит сезона',                 group: 1 },
      { key: 'promo.1.title',        label: 'Название акции',               type: 'text',     default: 'Кондиционер под ключ',        group: 1 },
      { key: 'promo.1.desc',         label: 'Описание',                     type: 'textarea', default: 'Кондиционер Ballu / Tosot + монтаж + все расходники + гарантия 3 года. Быстрая установка за 1 день.', group: 1 },
      { key: 'promo.1.old_price',    label: 'Старая цена',                  type: 'text',     default: 'от 22 500 ₽',                group: 1 },
      { key: 'promo.1.new_price',    label: 'Новая цена',                   type: 'text',     default: 'от 18 000 ₽',                group: 1 },
      { key: 'promo.1.deadline',     label: 'Срок (ISO дата)',              type: 'text',     default: '2026-09-01T00:00:00',         group: 1, hint: 'Формат: ГГГГ-ММ-ДДTчч:мм:сс' },
      { key: 'promo.1.image',        label: 'Изображение',                  type: 'image',    bucket: 'cms-images',                  group: 1 },
      { key: 'promo.2.badge',        label: 'Бейдж',                        type: 'text',     default: 'Рекомендуем',                group: 2 },
      { key: 'promo.2.title',        label: 'Название акции',               type: 'text',     default: 'Мульти-сплит для квартиры',   group: 2 },
      { key: 'promo.2.desc',         label: 'Описание',                     type: 'textarea', default: 'Одна внешняя + 2 внутренних блока. Климат в двух комнатах одновременно. Тихая работа от 19 дБ.', group: 2 },
      { key: 'promo.2.old_price',    label: 'Старая цена',                  type: 'text',     default: 'от 58 000 ₽',                group: 2 },
      { key: 'promo.2.new_price',    label: 'Новая цена',                   type: 'text',     default: 'от 49 000 ₽',                group: 2 },
      { key: 'promo.2.deadline',     label: 'Срок (ISO дата)',              type: 'text',     default: '2026-08-15T00:00:00',         group: 2, hint: 'Формат: ГГГГ-ММ-ДДTчч:мм:сс' },
      { key: 'promo.2.image',        label: 'Изображение',                  type: 'image',    bucket: 'cms-images',                  group: 2 },
      { key: 'promo.3.badge',        label: 'Бейдж',                        type: 'text',     default: 'Сезонная',                   group: 3 },
      { key: 'promo.3.title',        label: 'Название акции',               type: 'text',     default: 'ТО кондиционера',             group: 3 },
      { key: 'promo.3.desc',         label: 'Описание',                     type: 'textarea', default: 'Полный сервис: чистка фильтров, промывка теплообменника, дозаправка фреоном, проверка электроники.', group: 3 },
      { key: 'promo.3.old_price',    label: 'Старая цена',                  type: 'text',     default: 'от 3 300 ₽',                 group: 3 },
      { key: 'promo.3.new_price',    label: 'Новая цена',                   type: 'text',     default: 'от 3 000 ₽',                 group: 3 },
      { key: 'promo.3.deadline',     label: 'Срок (ISO дата)',              type: 'text',     default: '2026-10-01T00:00:00',         group: 3, hint: 'Формат: ГГГГ-ММ-ДДTчч:мм:сс' },
      { key: 'promo.3.image',        label: 'Изображение',                  type: 'image',    bucket: 'cms-images',                  group: 3 },
      { key: 'promo.4.badge',        label: 'Бейдж',                        type: 'text',     default: 'Комплекс',                   group: 4 },
      { key: 'promo.4.title',        label: 'Название акции',               type: 'text',     default: 'Вентиляция + кондиционер',    group: 4 },
      { key: 'promo.4.desc',         label: 'Описание',                     type: 'textarea', default: 'Комплексный заказ: система вентиляции и кондиционирования в одном проекте. Один монтаж — двойная экономия.', group: 4 },
      { key: 'promo.4.old_price',    label: 'Старая цена',                  type: 'text',     default: 'от 79 000 ₽',                group: 4 },
      { key: 'promo.4.new_price',    label: 'Новая цена',                   type: 'text',     default: 'от 69 500 ₽',                group: 4 },
      { key: 'promo.4.deadline',     label: 'Срок (ISO дата)',              type: 'text',     default: '2026-09-15T00:00:00',         group: 4, hint: 'Формат: ГГГГ-ММ-ДДTчч:мм:сс' },
      { key: 'promo.4.image',        label: 'Изображение',                  type: 'image',    bucket: 'cms-images',                  group: 4 },
    ]
  },
  // 4. КОНДИЦИОНЕРЫ
  {
    id: 'conditioners', title: 'Кондиционеры',
    subtitle: 'Все тексты страницы conditioners.html',
    fields: [
      { key: 'services.ac.hero_title', label: 'Hero — заголовок H1',         type: 'text',     default: 'Кондиционеры в Санкт-Петербурге' },
      { key: 'services.ac.hero_sub',   label: 'Hero — подзаголовок',         type: 'textarea', default: 'Продажа, монтаж и обслуживание сплит-систем любого типа. Более 1000 моделей в наличии. Монтаж за 1 день — от 18 000 ₽ под ключ.' },
      { key: 'ac.hero.tag1',           label: 'Hero — тег 1',                type: 'text',     default: 'Монтаж за 1 день' },
      { key: 'ac.hero.tag2',           label: 'Hero — тег 2',                type: 'text',     default: 'Гарантия 3 года' },
      { key: 'ac.hero.tag3',           label: 'Hero — тег 3',                type: 'text',     default: '1000+ моделей' },
      { key: 'ac.hero.tag4',           label: 'Hero — тег 4',                type: 'text',     default: 'Скидка 10% при заказе сегодня' },
      { key: 'ac.types.title',         label: 'Виды — заголовок',            type: 'text',     default: 'Подберём оборудование под любую задачу' },
      { key: 'ac.types.desc',          label: 'Виды — описание',             type: 'textarea', default: 'Настенные, кассетные, канальные, мульти-сплит — устанавливаем любые типы систем для квартир, офисов и производств.' },
      { key: 'ac.type.1.title',        label: 'Тип 1 — название',            type: 'text',     default: 'Настенные (сплит-системы)' },
      { key: 'ac.type.1.desc',         label: 'Тип 1 — описание',            type: 'textarea', default: 'Самый популярный тип. Подходит для жилых комнат, спален, небольших офисов. Тихие инверторные модели экономят до 40% электроэнергии.' },
      { key: 'ac.type.1.for',          label: 'Тип 1 — для кого',            type: 'text',     default: 'Квартиры и небольшие офисы' },
      { key: 'ac.type.2.title',        label: 'Тип 2 — название',            type: 'text',     default: 'Кассетные кондиционеры' },
      { key: 'ac.type.2.desc',         label: 'Тип 2 — описание',            type: 'textarea', default: 'Встраиваются в подвесной потолок. Обдувают помещение равномерно в 4 стороны — идеально для переговорных, ресторанов, торговых залов.' },
      { key: 'ac.type.2.for',          label: 'Тип 2 — для кого',            type: 'text',     default: 'Коммерческие помещения' },
      { key: 'ac.type.3.title',        label: 'Тип 3 — название',            type: 'text',     default: 'Канальные кондиционеры' },
      { key: 'ac.type.3.desc',         label: 'Тип 3 — описание',            type: 'textarea', default: 'Полностью скрыты в конструкции потолка или стен. Воздух распределяется через воздуховоды. Оптимально при ремонте «под ключ».' },
      { key: 'ac.type.3.for',          label: 'Тип 3 — для кого',            type: 'text',     default: 'Коттеджи и элитные объекты' },
      { key: 'ac.type.4.title',        label: 'Тип 4 — название',            type: 'text',     default: 'Мульти-сплит системы' },
      { key: 'ac.type.4.desc',         label: 'Тип 4 — описание',            type: 'textarea', default: 'Один внешний блок на несколько внутренних. Экономия места на фасаде здания, независимое управление каждой комнатой.' },
      { key: 'ac.type.4.for',          label: 'Тип 4 — для кого',            type: 'text',     default: 'Квартиры с несколькими комнатами' },
      { key: 'ac.type.5.title',        label: 'Тип 5 — название',            type: 'text',     default: 'Напольные и консольные' },
      { key: 'ac.type.5.desc',         label: 'Тип 5 — описание',            type: 'textarea', default: 'Монтируются внизу стены — отличное решение там, где нельзя делать отверстие в стене на высоте или ограничена высота потолков.' },
      { key: 'ac.type.5.for',          label: 'Тип 5 — для кого',            type: 'text',     default: 'Особые планировки' },
      { key: 'ac.type.6.title',        label: 'Тип 6 — название',            type: 'text',     default: 'Техобслуживание и ремонт' },
      { key: 'ac.type.6.desc',         label: 'Тип 6 — описание',            type: 'textarea', default: 'Чистка, заправка фреоном, диагностика, ремонт любой сложности. Продлевает срок службы кондиционера и сохраняет эффективность работы.' },
      { key: 'ac.type.6.for',          label: 'Тип 6 — для кого',            type: 'text',     default: 'Любые модели и бренды' },
      { key: 'ac.type.1.photo',        label: 'Тип 1 — фото карточки',       type: 'image',    bucket: 'cms-images' },
      { key: 'ac.type.2.photo',        label: 'Тип 2 — фото карточки',       type: 'image',    bucket: 'cms-images' },
      { key: 'ac.type.3.photo',        label: 'Тип 3 — фото карточки',       type: 'image',    bucket: 'cms-images' },
      { key: 'ac.type.4.photo',        label: 'Тип 4 — фото карточки',       type: 'image',    bucket: 'cms-images' },
      { key: 'ac.type.5.photo',        label: 'Тип 5 — фото карточки',       type: 'image',    bucket: 'cms-images' },
      { key: 'ac.type.6.photo',        label: 'Тип 6 — фото карточки',       type: 'image',    bucket: 'cms-images' },
      { key: 'ac.price.title',         label: 'Прайс-лист — заголовок',      type: 'text',     default: 'Стоимость монтажа кондиционера' },
      { key: 'ac.price.desc',          label: 'Прайс-лист — описание',       type: 'textarea', default: 'Цена под ключ — включает все материалы, трассу, крепежи, вакуумирование и пуско-наладку. Никаких доплат после подписания договора.' },
      { key: 'ac.price.note',          label: 'Прайс-лист — сноска',         type: 'textarea', default: '* Цены указаны при стандартной трассе до 4 м. Увеличение трассы, высотные работы и дополнительные опции рассчитываются индивидуально.' },
      { key: 'ac.brands.title',        label: 'Бренды — заголовок',          type: 'text',     default: 'Работаем с 12+ ведущими брендами' },
      { key: 'ac.brands.desc',         label: 'Бренды — описание',           type: 'textarea', default: 'Прямые поставки от производителей. Гарантируем оригинальность оборудования и сопровождение на весь гарантийный срок.' },
      { key: 'ac.process.title',       label: 'Монтаж — заголовок',          type: 'text',     default: 'Профессиональный монтаж без пыли и задержек' },
      { key: 'ac.process.desc',        label: 'Монтаж — описание',           type: 'textarea', default: 'Работаем аккуратно — стелем защитные покрытия, убираем за собой. Установка стандартного кондиционера занимает 2–3 часа.' },
      { key: 'ac.process.s1.title',    label: 'Монтаж — шаг 1 название',     type: 'text',     default: 'Алмазное бурение отверстий' },
      { key: 'ac.process.s1.desc',     label: 'Монтаж — шаг 1 описание',     type: 'textarea', default: 'Ровные края, минимум пыли. Используем профессиональные установки с пылесборниками.' },
      { key: 'ac.process.s2.title',    label: 'Монтаж — шаг 2 название',     type: 'text',     default: 'Вакуумирование трассы' },
      { key: 'ac.process.s2.desc',     label: 'Монтаж — шаг 2 описание',     type: 'textarea', default: 'Удаляем влагу и воздух из системы — обязательное условие долгой работы компрессора.' },
      { key: 'ac.process.s3.title',    label: 'Монтаж — шаг 3 название',     type: 'text',     default: 'Пуско-наладка и обучение' },
      { key: 'ac.process.s3.desc',     label: 'Монтаж — шаг 3 описание',     type: 'textarea', default: 'Проверяем все режимы работы, показываем управление, отвечаем на вопросы.' },
      { key: 'ac.process.s4.title',    label: 'Монтаж — шаг 4 название',     type: 'text',     default: 'Гарантийный талон' },
      { key: 'ac.process.s4.desc',     label: 'Монтаж — шаг 4 описание',     type: 'textarea', default: 'Выдаём документы с гарантией 3 года на оборудование и монтаж. Устраним любую проблему бесплатно.' },
      { key: 'ac.why.title',           label: 'Почему Nordic Air — заголовок', type: 'text',   default: 'Монтаж, которому доверяют' },
      { key: 'ac.why.c1.title',        label: 'Преимущество 1 — заголовок',  type: 'text',     default: 'Заявка сегодня — монтаж завтра' },
      { key: 'ac.why.c1.desc',         label: 'Преимущество 1 — текст',      type: 'textarea', default: 'Принимаем заявки 7 дней в неделю. Без очередей, без переносов сроков — всё по договору.' },
      { key: 'ac.why.c2.title',        label: 'Преимущество 2 — заголовок',  type: 'text',     default: 'Цена под ключ — всё включено' },
      { key: 'ac.why.c2.desc',         label: 'Преимущество 2 — текст',      type: 'textarea', default: 'Кабель-канал, крепёж, межблочная трасса, фреон, пуско-наладка — включены в стоимость.' },
      { key: 'ac.why.c3.title',        label: 'Преимущество 3 — заголовок',  type: 'text',     default: 'Гарантия на монтаж 3 года' },
      { key: 'ac.why.c3.desc',         label: 'Преимущество 3 — текст',      type: 'textarea', default: 'Вы защищены от проблем после установки. Исправим бесплатно, если что-то пойдёт не так.' },
      { key: 'ac.cta.title',           label: 'CTA — заголовок',             type: 'text',     default: 'Подберём кондиционер бесплатно' },
      { key: 'ac.cta.desc',            label: 'CTA — описание',              type: 'textarea', default: 'Позвоните или оставьте заявку. Специалист свяжется в течение 15 минут и поможет выбрать оптимальную модель под ваш бюджет.' },
      { key: 'ac.gallery.photo1',      label: 'Галерея — фото 1',            type: 'image',    bucket: 'cms-images' },
      { key: 'ac.gallery.photo2',      label: 'Галерея — фото 2',            type: 'image',    bucket: 'cms-images' },
      { key: 'ac.gallery.photo3',      label: 'Галерея — фото 3',            type: 'image',    bucket: 'cms-images' },
      { key: 'ac.gallery.photo4',      label: 'Галерея — фото 4',            type: 'image',    bucket: 'cms-images' },
      { key: 'ac.gallery.photo5',      label: 'Галерея — фото 5',            type: 'image',    bucket: 'cms-images' },
      { key: 'ac.gallery.photo6',      label: 'Галерея — фото 6',            type: 'image',    bucket: 'cms-images' },
      { key: 'ac.gallery.photo7',      label: 'Галерея — фото 7',            type: 'image',    bucket: 'cms-images' },
      { key: 'ac.gallery.photo8',      label: 'Галерея — фото 8',            type: 'image',    bucket: 'cms-images' },
      { key: 'ac.gallery.photo9',      label: 'Галерея — фото 9',            type: 'image',    bucket: 'cms-images' },
    ]
  },
  // 5. ТЕПЛОВЫЕ НАСОСЫ
  {
    id: 'heat', title: 'Тепловые насосы',
    subtitle: 'Все тексты страницы heat-pumps.html',
    fields: [
      { key: 'services.heat.hero_title', label: 'Hero — заголовок H1',        type: 'text',     default: 'Тёплый дом — даже если нет газа' },
      { key: 'services.heat.hero_sub',   label: 'Hero — подзаголовок',        type: 'textarea', default: 'Тепловые насосы воздух-воздух для частных домов, офисов и складов. Работают при −30°C, экономят электроэнергию в 4 раза. Монтаж за 1 день.' },
      { key: 'heat.hero.tag1',           label: 'Hero — тег 1',               type: 'text',     default: 'Работает при −30°C' },
      { key: 'heat.hero.tag2',           label: 'Hero — тег 2',               type: 'text',     default: 'Экономия ×4 vs электрокотёл' },
      { key: 'heat.hero.tag3',           label: 'Hero — тег 3',               type: 'text',     default: 'Срок службы 20 лет' },
      { key: 'heat.hero.tag4',           label: 'Hero — тег 4',               type: 'text',     default: 'Wi-Fi управление' },
      { key: 'heat.what.title',          label: 'Что такое — заголовок',      type: 'text',     default: 'Тепловой насос — разумная инвестиция в тепло' },
      { key: 'heat.what.p1',            label: 'Что такое — абзац 1',         type: 'textarea', default: 'Тепловой насос типа «воздух-воздух» — это высокоэффективная система отопления, которая извлекает тепловую энергию из уличного воздуха даже при сильном морозе и передаёт её в помещение.' },
      { key: 'heat.what.p2',            label: 'Что такое — абзац 2',         type: 'textarea', default: 'На 1 кВт потреблённой электроэнергии система производит 4–5 кВт тепловой мощности. Это делает тепловой насос в 4 раза экономичнее электрокотла.' },
      { key: 'heat.what.i1.title',      label: 'Инфо 1 — заголовок',          type: 'text',     default: 'Полная безопасность' },
      { key: 'heat.what.i1.desc',       label: 'Инфо 1 — описание',           type: 'textarea', default: 'Нет открытого огня, газа, дымохода. Не требует ежегодного обслуживания в отличие от газового котла.' },
      { key: 'heat.what.i2.title',      label: 'Инфо 2 — заголовок',          type: 'text',     default: 'Режим охлаждения летом' },
      { key: 'heat.what.i2.desc',       label: 'Инфо 2 — описание',           type: 'textarea', default: 'Зимой — отопление, летом — кондиционирование. Одна система решает обе задачи.' },
      { key: 'heat.what.i3.title',      label: 'Инфо 3 — заголовок',          type: 'text',     default: 'Управление со смартфона' },
      { key: 'heat.what.i3.desc',       label: 'Инфо 3 — описание',           type: 'textarea', default: 'Wi-Fi модуль, таймер, автозапуск. Интеграция в системы умного дома.' },
      { key: 'heat.cmp.title',          label: 'Сравнение — заголовок',       type: 'text',     default: 'Что выгоднее — газ, электрокотёл или тепловой насос?' },
      { key: 'heat.cmp.desc',           label: 'Сравнение — описание',        type: 'textarea', default: 'Газ остаётся самым дешёвым при наличии трубы. Без газификации — тепловой насос вне конкуренции по экономичности.' },
      { key: 'heat.models.title',       label: 'Модели — заголовок',          type: 'text',     default: 'Оборудование под любой объект' },
      { key: 'heat.models.desc',        label: 'Модели — описание',           type: 'textarea', default: 'Поставляем насосы производства Италии. Гарантия производителя + наша гарантия на монтаж.' },
      { key: 'heat.model.1.title',      label: 'Модель 1 — название',         type: 'text',     default: 'EKSF-25HIS' },
      { key: 'heat.model.1.desc',       label: 'Модель 1 — описание',         type: 'text',     default: 'Для помещений до 30 м²' },
      { key: 'heat.model.1.price',      label: 'Модель 1 — цена',             type: 'text',     default: '50 000 ₽' },
      { key: 'heat.model.1.f1',        label: 'Модель 1 — пункт 1',           type: 'text',     default: 'Мощность: 2.5 кВт тепла' },
      { key: 'heat.model.1.f2',        label: 'Модель 1 — пункт 2',           type: 'text',     default: 'Работа до −30°C' },
      { key: 'heat.model.1.f3',        label: 'Модель 1 — пункт 3',           type: 'text',     default: 'Wi-Fi управление' },
      { key: 'heat.model.1.f4',        label: 'Модель 1 — пункт 4',           type: 'text',     default: 'Монтаж и пуско-наладка' },
      { key: 'heat.model.2.badge',     label: 'Модель 2 — бейдж',             type: 'text',     default: 'Популярный выбор' },
      { key: 'heat.model.2.title',      label: 'Модель 2 — название',         type: 'text',     default: 'EKSF-50HIS' },
      { key: 'heat.model.2.desc',       label: 'Модель 2 — описание',         type: 'text',     default: 'Для помещений до 55 м²' },
      { key: 'heat.model.2.price',      label: 'Модель 2 — цена',             type: 'text',     default: '80 000 ₽' },
      { key: 'heat.model.2.f1',        label: 'Модель 2 — пункт 1',           type: 'text',     default: 'Мощность: 5.0 кВт тепла' },
      { key: 'heat.model.2.f2',        label: 'Модель 2 — пункт 2',           type: 'text',     default: 'Работа до −30°C' },
      { key: 'heat.model.2.f3',        label: 'Модель 2 — пункт 3',           type: 'text',     default: 'Wi-Fi + умная розетка в подарок' },
      { key: 'heat.model.2.f4',        label: 'Модель 2 — пункт 4',           type: 'text',     default: 'Авторестарт, защита от коррозии' },
      { key: 'heat.model.2.f5',        label: 'Модель 2 — пункт 5',           type: 'text',     default: 'Монтаж и пуско-наладка' },
      { key: 'heat.model.3.title',      label: 'Модель 3 — название',         type: 'text',     default: 'EKSF-70HIS' },
      { key: 'heat.model.3.desc',       label: 'Модель 3 — описание',         type: 'text',     default: 'Для помещений до 80 м²' },
      { key: 'heat.model.3.price',      label: 'Модель 3 — цена',             type: 'text',     default: '99 000 ₽' },
      { key: 'heat.model.3.f1',        label: 'Модель 3 — пункт 1',           type: 'text',     default: 'Мощность: 7.0 кВт тепла' },
      { key: 'heat.model.3.f2',        label: 'Модель 3 — пункт 2',           type: 'text',     default: 'Работа до −30°C' },
      { key: 'heat.model.3.f3',        label: 'Модель 3 — пункт 3',           type: 'text',     default: 'Wi-Fi управление' },
      { key: 'heat.model.3.f4',        label: 'Модель 3 — пункт 4',           type: 'text',     default: 'Монтаж и пуско-наладка' },
      { key: 'heat.models.note',       label: 'Модели — сноска',              type: 'textarea', default: 'Производитель: Euroklimat, Италия. Для крупных объектов — рассчитываем индивидуально.' },
      { key: 'heat.adv.title',         label: 'Преимущества — заголовок',     type: 'text',     default: 'Почему тепловой насос — правильный выбор' },
      { key: 'heat.adv.desc',          label: 'Преимущества — описание',      type: 'textarea', default: '10 причин перейти на тепловой насос прямо сейчас' },
      { key: 'heat.adv.a1.title',      label: 'Преимущество 1 — заголовок',   type: 'text',     default: 'Экономия в 4 раза' },
      { key: 'heat.adv.a1.desc',       label: 'Преимущество 1 — текст',       type: 'textarea', default: 'vs электрический котёл при тех же затратах на электроэнергию' },
      { key: 'heat.adv.a2.title',      label: 'Преимущество 2 — заголовок',   type: 'text',     default: 'Работает при −30°C' },
      { key: 'heat.adv.a2.desc',       label: 'Преимущество 2 — текст',       type: 'textarea', default: 'Специально разработан для российского климата' },
      { key: 'heat.adv.a3.title',      label: 'Преимущество 3 — заголовок',   type: 'text',     default: 'Срок службы 20 лет' },
      { key: 'heat.adv.a3.desc',       label: 'Преимущество 3 — текст',       type: 'textarea', default: '«Установил и забыл» — минимум обслуживания' },
      { key: 'heat.adv.a4.title',      label: 'Преимущество 4 — заголовок',   type: 'text',     default: 'Экологичность' },
      { key: 'heat.adv.a4.desc',       label: 'Преимущество 4 — текст',       type: 'textarea', default: 'Нет выбросов CO₂, дымохода, запаха горения' },
      { key: 'heat.adv.a5.title',      label: 'Преимущество 5 — заголовок',   type: 'text',     default: 'Нет согласований' },
      { key: 'heat.adv.a5.desc',       label: 'Преимущество 5 — текст',       type: 'textarea', default: 'В отличие от газа — никаких проверок, разрешений, инспекций' },
      { key: 'heat.adv.a6.title',      label: 'Преимущество 6 — заголовок',   type: 'text',     default: 'Летом — охлаждение' },
      { key: 'heat.adv.a6.desc',       label: 'Преимущество 6 — текст',       type: 'textarea', default: 'Режим кондиционирования включён в стоимость' },
      { key: 'heat.cta.title',         label: 'CTA — заголовок',              type: 'text',     default: 'Рассчитаем экономию для вашего дома' },
      { key: 'heat.cta.desc',          label: 'CTA — описание',               type: 'textarea', default: 'Бесплатная консультация. Покажем, сколько вы сэкономите за год, и подберём оптимальную модель под ваш объект.' },
      { key: 'heat.what.photo',        label: 'Что такое — фото',             type: 'image',    bucket: 'cms-images' },
      { key: 'heat.gallery.photo1',    label: 'Галерея — фото 1',             type: 'image',    bucket: 'cms-images' },
      { key: 'heat.gallery.photo2',    label: 'Галерея — фото 2',             type: 'image',    bucket: 'cms-images' },
      { key: 'heat.gallery.photo3',    label: 'Галерея — фото 3',             type: 'image',    bucket: 'cms-images' },
      { key: 'heat.gallery.photo4',    label: 'Галерея — фото 4',             type: 'image',    bucket: 'cms-images' },
      { key: 'heat.gallery.photo5',    label: 'Галерея — фото 5',             type: 'image',    bucket: 'cms-images' },
      { key: 'heat.gallery.photo6',    label: 'Галерея — фото 6',             type: 'image',    bucket: 'cms-images' },
    ]
  },
  // 6. ВЕНТИЛЯЦИЯ
  {
    id: 'ventilation', title: 'Вентиляция',
    subtitle: 'Все тексты страницы ventilation.html',
    fields: [
      { key: 'services.vent.hero_title', label: 'Hero — заголовок H1',        type: 'text',     default: 'Вентиляция под ключ в Санкт-Петербурге' },
      { key: 'services.vent.hero_sub',   label: 'Hero — подзаголовок',        type: 'textarea', default: 'Проектирование и монтаж приточно-вытяжных систем с рекуперацией. Квартиры, дома, офисы, рестораны, производство. Бесплатный проект при заказе монтажа.' },
      { key: 'vent.hero.tag1',           label: 'Hero — тег 1',               type: 'text',     default: 'Проект в подарок' },
      { key: 'vent.hero.tag2',           label: 'Hero — тег 2',               type: 'text',     default: 'Гарантия 5 лет' },
      { key: 'vent.hero.tag3',           label: 'Hero — тег 3',               type: 'text',     default: 'Срок от 2 недель' },
      { key: 'vent.hero.tag4',           label: 'Hero — тег 4',               type: 'text',     default: 'Управление со смартфона' },
      { key: 'vent.types.title',         label: 'Виды систем — заголовок',    type: 'text',     default: 'Подберём систему под ваш объект' },
      { key: 'vent.types.desc',          label: 'Виды систем — описание',     type: 'textarea', default: 'Проектируем и монтируем все типы вентиляционных систем — от простой бризерной установки до промышленной вытяжки.' },
      { key: 'vent.type.1.title',        label: 'Тип 1 — название',           type: 'text',     default: 'Приточная вентиляция' },
      { key: 'vent.type.1.desc',         label: 'Тип 1 — описание',           type: 'textarea', default: 'Подача очищенного и подогретого свежего воздуха. Для жилых помещений, офисов, магазинов.' },
      { key: 'vent.type.1.price',        label: 'Тип 1 — цена',               type: 'text',     default: 'от 50 000 ₽' },
      { key: 'vent.type.2.title',        label: 'Тип 2 — название',           type: 'text',     default: 'Приточно-вытяжная с рекуперацией' },
      { key: 'vent.type.2.desc',         label: 'Тип 2 — описание',           type: 'textarea', default: 'Подача свежего + удаление отработанного воздуха через рекуператор. Экономия тепла до 80%.' },
      { key: 'vent.type.2.price',        label: 'Тип 2 — цена',               type: 'text',     default: 'от 100 000 ₽' },
      { key: 'vent.type.3.title',        label: 'Тип 3 — название',           type: 'text',     default: 'Промышленная вентиляция' },
      { key: 'vent.type.3.desc',         label: 'Тип 3 — описание',           type: 'textarea', default: 'Удаление вредных веществ, поддержание нормативного воздухообмена. Заводы, склады, производства.' },
      { key: 'vent.type.3.price',        label: 'Тип 3 — цена',               type: 'text',     default: 'от 200 000 ₽' },
      { key: 'vent.type.4.title',        label: 'Тип 4 — название',           type: 'text',     default: 'Бризер / Приточный клапан' },
      { key: 'vent.type.4.desc',         label: 'Тип 4 — описание',           type: 'textarea', default: 'Компактное решение для одной-двух комнат. Очистка и подача свежего воздуха без капитального монтажа.' },
      { key: 'vent.type.4.price',        label: 'Тип 4 — цена',               type: 'text',     default: 'от 15 000 ₽' },
      { key: 'vent.type.5.title',        label: 'Тип 5 — название',           type: 'text',     default: 'Дымоудаление и противодымная' },
      { key: 'vent.type.5.desc',         label: 'Тип 5 — описание',           type: 'textarea', default: 'Системы дымоудаления (СДУ) и подпора воздуха для обеспечения эвакуации. По нормам пожарной безопасности.' },
      { key: 'vent.type.5.price',        label: 'Тип 5 — цена',               type: 'text',     default: 'Индивидуальный расчёт' },
      { key: 'vent.type.6.title',        label: 'Тип 6 — название',           type: 'text',     default: 'Осушение воздуха' },
      { key: 'vent.type.6.desc',         label: 'Тип 6 — описание',           type: 'textarea', default: 'Борьба с конденсатом и плесенью. Поддержание нормативной влажности в бассейнах, подвалах, складах.' },
      { key: 'vent.type.6.price',        label: 'Тип 6 — цена',               type: 'text',     default: 'от 30 000 ₽' },
      { key: 'vent.tiers.title',         label: 'Тарифы — заголовок',         type: 'text',     default: 'Система вентиляции под ключ' },
      { key: 'vent.tiers.desc',          label: 'Тарифы — описание',          type: 'textarea', default: 'Три комплектации для разных задач. Все варианты включают проект, материалы, монтаж и ввод в эксплуатацию.' },
      { key: 'vent.tier.1.title',        label: 'Тариф 1 — название',         type: 'text',     default: 'Эконом' },
      { key: 'vent.tier.1.desc',         label: 'Тариф 1 — описание',         type: 'text',     default: 'Приточная вентиляция для квартир' },
      { key: 'vent.tier.1.price',        label: 'Тариф 1 — цена',             type: 'text',     default: '50 000 ₽' },
      { key: 'vent.tier.1.f1',          label: 'Тариф 1 — пункт 1',           type: 'text',     default: 'Приточная установка' },
      { key: 'vent.tier.1.f2',          label: 'Тариф 1 — пункт 2',           type: 'text',     default: 'Фильтрация воздуха' },
      { key: 'vent.tier.1.f3',          label: 'Тариф 1 — пункт 3',           type: 'text',     default: 'Подогрев воздуха' },
      { key: 'vent.tier.1.f4',          label: 'Тариф 1 — пункт 4',           type: 'text',     default: 'Естественное удаление' },
      { key: 'vent.tier.2.badge',        label: 'Тариф 2 — бейдж',            type: 'text',     default: 'Лучший выбор' },
      { key: 'vent.tier.2.title',        label: 'Тариф 2 — название',         type: 'text',     default: 'Стандарт' },
      { key: 'vent.tier.2.desc',         label: 'Тариф 2 — описание',         type: 'text',     default: 'Приточно-вытяжная с рекуперацией' },
      { key: 'vent.tier.2.price',        label: 'Тариф 2 — цена',             type: 'text',     default: '100 000 ₽' },
      { key: 'vent.tier.2.f1',          label: 'Тариф 2 — пункт 1',           type: 'text',     default: 'Приточно-вытяжная установка' },
      { key: 'vent.tier.2.f2',          label: 'Тариф 2 — пункт 2',           type: 'text',     default: 'Рекуперация тепла (до 80%)' },
      { key: 'vent.tier.2.f3',          label: 'Тариф 2 — пункт 3',           type: 'text',     default: 'Шумоглушители' },
      { key: 'vent.tier.2.f4',          label: 'Тариф 2 — пункт 4',           type: 'text',     default: 'Таймер, ручное управление' },
      { key: 'vent.tier.2.f5',          label: 'Тариф 2 — пункт 5',           type: 'text',     default: 'Дома, коттеджи, офисы' },
      { key: 'vent.tier.3.title',        label: 'Тариф 3 — название',         type: 'text',     default: 'Комфорт' },
      { key: 'vent.tier.3.desc',         label: 'Тариф 3 — описание',         type: 'text',     default: 'С охлаждением и автоматизацией' },
      { key: 'vent.tier.3.price',        label: 'Тариф 3 — цена',             type: 'text',     default: '200 000 ₽' },
      { key: 'vent.tier.3.f1',          label: 'Тариф 3 — пункт 1',           type: 'text',     default: 'Полная автоматизация' },
      { key: 'vent.tier.3.f2',          label: 'Тариф 3 — пункт 2',           type: 'text',     default: 'Управление со смартфона' },
      { key: 'vent.tier.3.f3',          label: 'Тариф 3 — пункт 3',           type: 'text',     default: 'Охлаждение летом' },
      { key: 'vent.tier.3.f4',          label: 'Тариф 3 — пункт 4',           type: 'text',     default: 'Умный дом, CO₂ датчики' },
      { key: 'vent.design.title',        label: 'Проектирование — заголовок', type: 'text',     default: 'Стоимость проекта вентиляции' },
      { key: 'vent.design.desc',         label: 'Проектирование — описание',  type: 'textarea', default: 'При заказе монтажа — проект бесплатно. Отдельное проектирование — от 11 000 ₽.' },
      { key: 'vent.design.note',         label: 'Проектирование — сноска',    type: 'textarea', default: 'При заказе монтажа — проект в подарок. Экономия от 11 000 до 23 000 ₽' },
      { key: 'vent.cta.title',           label: 'CTA — заголовок',            type: 'text',     default: 'Спроектируем вентиляцию бесплатно' },
      { key: 'vent.cta.desc',            label: 'CTA — описание',             type: 'textarea', default: 'Оставьте заявку — инженер свяжется в течение 15 минут, уточнит задачу и назовёт точную стоимость.' },
      { key: 'vent.type.1.photo',        label: 'Приточная — фото карточки',  type: 'image',    bucket: 'cms-images' },
      { key: 'vent.type.2.photo',        label: 'Приточно-вытяжная — фото',   type: 'image',    bucket: 'cms-images' },
      { key: 'vent.type.3.photo',        label: 'Промышленная — фото',        type: 'image',    bucket: 'cms-images' },
      { key: 'vent.type.4.photo',        label: 'Бризер — фото карточки',     type: 'image',    bucket: 'cms-images' },
      { key: 'vent.type.5.photo',        label: 'Дымоудаление — фото',        type: 'image',    bucket: 'cms-images' },
      { key: 'vent.type.6.photo',        label: 'Осушение — фото карточки',   type: 'image',    bucket: 'cms-images' },
      { key: 'vent.gallery.photo1',      label: 'Галерея — фото 1',           type: 'image',    bucket: 'cms-images' },
      { key: 'vent.gallery.photo2',      label: 'Галерея — фото 2',           type: 'image',    bucket: 'cms-images' },
      { key: 'vent.gallery.photo3',      label: 'Галерея — фото 3',           type: 'image',    bucket: 'cms-images' },
      { key: 'vent.gallery.photo4',      label: 'Галерея — фото 4',           type: 'image',    bucket: 'cms-images' },
      { key: 'vent.gallery.photo5',      label: 'Галерея — фото 5',           type: 'image',    bucket: 'cms-images' },
      { key: 'vent.gallery.photo6',      label: 'Галерея — фото 6',           type: 'image',    bucket: 'cms-images' },
    ]
  },
  // 7. О КОМПАНИИ
  {
    id: 'about', title: 'О компании',
    subtitle: 'Все тексты страницы about.html',
    fields: [
      { key: 'about.hero.title',       label: 'Hero — заголовок H1',          type: 'text',     default: 'О компании Nordic Air' },
      { key: 'about.hero.subtitle',    label: 'Hero — подзаголовок',          type: 'textarea', default: 'С 2011 года устанавливаем климатические системы в Санкт-Петербурге и области. Только профессионалы, без посредников — результат говорит за нас.' },
      { key: 'about.story.title',      label: 'История — заголовок',          type: 'text',     default: 'Начали с одного кондиционера. Теперь — полный климат.' },
      { key: 'about.story.p1',         label: 'История — абзац 1',            type: 'textarea', default: 'Компания основана в 2011 году Андреем Утищевым — инженером-монтажником с профессиональным образованием в области климатических систем. Начинали с установки бытовых кондиционеров в квартирах, постепенно расширили компетенции до промышленных объектов.' },
      { key: 'about.story.p2',         label: 'История — абзац 2',            type: 'textarea', default: 'Сегодня Nordic Air — это команда специалистов, которая закрывает все потребности в климате: от простого кондиционера на кухню до комплексной системы для производственного цеха. Три направления под одним брендом, одним руководителем и одним стандартом качества.' },
      { key: 'about.story.p3',         label: 'История — абзац 3',            type: 'textarea', default: 'Принципиальная позиция: не нанимать субподрядчиков. Все монтажи выполняют штатные специалисты с опытом от 10 лет. Это означает полный контроль качества и прямую ответственность перед клиентом.' },
      { key: 'about.founder.name',     label: 'Руководитель — имя',           type: 'text',     default: 'Андрей Утищев' },
      { key: 'about.founder.position', label: 'Руководитель — должность',     type: 'text',     default: 'Основатель и руководитель' },
      { key: 'about.founder.bio',      label: 'Руководитель — цитата',        type: 'textarea', default: '"У нас нет менеджеров и раздутого штата. Только профессионалы по монтажу. Со мной вы будете общаться — именно я разрабатываю проект и контролирую монтаж."' },
      { key: 'about.founder.photo',    label: 'Руководитель — фото',          type: 'image',    bucket: 'cms-images' },
      { key: 'about.values.title',     label: 'Ценности — заголовок',         type: 'text',     default: 'Ценности, которые определяют качество' },
      { key: 'about.values.desc',      label: 'Ценности — описание',          type: 'textarea', default: 'Мы строим работу на простых, но важных принципах — именно они обеспечивают рейтинг 5.0 и сотни благодарных клиентов.' },
      { key: 'about.values.v1.title',  label: 'Ценность 1 — заголовок',       type: 'text',     default: 'Полная ответственность' },
      { key: 'about.values.v1.desc',   label: 'Ценность 1 — описание',        type: 'textarea', default: 'Гарантируем не только оборудование, но и монтаж. Проблема после установки? Исправляем бесплатно, без споров и затягивания.' },
      { key: 'about.values.v2.title',  label: 'Ценность 2 — заголовок',       type: 'text',     default: 'Честная цена в договоре' },
      { key: 'about.values.v2.desc',   label: 'Ценность 2 — описание',        type: 'textarea', default: 'Подписываем договор с фиксированной ценой до начала работ. Никаких «доплат по факту», «непредвиденных расходов» и других уловок.' },
      { key: 'about.values.v3.title',  label: 'Ценность 3 — заголовок',       type: 'text',     default: 'Соблюдение сроков' },
      { key: 'about.values.v3.desc',   label: 'Ценность 3 — описание',        type: 'textarea', default: 'Приезжаем точно в согласованное время. Монтаж за 1 день — не просто лозунг, а обязательство. Срыв сроков недопустим.' },
      { key: 'about.values.v4.title',  label: 'Ценность 4 — заголовок',       type: 'text',     default: 'Уважение к клиенту и пространству' },
      { key: 'about.values.v4.desc',   label: 'Ценность 4 — описание',        type: 'textarea', default: 'Работаем аккуратно: стелем защитные покрытия, убираем за собой. Ваш интерьер остаётся в целости — только кондиционер прибавляется.' },
      { key: 'about.cta.title',        label: 'CTA — заголовок',              type: 'text',     default: 'Доверьте климат профессионалам' },
      { key: 'about.cta.desc',         label: 'CTA — описание',               type: 'textarea', default: '15 лет опыта, 1000+ довольных клиентов, рейтинг 5.0. Позвоните или оставьте заявку — ответим в течение 15 минут.' },
      { key: 'about.gallery.photo1',   label: 'Галерея — фото 1',             type: 'image',    bucket: 'cms-images' },
      { key: 'about.gallery.photo2',   label: 'Галерея — фото 2',             type: 'image',    bucket: 'cms-images' },
      { key: 'about.gallery.photo3',   label: 'Галерея — фото 3',             type: 'image',    bucket: 'cms-images' },
      { key: 'about.gallery.photo4',   label: 'Галерея — фото 4',             type: 'image',    bucket: 'cms-images' },
      { key: 'about.gallery.photo5',   label: 'Галерея — фото 5',             type: 'image',    bucket: 'cms-images' },
      { key: 'about.gallery.photo6',   label: 'Галерея — фото 6',             type: 'image',    bucket: 'cms-images' },
    ]
  },
  // 8. СТРАНИЦА КОНТАКТОВ
  {
    id: 'contacts_page', title: 'Страница контактов',
    subtitle: 'Тексты страницы contacts.html',
    fields: [
      { key: 'contacts.hero.title',    label: 'Hero — заголовок H1',          type: 'text',     default: 'Свяжитесь с нами' },
      { key: 'contacts.hero.desc',     label: 'Hero — описание',              type: 'textarea', default: 'Перезвоним в течение 15 минут. Работаем 7 дней в неделю, с 9:00 до 21:00. Приходите в офис — встретим и проконсультируем.' },
      { key: 'contacts.hero.tag1',     label: 'Hero — тег 1',                 type: 'text',     default: 'Ответ за 15 минут' },
      { key: 'contacts.hero.tag2',     label: 'Hero — тег 2',                 type: 'text',     default: 'Пн–Вс: 9:00–21:00' },
      { key: 'contacts.hero.tag3',     label: 'Hero — тег 3',                 type: 'text',     default: 'Консультация бесплатно' },
      { key: 'contacts.form.title',    label: 'Форма — заголовок',            type: 'text',     default: 'Оставьте заявку' },
      { key: 'contacts.form.desc',     label: 'Форма — описание',             type: 'textarea', default: 'Опишите задачу — перезвоним в течение 15 минут и дадим точный расчёт стоимости бесплатно.' },
      { key: 'contacts.promise.n1',    label: 'Обещание — число 1',           type: 'text',     default: '15 мин' },
      { key: 'contacts.promise.l1',    label: 'Обещание — подпись 1',         type: 'text',     default: 'Перезвоним после заявки' },
      { key: 'contacts.promise.n2',    label: 'Обещание — число 2',           type: 'text',     default: '1 день' },
      { key: 'contacts.promise.l2',    label: 'Обещание — подпись 2',         type: 'text',     default: 'Выезд на замер' },
      { key: 'contacts.promise.n3',    label: 'Обещание — число 3',           type: 'text',     default: '7/7' },
      { key: 'contacts.promise.l3',    label: 'Обещание — подпись 3',         type: 'text',     default: 'Работаем без выходных' },
    ]
  },
  // 9. ПОРТФОЛИО
  {
    id: 'portfolio', title: 'Портфолио',
    subtitle: 'Фотографии карточек проектов на странице portfolio.html',
    fields: [
      { key: 'portfolio.photo1',       label: 'Проект 1 — фото',             type: 'image',    bucket: 'cms-images' },
      { key: 'portfolio.photo2',       label: 'Проект 2 — фото',             type: 'image',    bucket: 'cms-images' },
      { key: 'portfolio.photo3',       label: 'Проект 3 — фото',             type: 'image',    bucket: 'cms-images' },
      { key: 'portfolio.photo4',       label: 'Проект 4 — фото',             type: 'image',    bucket: 'cms-images' },
      { key: 'portfolio.photo5',       label: 'Проект 5 — фото',             type: 'image',    bucket: 'cms-images' },
      { key: 'portfolio.photo6',       label: 'Проект 6 — фото',             type: 'image',    bucket: 'cms-images' },
      { key: 'portfolio.photo7',       label: 'Проект 7 — фото',             type: 'image',    bucket: 'cms-images' },
      { key: 'portfolio.photo8',       label: 'Проект 8 — фото',             type: 'image',    bucket: 'cms-images' },
      { key: 'portfolio.photo9',       label: 'Проект 9 — фото',             type: 'image',    bucket: 'cms-images' },
    ]
  },
];

const TAB_META = {
  contacts:      { title: 'Контакты',           subtitle: 'Глобальные контактные данные, обновляются на всех страницах' },
  main:          { title: 'Главная страница',    subtitle: 'Все тексты главной страницы (index.html)' },
  promotions:    { title: 'Акции',              subtitle: 'Тексты страницы акций и карточки акций' },
  conditioners:  { title: 'Кондиционеры',       subtitle: 'Все тексты страницы кондиционеров' },
  heat:          { title: 'Тепловые насосы',    subtitle: 'Все тексты страницы тепловых насосов' },
  ventilation:   { title: 'Вентиляция',         subtitle: 'Все тексты страницы вентиляции' },
  about:         { title: 'О компании',         subtitle: 'Все тексты страницы о компании' },
  contacts_page: { title: 'Страница контактов', subtitle: 'Тексты страницы contacts.html' },
  portfolio:     { title: 'Портфолио',          subtitle: 'Фотографии карточек проектов (portfolio.html)' },
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
  var contentArea = document.getElementById('content-area');
  if (tabId === 'builder') {
    contentArea.classList.add('builder-active');
    contentArea.innerHTML = renderBuilderTab();
    return;
  }
  contentArea.classList.remove('builder-active');
  var section = SECTIONS.find(function (s) { return s.id === tabId; });
  if (!section) return;
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
    '<input type="file" id="' + fileInputId + '" accept="image/*" style="display:none" data-key="' + escHtml(field.key) + '" data-bucket="' + escHtml(field.bucket || 'cms-images') + '" data-preview="' + previewId + '" data-progress="' + progressId + '" data-hidden-id="' + inputId + '" onchange="handleImageUpload(this)">' +
    '<div class="upload-progress" id="' + progressId + '"><div class="spinner"></div><span>Загружаю...</span></div>' +
    '</div>' + urlDisplay +
    '<input type="hidden" id="' + inputId + '" data-key="' + escHtml(field.key) + '" value="' + escHtml(currentValue) + '">' +
    '</div></div>';
}

// ---- Image Upload (direct REST, no SDK) ----
async function handleImageUpload(fileInput) {
  var file = fileInput.files[0];
  if (!file) return;

  if (!accessToken) {
    showToast('Сессия истекла — обновите страницу и войдите заново', 'error');
    return;
  }

  var key = fileInput.dataset.key;
  var bucket = fileInput.dataset.bucket || 'cms-images';
  var previewId = fileInput.dataset.preview;
  var progressId = fileInput.dataset.progress;

  if (!file.type.startsWith('image/')) { showToast('Выберите файл изображения', 'error'); return; }
  if (file.size > 10 * 1024 * 1024) { showToast('Файл слишком большой (макс 10 МБ)', 'error'); return; }

  var progressEl = document.getElementById(progressId);
  if (progressEl) progressEl.classList.add('visible');
  fileInput.disabled = true;

  var controller = new AbortController();
  var timeoutId = setTimeout(function () { controller.abort(); }, 30000);

  try {
    var ext = (file.name.split('.').pop() || 'jpg').toLowerCase();
    var filename = key.replace(/\./g, '/') + '_' + Date.now() + '.' + ext;

    var uploadRes = await fetch(SB_URL + '/storage/v1/object/' + bucket + '/' + filename, {
      method: 'POST',
      signal: controller.signal,
      headers: {
        'apikey': SB_KEY,
        'Authorization': 'Bearer ' + (accessToken || SB_KEY),
        'Content-Type': file.type,
        'x-upsert': 'true'
      },
      body: file
    });

    clearTimeout(timeoutId);

    if (!uploadRes.ok) {
      var errData = await uploadRes.json().catch(function () { return {}; });
      throw new Error(errData.message || errData.error || ('Upload HTTP ' + uploadRes.status));
    }

    var publicUrl = SB_URL + '/storage/v1/object/public/' + bucket + '/' + filename;

    var fieldInputId = fileInput.dataset.hiddenId || ('field-' + key.replace(/\./g, '_'));
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
    clearTimeout(timeoutId);
    var msg = err.name === 'AbortError'
      ? 'Таймаут — сервер не ответил за 30 сек. Проверьте подключение и настройки Supabase Storage.'
      : err.message;
    showToast('Ошибка загрузки: ' + msg, 'error');
    console.error('[upload]', err);
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
      if (field.type === 'image' && !value) return;
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

// ---- PAGE BUILDER ----

var BUILDER_PAGES = [
  {
    id: 'index', label: 'Главная', url: '../index.html', key: 'blocks.index',
    blocks: [
      { id: 'hero',              label: 'Hero-баннер',       desc: 'Главный экран с заголовком и кнопками',
        fieldKeys: ['index.hero.eyebrow','index.hero.title','index.hero.subtitle','index.hero.btn1','index.hero.btn2'] },
      { id: 'stats',             label: 'Статистика',        desc: '15+ лет, 1000+ монтажей, рейтинг', fieldKeys: [] },
      { id: 'clients',           label: 'Нам доверяют',      desc: 'Типы клиентов', fieldKeys: [] },
      { id: 'services',          label: 'Наши услуги',       desc: 'Три карточки: кондиционеры, насосы, вентиляция',
        fieldKeys: ['index.services.label','index.services.title','index.services.desc','index.services.ac.photo','index.services.heat.photo','index.services.vent.photo'] },
      { id: 'quiz',              label: 'Квиз-калькулятор',  desc: 'Подбор системы за 3 шага', fieldKeys: [] },
      { id: 'about-brief',       label: 'О компании (блок)', desc: 'Кратко о компании + фото',
        fieldKeys: ['index.about.title','index.about.text1','index.about.text2','index.about.photo'] },
      { id: 'why',               label: 'Почему мы',         desc: '6 причин выбрать Nordic Air',
        fieldKeys: ['index.why.title','index.why.desc'] },
      { id: 'portfolio-preview', label: 'Примеры работ',     desc: 'Сетка с фото проектов', fieldKeys: ['index.portfolio.photo1','index.portfolio.photo2','index.portfolio.photo3','index.portfolio.photo4','index.portfolio.photo5','index.portfolio.photo6'] },
      { id: 'telegram',          label: 'Telegram-канал',    desc: 'Виджет Telegram-канала', fieldKeys: [] },
      { id: 'steps',             label: 'Как работаем',      desc: '4 шага от заявки до монтажа',
        fieldKeys: ['index.steps.title','index.steps.desc'] },
      { id: 'reviews',           label: 'Отзывы',            desc: 'Отзывы клиентов с Яндекса',
        fieldKeys: ['index.reviews.title','index.reviews.desc'] },
      { id: 'faq',               label: 'FAQ',               desc: 'Часто задаваемые вопросы',
        fieldKeys: ['index.faq.title','index.faq.desc'] },
      { id: 'zones',             label: 'Зоны обслуживания', desc: 'Районы СПб и Ленобласти', fieldKeys: [] },
      { id: 'cta',               label: 'Призыв к действию', desc: 'Финальный CTA-баннер',
        fieldKeys: ['index.cta.title','index.cta.desc'] },
    ]
  },
  {
    id: 'conditioners', label: 'Кондиционеры', url: '../conditioners.html', key: 'blocks.conditioners',
    blocks: [
      { id: 'hero',    label: 'Hero-баннер',       desc: 'Заголовок и теги',
        fieldKeys: ['services.ac.hero_title','services.ac.hero_sub'] },
      { id: 'types',   label: 'Виды кондиционеров',desc: '6 карточек типов',
        fieldKeys: ['ac.types.title','ac.types.desc','ac.type.1.photo','ac.type.2.photo','ac.type.3.photo','ac.type.4.photo','ac.type.5.photo','ac.type.6.photo'] },
      { id: 'pricing', label: 'Прайс-лист',        desc: 'Стоимость монтажа',
        fieldKeys: ['ac.price.title','ac.price.desc','ac.price.note'] },
      { id: 'brands',  label: 'Бренды',            desc: 'Ведущие бренды',
        fieldKeys: ['ac.brands.title','ac.brands.desc'] },
      { id: 'process', label: 'Процесс монтажа',   desc: '4 шага монтажа',
        fieldKeys: ['ac.process.title','ac.process.desc'] },
      { id: 'why',     label: 'Почему Nordic Air', desc: '3 преимущества',
        fieldKeys: ['ac.why.title'] },
      { id: 'gallery', label: 'Галерея работ',     desc: 'Фото выполненных работ', fieldKeys: ['ac.gallery.photo1','ac.gallery.photo2','ac.gallery.photo3','ac.gallery.photo4','ac.gallery.photo5','ac.gallery.photo6','ac.gallery.photo7','ac.gallery.photo8','ac.gallery.photo9'] },
      { id: 'cta',     label: 'Призыв к действию', desc: 'CTA-баннер',
        fieldKeys: ['ac.cta.title','ac.cta.desc'] },
    ]
  },
  {
    id: 'heat-pumps', label: 'Тепловые насосы', url: '../heat-pumps.html', key: 'blocks.heat-pumps',
    blocks: [
      { id: 'hero',       label: 'Hero-баннер',         desc: 'Заголовок и теги',
        fieldKeys: ['services.heat.hero_title','services.heat.hero_sub'] },
      { id: 'what',       label: 'Что такое насос',     desc: 'Описание + инфо-блоки',
        fieldKeys: ['heat.what.title','heat.what.p1','heat.what.p2','heat.what.photo'] },
      { id: 'comparison', label: 'Сравнение',           desc: 'Сравнение с другими типами',
        fieldKeys: ['heat.cmp.title','heat.cmp.desc'] },
      { id: 'models',     label: 'Модели',              desc: 'Каталог моделей',
        fieldKeys: ['heat.models.title','heat.models.desc'] },
      { id: 'advantages', label: 'Преимущества',        desc: '6 преимуществ',
        fieldKeys: ['heat.adv.title','heat.adv.desc'] },
      { id: 'gallery',    label: 'Галерея работ',       desc: 'Фото выполненных работ', fieldKeys: ['heat.gallery.photo1','heat.gallery.photo2','heat.gallery.photo3','heat.gallery.photo4','heat.gallery.photo5','heat.gallery.photo6'] },
      { id: 'cta',        label: 'Призыв к действию',   desc: 'CTA-баннер',
        fieldKeys: ['heat.cta.title','heat.cta.desc'] },
    ]
  },
  {
    id: 'ventilation', label: 'Вентиляция', url: '../ventilation.html', key: 'blocks.ventilation',
    blocks: [
      { id: 'hero',    label: 'Hero-баннер',       desc: 'Заголовок и теги',
        fieldKeys: ['services.vent.hero_title','services.vent.hero_sub'] },
      { id: 'types',   label: 'Виды вентиляции',  desc: '6 карточек типов',
        fieldKeys: ['vent.types.title','vent.types.desc','vent.type.1.photo','vent.type.2.photo','vent.type.3.photo','vent.type.4.photo','vent.type.5.photo','vent.type.6.photo'] },
      { id: 'pricing', label: 'Тарифы',            desc: '3 пакета услуг',
        fieldKeys: ['vent.tiers.title','vent.tiers.desc'] },
      { id: 'design',  label: 'Проектирование',    desc: 'Стоимость проекта',
        fieldKeys: ['vent.design.title','vent.design.desc'] },
      { id: 'photo',   label: 'Фото-блок',         desc: 'Фото + описание', fieldKeys: [] },
      { id: 'gallery', label: 'Галерея работ',     desc: 'Фото выполненных работ', fieldKeys: ['vent.gallery.photo1','vent.gallery.photo2','vent.gallery.photo3','vent.gallery.photo4','vent.gallery.photo5','vent.gallery.photo6'] },
      { id: 'cta',     label: 'Призыв к действию', desc: 'CTA-баннер',
        fieldKeys: ['vent.cta.title','vent.cta.desc'] },
    ]
  },
  {
    id: 'about', label: 'О компании', url: '../about.html', key: 'blocks.about',
    blocks: [
      { id: 'hero',    label: 'Hero-баннер',       desc: 'Заголовок страницы',
        fieldKeys: ['about.hero.title','about.hero.subtitle'] },
      { id: 'stats',   label: 'Статистика',        desc: '4 ключевых показателя', fieldKeys: [] },
      { id: 'story',   label: 'Наша история',      desc: 'История компании',
        fieldKeys: ['about.story.title','about.story.p1','about.story.p2','about.story.p3'] },
      { id: 'values',  label: 'Наши принципы',     desc: '4 ценности компании',
        fieldKeys: ['about.values.title','about.values.desc'] },
      { id: 'brands',  label: 'Партнёры',          desc: 'Официальные бренды', fieldKeys: [] },
      { id: 'gallery', label: 'Галерея проектов',  desc: 'Примеры работ', fieldKeys: ['about.gallery.photo1','about.gallery.photo2','about.gallery.photo3','about.gallery.photo4','about.gallery.photo5','about.gallery.photo6'] },
      { id: 'cta',     label: 'Призыв к действию', desc: 'CTA-баннер',
        fieldKeys: ['about.cta.title','about.cta.desc'] },
    ]
  },
  {
    id: 'portfolio', label: 'Портфолио', url: '../portfolio.html', key: 'blocks.portfolio',
    blocks: [
      { id: 'hero',     label: 'Hero-баннер',      desc: 'Заголовок страницы', fieldKeys: [] },
      { id: 'stats',    label: 'Статистика',        desc: 'Счётчики: объекты, лет, рейтинг, гарантия', fieldKeys: [] },
      { id: 'projects', label: 'Проекты',           desc: 'Сетка карточек проектов', fieldKeys: ['portfolio.photo1','portfolio.photo2','portfolio.photo3','portfolio.photo4','portfolio.photo5','portfolio.photo6','portfolio.photo7','portfolio.photo8','portfolio.photo9'] },
      { id: 'cta',      label: 'Призыв к действию', desc: 'CTA-баннер', fieldKeys: [] },
    ]
  },
  {
    id: 'contacts', label: 'Контакты', url: '../contacts.html', key: 'blocks.contacts',
    blocks: [
      { id: 'hero',     label: 'Hero-баннер',       desc: 'Заголовок страницы',
        fieldKeys: ['contacts.hero.title','contacts.hero.desc','contacts.hero.tag1','contacts.hero.tag2','contacts.hero.tag3'] },
      { id: 'contacts', label: 'Контакты и форма',  desc: 'Карточки контактов + форма заявки', fieldKeys: [] },
      { id: 'promise',  label: 'Обещания',           desc: '15 мин / 1 день / 7/7',
        fieldKeys: ['contacts.promise.n1','contacts.promise.l1','contacts.promise.n2','contacts.promise.l2','contacts.promise.n3','contacts.promise.l3'] },
    ]
  },
  {
    id: 'promotions', label: 'Акции', url: '../promotions.html', key: 'blocks.promotions',
    blocks: [
      { id: 'hero',   label: 'Hero-баннер',         desc: 'Заголовок страницы',
        fieldKeys: ['promos.hero.title','promos.hero.sub'] },
      { id: 'promos', label: 'Акции',                desc: '4 карточки акций',
        fieldKeys: ['promos.section.label','promos.section.title','promos.section.sub'] },
      { id: 'howto',  label: 'Как получить скидку', desc: '3 шага получения скидки', fieldKeys: [] },
      { id: 'cta',    label: 'Призыв к действию',   desc: 'CTA-баннер', fieldKeys: [] },
    ]
  }
];

TAB_META['builder'] = {
  title: 'Конструктор страниц',
  subtitle: 'Управляйте блоками: включайте, перетаскивайте, редактируйте тексты и добавляйте новые'
};

var builderActivePage = 'index';
var builderDragSrc = null;
var builderDropOccurred = false;
var builderActiveEditor = null;
var builderActiveEditorDynamic = null;

// Template definitions for the block library
var TEMPLATE_LABELS = { cta:'CTA-баннер', gallery:'Галерея фото', 'text-image':'Текст + фото', stats:'Статистика', faq:'FAQ', reviews:'Отзывы' };
var TEMPLATE_DESCS  = { cta:'Заголовок, текст и кнопка', gallery:'Сетка из фотографий', 'text-image':'Блок с текстом и изображением', stats:'Ряд из 4 цифр с подписями', faq:'Вопросы и ответы', reviews:'Карточки отзывов' };
var TEMPLATE_FIELDS = {
  cta: [
    { key:'title',    label:'Заголовок',      type:'text',     default:'Заголовок CTA' },
    { key:'desc',     label:'Описание',        type:'textarea', default:'Описание призыва к действию' },
    { key:'btn_text', label:'Текст кнопки',   type:'text',     default:'Оставить заявку' },
    { key:'btn_href', label:'Ссылка кнопки',  type:'text',     default:'contacts.html' },
  ],
  gallery: [
    { key:'title',  label:'Заголовок',  type:'text',  default:'Галерея работ' },
    { key:'photo1', label:'Фото 1', type:'image', bucket:'cms-images', default:'' },
    { key:'photo2', label:'Фото 2', type:'image', bucket:'cms-images', default:'' },
    { key:'photo3', label:'Фото 3', type:'image', bucket:'cms-images', default:'' },
    { key:'photo4', label:'Фото 4', type:'image', bucket:'cms-images', default:'' },
    { key:'photo5', label:'Фото 5', type:'image', bucket:'cms-images', default:'' },
    { key:'photo6', label:'Фото 6', type:'image', bucket:'cms-images', default:'' },
  ],
  'text-image': [
    { key:'title',    label:'Заголовок',  type:'text',     default:'Заголовок блока' },
    { key:'text',     label:'Текст',      type:'textarea', default:'Текст описания...' },
    { key:'image',    label:'Изображение',type:'image',    bucket:'cms-images', default:'' },
    { key:'btn_text', label:'Кнопка',     type:'text',     default:'Подробнее' },
    { key:'btn_href', label:'Ссылка',     type:'text',     default:'contacts.html' },
  ],
  stats: [
    { key:'stat1_num',   label:'Число 1',   type:'text', default:'1000+' },
    { key:'stat1_label', label:'Подпись 1', type:'text', default:'монтажей' },
    { key:'stat2_num',   label:'Число 2',   type:'text', default:'15+' },
    { key:'stat2_label', label:'Подпись 2', type:'text', default:'лет на рынке' },
    { key:'stat3_num',   label:'Число 3',   type:'text', default:'5.0' },
    { key:'stat3_label', label:'Подпись 3', type:'text', default:'рейтинг' },
    { key:'stat4_num',   label:'Число 4',   type:'text', default:'12+' },
    { key:'stat4_label', label:'Подпись 4', type:'text', default:'брендов' },
  ],
  faq: [
    { key:'title', label:'Заголовок', type:'text',     default:'Часто задаваемые вопросы' },
    { key:'q1',    label:'Вопрос 1',  type:'text',     default:'' },
    { key:'a1',    label:'Ответ 1',   type:'textarea', default:'' },
    { key:'q2',    label:'Вопрос 2',  type:'text',     default:'' },
    { key:'a2',    label:'Ответ 2',   type:'textarea', default:'' },
    { key:'q3',    label:'Вопрос 3',  type:'text',     default:'' },
    { key:'a3',    label:'Ответ 3',   type:'textarea', default:'' },
  ],
  reviews: [
    { key:'title',   label:'Заголовок', type:'text',     default:'Отзывы клиентов' },
    { key:'r1_text', label:'Отзыв 1',   type:'textarea', default:'' },
    { key:'r1_name', label:'Имя 1',     type:'text',     default:'' },
    { key:'r2_text', label:'Отзыв 2',   type:'textarea', default:'' },
    { key:'r2_name', label:'Имя 2',     type:'text',     default:'' },
    { key:'r3_text', label:'Отзыв 3',   type:'textarea', default:'' },
    { key:'r3_name', label:'Имя 3',     type:'text',     default:'' },
  ],
};

function selectBuilderPage(pageId) {
  builderActivePage = pageId;
  var contentArea = document.getElementById('content-area');
  contentArea.classList.add('builder-active');
  contentArea.innerHTML = renderBuilderTab();
}

function renderBuilderTab() {
  var page = BUILDER_PAGES.find(function(p) { return p.id === builderActivePage; }) || BUILDER_PAGES[0];
  var savedConfig = null;
  try {
    var raw = contentCache[page.key];
    if (raw) savedConfig = JSON.parse(raw);
  } catch (e) {}

  var blocks = page.blocks.map(function(block, index) {
    var saved = savedConfig && savedConfig.find(function(c) { return c.id === block.id; });
    return {
      id: block.id, label: block.label, desc: block.desc,
      fieldKeys: block.fieldKeys || [], dynamic: false,
      visible: saved ? saved.visible !== false : true,
      order: saved ? saved.order : index
    };
  });

  // Load dynamic blocks from contentCache
  var dynPrefix = 'dblock.' + page.id + '.';
  Object.keys(contentCache).forEach(function(key) {
    if (key.indexOf(dynPrefix) !== 0) return;
    var blockId = key.substring(dynPrefix.length);
    if (blocks.find(function(b) { return b.id === blockId; })) return;
    var dynData = null;
    try { dynData = JSON.parse(contentCache[key]); } catch(e) {}
    var saved = savedConfig && savedConfig.find(function(c) { return c.id === blockId; });
    blocks.push({
      id: blockId,
      label: (dynData && dynData._label) || TEMPLATE_LABELS[dynData && dynData._template] || blockId,
      desc: (dynData && dynData._desc) || TEMPLATE_DESCS[dynData && dynData._template] || 'Динамический блок',
      fieldKeys: [], dynamic: true,
      template: dynData && dynData._template,
      visible: saved ? saved.visible !== false : true,
      order: saved ? saved.order : blocks.length
    });
  });

  blocks.sort(function(a, b) { return a.order - b.order; });

  // Page tabs
  var pageTabsHTML = BUILDER_PAGES.map(function(p) {
    return '<button class="builder-page-tab' + (p.id === builderActivePage ? ' active' : '') + '" ' +
      'onclick="selectBuilderPage(\'' + p.id + '\')">' + escHtml(p.label) + '</button>';
  }).join('');

  // Block rows
  var blocksHTML = blocks.map(function(block) {
    var checkedAttr = block.visible ? ' checked' : '';
    var hiddenClass = block.visible ? '' : ' builder-block--hidden';
    var badge = block.dynamic ? '<span class="builder-block-badge">NEW</span>' : '';
    var editBtn = (block.fieldKeys.length > 0 || block.dynamic)
      ? '<button class="btn-icon builder-edit-btn" onclick="openBlockEditor(\'' + escHtml(block.id) + '\')" title="Редактировать контент">' +
        '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>' +
        '</button>'
      : '';
    var delBtn = block.dynamic
      ? '<button class="btn-icon builder-delete-btn" onclick="deleteDynamicBlock(\'' + escHtml(block.id) + '\')" title="Удалить блок">' +
        '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6m4-6v6"/></svg>' +
        '</button>'
      : '';
    return '<div class="builder-block' + hiddenClass + '" draggable="true" data-block-id="' + escHtml(block.id) + '" ' +
      'ondragstart="builderDragStart(event)" ondragover="builderDragOver(event)" ' +
      'ondragleave="builderDragLeave(event)" ondrop="builderDrop(event)" ondragend="builderDragEnd(event)">' +
      '<div class="builder-block-drag">' +
      '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>' +
      '</div>' +
      '<div class="builder-block-body">' +
      '<div class="builder-block-name">' + escHtml(block.label) + badge + '</div>' +
      '<div class="builder-block-desc">' + escHtml(block.desc) + '</div>' +
      '</div>' +
      '<div class="builder-block-actions">' + editBtn + delBtn + '</div>' +
      '<label class="builder-toggle">' +
      '<input type="checkbox"' + checkedAttr + ' onchange="builderToggleBlock(this, \'' + escHtml(block.id) + '\')">' +
      '<span class="builder-toggle-track"></span>' +
      '</label>' +
      '</div>';
  }).join('');

  // Library modal: 6 template cards
  var libTemplates = [
    { id:'cta',        icon:'<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 3H8l-2 4h12z"/></svg>' },
    { id:'gallery',    icon:'<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>' },
    { id:'text-image', icon:'<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="8" height="18" rx="1"/><line x1="14" y1="8" x2="21" y2="8"/><line x1="14" y1="12" x2="21" y2="12"/><line x1="14" y1="16" x2="21" y2="16"/></svg>' },
    { id:'stats',      icon:'<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/><line x1="2" y1="20" x2="22" y2="20"/></svg>' },
    { id:'faq',        icon:'<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>' },
    { id:'reviews',    icon:'<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>' },
  ];
  var libGridHTML = libTemplates.map(function(t) {
    return '<div class="builder-lib-card" onclick="addBlockFromLibrary(\'' + t.id + '\')">' +
      '<div class="builder-lib-card-icon">' + t.icon + '</div>' +
      '<div class="builder-lib-card-label">' + escHtml(TEMPLATE_LABELS[t.id] || t.id) + '</div>' +
      '<div class="builder-lib-card-desc">' + escHtml(TEMPLATE_DESCS[t.id] || '') + '</div>' +
      '</div>';
  }).join('');

  var iframeSrc = page.url || ('../' + page.id + '.html');

  return '<div class="builder-layout">' +
    // LEFT PANEL
    '<div class="builder-left">' +
      '<div class="builder-left-top">' +
        '<div class="builder-page-tabs">' + pageTabsHTML + '</div>' +
        '<div class="builder-toolbar">' +
          '<button class="btn-builder-lib" onclick="showBlockLibrary()">' +
            '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>' +
            ' Добавить блок</button>' +
          '<button class="btn-icon btn-builder-refresh" onclick="refreshBuilderPreview()" title="Обновить превью страницы">' +
            '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 11-2.12-9.36L23 10"/></svg>' +
          '</button>' +
        '</div>' +
      '</div>' +
      '<div class="builder-left-scroll">' +
        '<div class="builder-info">' +
          '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>' +
          ' Перетащите блоки для изменения порядка. Кнопка карандаша — редактировать тексты.' +
        '</div>' +
        '<div class="builder-blocks" id="builder-blocks">' + blocksHTML + '</div>' +
      '</div>' +
      '<div class="builder-left-footer">' +
        '<span class="save-status" id="save-status-builder"></span>' +
        '<button class="btn btn-save" onclick="saveBlockConfig()">' +
          '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>' +
          ' Сохранить</button>' +
      '</div>' +
    '</div>' +
    // RIGHT PANEL (iframe preview)
    '<div class="builder-right" id="builder-right">' +
      '<iframe class="builder-iframe" id="builder-iframe" src="' + escHtml(iframeSrc) + '" title="Превью страницы"></iframe>' +
      // Block editor overlay
      '<div class="builder-editor" id="builder-editor">' +
        '<div class="builder-editor-header">' +
          '<div class="builder-editor-title" id="builder-editor-title">Редактировать блок</div>' +
          '<button class="btn-icon" onclick="closeBlockEditor()" title="Закрыть">' +
            '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>' +
          '</button>' +
        '</div>' +
        '<div class="builder-editor-body" id="builder-editor-body"></div>' +
        '<div class="builder-editor-footer">' +
          '<button class="btn btn-sm" style="background:var(--content-bg);border:1.5px solid var(--border);color:var(--text-secondary);" onclick="closeBlockEditor()">Отмена</button>' +
          '<button class="btn btn-save btn-sm" id="builder-editor-save" onclick="saveBlockEditor()">Сохранить</button>' +
        '</div>' +
      '</div>' +
    '</div>' +
    // Library modal (fixed overlay)
    '<div class="builder-lib-overlay" id="builder-library">' +
      '<div class="builder-lib-modal">' +
        '<div class="builder-lib-header">' +
          '<div class="builder-lib-title">Библиотека блоков</div>' +
          '<button class="btn-icon" onclick="closeBlockLibrary()">' +
            '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>' +
          '</button>' +
        '</div>' +
        '<p class="builder-lib-desc">Выберите шаблон — он добавится в список блоков. Затем заполните его содержимое.</p>' +
        '<div class="builder-lib-grid">' + libGridHTML + '</div>' +
      '</div>' +
    '</div>' +
    '</div>';
}

// ---- Builder: drag and drop ----

function builderToggleBlock(checkbox, blockId) {
  var blockEl = checkbox.closest ? checkbox.closest('.builder-block') : null;
  if (blockEl) blockEl.classList.toggle('builder-block--hidden', !checkbox.checked);
  saveBlockConfig();
}

function builderDragStart(event) {
  builderDragSrc = event.currentTarget;
  event.currentTarget.classList.add('builder-block--dragging');
  event.dataTransfer.effectAllowed = 'move';
  event.dataTransfer.setData('text/plain', event.currentTarget.dataset.blockId);
}

function builderDragOver(event) {
  event.preventDefault();
  event.dataTransfer.dropEffect = 'move';
  if (event.currentTarget !== builderDragSrc) {
    event.currentTarget.classList.add('builder-block--over');
  }
}

function builderDragLeave(event) {
  event.currentTarget.classList.remove('builder-block--over');
}

function builderDrop(event) {
  event.preventDefault();
  builderDropOccurred = true;
  var target = event.currentTarget;
  target.classList.remove('builder-block--over');
  if (!builderDragSrc || builderDragSrc === target) return;
  var list = document.getElementById('builder-blocks');
  var allBlocks = Array.from(list.querySelectorAll('.builder-block'));
  var srcIdx = allBlocks.indexOf(builderDragSrc);
  var tgtIdx = allBlocks.indexOf(target);
  if (srcIdx < tgtIdx) {
    list.insertBefore(builderDragSrc, target.nextSibling);
  } else {
    list.insertBefore(builderDragSrc, target);
  }
}

function builderDragEnd(event) {
  event.currentTarget.classList.remove('builder-block--dragging');
  document.querySelectorAll('.builder-block--over').forEach(function(el) { el.classList.remove('builder-block--over'); });
  builderDragSrc = null;
  if (builderDropOccurred) {
    builderDropOccurred = false;
    saveBlockConfig();
  }
}

// ---- Builder: block editor ----

function getFieldDef(key) {
  for (var i = 0; i < SECTIONS.length; i++) {
    for (var j = 0; j < SECTIONS[i].fields.length; j++) {
      if (SECTIONS[i].fields[j].key === key) return SECTIONS[i].fields[j];
    }
  }
  return null;
}

function buildEditorFields(fields, prefix, dynData) {
  if (!fields || fields.length === 0) {
    return '<div class="builder-editor-empty">Для этого блока нет редактируемых полей в конструкторе. Используйте раздел в меню слева.</div>';
  }
  return fields.map(function(f) {
    var value = dynData ? (dynData[f.key] !== undefined ? dynData[f.key] : (f.default || '')) : '';
    if (!dynData) {
      var v = contentCache[f.key];
      value = (v !== undefined && v !== '') ? v : (f.default || '');
    }
    var inputId = prefix + f.key.replace(/[.\-]/g, '_');
    if (f.type === 'image') {
      return renderImageField(f, value, inputId);
    }
    if (f.type === 'textarea') {
      return '<div class="builder-editor-field">' +
        '<label class="form-label">' + escHtml(f.label) + '</label>' +
        '<textarea class="form-input" id="' + inputId + '" data-key="' + escHtml(f.key) + '" rows="3">' + escHtml(value) + '</textarea>' +
        '</div>';
    }
    return '<div class="builder-editor-field">' +
      '<label class="form-label">' + escHtml(f.label) + '</label>' +
      '<input class="form-input" type="text" id="' + inputId + '" data-key="' + escHtml(f.key) + '" value="' + escHtml(value) + '">' +
      '</div>';
  }).join('');
}

function openBlockEditor(blockId) {
  var page = BUILDER_PAGES.find(function(p) { return p.id === builderActivePage; });
  if (!page) return;

  builderActiveEditor = blockId;

  var editorEl = document.getElementById('builder-editor');
  var titleEl = document.getElementById('builder-editor-title');
  var bodyEl = document.getElementById('builder-editor-body');

  // Static block
  var block = page.blocks.find(function(b) { return b.id === blockId; });
  if (block) {
    builderActiveEditorDynamic = null;
    if (titleEl) titleEl.textContent = block.label;
    var fieldDefs = (block.fieldKeys || []).map(function(key) {
      var def = getFieldDef(key);
      return def || { key: key, label: key, type: 'text', default: '' };
    });
    if (bodyEl) bodyEl.innerHTML = buildEditorFields(fieldDefs, 'be_', null);
    if (editorEl) editorEl.style.display = 'flex';
    return;
  }

  // Dynamic block
  var dynKey = 'dblock.' + builderActivePage + '.' + blockId;
  var dynData = null;
  try { dynData = JSON.parse(contentCache[dynKey] || '{}'); } catch(e) { dynData = {}; }
  var templateId = (dynData && dynData._template) || '';
  builderActiveEditorDynamic = { blockId: blockId, templateId: templateId };

  var label = TEMPLATE_LABELS[templateId] || blockId;
  if (titleEl) titleEl.textContent = label;
  var tFields = TEMPLATE_FIELDS[templateId] || [];
  if (bodyEl) bodyEl.innerHTML = buildEditorFields(tFields, 'be_dyn_', dynData);
  if (editorEl) editorEl.style.display = 'flex';
}

function closeBlockEditor() {
  var editorEl = document.getElementById('builder-editor');
  if (editorEl) editorEl.style.display = 'none';
  builderActiveEditor = null;
  builderActiveEditorDynamic = null;
}

async function saveBlockEditor() {
  if (!builderActiveEditor) return;

  var saveBtn = document.getElementById('builder-editor-save');
  if (saveBtn) { saveBtn.disabled = true; saveBtn.textContent = 'Сохраняю...'; }

  try {
    if (builderActiveEditorDynamic) {
      // Dynamic block
      var blockId = builderActiveEditorDynamic.blockId;
      var templateId = builderActiveEditorDynamic.templateId;
      var dynKey = 'dblock.' + builderActivePage + '.' + blockId;
      var dynData = {};
      try { dynData = JSON.parse(contentCache[dynKey] || '{}'); } catch(e) {}
      var tFields = TEMPLATE_FIELDS[templateId] || [];
      tFields.forEach(function(f) {
        var el = document.getElementById('be_dyn_' + f.key.replace(/[.\-]/g, '_'));
        if (el) dynData[f.key] = el.value || '';
      });
      var dynJson = JSON.stringify(dynData);
      await upsertRows([{ key: dynKey, value: dynJson, type: 'json' }]);
      contentCache[dynKey] = dynJson;
    } else {
      // Static block
      var page = BUILDER_PAGES.find(function(p) { return p.id === builderActivePage; });
      if (!page) return;
      var block = page.blocks.find(function(b) { return b.id === builderActiveEditor; });
      if (!block || !block.fieldKeys || !block.fieldKeys.length) {
        closeBlockEditor(); return;
      }
      var rows = [];
      block.fieldKeys.forEach(function(key) {
        var el = document.getElementById('be_' + key.replace(/[.\-]/g, '_'));
        if (!el) return;
        var value = el.value || '';
        var fieldDef = getFieldDef(key);
        var fieldType = (fieldDef && fieldDef.type === 'image') ? 'image' : 'text';
        rows.push({ key: key, value: value, type: fieldType });
        contentCache[key] = value;
      });
      if (rows.length > 0) await upsertRows(rows);
    }
    showToast('Блок сохранён!', 'success');
    closeBlockEditor();
    refreshBuilderPreview();
  } catch(err) {
    showToast('Ошибка: ' + err.message, 'error');
  } finally {
    if (saveBtn) { saveBtn.disabled = false; saveBtn.textContent = 'Сохранить'; }
  }
}

// ---- Builder: library ----

function showBlockLibrary() {
  var el = document.getElementById('builder-library');
  if (el) el.style.display = 'flex';
}

function closeBlockLibrary() {
  var el = document.getElementById('builder-library');
  if (el) el.style.display = 'none';
}

async function addBlockFromLibrary(templateId) {
  closeBlockLibrary();
  var page = BUILDER_PAGES.find(function(p) { return p.id === builderActivePage; }) || BUILDER_PAGES[0];
  var blockId = templateId + '-' + Date.now();
  var dynData = {
    _template: templateId,
    _label: TEMPLATE_LABELS[templateId] || templateId,
    _desc: TEMPLATE_DESCS[templateId] || ''
  };
  var tFields = TEMPLATE_FIELDS[templateId] || [];
  tFields.forEach(function(f) { dynData[f.key] = f.default || ''; });

  var dynKey = 'dblock.' + page.id + '.' + blockId;
  var dynJson = JSON.stringify(dynData);

  try {
    await upsertRows([{ key: dynKey, value: dynJson, type: 'json' }]);
    contentCache[dynKey] = dynJson;

    // Append to block config
    var savedConfig = [];
    try { var r = contentCache[page.key]; if (r) savedConfig = JSON.parse(r) || []; } catch(e) {}
    // If no config saved yet, initialize with all static blocks so they are tracked
    if (savedConfig.length === 0) {
      page.blocks.forEach(function(b, i) { savedConfig.push({ id: b.id, visible: true, order: i }); });
    }
    var nextOrder = Math.max.apply(null, savedConfig.map(function(b) { return b.order !== undefined ? b.order : 0; })) + 1;
    savedConfig.push({ id: blockId, visible: true, order: nextOrder });
    var configJson = JSON.stringify(savedConfig);
    await upsertRows([{ key: page.key, value: configJson, type: 'json' }]);
    contentCache[page.key] = configJson;

    showToast('Блок добавлен! Заполните его содержимое.', 'success');

    // Re-render and auto-open editor
    var contentArea = document.getElementById('content-area');
    contentArea.classList.add('builder-active');
    contentArea.innerHTML = renderBuilderTab();
    openBlockEditor(blockId);
  } catch(err) {
    showToast('Ошибка: ' + err.message, 'error');
  }
}

async function deleteDynamicBlock(blockId) {
  if (!confirm('Удалить этот блок? Восстановить нельзя.')) return;
  var page = BUILDER_PAGES.find(function(p) { return p.id === builderActivePage; }) || BUILDER_PAGES[0];
  var dynKey = 'dblock.' + page.id + '.' + blockId;
  try {
    var savedConfig = [];
    try { var r = contentCache[page.key]; if (r) savedConfig = JSON.parse(r) || []; } catch(e) {}
    savedConfig = savedConfig.filter(function(b) { return b.id !== blockId; });
    var configJson = JSON.stringify(savedConfig);
    await upsertRows([{ key: page.key, value: configJson, type: 'json' }]);
    contentCache[page.key] = configJson;
    delete contentCache[dynKey];
    // Delete row from Supabase
    await sbFetch('/rest/v1/content?key=eq.' + encodeURIComponent(dynKey), { method: 'DELETE' });
    showToast('Блок удалён', 'success');
    var contentArea = document.getElementById('content-area');
    contentArea.classList.add('builder-active');
    contentArea.innerHTML = renderBuilderTab();
  } catch(err) {
    showToast('Ошибка: ' + err.message, 'error');
  }
}

// ---- Builder: preview ----

function refreshBuilderPreview() {
  var iframe = document.getElementById('builder-iframe');
  if (!iframe) return;
  var page = BUILDER_PAGES.find(function(p) { return p.id === builderActivePage; }) || BUILDER_PAGES[0];
  var baseUrl = page.url || ('../' + page.id + '.html');
  var sep = baseUrl.indexOf('?') !== -1 ? '&' : '?';
  iframe.src = baseUrl + sep + '_t=' + Date.now();
}

// ---- Builder: save block config ----

async function saveBlockConfig() {
  var page = BUILDER_PAGES.find(function(p) { return p.id === builderActivePage; }) || BUILDER_PAGES[0];
  var saveBtn = document.querySelector('.builder-left-footer .btn-save');
  var statusEl = document.getElementById('save-status-builder');

  if (saveBtn) {
    saveBtn.disabled = true;
    saveBtn.innerHTML = '<div class="spinner" style="border-color:rgba(255,255,255,.3);border-top-color:#fff;width:13px;height:13px;border-width:2px;display:inline-block;margin-right:6px;"></div> Сохраняю...';
  }

  try {
    var list = document.getElementById('builder-blocks');
    var blockEls = list ? Array.from(list.querySelectorAll('.builder-block')) : [];
    var config = blockEls.map(function(el, index) {
      var checkbox = el.querySelector('input[type="checkbox"]');
      return { id: el.dataset.blockId, visible: checkbox ? checkbox.checked : true, order: index };
    });
    var configJson = JSON.stringify(config);
    await upsertRows([{ key: page.key, value: configJson, type: 'json' }]);
    contentCache[page.key] = configJson;
    showToast('Конструктор сохранён!', 'success');
    if (statusEl) {
      statusEl.textContent = 'Сохранено ' + new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
      statusEl.style.color = 'var(--green)';
    }
    refreshBuilderPreview();
  } catch (err) {
    showToast('Ошибка: ' + err.message, 'error');
    if (statusEl) { statusEl.textContent = 'Ошибка'; statusEl.style.color = 'var(--red)'; }
  } finally {
    if (saveBtn) {
      saveBtn.disabled = false;
      saveBtn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg> Сохранить';
    }
  }
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
window.selectBuilderPage = selectBuilderPage;
window.builderToggleBlock = builderToggleBlock;
window.builderDragStart = builderDragStart;
window.builderDragOver = builderDragOver;
window.builderDragLeave = builderDragLeave;
window.builderDrop = builderDrop;
window.builderDragEnd = builderDragEnd;
window.saveBlockConfig = saveBlockConfig;
window.openBlockEditor = openBlockEditor;
window.closeBlockEditor = closeBlockEditor;
window.saveBlockEditor = saveBlockEditor;
window.showBlockLibrary = showBlockLibrary;
window.closeBlockLibrary = closeBlockLibrary;
window.addBlockFromLibrary = addBlockFromLibrary;
window.deleteDynamicBlock = deleteDynamicBlock;
window.refreshBuilderPreview = refreshBuilderPreview;
