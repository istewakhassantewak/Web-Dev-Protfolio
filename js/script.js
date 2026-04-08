(() => {
    const qs = (selector, scope = document) => scope.querySelector(selector);
    const qsa = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));

    const form = qs('.contact');
    const scrollToTopBtn = qs('#scrollToTop');
    const sections = qsa('main section');
    const navLinks = qsa('nav a');
    const bannerDesc = qs('.banner-description');
    const downloadLink = qs('a[href$=".pdf"]');

    const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

    const createProgressBar = () => {
        const bar = document.createElement('div');
        bar.id = 'scrollProgress';
        document.body.appendChild(bar);
        return bar;
    };

    const progressBar = createProgressBar();

    const updateProgressBar = () => {
        const scrollTop = window.scrollY;
        const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = documentHeight > 0 ? (scrollTop / documentHeight) * 100 : 0;
        progressBar.style.width = `${progress}%`;
    };

    const setActiveNav = () => {
        let currentId = '';
        sections.forEach(section => {
            const top = section.offsetTop - 80;
            if (window.scrollY >= top) {
                currentId = section.id;
            }
        });

        navLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === `#${currentId}`);
        });
    };

    const typeWriter = async (element, text, speed = 30) => {
        element.textContent = '';
        for (let i = 0; i < text.length; i += 1) {
            element.textContent += text.charAt(i);
            await wait(speed);
        }
    };

    const revealOnScroll = () => {
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    revealObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

        qsa('section, .footercolumn').forEach(element => {
            element.classList.add('hidden-section');
            revealObserver.observe(element);
        });
    };

    const handleFormSubmit = async event => {
        event.preventDefault();
        const submitBtn = qs('input[type="submit"]', form);
        const originalText = submitBtn.value;
        const name = qs('#name').value.trim();
        const email = qs('#email').value.trim();
        const message = qs('#message').value.trim();

        if (!name || !email || !message) {
            alert('Please fill in all fields before sending.');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert('Please enter a valid email address.');
            return;
        }

        submitBtn.value = 'Sending...';
        submitBtn.disabled = true;
        await wait(900);
        alert('Thanks! Your message has been sent successfully.');
        form.reset();
        submitBtn.value = originalText;
        submitBtn.disabled = false;
    };

    const initEvents = () => {
        form.addEventListener('submit', handleFormSubmit);

        const contactBtn = qs('#contactBtn');
        if (contactBtn) {
            contactBtn.addEventListener('click', event => {
                event.preventDefault();
                qs('#contact').scrollIntoView({ behavior: 'smooth' });
            });
        }

        if (downloadLink) {
            downloadLink.addEventListener('click', () => {
                downloadLink.textContent = 'Downloading...';
                setTimeout(() => {
                    downloadLink.textContent = 'Download CV';
                }, 1000);
            });
        }

        scrollToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });

        window.addEventListener('scroll', () => {
            scrollToTopBtn.style.display = window.scrollY > 300 ? 'block' : 'none';
            updateProgressBar();
            setActiveNav();
        });

        navLinks.forEach(link => {
            link.addEventListener('mouseenter', () => {
                link.style.transform = 'scale(1.05)';
            });
            link.addEventListener('mouseleave', () => {
                link.style.transform = 'scale(1)';
            });
        });
    };

    document.addEventListener('DOMContentLoaded', async () => {
        if (bannerDesc) {
            await typeWriter(bannerDesc, bannerDesc.textContent, 30);
        }
        revealOnScroll();
        updateProgressBar();
        setActiveNav();
        initEvents();
    });
})();
