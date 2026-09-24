const listContainer = document.getElementById('article-list');

fetch('posts/posts.json')
    .then(response => response.json())
    .then(posts => {
        posts.forEach(post => {

            const card = document.createElement('a');
            card.href = `post.html?file=${post.file}`;
            card.className = 'article-card';

            card.innerHTML = `
                <h3>${post.title}</h3>
                <p>${post.date} · 点击阅读</p>
            `;

            listContainer.appendChild(card);
        });
    })
    .catch(error => {
        console.error('文章呢:):', error);
        listContainer.innerHTML = '<p>文章不见啦^-^重开吧</p>';
    });