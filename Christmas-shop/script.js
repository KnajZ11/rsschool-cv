// Минимальный скрипт для сайта
// 1. Добавление в корзину
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('btn-small') || 
        e.target.closest('.btn-small')) {
        
        const button = e.target.classList.contains('btn-small') ? 
                      e.target : e.target.closest('.btn-small');
    
    // 2. Форма подписки
    const form = document.querySelector('.cta-form');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Спасибо за подписку!');
            this.reset();
        });
    }

     // 3. Плавная прокрутка к якорям
     const smoothLinks = document.querySelectorAll('a[href^="#"]');
    
     smoothLinks.forEach(link => {
         link.addEventListener('click', function(e) {
             e.preventDefault();             
             const targetId = this.getAttribute('href');
             if (targetId === '#') return;             
             const targetElement = document.querySelector(targetId);
             if (targetElement) {
                 targetElement.scrollIntoView({
                     behavior: 'smooth',
                     block: 'start'
                 });
             }
         });
     });
}});
