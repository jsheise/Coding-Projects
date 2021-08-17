const form = document.querySelector('#searchForm');
form.addEventListener('submit', async function(e) {
    e.preventDefault();
    const searchTerm = form.elements.query.value;
    const res = await axios.get(`https://api.tvmaze.com/search/shows?q=${searchTerm}`);
    appendImages(res.data);
    form.elements.query.value = ''; //clear the form input
})

const appendImages = (showsArray) => {
    for (let entry of showsArray) {
        if (entry.show.image) {
            const newImg = document.createElement('img');
            newImg.src = entry.show.image.medium;
            document.body.append(newImg);
        }
    }
}