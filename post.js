const urlParams = new URLSearchParams(window.location.search);
const filePath = urlParams.get('file');

const contentDiv = document.getElementById('article-content');

if (!filePath) {
    contentDiv.innerHTML = '<h1>文章呢:)</h1><p>请检查链接是否正确。</p>';
} else {
    fetch(filePath)
        .then(response => {
            if (!response.ok) throw new Error('文件不存在');
            return response.text();
        })
        .then(markdownText => {
            contentDiv.innerHTML = marked.parse(markdownText, { breaks: true });

            const firstLine = markdownText.split('\n')[0];
            if (firstLine.startsWith('# ')) {
                document.title = firstLine.replace('# ', '') + ' | UNDEF';
            }
        })
        .catch(error => {
            console.error('加载失败:', error);
            contentDiv.innerHTML = '<h1>失败了呢</h1><p>文章不见啦</p>';
        });
}