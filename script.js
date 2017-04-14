document.addEventListener("DOMContentLoaded", main);

let renderCallbacks = [];


function main() {
    initNavbar();
    initInfoPane();
    initProjectCards();

    (function render() {
        renderCallbacks.forEach(fn => fn());
        requestAnimationFrame(render);
    })();

    document.addEventListener("wheel", ev => {
        if (document.querySelector('.expanded-project.active'))
            ev.preventDefault();
    });

    document.addEventListener("keydown", ev => {
        let scrollKeys = [33,34,35,36,37,38,39,40];
        if (document.querySelector('.expanded-project.active') && scrollKeys.includes(ev.which))
            ev.preventDefault();
    })
}


function initNavbar() {
    bindNavbarButtons();

    let hero = document.getElementById('hero');
    let nameNav = document.getElementById('name-nav');
    let contactNav = document.getElementById('contact-info-nav');
    let navbar = document.querySelector('nav');

    onRender(updatePos);
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
    document.addEventListener('scroll', callback);
}


function bindNavbarButtons() {
    let bindings = [
        ['info-link',       'info'],
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
            let sectionTop = section.getBoundingClientRect().top;
            let marginTop = getComputedStyle(section).marginTop;
            let scrollOffset = section.getBoundingClientRect().top - navbarHeight - parseInt(marginTop);
            scrollBy({
                top: scrollOffset,
                behavior: 'smooth'
            });
        });
    });
}

function checkActive(link, section) {
    let rect = section.getBoundingClientRect();
    let marginTop = parseInt(getComputedStyle(section).marginTop);
    let midHeight = window.innerHeight / 2;

    if (rect.top - marginTop < midHeight && rect.bottom >= midHeight)
        link.classList.add('active');
    else
        link.classList.remove('active');
}


function initInfoPane() {
    let bindings = [
        ['general-info-link',   'general-info'],
        ['goal-info-link',      'goal-info'],
        ['elective-info-link',  'elective-info'],
        ['award-info-link',     'award-info'],
        ['oss-info-link',       'oss-info']
    ];

    bindings.forEach(binding => {
        let link = document.getElementById(binding[0]);
        let content = document.getElementById(binding[1]);

        link.addEventListener('click', () => {
            document.querySelector('.info-link.active').classList.remove('active');
            link.classList.add('active');
            document.querySelector('.info-content.active').classList.remove('active');
            content.classList.add('active');
        });
    });
}


function initProjectCards() {

    let bindings = [
        ['fluffify-card', 'fluffify'],
        ['stalkr-card',   'stalkr'],
        ['reds-card',     'reds'],
        ['taa-card',      'taa'],
        ['pantri-card',   'pantri'],
        ['nimbus-card',   'nimbus'],
        ['beacon-card',   'beacon'],
        ['alisa-card',    'alisa'],
        ['socal-card',    'socal']
    ];

    bindings.forEach(binding => {
        let card = document.getElementById(binding[0]);
        let desc = document.getElementById(binding[1]);

        card.addEventListener('click', () => expandCard(card, desc));
        desc.addEventListener('click', ev => ev.stopPropagation());
        onRender(() => updateDescTransform(card, desc));
    });

    let projWrap = document.getElementById('expanded-project-wrap');
    projWrap.addEventListener('click', collapseCard);

}


function expandCard(card, desc) {
    let projWrap = document.getElementById('expanded-project-wrap');

    projWrap.classList.add('active');

    desc.classList.add('expanding');
    desc.classList.add('active');
    desc.style.transform = "scale(1)";

    desc.addEventListener('transitionend', () => desc.classList.remove('expanding'), {once: true});
}


function collapseCard() {
    let projWrap = document.getElementById('expanded-project-wrap');
    let desc = document.querySelector('.expanded-project.active');

    projWrap.classList.remove('active');

    desc.classList.add('contracting');
    desc.classList.remove('active');
    desc.addEventListener('transitionend', () => desc.classList.remove('contracting'), {once: true});
}


function updateDescTransform(card, desc) {
    if (desc.classList.contains('active'))
        return;

    let cardStyle = getComputedStyle(card);
    let descStyle = getComputedStyle(desc);

    let cardWidth = parseFloat(cardStyle.width);
    let cardHeight = parseFloat(cardStyle.height);

    // First scale the description so that we have a centered card sized description in the middle
    let scaleX = cardWidth / parseFloat(descStyle.width);
    let scaleY = cardHeight / parseFloat(descStyle.height);

    // Do the math to translate after scaling (Because actually changing the position kills perf)
    let descLeft = 0.5 * (window.innerWidth - cardWidth);
    let descTop = 0.5 * (window.innerHeight - cardHeight)

    let cardRect = card.getBoundingClientRect();
    let offsetX = cardRect.left - descLeft;
    let offsetY = cardRect.top - descTop;

    desc.style.transform = `translate(${offsetX}px, ${offsetY}px) scale(${scaleX}, ${scaleY})`;

}
