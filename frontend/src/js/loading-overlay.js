const loadingOverlay = document.querySelector('.loading-overlay')

window.addEventListener('load', () => {
    document.body.classList.add('loaded')
})
window.addEventListener('click', (e) => {
    console.log(e.target.className);
    if (e.target.className == 'loading-overlay') {
        loadingOverlay.remove()
    }
})
loadingOverlay.ontransitionend = () => {
    loadingOverlay.remove()
}