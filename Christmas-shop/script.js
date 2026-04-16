// ==================== ГЛАВНЫЕ ПЕРЕМЕННЫЕ ====================
let allGifts = []; // Здесь будут храниться все подарки
let cart = JSON.parse(localStorage.getItem('cart')) || []; // Корзина из localStorage

// =====  ИНИЦИАЛИЗАЦИЯ =====
document.addEventListener('DOMContentLoaded', function() {
    initializeCart();
    initializeWishlist();
    initializeFilters();
    initializeMobileMenu();
});

// ===== 1. ДОБАВЛЕНИЕ В КОРЗИНУ =====
document.addEventListener('click', function(e) {
    // Обработка кнопок "В корзину"
    if (e.target.classList.contains('btn-small') || 
    e.target.closest('.btn-small')) {
        
        const button = e.target.classList.contains('btn-small') ? 
                      e.target : e.target.closest('.btn-small');
        
        // Получаем информацию о товаре
        const giftCard = button.closest('.gift-card');
        const productName = giftCard ? 
            giftCard.querySelector('h3').textContent : 'Товар';
        const productPrice = giftCard ? 
            giftCard.querySelector('.gift-price').textContent : '';
        
        // Добавляем в корзину (упрощённо)
        console.log(`Добавлено в корзину: ${productName} - ${productPrice}`);
        
        // Визуальная обратная связь
        const originalText = button.textContent;
        const originalBg = button.style.backgroundColor;
        button.textContent = '✓ Добавлено';
        button.style.backgroundColor = '#4CAF50';
        button.style.pointerEvents = 'none';
        
        // Возвращаем исходный вид через 2 секунды
        setTimeout(() => {
            button.textContent = originalText;
            button.style.backgroundColor = originalBg;
            button.style.pointerEvents = 'auto';
        }, 2000);
        
        // Предотвращаем всплытие события
        e.stopPropagation();
    }
});

// ===== 2. ФОРМА ПОДПИСКИ =====
document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('.cta-form');
    
    // Валидация email
    function validateEmail(email) {
        const re = /^[^s@]+@[^s@]+.[^s@]+$/;
        return re.test(email);
    }
    
    // Функция показа сообщений формы
    function showFormMessage(message, type) {
        // Удаляем предыдущие сообщения
        const existingMessage = form.querySelector('.form-message');
        if (existingMessage) {
            existingMessage.remove();
        }
        
        // Создаем новое сообщение
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('form-message', type); 
        messageDiv.textContent = message;
        messageDiv.style.cssText = `
            argin-top: 10px;
            padding: 10px 15px;
            border-radius: 8px;
            font-size: 14px;
            text-align: center;
            animation: fadeIn 0.3s ease;
       `;
        
        if (type === 'success') {
            messageDiv.style.backgroundColor = 'rgba(76, 175, 80, 0.1)';
            messageDiv.style.color = '#4CAF50';
            messageDiv.style.border = '1px solid #4CAF50';
        } else {
            messageDiv.style.backgroundColor = 'rgba(244, 67, 54, 0.1)';
            messageDiv.style.color = '#f44336';
            messageDiv.style.border = '1px solid #f44336';
        }
        
        form.appendChild(messageDiv);
        
        // Автоматическое удаление через 5 секунд
        setTimeout(() => {
            if (messageDiv.parentNode === form) {
                messageDiv.remove();
            }
        }, 5000);
    }
    
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const emailInput = this.querySelector('input[type="email"]');
            const email = emailInput.value.trim();
            
            if (!email) {
                showFormMessage('Пожалуйста, введите email', 'error');
                emailInput.focus();
                return;
            }
            
            if (!validateEmail(email)) {
                showFormMessage('Пожалуйста, введите корректный email', 'error');
                emailInput.focus();
                return;
            }
            
            // Симуляция отправки
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
             submitBtn.textContent = 'Отправка...';
            submitBtn.disabled = true;
            
            // Показываем сообщение об успехе
            setTimeout(() => {
                showFormMessage('Спасибо за подписку! Проверьте вашу почту.', 'success');
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
                this.reset();
            }, 1500);
        });
    }
});

// ===== 3. ПЛАВНАЯ ПРОКРУТКА =====
document.addEventListener('DOMContentLoaded', function() {
    const smoothLinks = document.querySelectorAll('a[href^="#"]');
    
    smoothLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            
            // Игнорируем пустые ссылки и ссылки на другие страницы
            if (targetId === '#' || targetId === '' || targetId.includes('http')) return;
            
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                e.preventDefault();
                
                // Рассчитываем позицию с учётом фиксированного хедера
                const header = document.querySelector('header');
                const headerHeight = header ? header.offsetHeight : 80;
                
                // Получаем позицию элемента
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerHeight;
                
                // Плавная прокрутка
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
                
                // Обновляем URL без перезагрузки
                if (history.pushState) {
                    history.pushState(null, null, targetId);
                }
                
                // Добавляем фокус для доступности
                targetElement.setAttribute('tabindex', '-1');
                targetElement.focus();
                setTimeout(() => {
                    targetElement.removeAttribute('tabindex');
                }, 1000);
            }
        });
    });
});

// ===== 4. АДАПТИВНОЕ МЕНЮ =====
document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            this.classList.toggle('active');
            
            // Анимация иконки гамбургера
            const spans = this.querySelectorAll('span');
            if (navMenu.classList.contains('active')) {
                spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
            } else {
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });
        
        // Закрытие меню при клике на ссылку
        const navLinks = navMenu.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                menuToggle.classList.remove('active');
                
                const spans = menuToggle.querySelectorAll('span');
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            });
        });
// Закрытие меню при клике вне его
        document.addEventListener('click', function(e) {
            if (!navMenu.contains(e.target) && !menuToggle.contains(e.target)) {
                navMenu.classList.remove('active');
                menuToggle.classList.remove('active');
                
                const spans = menuToggle.querySelectorAll('span');
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });
    }
});

// ===== 5. LAZY LOADING ИЗОБРАЖЕНИЙ =====
document.addEventListener('DOMContentLoaded', function() {
    if ('IntersectionObserver' in window) {
        const lazyImages = document.querySelectorAll('img[data-src]');
        
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.add('loaded');
                    observer.unobserve(img);
                }
            });
        });
        
        lazyImages.forEach(img => imageObserver.observe(img));
    }
});

// ===== 6. ТАЙМЕР НОВОГО ГОДА =====
const currentYear = new Date().getFullYear();
const targetDate = new Date(currentYear + 1, 0, 1); 
const startDate = new Date(currentYear, 0, 1);

function updateCountdown() {    
    const now = new Date();    
    const diff = targetDate - now;

    if (diff <= 0) {
        if (typeof handleTargetDateArrival === 'function') {
            handleTargetDateArrival();
        } else {
            console.log("С Новым Годом!");
        }
        return;
    }

    const totalSeconds = Math.floor(diff / 1000);
    const days = Math.floor(totalSeconds / (3600 * 24));
    const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60; 

    // Безопасное обновление элементов (проверяем наличие ID)
    const elements = {
        'days': days,
        'hours': hours,
        'minutes': minutes,
        'seconds': seconds
    };

    for (const [id, value] of Object.entries(elements)) {
        const el = document.getElementById(id);
        if (el) {
            el.textContent = value.toString().padStart(2, '0');
        }
    }

    updateProgressBar(now);

    // Безопасный вызов updateMessages
    if (typeof updateMessages === 'function') {
        updateMessages(days, hours);
    }
}

function updateProgressBar(now) {
    const totalDuration = targetDate - startDate;
    const elapsed = now - startDate;
    const progress = Math.min((elapsed / totalDuration) * 100, 100);

    const progressBar = document.getElementById('progress-bar');
    const progressPercentage = document.getElementById('progress-percentage');

    if (progressBar) progressBar.style.width = progress + '%';
    if (progressPercentage) progressPercentage.textContent = Math.round(progress) + '%';
}

// Запуск
document.addEventListener('DOMContentLoaded', () => {
    updateCountdown();
    setInterval(updateCountdown, 1000);
});


// ===== 7. ОБРАБОТКА ОШИБОК =====
window.addEventListener('error', function(e) {
    console.error('Произошла ошибка:', e.message);
});

// ===== 8. АДАПТИВНЫЕ ИЗМЕНЕНИЯ ПРИ ИЗМЕНЕНИИ РАЗМЕРА ОКНА =====
let resizeTimeout;
window.addEventListener('resize', function() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(function() {
        // Закрываем меню на мобильных при увеличении экрана
        if (window.innerWidth > 768) {
            const navMenu = document.querySelector('.nav-menu');
            const menuToggle = document.querySelector('.menu-toggle');
            
            if (navMenu && menuToggle) {
                navMenu.classList.remove('active');
                menuToggle.classList.remove('active');
                
                const spans = menuToggle.querySelectorAll('span');
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        }
    }, 250);
});

// ===== 9.КНОПКА "НАВЕРХ" =====
document.addEventListener('DOMContentLoaded', function() {
    // Создаем кнопку, если ее нет
    if (!document.querySelector('.back-to-top-btn')) {
        const backToTopBtn = document.createElement('button');
        backToTopBtn.className = 'back-to-top-btn';
        backToTopBtn.id = 'backToTop';
        backToTopBtn.innerHTML = '<i class="fas fa-chevron-up"></i>';
        backToTopBtn.setAttribute('aria-label', 'Наверх');
        document.body.appendChild(backToTopBtn);
    }
    
    const backToTopBtn = document.querySelector('.back-to-top-btn');
    
    if (!backToTopBtn) return;
    
    // Показываем/скрываем кнопку при прокрутке
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }
    });
    
    // Плавная прокрутка наверх
    backToTopBtn.addEventListener('click', function(e) {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Инициализация при загрузке
    if (window.pageYOffset > 300) {
        backToTopBtn.classList.add('show');
    }
});


// ==================== 10. ОБНОВЛЕНИЕ СЛУЧАЙНЫХ ПОДАРКОВ ====================
document.addEventListener('DOMContentLoaded', function() {
    const giftsGrid = document.querySelector('.random-gifts-grid');
    const refreshBtn = document.querySelector('.refresh-btn');
    
    // Переменная для хранения данных, загруженных из JSON
    let giftsData = [];

    if (!giftsGrid) return;  

    // --- Функция загрузки данных через fetch ---
    async function loadGifts() {
        try {
            // Путь к моему JSON файлу
            const response = await fetch('./data/gifts.json');
            
            if (!response.ok) {
                throw new Error('Ошибка при загрузке данных с сервера');
            }
            
            giftsData = await response.json();
            
            // После загрузки сразу отображаем 4 случайных подарка
            displayGifts(getRandomGifts(4));
            
        } catch (error) {
            console.error('Ошибка:', error);
            giftsGrid.innerHTML = '<p style="color: white; text-align: center;">Не удалось загрузить подарки...</p>';
        }
    }
    
    // Получить случайные подарки из загруженного массива
    function getRandomGifts(count = 4) {
        if (giftsData.length === 0) return [];
        return [...giftsData].sort(() => Math.random() - 0.5).slice(0, count);
    }
    
    // Отрисовка карточек
    function displayGifts(giftsArray) {
        giftsGrid.innerHTML = giftsArray.map(gift => `
            <div class="gift-card">
                <div class="gift-image">
                    <img src="${gift.image}" alt="${gift.name}" loading="lazy">
                </div>
                <div class="gift-content">
                    <h3>${gift.name}</h3>
                    <p>${gift.desc}</p>
                    <div class="gift-price">
                        <span class="price">${gift.price}</span>
                        <button class="btn add-to-cart" data-id="${gift.id}">
                           <i class="fas fa-cart-plus"></i>
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
        
        // Вешаем события на кнопки после того, как они появились в DOM
        attachCartEvents();
    }
    
    function attachCartEvents() {
        document.querySelectorAll('.add-to-cart').forEach(btn => {
            btn.addEventListener('click', function() {
                const giftId = this.getAttribute('data-id');
                addToCart(giftId);
            });
        });
    }
    
    function addToCart(giftId) {
        const gift = giftsData.find(g => g.id == giftId);
        if (!gift) return;
        
        // Cелектор с использованием шаблонных строк
        const btn = document.querySelector(`.add-to-cart[data-id='${giftId}']`);
        if (btn) {
            btn.innerHTML = '<i class="fas fa-check"></i>';
            btn.style.backgroundColor = '#4CAF50';
            btn.style.pointerEvents = 'none'; // Чтобы нельзя было нажать дважды
        }
        console.log(`Добавлено в корзину: ${gift.name}`);
    }

    // Логика кнопки обновления
    if (refreshBtn) {
        refreshBtn.addEventListener('click', () => {
            // Вращаем иконку при нажатии (если есть i)
            const icon = refreshBtn.querySelector('i');
            if (icon) icon.style.transform = 'rotate(360deg)';
            
            displayGifts(getRandomGifts(4));          
            
            setTimeout(() => { if(icon) icon.style.transform = 'rotate(0deg)'; }, 500);
        });
    }

    // СТАРТ: Загружаем данные
    loadGifts();
});