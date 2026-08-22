// =========================================================
// PRATYUSH PORTFOLIO
// MAIN.JS
// =========================================================

document.addEventListener("DOMContentLoaded", () => {


    // =====================================================
    // 01. HERO TYPING EFFECT
    // =====================================================

    const typingText =
        document.getElementById("typing-text");


    const typingWords = [
        "Full-Stack Developer",
        "AI/ML Developer",
        "Software Engineer",
        "Freelance Developer"
    ];


    let typingWordIndex = 0;

    let typingCharacterIndex = 0;

    let isDeleting = false;


    const TYPING_SPEED = 75;

    const DELETING_SPEED = 42;

    const WORD_PAUSE = 1300;

    const NEXT_WORD_PAUSE = 250;



    function runTypingEffect() {

        if (!typingText) {
            return;
        }


        const currentWord =
            typingWords[typingWordIndex];


        // ---------------------------------------------
        // TYPING
        // ---------------------------------------------

        if (!isDeleting) {

            typingCharacterIndex++;


            typingText.textContent =
                currentWord.substring(
                    0,
                    typingCharacterIndex
                );


            // Word completed
            if (
                typingCharacterIndex ===
                currentWord.length
            ) {

                isDeleting = true;


                setTimeout(
                    runTypingEffect,
                    WORD_PAUSE
                );


                return;
            }


            setTimeout(
                runTypingEffect,
                TYPING_SPEED
            );

        }


        // ---------------------------------------------
        // DELETING
        // ---------------------------------------------

        else {

            typingCharacterIndex--;


            typingText.textContent =
                currentWord.substring(
                    0,
                    typingCharacterIndex
                );


            // Word completely deleted
            if (typingCharacterIndex === 0) {

                isDeleting = false;


                typingWordIndex =
                    (
                        typingWordIndex + 1
                    ) %
                    typingWords.length;


                setTimeout(
                    runTypingEffect,
                    NEXT_WORD_PAUSE
                );


                return;
            }


            setTimeout(
                runTypingEffect,
                DELETING_SPEED
            );
        }
    }



    if (typingText) {

        runTypingEffect();

    }



    // =====================================================
    // 02. SERVICE CARD
    // 3D TILT + FOLLOWING PURPLE GLOW
    // =====================================================

    const serviceCards =
        document.querySelectorAll(
            ".service-card"
        );


    const supportsHover =
        window.matchMedia(
            "(hover: hover) and (pointer: fine)"
        ).matches;



    if (supportsHover) {

        serviceCards.forEach((card) => {

            card.addEventListener(
                "mousemove",
                (event) => {

                    const rect =
                        card.getBoundingClientRect();


                    const x =
                        event.clientX -
                        rect.left;


                    const y =
                        event.clientY -
                        rect.top;


                    // -----------------------------------------
                    // FOLLOWING GLOW POSITION
                    // -----------------------------------------

                    card.style.setProperty(
                        "--mouse-x",
                        `${x}px`
                    );


                    card.style.setProperty(
                        "--mouse-y",
                        `${y}px`
                    );


                    // -----------------------------------------
                    // CARD CENTER
                    // -----------------------------------------

                    const centerX =
                        rect.width / 2;


                    const centerY =
                        rect.height / 2;


                    // -----------------------------------------
                    // SUBTLE ROTATION
                    // -----------------------------------------

                    const rotateY =
                        (
                            (x - centerX) /
                            centerX
                        ) * 4;


                    const rotateX =
                        (
                            (centerY - y) /
                            centerY
                        ) * 4;


                    card.style.transform =
                        `
                        perspective(900px)
                        rotateX(${rotateX}deg)
                        rotateY(${rotateY}deg)
                        translateY(-8px)
                        `;

                }
            );



            card.addEventListener(
                "mouseleave",
                () => {

                    card.style.transform =
                        `
                        perspective(900px)
                        rotateX(0deg)
                        rotateY(0deg)
                        translateY(0)
                        `;

                }
            );

        });

    }



    // =====================================================
    // 03. SKILLS ELEMENTS
    // =====================================================

    const skillsOrbit =
        document.querySelector(
            ".skills-orbit"
        );


    const techNodes =
        Array.from(
            document.querySelectorAll(
                ".tech-node"
            )
        );


    const techDetails =
        document.querySelector(
            ".tech-details"
        );


    const detailIcon =
        document.getElementById(
            "detailIcon"
        );


    const detailName =
        document.getElementById(
            "detailName"
        );


    const detailCategory =
        document.getElementById(
            "detailCategory"
        );


    const detailDescription =
        document.getElementById(
            "detailDescription"
        );


    const detailLevel =
        document.getElementById(
            "detailLevel"
        );


    const proficiencyBar =
        document.getElementById(
            "proficiencyBar"
        );



    // =====================================================
    // 04. SKILLS SETTINGS
    // =====================================================

    let currentTechIndex = 0;


    let autoTechnologyTimer = null;


    const AUTO_CHANGE_TIME = 2800;



    // =====================================================
    // 05. CREATE THE FOUR ORBIT TRACKER DOTS
    //
    // NO MANUAL HTML REQUIRED.
    //
    // JS automatically creates:
    //
    // tracker-1
    // tracker-2
    // tracker-3
    // tracker-4
    // =====================================================

    function createOrbitTrackers() {

        if (!skillsOrbit) {
            return [];
        }


        // ---------------------------------------------
        // Remove the OLD single tracker if it exists
        // ---------------------------------------------

        const oldTracker =
            skillsOrbit.querySelector(
                ".orbit-tracker"
            );


        if (oldTracker) {

            oldTracker.remove();

        }


        // ---------------------------------------------
        // Check if four trackers already exist
        // ---------------------------------------------

        let existingTrackers =
            Array.from(
                skillsOrbit.querySelectorAll(
                    ".skill-tracker"
                )
            );


        if (existingTrackers.length === 4) {

            return existingTrackers;

        }


        // Remove incomplete / duplicate tracker elements
        existingTrackers.forEach(
            (tracker) => {

                tracker.remove();

            }
        );


        // ---------------------------------------------
        // Create four trackers
        // ---------------------------------------------

        const createdTrackers = [];


        for (
            let index = 1;
            index <= 4;
            index++
        ) {

            const tracker =
                document.createElement("div");


            tracker.className =
                `skill-tracker tracker-${index}`;


            tracker.setAttribute(
                "aria-hidden",
                "true"
            );


            const dot =
                document.createElement("span");


            tracker.appendChild(dot);


            skillsOrbit.appendChild(
                tracker
            );


            createdTrackers.push(
                tracker
            );
        }


        return createdTrackers;
    }



    const skillTrackers =
        createOrbitTrackers();



    // =====================================================
    // 06. TRACKER ROTATION STATE
    //
    // We keep an accumulated angle.
    // This makes the dots move CLOCKWISE instead of
    // suddenly travelling backwards.
    // =====================================================

    let trackerRotation = -90;



    function normalizeAngle(angle) {

        return (
            (angle % 360) + 360
        ) % 360;

    }



    function getClockwiseRotation(
        currentRotation,
        targetAngle
    ) {

        const currentNormalized =
            normalizeAngle(
                currentRotation
            );


        const targetNormalized =
            normalizeAngle(
                targetAngle
            );


        let difference =
            (
                targetNormalized -
                currentNormalized +
                360
            ) % 360;


        return (
            currentRotation +
            difference
        );
    }



    // =====================================================
    // 07. CALCULATE ACTIVE TECHNOLOGY ANGLE
    // =====================================================

    function calculateNodeAngle(node) {

        if (
            !skillsOrbit ||
            !node
        ) {

            return 0;
        }


        const orbitRect =
            skillsOrbit
                .getBoundingClientRect();


        const nodeRect =
            node
                .getBoundingClientRect();


        // ---------------------------------------------
        // ORBIT CENTER
        // ---------------------------------------------

        const orbitCenterX =
            orbitRect.left +
            orbitRect.width / 2;


        const orbitCenterY =
            orbitRect.top +
            orbitRect.height / 2;


        // ---------------------------------------------
        // TECHNOLOGY CENTER
        // ---------------------------------------------

        const nodeCenterX =
            nodeRect.left +
            nodeRect.width / 2;


        const nodeCenterY =
            nodeRect.top +
            nodeRect.height / 2;


        // ---------------------------------------------
        // ANGLE
        // ---------------------------------------------

        return (
            Math.atan2(
                nodeCenterY -
                orbitCenterY,

                nodeCenterX -
                orbitCenterX
            ) *
            180 /
            Math.PI
        );

    }



    // =====================================================
    // 08. MOVE FOUR DOTS TO ACTIVE TECHNOLOGY
    //
    // DOT 1
    // ↓
    // DOT 2
    // ↓
    // DOT 3
    // ↓
    // DOT 4
    //
    // CSS transition-delay creates the following effect.
    // =====================================================

    function moveTrackersTo(node) {

        if (
            !node ||
            !skillsOrbit ||
            skillTrackers.length === 0
        ) {

            return;
        }


        const targetAngle =
            calculateNodeAngle(node);


        // Always move clockwise
        trackerRotation =
            getClockwiseRotation(
                trackerRotation,
                targetAngle
            );


        skillTrackers.forEach(
            (tracker) => {

                tracker.style.transform =
                    `
                    translate(-50%, -50%)
                    rotate(${trackerRotation}deg)
                    `;

            }
        );

    }



    // =====================================================
    // 09. UPDATE DETAIL PANEL
    // =====================================================

    function updateTechnologyDetails(node) {

        if (!node) {
            return;
        }


        const name =
            node.dataset.name ||
            "Technology";


        const category =
            node.dataset.category ||
            "Development";


        const description =
            node.dataset.description ||
            "";


        const level =
            Math.max(
                0,
                Math.min(
                    100,
                    Number(
                        node.dataset.level
                    ) || 0
                )
            );


        const iconElement =
    node.querySelector(".tech-icon");

const iconImage =
    iconElement
        ? iconElement.querySelector("img")
        : null;


        // ---------------------------------------------
        // DETAIL CARD TRANSITION
        // ---------------------------------------------

        if (techDetails) {

            techDetails.classList.remove(
                "is-changing"
            );


            // Restart CSS animation
            void techDetails.offsetWidth;


            techDetails.classList.add(
                "is-changing"
            );

        }



        // ---------------------------------------------
        // UPDATE TEXT
        // ---------------------------------------------

      if (detailIcon) {

    detailIcon.innerHTML = "";

    if (iconImage) {

        const clonedImage =
            iconImage.cloneNode(true);

        clonedImage.removeAttribute("loading");

        detailIcon.appendChild(
            clonedImage
        );

    }

}


        if (detailName) {

            detailName.textContent =
                name;

        }


        if (detailCategory) {

            detailCategory.textContent =
                category;

        }


        if (detailDescription) {

            detailDescription.textContent =
                description;

        }


        if (detailLevel) {

            detailLevel.textContent =
                `${level}%`;

        }



        // ---------------------------------------------
        // PROGRESS BAR
        // ---------------------------------------------

        if (proficiencyBar) {

            proficiencyBar.style.width =
                "0%";


            requestAnimationFrame(() => {

                setTimeout(() => {

                    proficiencyBar
                        .style
                        .width =
                        `${level}%`;

                }, 80);

            });

        }

    }



    // =====================================================
    // 10. SELECT TECHNOLOGY
    // =====================================================

    function selectTechnology(node) {

        if (!node) {
            return;
        }


        // ---------------------------------------------
        // REMOVE ACTIVE FROM ALL
        // ---------------------------------------------

        techNodes.forEach(
            (technology) => {

                technology
                    .classList
                    .remove("active");

            }
        );


        // ---------------------------------------------
        // ACTIVATE CURRENT NODE
        // ---------------------------------------------

        node.classList.add(
            "active"
        );


        // ---------------------------------------------
        // UPDATE INDEX
        // ---------------------------------------------

        const selectedIndex =
            techNodes.indexOf(node);


        if (selectedIndex !== -1) {

            currentTechIndex =
                selectedIndex;

        }


        // ---------------------------------------------
        // MOVE FOUR DOTS
        // ---------------------------------------------

        moveTrackersTo(node);


        // ---------------------------------------------
        // CHANGE RIGHT CARD
        // ---------------------------------------------

        updateTechnologyDetails(
            node
        );

    }



    // =====================================================
    // 11. STOP AUTO TECHNOLOGY
    // =====================================================

    function stopAutoTechnology() {

        if (
            autoTechnologyTimer !==
            null
        ) {

            clearInterval(
                autoTechnologyTimer
            );


            autoTechnologyTimer =
                null;

        }

    }



    // =====================================================
    // 12. START AUTO TECHNOLOGY
    // =====================================================

    function startAutoTechnology() {

        if (
            techNodes.length === 0
        ) {

            return;
        }


        stopAutoTechnology();


        autoTechnologyTimer =
            setInterval(
                () => {

                    // ---------------------------------
                    // NEXT TECHNOLOGY
                    // ---------------------------------

                    currentTechIndex =
                        (
                            currentTechIndex +
                            1
                        ) %
                        techNodes.length;


                    selectTechnology(
                        techNodes[
                        currentTechIndex
                        ]
                    );

                },

                AUTO_CHANGE_TIME
            );

    }



    // =====================================================
    // 13. TECHNOLOGY CLICK SUPPORT
    // =====================================================

    techNodes.forEach(
        (node, index) => {

            node.addEventListener(
                "click",
                () => {

                    currentTechIndex =
                        index;


                    // Immediately select clicked technology
                    selectTechnology(
                        node
                    );


                    // Restart timer AFTER click
                    startAutoTechnology();

                }
            );

        }
    );



    // =====================================================
    // 14. KEYBOARD ACCESSIBILITY
    // =====================================================

    techNodes.forEach(
        (node, index) => {

            node.addEventListener(
                "keydown",
                (event) => {

                    let newIndex =
                        index;


                    if (
                        event.key ===
                        "ArrowRight"
                    ) {

                        newIndex =
                            (
                                index + 1
                            ) %
                            techNodes.length;

                    }


                    else if (
                        event.key ===
                        "ArrowLeft"
                    ) {

                        newIndex =
                            (
                                index -
                                1 +
                                techNodes.length
                            ) %
                            techNodes.length;

                    }


                    else {

                        return;

                    }


                    event.preventDefault();


                    const nextNode =
                        techNodes[
                        newIndex
                        ];


                    nextNode.focus();


                    selectTechnology(
                        nextNode
                    );


                    startAutoTechnology();

                }
            );

        }
    );



    // =====================================================
    // 15. INITIALIZE TECHNOLOGY SYSTEM
    // =====================================================

    function initializeTechnologySystem() {

        if (
            techNodes.length === 0
        ) {

            return;
        }


        // Use already-active HTML technology,
        // otherwise use first technology.

        const activeNode =
            document.querySelector(
                ".tech-node.active"
            );


        const initialNode =
            activeNode ||
            techNodes[0];


        currentTechIndex =
            techNodes.indexOf(
                initialNode
            );


        if (
            currentTechIndex < 0
        ) {

            currentTechIndex = 0;

        }


        // Wait until browser finishes layout
        requestAnimationFrame(
            () => {

                selectTechnology(
                    initialNode
                );


                startAutoTechnology();

            }
        );

    }



    initializeTechnologySystem();



    // =====================================================
    // 16. WINDOW RESIZE
    // KEEP DOTS ALIGNED WITH TECHNOLOGY
    // =====================================================

    let resizeTimer = null;


    window.addEventListener(
        "resize",
        () => {

            clearTimeout(
                resizeTimer
            );


            resizeTimer =
                setTimeout(
                    () => {

                        const activeNode =
                            document.querySelector(
                                ".tech-node.active"
                            );


                        if (activeNode) {

                            /*
                             * Recalculate location without
                             * changing active technology.
                             */

                            const targetAngle =
                                calculateNodeAngle(
                                    activeNode
                                );


                            trackerRotation =
                                targetAngle;


                            skillTrackers.forEach(
                                (tracker) => {

                                    tracker.style.transition =
                                        "none";


                                    tracker.style.transform =
                                        `
                                        translate(-50%, -50%)
                                        rotate(${targetAngle}deg)
                                        `;

                                }
                            );


                            // Restore transition
                            requestAnimationFrame(
                                () => {

                                    requestAnimationFrame(
                                        () => {

                                            skillTrackers.forEach(
                                                (
                                                    tracker
                                                ) => {

                                                    tracker.style.transition =
                                                        "";

                                                }
                                            );

                                        }
                                    );

                                }
                            );

                        }

                    },

                    160
                );

        },
        {
            passive: true
        }
    );



    // =====================================================
    // 17. PAGE VISIBILITY OPTIMIZATION
    //
    // Stop the interval when the browser tab is hidden.
    // Restart when user returns.
    // =====================================================

    document.addEventListener(
        "visibilitychange",
        () => {

            if (
                document.hidden
            ) {

                stopAutoTechnology();

            }

            else {

                startAutoTechnology();

            }

        }
    );



    // =====================================================
    // 18. SCROLL PROGRESS
    // =====================================================

    const scrollProgress =
        document.getElementById(
            "scroll-progress"
        );


    function updateScrollProgress() {

        if (!scrollProgress) {
            return;
        }


        const scrollTop =
            window.scrollY ||
            document.documentElement.scrollTop;


        const scrollHeight =
            document.documentElement
                .scrollHeight -
            window.innerHeight;


        const percentage =
            scrollHeight > 0
                ? (
                    scrollTop /
                    scrollHeight
                ) * 100
                : 0;


        scrollProgress.style.width =
            `${percentage}%`;

    }


    window.addEventListener(
        "scroll",
        updateScrollProgress,
        {
            passive: true
        }
    );


    updateScrollProgress();



    // =====================================================
    // 19. HEADER SCROLL STATE
    // =====================================================

    const header =
        document.getElementById(
            "header"
        );


    function updateHeader() {

        if (!header) {
            return;
        }


        header.classList.toggle(
            "scrolled",
            window.scrollY > 30
        );

    }


    window.addEventListener(
        "scroll",
        updateHeader,
        {
            passive: true
        }
    );


    updateHeader();



    // =====================================================
    // 20. MOBILE NAVIGATION
    // =====================================================

    const menuButton =
        document.getElementById(
            "menu-button"
        );


    const mobileMenu =
        document.getElementById(
            "mobile-menu"
        );


    const mobileLinks =
        document.querySelectorAll(
            ".mobile-nav a"
        );


    function closeMobileMenu() {

        if (
            !menuButton ||
            !mobileMenu
        ) {

            return;
        }


        menuButton.classList.remove(
            "active"
        );


        mobileMenu.classList.remove(
            "active"
        );


        menuButton.setAttribute(
            "aria-expanded",
            "false"
        );


        document.body.classList.remove(
            "menu-open"
        );

    }



    function toggleMobileMenu() {

        if (
            !menuButton ||
            !mobileMenu
        ) {

            return;
        }


        const opening =
            !mobileMenu.classList
                .contains("active");


        menuButton.classList.toggle(
            "active",
            opening
        );


        mobileMenu.classList.toggle(
            "active",
            opening
        );


        menuButton.setAttribute(
            "aria-expanded",
            String(opening)
        );


        document.body.classList.toggle(
            "menu-open",
            opening
        );

    }



    if (
        menuButton &&
        mobileMenu
    ) {

        menuButton.addEventListener(
            "click",
            toggleMobileMenu
        );

    }



    mobileLinks.forEach(
        (link) => {

            link.addEventListener(
                "click",
                closeMobileMenu
            );

        }
    );



    // =====================================================
    // 21. ACTIVE NAVIGATION LINK
    // =====================================================

    const navLinks =
        document.querySelectorAll(
            ".nav-link"
        );


    const navigationSections =
        Array.from(
            navLinks
        )
            .map(
                (link) => {

                    const selector =
                        link.getAttribute(
                            "href"
                        );


                    if (
                        !selector ||
                        !selector.startsWith(
                            "#"
                        )
                    ) {

                        return null;

                    }


                    return document
                        .querySelector(
                            selector
                        );

                }
            )
            .filter(Boolean);



    function updateActiveNavigation() {

        let currentSectionId =
            "home";


        const scrollPosition =
            window.scrollY +
            180;


        navigationSections.forEach(
            (section) => {

                if (
                    scrollPosition >=
                    section.offsetTop
                ) {

                    currentSectionId =
                        section.id;

                }

            }
        );


        navLinks.forEach(
            (link) => {

                const href =
                    link.getAttribute(
                        "href"
                    );


                link.classList.toggle(
                    "active",
                    href ===
                    `#${currentSectionId}`
                );

            }
        );

    }



    window.addEventListener(
        "scroll",
        updateActiveNavigation,
        {
            passive: true
        }
    );


    updateActiveNavigation();



    // =====================================================
    // 22. BACK TO TOP
    // =====================================================

    const backToTop =
        document.getElementById(
            "back-to-top"
        );


    function updateBackToTop() {

        if (!backToTop) {
            return;
        }


        const visible =
            window.scrollY > 600;


        backToTop.style.opacity =
            visible
                ? "1"
                : "0";


        backToTop.style.pointerEvents =
            visible
                ? "auto"
                : "none";


        backToTop.style.transform =
            visible
                ? "translateY(0)"
                : "translateY(12px)";

    }



    if (backToTop) {

        backToTop.addEventListener(
            "click",
            () => {

                window.scrollTo({
                    top: 0,
                    behavior: "smooth"
                });

            }
        );


        updateBackToTop();


        window.addEventListener(
            "scroll",
            updateBackToTop,
            {
                passive: true
            }
        );

    }



    // =====================================================
    // 23. ABOUT IMAGE POINTER LIGHT
    // =====================================================

    const aboutImageCard =
        document.querySelector(
            ".about-image-card"
        );


    if (
        aboutImageCard &&
        supportsHover
    ) {

        aboutImageCard.addEventListener(
            "mousemove",
            (event) => {

                const rect =
                    aboutImageCard
                        .getBoundingClientRect();


                const x =
                    event.clientX -
                    rect.left;


                const y =
                    event.clientY -
                    rect.top;


                aboutImageCard.style.setProperty(
                    "--about-x",
                    `${x}px`
                );


                aboutImageCard.style.setProperty(
                    "--about-y",
                    `${y}px`
                );

            }
        );

    }



    // =====================================================
    // 24. ESCAPE KEY
    // =====================================================

    document.addEventListener(
        "keydown",
        (event) => {

            if (
                event.key ===
                "Escape"
            ) {

                closeMobileMenu();

            }

        }
    );


});

// =========================================================
// PROJECT SHOWCASE
// AUTO + MANUAL + ARROWS
// =========================================================

document.addEventListener("DOMContentLoaded", () => {

    // =====================================================
    // PROJECT DATA
    // =====================================================

    const projects = [

        {
            number: "01",

            title: "Grace Enterprises",

            category: "Service Business Website",

            domain: "graceenterprises.online",

            image:
                "images/projects/grace-enterprises.png",

            live:
                "https://graceenterprises.online/",

            github:
                "https://github.com/pratyushcse/Grace_Enterprises",

            description:
                "A modern service business website designed to present professional services through a clean, responsive and conversion-focused digital experience.",

            technologies: [
                "HTML",
                "CSS",
                "JavaScript",
                "Responsive"
            ]
        },


        {
            number: "02",

            title: "AMJ Enterprises",

            category:
                "LED Wall & Event Technology",

            domain:
                "https://amjenterprises.in",

            image:
                "images/projects/amj-enterprises.png",

            live:
                "https://amjenterprises.in/",

            github:
                "https://github.com/pratyushcse/AMJ_Enterprises",

            description:
                "A premium event technology website created to showcase LED wall rentals, event solutions, installations and professional display services.",

            technologies: [
                "HTML",
                "CSS",
                "JavaScript",
                "Responsive"
            ]
        },


        {
            number: "03",

            title: "Adithya Beach Villa",

            category:
                "Hospitality Website",

            domain:
                "adithyabeachvilla.in",

            image:
                "images/projects/adithya-beach-villa.png",

            live:
                "https://adithyabeachvilla.in/",

            github:
                "https://github.com/pratyushcse/Adithya_Beach_Villa",

            description:
                "A premium hospitality website designed to showcase the beachfront villa, rooms, amenities, gallery and booking experience.",

            technologies: [
                "HTML",
                "CSS",
                "JavaScript",
                "Responsive"
            ]
        }

    ];


    // =====================================================
    // ELEMENTS
    // =====================================================

    const projectShowcase =
        document.getElementById(
            "project-showcase"
        );


    const projectMainImage =
        document.getElementById(
            "projectMainImage"
        );


    const projectDomain =
        document.getElementById(
            "projectDomain"
        );


    const projectBigNumber =
        document.getElementById(
            "projectBigNumber"
        );


    const projectTitle =
        document.getElementById(
            "projectTitle"
        );


    const projectCategory =
        document.getElementById(
            "projectCategory"
        );


    const projectDescription =
        document.getElementById(
            "projectDescription"
        );


    const projectTechStack =
        document.getElementById(
            "projectTechStack"
        );


    const projectLiveLink =
        document.getElementById(
            "projectLiveLink"
        );


    const projectGithubLink =
        document.getElementById(
            "projectGithubLink"
        );


    const projectBrowserLink =
        document.getElementById(
            "projectBrowserLink"
        );


    const projectFloatingLink =
        document.getElementById(
            "projectFloatingLink"
        );


    const projectProgressNumber =
        document.getElementById(
            "projectProgressNumber"
        );


    const projectProgressBar =
        document.getElementById(
            "projectProgressBar"
        );


    const projectPrev =
        document.getElementById(
            "projectPrev"
        );


    const projectNext =
        document.getElementById(
            "projectNext"
        );


    const projectSelectors =
        Array.from(
            document.querySelectorAll(
                ".project-selector"
            )
        );


    // =====================================================
    // SETTINGS
    // =====================================================

    let currentProjectIndex = 0;

    let projectAutoTimer = null;


    const PROJECT_AUTO_TIME = 5000;


    // =====================================================
    // UPDATE PROJECT
    // =====================================================

    function updateProject(index) {

        if (
            index < 0
        ) {
            index =
                projects.length - 1;
        }


        if (
            index >= projects.length
        ) {
            index = 0;
        }


        currentProjectIndex = index;


        const project =
            projects[index];


        // =================================================
        // ACTIVE SELECTOR
        // =================================================

        projectSelectors.forEach(
            (selector, selectorIndex) => {

                selector.classList.toggle(
                    "active",
                    selectorIndex === index
                );

            }
        );


        // =================================================
        // CHANGE ANIMATION
        // =================================================

        if (projectShowcase) {

            projectShowcase
                .classList
                .remove(
                    "project-changing"
                );


            void projectShowcase.offsetWidth;


            projectShowcase
                .classList
                .add(
                    "project-changing"
                );

        }


        // =================================================
        // IMAGE
        // =================================================

        if (projectMainImage) {

            projectMainImage.style.opacity =
                "0";


            setTimeout(() => {

                projectMainImage.src =
                    project.image;


                projectMainImage.alt =
                    `${project.title} website project`;


                projectMainImage.style.opacity =
                    "1";

            }, 180);

        }


        // =================================================
        // TEXT
        // =================================================

        if (projectDomain) {

            projectDomain.textContent =
                project.domain;

        }


        if (projectBigNumber) {

            projectBigNumber.textContent =
                project.number;

        }


        if (projectTitle) {

            projectTitle.textContent =
                project.title;

        }


        if (projectCategory) {

            projectCategory.textContent =
                project.category;

        }


        if (projectDescription) {

            projectDescription.textContent =
                project.description;

        }


        // =================================================
        // TECHNOLOGIES
        // =================================================

        if (projectTechStack) {

            projectTechStack.innerHTML =
                "";


            project.technologies.forEach(
                (technology) => {

                    const span =
                        document.createElement(
                            "span"
                        );


                    span.textContent =
                        technology;


                    projectTechStack
                        .appendChild(
                            span
                        );

                }
            );

        }


        // =================================================
        // LINKS
        // =================================================

        if (projectLiveLink) {

            projectLiveLink.href =
                project.live;

        }


        if (projectBrowserLink) {

            projectBrowserLink.href =
                project.live;

        }


        if (projectFloatingLink) {

            projectFloatingLink.href =
                project.live;

        }


        if (projectGithubLink) {

            projectGithubLink.href =
                project.github;

        }


        // =================================================
        // PROGRESS NUMBER
        // =================================================

        if (projectProgressNumber) {

            projectProgressNumber.textContent =
                project.number;

        }


        // =================================================
        // PROGRESS BAR
        // =================================================

        if (projectProgressBar) {

            const progress =
                (
                    (
                        index + 1
                    ) /
                    projects.length
                ) *
                100;


            projectProgressBar.style.width =
                `${progress}%`;

        }

    }


    // =====================================================
    // NEXT PROJECT
    // =====================================================

    function nextProject() {

        const nextIndex =
            (
                currentProjectIndex + 1
            ) %
            projects.length;


        updateProject(
            nextIndex
        );

    }


    // =====================================================
    // PREVIOUS PROJECT
    // =====================================================

    function previousProject() {

        let previousIndex =
            currentProjectIndex - 1;


        if (
            previousIndex < 0
        ) {

            previousIndex =
                projects.length - 1;

        }


        updateProject(
            previousIndex
        );

    }


    // =====================================================
    // AUTO PLAY
    // =====================================================

    function startProjectAutoPlay() {

        stopProjectAutoPlay();


        projectAutoTimer =
            setInterval(
                () => {

                    nextProject();

                },
                PROJECT_AUTO_TIME
            );

    }


    // =====================================================
    // STOP AUTO PLAY
    // =====================================================

    function stopProjectAutoPlay() {

        if (
            projectAutoTimer
        ) {

            clearInterval(
                projectAutoTimer
            );


            projectAutoTimer =
                null;

        }

    }


    // =====================================================
    // CLICK PROJECT 01 / 02 / 03
    // =====================================================

    projectSelectors.forEach(
        (selector, index) => {

            selector.addEventListener(
                "click",
                () => {

                    updateProject(
                        index
                    );


                    startProjectAutoPlay();

                }
            );

        }
    );


    // =====================================================
    // NEXT ARROW
    // =====================================================

    if (projectNext) {

        projectNext.addEventListener(
            "click",
            () => {

                nextProject();


                startProjectAutoPlay();

            }
        );

    }


    // =====================================================
    // PREVIOUS ARROW
    // =====================================================

    if (projectPrev) {

        projectPrev.addEventListener(
            "click",
            () => {

                previousProject();


                startProjectAutoPlay();

            }
        );

    }


    // =====================================================
    // KEYBOARD SUPPORT
    // =====================================================

    document.addEventListener(
        "keydown",
        (event) => {

            if (
                event.key ===
                "ArrowRight"
            ) {

                nextProject();

                startProjectAutoPlay();

            }


            if (
                event.key ===
                "ArrowLeft"
            ) {

                previousProject();

                startProjectAutoPlay();

            }

        }
    );


    // =====================================================
    // PROJECT SCREEN MOUSE GLOW
    // =====================================================

    const projectScreen =
        document.querySelector(
            ".project-browser-screen"
        );


    if (projectScreen) {

        projectScreen.addEventListener(
            "mousemove",
            (event) => {

                const rect =
                    projectScreen
                        .getBoundingClientRect();


                const x =
                    event.clientX -
                    rect.left;


                const y =
                    event.clientY -
                    rect.top;


                projectScreen.style.setProperty(
                    "--project-x",
                    `${x}px`
                );


                projectScreen.style.setProperty(
                    "--project-y",
                    `${y}px`
                );

            }
        );

    }


    // =====================================================
    // PAUSE WHEN TAB HIDDEN
    // =====================================================

    document.addEventListener(
        "visibilitychange",
        () => {

            if (
                document.hidden
            ) {

                stopProjectAutoPlay();

            }

            else {

                startProjectAutoPlay();

            }

        }
    );


    // =====================================================
    // INITIALIZE
    // =====================================================

    updateProject(0);

    startProjectAutoPlay();

});

// =========================================================
// MY PROCESS
// AUTO + MANUAL + TERMINAL TYPING
// =========================================================

document.addEventListener("DOMContentLoaded", () => {

    // =====================================================
    // PROCESS DATA
    // =====================================================

    const processData = [

        {
            number: "01",
            title: "DISCOVER",
            description:
                "We start by understanding your business, audience and goals to create a strong foundation for the right solution.",
            activity: "Strategy & Research",
            progress: 25,
            lines: [
                "analyzing project requirements...",
                "defining objectives...",
                "researching user experience...",
                "technical planning..."
            ],
            success: "strategy initialized"
        },

        {
            number: "02",
            title: "DESIGN",
            description:
                "I transform the project strategy into a clear interface structure with thoughtful UI/UX, responsive layouts and interactions.",
            activity: "UI/UX & Interface Planning",
            progress: 50,
            lines: [
                "creating information architecture...",
                "planning responsive layouts...",
                "building visual hierarchy...",
                "designing interactions..."
            ],
            success: "design system ready"
        },

        {
            number: "03",
            title: "DEVELOP",
            description:
                "The design is converted into clean, maintainable code with frontend, backend and intelligent features working together.",
            activity: "Development & Integration",
            progress: 75,
            lines: [
                "initializing project structure...",
                "building frontend components...",
                "connecting backend services...",
                "integrating application features..."
            ],
            success: "development completed"
        },

        {
            number: "04",
            title: "DELIVER",
            description:
                "The final product is tested, optimized and prepared for production with performance, responsiveness and reliability in mind.",
            activity: "Testing & Launch",
            progress: 100,
            lines: [
                "running quality checks...",
                "optimizing performance...",
                "testing responsive experience...",
                "deploying production build..."
            ],
            success: "project successfully launched"
        }

    ];


    // =====================================================
    // ELEMENTS
    // =====================================================

    const processSteps =
        Array.from(
            document.querySelectorAll(
                ".process-step"
            )
        );

    const processNavItems =
        Array.from(
            document.querySelectorAll(
                ".process-nav-item"
            )
        );

    const processTyping =
        document.getElementById(
            "processTyping"
        );

    const currentProcessNumber =
        document.getElementById(
            "currentProcessNumber"
        );

    const currentProcessTitle =
        document.getElementById(
            "currentProcessTitle"
        );

    const currentProcessDescription =
        document.getElementById(
            "currentProcessDescription"
        );

    const currentProcessActivity =
        document.getElementById(
            "currentProcessActivity"
        );

    const processPercentage =
        document.getElementById(
            "processPercentage"
        );

    const processPercentageBar =
        document.getElementById(
            "processPercentageBar"
        );

    const processLineProgress =
        document.getElementById(
            "processLineProgress"
        );

    const processMiniProgress =
        document.getElementById(
            "processMiniProgress"
        );


    // =====================================================
    // SETTINGS
    // =====================================================

    let currentProcessIndex = 0;

    let typingCancelled = false;

    let processAutoTimer = null;


    const TYPE_SPEED = 28;

    const LINE_DELAY = 320;

    const SUCCESS_DELAY = 900;

    const STEP_HOLD_TIME = 1800;



    // =====================================================
    // WAIT
    // =====================================================

    function wait(ms) {

        return new Promise(
            resolve =>
                setTimeout(resolve, ms)
        );

    }



    // =====================================================
    // TYPE ONE LINE
    // =====================================================

    async function typeLine(
        text,
        success = false
    ) {

        if (!processTyping) return;


        const line =
            document.createElement("div");


        line.className =
            "terminal-line";


        const prefix =
            document.createElement("span");


        prefix.className =
            success
                ? "terminal-prefix terminal-success"
                : "terminal-prefix";


        prefix.textContent =
            success ? "✓" : ">";


        const content =
            document.createElement("span");


        if (success) {

            content.className =
                "terminal-success";

        }


        line.appendChild(prefix);

        line.appendChild(content);

        processTyping.appendChild(line);


        for (
            let i = 0;
            i < text.length;
            i++
        ) {

            if (typingCancelled) {
                return;
            }


            content.textContent +=
                text.charAt(i);


            await wait(TYPE_SPEED);

        }

    }



    // =====================================================
    // RUN TERMINAL FOR CURRENT STEP
    // =====================================================

    async function runProcessTerminal(index) {

        if (!processTyping) return;


        typingCancelled = true;

        await wait(20);

        typingCancelled = false;


        processTyping.innerHTML = "";


        const process =
            processData[index];


        for (
            let i = 0;
            i < process.lines.length;
            i++
        ) {

            if (typingCancelled) {
                return;
            }


            await typeLine(
                process.lines[i]
            );


            await wait(
                LINE_DELAY
            );

        }


        if (typingCancelled) {
            return;
        }


        await typeLine(
            process.success,
            true
        );


        await wait(
            SUCCESS_DELAY
        );

    }



    // =====================================================
    // SELECT PROCESS
    // =====================================================

    function selectProcess(index) {

        if (
            index < 0
        ) {

            index =
                processData.length - 1;

        }


        if (
            index >=
            processData.length
        ) {

            index = 0;

        }


        currentProcessIndex =
            index;


        const process =
            processData[index];


        // ACTIVE TOP STEP

        processSteps.forEach(
            (step, stepIndex) => {

                step.classList.toggle(
                    "active",
                    stepIndex === index
                );

            }
        );


        // ACTIVE SIDEBAR STEP

        processNavItems.forEach(
            (item, itemIndex) => {

                item.classList.toggle(
                    "active",
                    itemIndex === index
                );

            }
        );


        // RIGHT CARD

        if (currentProcessNumber) {

            currentProcessNumber.textContent =
                process.number;

        }


        if (currentProcessTitle) {

            currentProcessTitle.textContent =
                process.title;

        }


        if (currentProcessDescription) {

            currentProcessDescription.textContent =
                process.description;

        }


        if (currentProcessActivity) {

            currentProcessActivity.textContent =
                process.activity;

        }


        if (processPercentage) {

            processPercentage.textContent =
                `${process.progress}%`;

        }


        if (processPercentageBar) {

            processPercentageBar.style.width =
                `${process.progress}%`;

        }


        if (processLineProgress) {

            processLineProgress.style.width =
                `${process.progress}%`;

        }


        if (processMiniProgress) {

            processMiniProgress.style.width =
                `${process.progress}%`;

        }


        // RESTART TERMINAL

        runProcessTerminal(index);

    }



    // =====================================================
    // NEXT PROCESS
    // =====================================================

    function nextProcess() {

        currentProcessIndex =
            (
                currentProcessIndex + 1
            ) %
            processData.length;


        selectProcess(
            currentProcessIndex
        );

    }



    // =====================================================
    // STOP AUTO
    // =====================================================

    function stopProcessAuto() {

        if (processAutoTimer) {

            clearInterval(
                processAutoTimer
            );


            processAutoTimer =
                null;

        }

    }



    // =====================================================
    // START AUTO
    // =====================================================

    function startProcessAuto() {

        stopProcessAuto();


        processAutoTimer =
            setInterval(
                () => {

                    nextProcess();

                },

                7200
            );

    }



    // =====================================================
    // TOP STEP CLICK
    // =====================================================

    processSteps.forEach(
        (step, index) => {

            step.addEventListener(
                "click",
                () => {

                    selectProcess(index);

                    startProcessAuto();

                }
            );

        }
    );



    // =====================================================
    // SIDEBAR CLICK
    // =====================================================

    processNavItems.forEach(
        (item, index) => {

            item.addEventListener(
                "click",
                () => {

                    selectProcess(index);

                    startProcessAuto();

                }
            );

        }
    );



    // =====================================================
    // VISIBILITY
    // =====================================================

    document.addEventListener(
        "visibilitychange",
        () => {

            if (document.hidden) {

                stopProcessAuto();

            }

            else {

                startProcessAuto();

            }

        }
    );



    // =====================================================
    // INITIAL START
    // =====================================================

    if (
        processData.length > 0
    ) {

        selectProcess(0);

        startProcessAuto();

    }

});


const contactForm = document.getElementById("contactForm");

if (contactForm) {
    contactForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const submitButton =
            contactForm.querySelector(".contact-submit");

        const submitText =
            submitButton.querySelector("span");

        const originalText =
            submitText.textContent;

        submitButton.disabled = true;
        submitText.textContent = "Sending...";

        const formData =
            new FormData(contactForm);

        formData.append(
            "_subject",
            "New Project Enquiry - Pratyush Portfolio"
        );

        formData.append(
            "_captcha",
            "false"
        );

        formData.append(
            "_template",
            "table"
        );

        try {
            const response = await fetch(
                "https://formsubmit.co/ajax/pratyushpoojary974@gmail.com",
                {
                    method: "POST",
                    headers: {
                        Accept: "application/json"
                    },
                    body: formData
                }
            );

            const result = await response.json();

            if (!response.ok) {
                throw new Error("Message failed");
            }

            submitText.textContent =
                "Message Sent ✓";

            contactForm.reset();

            setTimeout(() => {
                submitText.textContent =
                    originalText;

                submitButton.disabled =
                    false;
            }, 3000);

        } catch (error) {
            console.error(error);

            submitText.textContent =
                "Failed — Try Again";

            setTimeout(() => {
                submitText.textContent =
                    originalText;

                submitButton.disabled =
                    false;
            }, 3000);
        }
    });
}