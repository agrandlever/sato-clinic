(function () {
  "use strict";

  const newsItems = Array.isArray(window.SATO_NEWS) ? window.SATO_NEWS : [];
  const formatDate = (value) => String(value).replaceAll("-", ".");

  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".global-nav");

  if (toggle && nav) {
    const closeNavigation = (restoreFocus = false) => {
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "メニューを開く");
      nav.classList.remove("is-open");
      document.body.classList.remove("nav-open");
      if (restoreFocus) toggle.focus();
    };

    toggle.addEventListener("click", () => {
      const willOpen = toggle.getAttribute("aria-expanded") !== "true";
      toggle.setAttribute("aria-expanded", String(willOpen));
      toggle.setAttribute("aria-label", willOpen ? "メニューを閉じる" : "メニューを開く");
      nav.classList.toggle("is-open", willOpen);
      document.body.classList.toggle("nav-open", willOpen);
    });

    nav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => closeNavigation());
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") {
        closeNavigation(true);
      }
    });

    document.addEventListener("click", (event) => {
      if (
        toggle.getAttribute("aria-expanded") === "true" &&
        !nav.contains(event.target) &&
        !toggle.contains(event.target)
      ) {
        closeNavigation();
      }
    });

    const desktopNavigation = window.matchMedia("(min-width: 1081px)");
    desktopNavigation.addEventListener("change", (event) => {
      if (event.matches) closeNavigation();
    });
  }

  const createNewsRow = (item) => {
    const row = document.createElement("li");
    const time = document.createElement("time");
    const link = document.createElement("a");

    time.dateTime = item.date;
    time.textContent = formatDate(item.date);
    link.href = `./news.html?id=${encodeURIComponent(item.id)}`;
    link.textContent = item.title;
    row.append(time, link);
    return row;
  };

  const topNews = document.querySelector("[data-top-news]");
  if (topNews && newsItems.length > 0) {
    topNews.replaceChildren(...newsItems.slice(0, 5).map(createNewsRow));
  }

  const newsPage = document.querySelector("[data-news-page]");
  if (newsPage) {
    const selectedId = new URLSearchParams(window.location.search).get("id");
    const selectedItem = newsItems.find((item) => item.id === selectedId);

    if (selectedItem) {
      document.title = `${selectedItem.title} | 佐藤医院`;

      const article = document.createElement("article");
      const time = document.createElement("time");
      const heading = document.createElement("h2");
      const body = document.createElement("div");
      const back = document.createElement("p");
      const backLink = document.createElement("a");

      article.className = "news-article";
      article.dataset.newsDetail = "";
      time.dateTime = selectedItem.date;
      time.textContent = formatDate(selectedItem.date);
      time.dataset.newsDate = "";
      heading.textContent = selectedItem.title;
      heading.dataset.newsTitle = "";
      body.dataset.newsBody = "";
      article.append(time, heading, body);

      selectedItem.body.forEach((paragraph) => {
        const text = document.createElement("p");
        text.textContent = paragraph;
        body.append(text);
      });

      back.className = "page-back-link";
      backLink.className = "button button--light";
      backLink.href = "./news.html";
      backLink.textContent = "お知らせ一覧へ戻る";
      back.append(backLink);
      newsPage.replaceChildren(article, back);
    } else if (newsItems.length > 0) {
      const list = document.createElement("ul");
      list.className = "news-archive";
      list.dataset.newsList = "";
      list.append(...newsItems.map(createNewsRow));
      newsPage.replaceChildren(list);
    }
  }
})();
