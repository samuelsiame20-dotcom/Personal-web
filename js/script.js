/* =========================================================
   ICT251 Activity 3 - Samuel Siame
   Four JavaScript features:
     1. Contact form validation and preview (compulsory)
     2. Project search and filter
     3. Gallery viewer (Previous / Next)
     4. Light / dark theme switch
   Extras: mobile menu button and highlighting the section on screen.
   The script is loaded with "defer", so the HTML is ready when it runs.
   ========================================================= */

"use strict";

// Lets the CSS know JavaScript is running (used for the collapsible mobile menu).
document.documentElement.classList.add("has-js");

/* ---------- 1. Contact form validation and preview ---------- */

// Simple email pattern: something@something.domain (no spaces)
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// Shows (or clears) the error message under one field.
function setFieldError(field, message) {
    const errorBox = document.getElementById(field.id + "-error");
    errorBox.textContent = message;
    field.setAttribute("aria-invalid", message ? "true" : "false");
}

// Checks name, email and message. Returns a list of problems (empty list = valid).
function validateContactForm(nameField, emailField, messageField) {
    const problems = [];
    const name = nameField.value.trim();
    const email = emailField.value.trim();
    const message = messageField.value.trim();

    if (name === "") {
        setFieldError(nameField, "Please enter your name (spaces only are not accepted).");
        problems.push(nameField);
    } else {
        setFieldError(nameField, "");
    }

    if (email === "") {
        setFieldError(emailField, "Please enter your email address.");
        problems.push(emailField);
    } else if (!EMAIL_PATTERN.test(email)) {
        setFieldError(emailField, "Please enter a valid email, for example name@example.com.");
        problems.push(emailField);
    } else {
        setFieldError(emailField, "");
    }

    if (message === "") {
        setFieldError(messageField, "Please enter a message (spaces only are not accepted).");
        problems.push(messageField);
    } else {
        setFieldError(messageField, "");
    }

    return problems;
}

// Fills the on-page preview. textContent is used so typed text is never run as HTML.
function showPreview(values) {
    document.getElementById("preview-name").textContent = values.name;
    document.getElementById("preview-email").textContent = values.email;
    document.getElementById("preview-topic").textContent = values.topic;
    document.getElementById("preview-message").textContent = values.message;
    document.getElementById("preview").hidden = false;
}

function setupContactForm() {
    const form = document.getElementById("contact-form");
    if (!form) return;

    const nameField = document.getElementById("name");
    const emailField = document.getElementById("email");
    const topicField = document.getElementById("topic");
    const messageField = document.getElementById("message");
    const status = document.getElementById("form-status");
    const preview = document.getElementById("preview");

    form.addEventListener("submit", function (event) {
        event.preventDefault(); // keep everything in the browser, no page reload

        const problems = validateContactForm(nameField, emailField, messageField);

        if (problems.length > 0) {
            preview.hidden = true;
            status.className = "form-status is-error";
            status.textContent = "Please fix the " + problems.length +
                (problems.length === 1 ? " field" : " fields") + " marked below.";
            problems[0].focus();
            return;
        }

        showPreview({
            name: nameField.value.trim(),
            email: emailField.value.trim(),
            topic: topicField.value,
            message: messageField.value.trim()
        });
        status.className = "form-status is-success";
        status.textContent = "Your input was validated in the browser. Nothing was sent - this is a demonstration only.";
    });
}

/* ---------- 2. Project search and filter ---------- */

function setupProjectFilter() {
    const grid = document.getElementById("project-grid");
    if (!grid) return;

    const cards = Array.from(grid.querySelectorAll(".project-card"));
    const buttons = Array.from(document.querySelectorAll(".filter-btn"));
    const searchBox = document.getElementById("project-search");
    const resetButton = document.getElementById("filter-reset");
    const status = document.getElementById("filter-status");
    let activeTag = "all";

    // Shows only cards that match BOTH the chosen tag and the search text.
    function applyFilter() {
        const query = searchBox.value.trim().toLowerCase();
        let shown = 0;

        cards.forEach(function (card) {
            const tags = card.dataset.tags.split(" ");
            const matchesTag = activeTag === "all" || tags.includes(activeTag);
            const matchesText = query === "" || card.textContent.toLowerCase().includes(query);
            const visible = matchesTag && matchesText;
            card.hidden = !visible;
            if (visible) shown++;
        });

        if (shown === 0) {
            status.textContent = "No projects match your search. Try another word or press Reset.";
        } else if (activeTag === "all" && query === "") {
            status.textContent = "Showing all " + cards.length + " projects.";
        } else {
            status.textContent = "Showing " + shown + " of " + cards.length + " projects.";
        }
    }

    // Highlights the chosen filter button.
    function setActiveTag(tag) {
        activeTag = tag;
        buttons.forEach(function (btn) {
            const isActive = btn.dataset.filter === tag;
            btn.classList.toggle("is-active", isActive);
            btn.setAttribute("aria-pressed", String(isActive));
        });
        applyFilter();
    }

    buttons.forEach(function (btn) {
        btn.addEventListener("click", function () {
            setActiveTag(btn.dataset.filter);
        });
    });

    searchBox.addEventListener("input", applyFilter);

    resetButton.addEventListener("click", function () {
        searchBox.value = "";
        setActiveTag("all");
        searchBox.focus();
    });

    applyFilter();
}

/* ---------- 3. Gallery viewer ---------- */

function setupGalleryViewer() {
    const viewer = document.getElementById("viewer");
    const thumbs = document.getElementById("thumbs");
    if (!viewer || !thumbs) return;

    const figures = Array.from(thumbs.querySelectorAll("figure"));
    // Build an array of photos from the existing HTML figures
    const photos = figures.map(function (figure) {
        const img = figure.querySelector("img");
        return {
            src: img.getAttribute("src"),
            alt: img.getAttribute("alt"),
            width: img.getAttribute("width"),
            height: img.getAttribute("height"),
            caption: figure.querySelector("figcaption").textContent
        };
    });

    const viewerImg = document.getElementById("viewer-img");
    const viewerCaption = document.getElementById("viewer-caption");
    const counter = document.getElementById("photo-counter");
    const prevButton = document.getElementById("prev-photo");
    const nextButton = document.getElementById("next-photo");
    let current = 0;

    // Displays photo number "index" and updates buttons, counter and thumbnail highlight.
    function showPhoto(index) {
        if (index < 0 || index >= photos.length) return; // ignore out-of-range requests
        current = index;
        viewerImg.src = photos[index].src;
        viewerImg.alt = photos[index].alt;
        viewerImg.width = photos[index].width;     // matching size stops the page jumping
        viewerImg.height = photos[index].height;
        viewerCaption.textContent = photos[index].caption;
        counter.textContent = "Photo " + (index + 1) + " of " + photos.length;

        prevButton.disabled = index === 0;                    // first photo
        nextButton.disabled = index === photos.length - 1;    // last photo

        figures.forEach(function (figure, i) {
            figure.classList.toggle("is-current", i === index);
            figure.querySelector(".thumb-btn").setAttribute("aria-current", i === index ? "true" : "false");
        });
    }

    // Wrap each thumbnail image in a button so it works with mouse and keyboard.
    figures.forEach(function (figure, i) {
        const img = figure.querySelector("img");
        const button = document.createElement("button");
        button.type = "button";
        button.className = "thumb-btn";
        button.setAttribute("aria-label", "Show photo " + (i + 1) + ": " + photos[i].caption);
        img.parentNode.insertBefore(button, img);
        button.appendChild(img);
        button.addEventListener("click", function () {
            showPhoto(i);
            viewer.scrollIntoView({ block: "nearest" });
        });
    });

    prevButton.addEventListener("click", function () {
        showPhoto(current - 1);
        if (prevButton.disabled) nextButton.focus(); // keep keyboard focus on a usable button
    });
    nextButton.addEventListener("click", function () {
        showPhoto(current + 1);
        if (nextButton.disabled) prevButton.focus();
    });

    viewer.hidden = false;
    showPhoto(0);
}

/* ---------- 4. Theme switch ---------- */

const THEME_KEY = "ict251-theme";

// Applies "light" or "dark" and updates the button text and state.
function applyTheme(theme, button) {
    document.documentElement.setAttribute("data-theme", theme);
    const isDark = theme === "dark";
    button.setAttribute("aria-pressed", String(isDark));
    button.textContent = isDark ? "Light theme" : "Dark theme";
}

function setupThemeSwitch() {
    const button = document.getElementById("theme-toggle");
    if (!button) return;

    // Load the saved choice. Storage can be blocked (e.g. private mode), so use try/catch.
    let saved = null;
    try {
        saved = localStorage.getItem(THEME_KEY);
    } catch (error) {
        saved = null;
    }
    applyTheme(saved === "dark" ? "dark" : "light", button);

    button.addEventListener("click", function () {
        const next = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
        applyTheme(next, button);
        try {
            localStorage.setItem(THEME_KEY, next);
        } catch (error) {
            /* saving is optional; the theme still changes */
        }
    });
}

/* ---------- Extra: mobile navigation ---------- */

// Opens and closes the menu on narrow screens; the button text and aria-expanded show its state.
function setupMobileNav() {
    const button = document.getElementById("menu-toggle");
    const nav = document.getElementById("site-nav");
    if (!button || !nav) return;

    function setOpen(open) {
        nav.classList.toggle("is-open", open);
        button.setAttribute("aria-expanded", String(open));
        button.textContent = open ? "Close menu" : "Menu";
    }

    button.addEventListener("click", function () {
        setOpen(!nav.classList.contains("is-open"));
    });

    // Close the menu after choosing a section, or when Escape is pressed.
    nav.addEventListener("click", function (event) {
        if (event.target.tagName === "A") setOpen(false);
    });
    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape" && nav.classList.contains("is-open")) {
            setOpen(false);
            button.focus();
        }
    });
}

/* ---------- Extra: highlight the section on screen ---------- */

// Marks the navigation link for whichever section is currently in view.
function setupActiveSection() {
    if (!("IntersectionObserver" in window)) return; // very old browsers: skip quietly

    const links = Array.from(document.querySelectorAll("#site-nav a[href^='#']"));
    const sections = links
        .map(function (link) { return document.querySelector(link.getAttribute("href")); })
        .filter(Boolean);

    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (!entry.isIntersecting) return;
            links.forEach(function (link) {
                const match = link.getAttribute("href") === "#" + entry.target.id;
                link.classList.toggle("is-active", match);
                if (match) {
                    link.setAttribute("aria-current", "location");
                } else {
                    link.removeAttribute("aria-current");
                }
            });
        });
    }, { rootMargin: "-40% 0px -55% 0px" }); // "in view" = crossing the middle of the screen

    sections.forEach(function (section) { observer.observe(section); });
}

/* ---------- Start everything ---------- */
setupThemeSwitch();
setupContactForm();
setupProjectFilter();
setupGalleryViewer();
setupMobileNav();
setupActiveSection();
