document.addEventListener("DOMContentLoaded", main);

let renderCallbacks = [];


function main() {
    initNavbar();

    (function render() {
        renderCallbacks.forEach(fn => fn());
        requestAnimationFrame(render);
    })();
}


function initNavbar() {
    bindNavbarButtons();

    let hero = document.getElementById('hero');
    let nameNav = document.getElementById('name-nav');
    let contactNav = document.getElementById('contact-info-nav');
    let navbar = document.querySelector('nav');

    // Different browsers have weird behavior here
    onRender(updatePos);
    document.addEventListener('scroll', updatePos);

    function updatePos() {
        let navbarTop = hero.getBoundingClientRect().bottom - navbar.offsetHeight;

        if (navbarTop <= 0) {
            navbar.classList.add('sticky');
            nameNav.classList.add('sticky');
            contactNav.classList.add('sticky');
        }
        else {
            navbar.classList.remove('sticky');
            nameNav.classList.remove('sticky');
            contactNav.classList.remove('sticky');
        }
    }
}



function onRender(callback) {
    renderCallbacks.push(callback);
}


function bindNavbarButtons() {
    let bindings = [
        ['education-link',  'education'],
        ['experience-link', 'experience'],
        ['projects-link',   'projects']
    ];

    bindings.forEach(binding => {
        let link = document.getElementById(binding[0]);
        let section = document.getElementById(binding[1]);
        let navbarHeight = document.querySelector('nav').offsetHeight;

        onRender(() => checkActive(link, section));
        document.addEventListener('scroll', () => checkActive(link, section));

        link.addEventListener('click', () => {
            let scrollOffset = section.getBoundingClientRect().top - navbarHeight;
            scrollBy({
                top: scrollOffset,
                behavior: 'smooth'
            });
        });
    });


    function checkActive(link, section) {
        let rect = section.getBoundingClientRect();
        let midHeight = window.innerHeight / 2;

        if (rect.top < midHeight && rect.bottom >= midHeight)
            link.classList.add('active');
        else
            link.classList.remove('active');
    }
}
