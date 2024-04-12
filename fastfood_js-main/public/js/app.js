// Toast function
function toast({ title = '', message = '', type = 'info', duration = 3000 }) {
  const main = document.getElementById('toast');
  if (main) {
    const toast = document.createElement('div');

    // Auto remove toast
    const autoRemoveId = setTimeout(function () {
      main.removeChild(toast);
    }, duration + 1000);

    // Remove toast when clicked
    toast.onclick = function (e) {
      if (e.target.closest('.toast__close')) {
        main.removeChild(toast);
        clearTimeout(autoRemoveId);
      }
    };

    const icons = {
      success: 'fas fa-check-circle',
      info: 'fas fa-info-circle',
      warning: 'fas fa-exclamation-circle',
      error: 'fas fa-exclamation-circle',
    };
    const icon = icons[type];
    const delay = (duration / 1000).toFixed(2);

    toast.classList.add('toast-box', `toast--${type}`);
    toast.style.animation = `slideInLeft ease .3s, fadeOut linear 1s ${delay}s forwards`;

    toast.innerHTML = `
                      <div class="toast__icon">
                          <i class="${icon}"></i>
                      </div>
                      <div class="toast__body">
                          <h3 class="toast__title">${title}</h3>
                          <p class="toast__msg">${message}</p>
                      </div>
                      <div class="toast__close">
                          <i class="fas fa-times"></i>
                      </div>
                  `;
    main.appendChild(toast);
  }
}

$(document).ajaxStart(function () {});

$(document).ajaxStop(function () {});

function formatCurrency(price) {
  const formattedPrice = (price / 1000)
    .toFixed(3)
    .replace(/\d(?=(\d{3})+\.)/g, '$&.');
  return formattedPrice + 'đ';
}

function calculateTotal(priceString, quantity) {
  // Lấy số từ chuỗi giá (loại bỏ dấu chấm và đồng thời chuyển đổi thành số nguyên)
  const price = parseInt(priceString.replace(/\./g, '').replace('đ', ''));

  // Kiểm tra xem có phải số hay không
  if (isNaN(price)) {
    console.error('Invalid price string!');
    return null;
  }

  // Tính tổng tiền
  return formatCurrency(price * quantity);
}

function formattedDate(dateString) {
  const date = new Date(dateString);
  return `${date.getHours()}:${date.getMinutes()} 
  ${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
}
