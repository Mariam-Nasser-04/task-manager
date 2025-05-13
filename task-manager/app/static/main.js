// Toast notification system
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast-notification ${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.classList.add('show');
    }, 10);
    
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 3000);
}

// Modal functions
window.onload = function() {
    const modal = document.getElementById("summaryModal");
    if (modal) {
        modal.style.display = "flex";
        showRandomQuote();
    }
    
    // Initialize date pickers
    const dateInputs = document.querySelectorAll('input[type="date"]');
    dateInputs.forEach(input => {
        if (!input.value) {
            input.value = new Date().toISOString().split('T')[0];
        }
    });
};

function closeModal() {
    document.getElementById("summaryModal").style.display = "none";
}

function showRandomQuote() {
    const quotes = [
        "Success is the sum of small efforts repeated day in and day out.",
        "Don't watch the clock; do what it does. Keep going.",
        "The future depends on what you do today.",
        "Believe you can and you're halfway there.",
        "It always seems impossible until it's done.",
        "Push yourself, because no one else is going to do it for you.",
        "Little by little, a little becomes a lot.",
        "Stay positive, work hard, make it happen."
    ];

    const randomIndex = Math.floor(Math.random() * quotes.length);
    document.getElementById("quoteText").innerText = `"${quotes[randomIndex]}"`;
}

// Theme management
const toggleButton = document.getElementById("themeToggle");

function applyTheme(theme) {
    document.body.setAttribute('data-theme', theme);
    localStorage.setItem("theme", theme);
    
    // Update icon
    const icon = document.querySelector('#themeToggle i');
    if (icon) {
        icon.className = theme === "dark" ? "fas fa-sun" : "fas fa-moon";
    }
}

if (toggleButton) {
    toggleButton.addEventListener("click", () => {
        const currentTheme = document.body.getAttribute('data-theme') || 'light';
        applyTheme(currentTheme === "dark" ? "light" : "dark");
    });
}

// Initialize theme on load
window.addEventListener("load", () => {
    const savedTheme = localStorage.getItem("theme") || "light";
    applyTheme(savedTheme);
});

// Task editing functionality
function enableTaskEdit(taskElement) {
    const taskText = taskElement.querySelector('span');
    const currentText = taskText.textContent;
    
    const input = document.createElement('input');
    input.type = 'text';
    input.value = currentText;
    input.className = 'task-edit-input';
    
    taskText.replaceWith(input);
    input.focus();
    
    function saveEdit() {
        const newText = input.value.trim();
        if (newText && newText !== currentText) {
            // In a real app, you would send this to the server
            taskText.textContent = newText;
            showToast('Task updated successfully!');
        }
        input.replaceWith(taskText);
    }
    
    input.addEventListener('blur', saveEdit);
    input.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') saveEdit();
        if (e.key === 'Escape') input.replaceWith(taskText);
    });
}

// Confirmation dialog
function showConfirmation(message, callback) {
    const dialog = document.createElement('div');
    dialog.className = 'confirmation-dialog';
    
    dialog.innerHTML = `
        <div class="dialog-content">
            <p>${message}</p>
            <div class="dialog-actions">
                <button class="cancel-btn">Cancel</button>
                <button class="confirm-btn">Confirm</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(dialog);
    
    dialog.querySelector('.cancel-btn').addEventListener('click', () => {
        dialog.remove();
    });
    
    dialog.querySelector('.confirm-btn').addEventListener('click', () => {
        callback();
        dialog.remove();
    });
}

// Search functionality
if (document.getElementById('taskSearch')) {
    document.getElementById('taskSearch').addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const tasks = document.querySelectorAll('.task-item');
        
        tasks.forEach(task => {
            const text = task.querySelector('span').textContent.toLowerCase();
            if (text.includes(searchTerm)) {
                task.style.display = 'flex';
            } else {
                task.style.display = 'none';
            }
        });
    });
}