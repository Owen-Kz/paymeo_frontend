// src/utils/helpers.js
export const setCookie = (name, value, daysToExpire) => {
  const date = new Date();
  date.setTime(date.getTime() + daysToExpire * 24 * 60 * 60 * 1000);
  const expires = "expires=" + date.toUTCString();
  document.cookie = name + "=" + value + "; " + expires + "; path=/";
};

export const deleteCookie = (cookieName) => {
  const paths = ["/", "/dashboard", "/invoice"];
  paths.forEach(path => {
    document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path};`;
    document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path}; domain=${document.domain};`;
  });
};

export const showError = (message, inputRef) => {
  if (inputRef.current) {
    const errorMsg = document.getElementById("errorMsg");
    if (errorMsg) {
      errorMsg.textContent = message;
    }
    inputRef.current.classList.add("shake");
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.classList.remove("shake");
      }
    }, 300);
  }
};

export const showToast = (message, type = 'success') => {
  let container = document.getElementById('toastContainer');
  
  if (!container) {
    container = document.createElement('div');
    container.id = 'toastContainer';
    container.className = 'fixed top-4 right-4 z-50 flex flex-col gap-2';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `px-4 py-3 rounded-md shadow-lg ${
    type === 'success' ? 'bg-green-800 text-white' : 'bg-red-500 text-white'
  }`;
  toast.innerHTML = `
    <span>${message}</span>
    <span class="close ml-2 cursor-pointer" onclick="this.parentElement.remove()">×</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 4000);
};