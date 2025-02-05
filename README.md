# 📌 Sistema de Inclusión de Archivos en HTML con JavaScript

Este proyecto permite incluir archivos HTML de manera dinámica en una página web sin necesidad de recargarla, similar a `include` en PHP. También optimiza la velocidad mediante caché y asegura que los elementos incluidos se integren correctamente en el DOM.

---

## 🚀 **Características**
✅ **Carga dinámica de archivos HTML** con `[include]` en los elementos.
✅ **Uso de caché** para evitar recargas innecesarias.
✅ **Reemplazo completo del `<div include='...'>`**, dejando solo el contenido real.
✅ **Soporte para cambios dinámicos**, como selección de usuario.
✅ **Optimización de carga con `Promise.all()`** para mayor velocidad.

---

## 📂 **Estructura del Proyecto**
```
📁 proyecto
│── index.html
│── header.html
│── user.html
│── script.js
│── README.md
```

---

## 📜 **Uso**

### 📌 **1. Agrega `include="archivo.html"` en `index.html`**
```html
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mi Página con Include Mejorado</title>
</head>
<body>
    
    <div include="header.html"></div>
    <div include="user.html"></div>

    <script src="script.js"></script>
</body>
</html>
```

---

### 📌 **2. Crea `header.html` con un selector de usuario**
```html
<header>
    <nav>
        <a href="#home">Inicio</a>
        <a href="#projects">Proyectos</a>
        <a href="#about">Sobre mí</a>
        <a href="#contact">Contacto</a>
        
        <select id="userSelect">
            <option value="Juan">Juan</option>
            <option value="María">María</option>
            <option value="Carlos">Carlos</option>
        </select>
    </nav>
</header>
```

---

### 📌 **3. Crea `user.html` con mensaje dinámico**
```html
<p>Bienvenido <span id="userName">[Usuario]</span></p>
```

---

### 📌 **4. Agrega `script.js` para cargar archivos dinámicamente**
```js
async function incluirArchivos() {
    let elementos = document.querySelectorAll("[include]");
    let peticiones = [...elementos].map(async (el) => {
        let file = el.getAttribute("include");
        let cacheKey = `cache_${file}`;
        
        let cacheData = sessionStorage.getItem(cacheKey);
        let lastModified = localStorage.getItem(`${cacheKey}_lastmod`);
        let headers = lastModified ? { "If-Modified-Since": lastModified } : {};
        
        try {
            let response = await fetch(file, { headers });
            
            if (response.status === 304 && cacheData) {
                return { el, content: cacheData };
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
    
    let resultados = await Promise.all(peticiones);
    resultados.forEach(({ el, content }) => {
        let temp = document.createElement("div");
        temp.innerHTML = content;
        let firstChild = temp.firstElementChild;

        if (firstChild) {
            el.replaceWith(firstChild);
        }
    });
    
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

document.addEventListener("DOMContentLoaded", incluirArchivos);
```

---

## 🎯 **¿Cómo Funciona?**
1️⃣ **Carga automática** de `header.html` y `user.html` en `index.html`.
2️⃣ **Usa caché** para mejorar velocidad y evitar descargas innecesarias.
3️⃣ **Reemplaza `<div include="...">` por el contenido real**, limpiando el DOM.
4️⃣ **Permite cambiar usuario** sin recargar la página.

---

## 📌 **Beneficios**
✔ **Carga archivos como PHP `include` pero sin servidor.**
✔ **Mejora la velocidad con caché.**
✔ **Limpia el código fuente (sin `div include="...")`.**
✔ **Fácil de usar e integrar en cualquier proyecto.**

---

## 📌 **Ejemplo en Vivo**
Puedes probar el código subiéndolo a un servidor o usándolo localmente con un entorno como Live Server en VS Code.

**¡Espero que te sea útil! 🚀**

**descargalo y cambia lo que queiras**

