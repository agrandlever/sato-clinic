(function () {
  "use strict";

  const formatDate = (date) => String(date).replace(/-/g, ".");
  const newsItems = Array.isArray(window.SATO_NEWS) ? window.SATO_NEWS : [];

  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".global-nav");

  if (toggle && nav) {
    const closeNav = () => {
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "メニューを開く");
      nav.classList.remove("is-open");
      document.body.classList.remove("nav-open");
    };

    toggle.addEventListener("click", () => {
      const isOpen = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!isOpen));
      toggle.setAttribute("aria-label", isOpen ? "メニューを開く" : "メニューを閉じる");
      nav.classList.toggle("is-open", !isOpen);
      document.body.classList.toggle("nav-open", !isOpen);
    });

    nav.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeNav));
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeNav();
        toggle.focus();
      }
    });

    const mobileNavigation = window.matchMedia("(max-width: 1050px)");
    mobileNavigation.addEventListener("change", (event) => {
      if (!event.matches) {
        closeNav();
      }
    });
  }

  const topNewsList = document.querySelector("[data-news-list]");
  if (topNewsList && newsItems.length) {
    topNewsList.replaceChildren(
      ...newsItems.slice(0, 5).map((item) => {
        const row = document.createElement("li");
        const time = document.createElement("time");
        const link = document.createElement("a");
        time.dateTime = item.date;
        time.textContent = formatDate(item.date);
        link.href = `./news.html?id=${encodeURIComponent(item.id)}`;
        link.textContent = item.title;
        row.append(time, link);
        return row;
      }),
    );
  }

  const newsPage = document.querySelector("[data-news-page]");
  if (newsPage) {
    const id = new URLSearchParams(window.location.search).get("id");
    const selected = newsItems.find((item) => item.id === id);

    if (selected) {
      document.title = `${selected.title} | 佐藤医院`;
      const article = document.createElement("article");
      article.className = "news-article";
      const time = document.createElement("time");
      const title = document.createElement("h1");
      time.dateTime = selected.date;
      time.textContent = formatDate(selected.date);
      title.textContent = selected.title;
      article.append(time, title);
      selected.body.forEach((paragraph) => {
        const p = document.createElement("p");
        p.textContent = paragraph;
        article.append(p);
      });
      const back = document.createElement("p");
      back.className = "page-back-link";
      back.innerHTML = '<a href="./news.html">お知らせ一覧へ戻る</a>';
      newsPage.replaceChildren(article, back);
    } else {
      const list = document.createElement("ul");
      list.className = "news-archive";
      newsItems.forEach((item) => {
        const row = document.createElement("li");
        const time = document.createElement("time");
        const link = document.createElement("a");
        time.dateTime = item.date;
        time.textContent = formatDate(item.date);
        link.href = `./news.html?id=${encodeURIComponent(item.id)}`;
        link.textContent = item.title;
        row.append(time, link);
        list.append(row);
      });
      newsPage.replaceChildren(list);
    }
  }
})();
