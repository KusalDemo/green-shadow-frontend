document.addEventListener("DOMContentLoaded", () => {
    const mainContent = document.getElementById("main-content");
    const navItems = document.querySelectorAll(".nav-item");

    const loadPage = async (page) => {
        try {
            const response = await fetch(page);
            if (!response.ok) throw new Error("Page not found");
            const content = await response.text();
            mainContent.innerHTML = content;
        } catch (error) {
            mainContent.innerHTML = "<p>Error loading page.</p>";
            console.error(error);
        }
    };

    navItems.forEach(item => {
        item.addEventListener("click", () => {
            console.log("clicked", item);
            navItems.forEach(i => i.classList.remove("active"));
            item.classList.add("active");

            const page = item.getAttribute("data-page");
            loadPage(page);
        });
    });

    loadPage("view/dashboard/dashboard.html");
});
