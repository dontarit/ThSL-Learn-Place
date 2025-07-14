export default function openAlert(theme, title, content) {
    let icon
    if (theme == 'success') { icon = 'ph-check-fat' }
    else if (theme == 'info') { icon = 'ph-info' }
    else if (theme == 'warning') { icon = 'ph-warning' }
    else if (theme == 'danger') { icon = 'ph-x-circle' }

    let alertDiv = document.createElement('div');
    alertDiv.id = 'alert-content';
    alertDiv.className = `alert alert-${theme} alert-close alert-white rounded`;
    alertDiv.innerHTML = `
        <div class="icon">
            <i class="ph-fill ${icon}"></i>
        </div>
        <strong>${title} : </strong> ${content}
    `;
    document.body.appendChild(alertDiv);

    setTimeout(() => {
        alertDiv.classList.add('alert-append')
        alertDiv.classList.remove('alert-close')
    }, 10);

    setTimeout(() => {
        alertDiv.classList.add('alert-close')
        alertDiv.classList.remove('alert-append')
        setTimeout(() => {
            alertDiv.remove()
        }, 1250);
    }, 10 * 1000);
}