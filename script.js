document.addEventListener('DOMContentLoaded', () => {
    const header = document.getElementById('header');
   
    if (!header) {
        console.error("Element header nie został znaleziony");
        return;
    }

    function setCookie(name, value, days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        const expires = "expires=" + date.toUTCString();
        document.cookie = name + "=" + value + ";" + expires + ";path=/";
    }

    function getCookie(name) {
        const cookieName = name + "=";
        const decodedCookie = decodeURIComponent(document.cookie);
        const cookiesArray = decodedCookie.split(';');
        for (let cookie of cookiesArray) {
            cookie = cookie.trim();
            if (cookie.indexOf(cookieName) === 0) {
                return cookie.substring(cookieName.length, cookie.length);
            }
        }
        return "";
    }

    function applyHeaderPreference() {
        const headerPreference = getCookie("headerPreference");

        if (headerPreference === "alwaysVisible") {
            header.classList.add('visible');
            document.removeEventListener('mousemove', handleHover);
        } else {
            document.addEventListener('mousemove', handleHover);
        }
    }

    function handleHover(event) {
        if (event.clientY < 50) {
            header.classList.add('visible');
        } else {
            header.classList.remove('visible');
        }
    }

    applyHeaderPreference();

    const toggleHeaderBtn = document.getElementById("toggleHeader");
    if (toggleHeaderBtn) {
        toggleHeaderBtn.addEventListener("click", () => {
            const headerPreference = getCookie("headerPreference");

            if (headerPreference === "alwaysVisible") {
                setCookie("headerPreference", "hoverOnly", 7);
                alert("Nagłówek będzie teraz wysuwał się tylko przy najechaniu myszką.");
            } else {
                setCookie("headerPreference", "alwaysVisible", 7);
                alert("Nagłówek będzie teraz zawsze widoczny.");
            }
            location.reload();
        });
    }


    

});
document.addEventListener('DOMContentLoaded', () => {
    const sourcesBtn = document.getElementById('sourcesBtn'); 
    const sourcesModal = document.getElementById('sourcesModal'); 
    const closeModal = sourcesModal ? sourcesModal.querySelector('.close') : null; 

    if (sourcesBtn && sourcesModal) {
        sourcesBtn.addEventListener("click", () => {
            sourcesModal.style.display = "flex"; 
        });
    }

    if (closeModal) {
        closeModal.addEventListener("click", () => {
            sourcesModal.style.display = "none"; 
        });
    }

    window.addEventListener("click", (event) => {
        if (event.target === sourcesModal) {
            sourcesModal.style.display = "none";
        }
    });
});
