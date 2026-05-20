'use strict';

const $ = (sel) => document.querySelector(sel);

const ui = {
    grid: $('#repo-grid'),
    cardTpl: $('#repo-card')
};

const state = {
    repos: []
};

function apiHeaders() {
    return { 'Accept': 'application/vnd.github+json' };
}

async function fetchJSON(url) {
    const res = await fetch(url, { headers: apiHeaders() });
    if (!res.ok) {
        let msg = res.status + ' ' + res.statusText;
        try { const j = await res.json(); if (j.message) msg += ' — ' + j.message; } catch { }
        throw new Error(msg);
    }
    return res.json();
}

function formatDate(iso) {
    const d = new Date(iso);
    return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: '2-digit' });
}

function percent(n, total) {
    return total ? Math.round((n / total) * 100) : 0;
}

function chipsFromLanguages(langMap) {
    const frags = document.createDocumentFragment();
    const total = Object.values(langMap).reduce((a, b) => a + b, 0);
    const sorted = Object.entries(langMap).sort((a, b) => b[1] - a[1]).slice(0, 6);
    for (const [lang, bytes] of sorted) {
        const chip = document.createElement('span');
        chip.className = 'chip';
        chip.textContent = `${lang} ${percent(bytes, total)}%`;
        chip.title = `${lang}: ${percent(bytes, total)}%`;
        frags.appendChild(chip);
    }
    return frags;
}

function chipsFromTopics(topics) {
    const frags = document.createDocumentFragment();
    (topics || []).slice(0, 6).forEach((t) => {
        const chip = document.createElement('span');
        chip.className = 'chip';
        chip.textContent = '#' + t;
        frags.appendChild(chip);
    });
    return frags;
}

function buildLinks(repo) {
    const frags = document.createDocumentFragment();
    if (repo.homepage) {
        const home = document.createElement('a');
        home.href = repo.homepage;
        home.target = '_blank';
        home.rel = 'noopener';
        home.className = 'ext-link';
        home.textContent = 'Site / démo';
        frags.appendChild(home);
    }
    return frags;
}

function render() {
    ui.grid.innerHTML = '';
    const frag = document.createDocumentFragment();

    state.repos.forEach((repo) => {
        const node = ui.cardTpl.content.firstElementChild.cloneNode(true);
        node.querySelector('.repo-link').textContent = repo.full_name;
        node.querySelector('.repo-link').href = repo.html_url;
        node.querySelector('.avatar').src = repo.owner && repo.owner.avatar_url;
        node.querySelector('.desc').textContent = repo.description || '—';
        node.querySelector('.stars').textContent = `★ ${repo.stargazers_count}`;
        node.querySelector('.updated').textContent = `maj ${formatDate(repo.pushed_at || repo.updated_at)}`;
        node.querySelector('.visibility').textContent = repo.private ? 'privé' : (repo.visibility || 'public');

        const chips = node.querySelector('.chips');
        chips.appendChild(chipsFromLanguages(repo.__languages || {}));
        chips.appendChild(chipsFromTopics(repo.topics || []));

        node.querySelector('.footer').appendChild(buildLinks(repo));
        frag.appendChild(node);
    });

    ui.grid.appendChild(frag);
}

async function loadRepos() {
    const user = 'galagain';
    try {
        const repos = await fetchJSON(`https://api.github.com/users/${encodeURIComponent(user)}/repos?per_page=100&sort=updated`);
        const withExtras = await Promise.all(repos.map(async (r) => {
            const [languages, repoFull] = await Promise.all([
                fetchJSON(r.languages_url),
                fetchJSON(`https://api.github.com/repos/${r.full_name}`)
            ]);
            r.__languages = languages;
            r.topics = (repoFull && repoFull.topics) || r.topics || [];
            r.homepage = (repoFull && repoFull.homepage) || r.homepage;
            return r;
        }));

        state.repos = withExtras.filter((r) => r.owner && r.owner.login === 'galagain');
        render();
    } catch (err) {
        console.error(err);
        const msg = document.createElement('div');
        msg.textContent = 'Erreur de chargement : ' + (err && err.message || err);
        msg.style.color = '#fecaca';
        msg.style.background = '#1a0f12';
        msg.style.border = '1px solid #7f1d1d';
        msg.style.padding = '12px';
        msg.style.borderRadius = '12px';
        ui.grid.innerHTML = '';
        ui.grid.appendChild(msg);
    }
}

window.addEventListener('DOMContentLoaded', loadRepos);
