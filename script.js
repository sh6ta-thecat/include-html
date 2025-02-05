async function incluirArchivos() {
    let elementos = document.querySelectorAll("[include]");
    let peticiones = [...elementos].map(async (el) => {
        let file = el.getAttribute("include");
        let cacheKey = `cache_${file}`;

        // Verificar si ya está en caché
        let cacheData = sessionStorage.getItem(cacheKey);
        let lastModified = localStorage.getItem(`${cacheKey}_lastmod`);
        let headers = lastModified ? { "If-Modified-Since": lastModified } : {};

        try {
            let response = await fetch(file, { headers });

            if (response.status === 304 && cacheData) {
                return { el, content: cacheData }; // Usa caché si no cambió
            } else {
                let text = await response.text();
                sessionStorage.setItem(cacheKey, text);
                localStorage.setItem(`${cacheKey}_lastmod`, response.headers.get("Last-Modified"));
                return { el, content: text };
            }
        } catch (error) {
            return { el, content: `<p>Error cargando: ${file}</p>` };
        }
    });

    // Ejecutar todas las cargas en paralelo y actualizar el DOM
    let resultados = await Promise.all(peticiones);
    resultados.forEach(({ el, content }) => {
        let temp = document.createElement("div");
        temp.innerHTML = content;
        let firstChild = temp.firstElementChild;

        if (firstChild) {
            el.replaceWith(firstChild); // Reemplaza completamente el <div include="..."> con su contenido real
        }
    });

    // Esperar a que `header.html` se cargue antes de inicializar la selección de usuario
    if (document.getElementById("userSelect")) {
        inicializarUserSelector();
    }
}

function inicializarUserSelector() {
    let userSelect = document.getElementById("userSelect");
    let user = localStorage.getItem("selectedUser") || "Juan";

    userSelect.value = user;
    actualizarUsuario(user);

    userSelect.addEventListener("change", function () {
        let nuevoUsuario = userSelect.value;
        localStorage.setItem("selectedUser", nuevoUsuario);
        actualizarUsuario(nuevoUsuario);
    });
}

function actualizarUsuario(user) {
    let userNameElement = document.getElementById("userName");
    if (userNameElement) {
        userNameElement.textContent = user;
    }
}

// Iniciar carga rápida
document.addEventListener("DOMContentLoaded", incluirArchivos);
