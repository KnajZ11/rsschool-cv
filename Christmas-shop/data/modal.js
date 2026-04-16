// Модальные окна для товаров
class ProductModal {
    constructor() {
        this.modal = null;
        this.initModal();
    }
    
    initModal() {
           // Создаем модальное окно, если его нет
        if (!document.getElementById('productModal')) {
            this.modal = document.createElement('div');
            this.modal.id = 'productModal';
            this.modal.className = 'modal';
            document.body.appendChild(this.modal);
        } else {
            this.modal = document.getElementById('productModal');
        }
        
        // Закрытие по ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') this.close();
        });
        
        // Закрытие по клику вне окна
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) this.close();
        });
    }
    
    open(product) {
        if (!this.modal) return;
        
        const stars = this.createStars(product.rating);
        
        this.modal.innerHTML = `
            <div class="modal-content">
                <span class="close-modal">&times;</span>
                <div class="modal-body">
                    <img src="${product.image}" alt="${product.name}" class="modal-img">
                    <div class="modal-info">
                        <span class="gift-category">${product.category}</span>
                        <h2>${product.name}</h2>
                        <div class="gift-rating">${stars}</div>
                        <p class="modal-description">${product.fullDescription || product.description}</p>
                        
                        <div class="modal-details">
                            ${product.material ? `<p><strong>Материал:</strong> ${product.material}</p>` : ''}
                            ${product.size ? `<p><strong>Размер:</strong> ${product.size}</p>` : ''}
                            ${product.weight ? `<p><strong>Вес:</strong> ${product.weight}</p>` : ''}
                        </div>
                        
                        <div class="modal-footer">
                            <span class="modal-price">${product.price} ₽</span>
                            <button class="btn add-to-cart-modal" data-id="${product.id}">
                                <i class="fas fa-shopping-cart"></i> Добавить в корзину
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        this.modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        
        // Добавляем обработчики
        this.modal.querySelector('.close-modal').addEventListener('click', () => this.close());
        
        const addToCartBtn = this.modal.querySelector('.add-to-cart-modal');
        if (addToCartBtn) {
            addToCartBtn.addEventListener('click', () => {
                this.addToCart(product);
                this.close();
            });
        }
    }
    
    close() {
        if (this.modal) {
            this.modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    }
    
    createStars(rating) {
        let stars = '';
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        
        for (let i = 1; i <= 5; i++) {
            if (i <= fullStars) {
                stars += '<i class="fas fa-star"></i>';
            } else if (i === fullStars + 1 && hasHalfStar) {
                stars += '<i class="fas fa-star-half-alt"></i>';
            } else {
                stars += '<i class="far fa-star"></i>';
            }
        }
        
        return stars + ` <span class="rating-text">(${rating})</span>`;
    }
    
    addToCart(product) {
        // Здесь будет логика добавления в корзину
        console.log('Добавлено в корзину:', product.name);
        this.showNotification(`"${product.name}" добавлен в корзину!`);
    }
    
    showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.innerHTML = `
            <i class="fas fa-check-circle"></i>
                   <span>${message}</span>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
}

// Глобальный экземпляр модального окна
window.productModal = new ProductModal();