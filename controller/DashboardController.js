import {getCookie} from "../utils/utils.js";

document.addEventListener("DOMContentLoaded", () => {
    let userLoggedIn = getCookie("greenShadowUser");
    fetchNews();

    document.getElementsByClassName("user-email").innerHTML = userLoggedIn;
    const btnReloadData = document.getElementById("btn-reload-data");
    if (btnReloadData) {
        btnReloadData.addEventListener('click', () => fetchNews());
    }
})

const url = `https://newsapi.org/v2/everything?q=agri&from=2024-11-01&sortBy=publishedAt&language=en&apiKey=2b465757575858585590834322`;

const fetchNews = () => {
    $.ajax({
        url: url,
        method: 'GET',
        success: function (data) {
            const articles = data.articles.slice(0, 12);
            const newsContainer = document.getElementById('news-container');
            newsContainer.innerHTML = '';

            articles.forEach(article => {
                const imageUrl = article.urlToImage || 'https://www.agrii.co.uk/assets/i/Agrii-News-Holder-newspage.jpg';

                const card = `
                    <div class="col-lg-4 col-sm-6 mb-4">
                        <div class="card mb-4 h-100">
                            <img src="${imageUrl}" class="card-img-top" alt="${article.title}">
                            <div class="card-body">
                                <p class="card-title fw-bold">${article.title}</p>
                                <small class="text-muted">${article.source.name}</small>
                            </div>
                            <div class="text-center mb-2">
                                <a href="${article.url}" target="_blank" class="btn btn-success">Read More</a>
                            </div>
                        </div>
                    </div>`;
                newsContainer.insertAdjacentHTML('beforeend', card);
            });
        },
        error: function (xhr, status, error) {
            console.error('Error fetching news:', error);
        }
    });
};




