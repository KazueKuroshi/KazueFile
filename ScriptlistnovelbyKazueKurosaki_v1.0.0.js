  let allEntries = [];
  let isImageMode = true; // Default mode is image mode

  function fetchPosts() {
    const label = 'Series';
    const url = `/feeds/posts/default/-/${label}?alt=json-in-script&callback=handleResponse`;
    const script = document.createElement('script');
    script.src = url;
    document.body.appendChild(script);
  }

  function handleResponse(data) {
    allEntries = data.feed.entry || [];
    displayPosts(allEntries);
  }

  function displayPosts(entries ) {
    const sitemapContainer = document.getElementById('sitemap');
    sitemapContainer.innerHTML = ''; // Clear previous posts

    // Sort entries by title
    entries.sort((a, b) => {
      const titleA = a.title.$t.toLowerCase();
      const titleB = b.title.$t.toLowerCase();
      return titleA < titleB ? -1 : titleA > titleB ? 1 : 0;
    });

    entries.forEach(entry => {
      const title = entry.title.$t;
      const link = entry.link.find(l => l.rel === 'alternate').href;
      let thumbnail = entry.media$thumbnail ? entry.media$thumbnail.url : 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEg36Plynr4PROyp7jwL6Kt9JlOkGciREt51Kn2logfrN1Rt0kOOibq_KnlGIXbChKxpPOJA_1MNKhy8oV8zn81FUyqSkh235ACikI5xCI0JgfAUsi0eIW2uM2wOAK25DIpENF4cCor4_hKYT0RGXpxqc2oMvempEzvSm_MJofGSRU0p5s4p0Gr4_WQ0mZQ/s1600/Kurokawa.Akane.no.image.default.Kazue.Kurosaki.jpg'; // Ganti dengan thumbnail default jika tidak ada
      thumbnail = thumbnail.replace(/s72-c/, 's800'); // Mengganti ukuran thumbnail menjadi lebih besar

      const postElement = document.createElement('div');
      postElement.className = 'post-item';
      postElement.innerHTML = isImageMode ? `
        <a href="${link}">
          <img src="${thumbnail}" alt="${title}">
          <h3>${title}</h3>
        </a>
      ` : `
        <a href="${link}">
          <h3>${title}</h3>
        </a>
      `;
      sitemapContainer.appendChild(postElement);
    });
  }

  function filterPosts(letter) {
    let filteredEntries;

    if (letter === 'all') {
      filteredEntries = allEntries;
    } else {
      filteredEntries = allEntries.filter(entry => {
        const title = entry.title.$t.toUpperCase();
        return title.startsWith(letter) || (letter === '#' && /\d/.test(title.charAt(0))) || (letter === '0-9' && /\d/.test(title.charAt(0)));
      });
    }

    displayPosts(filteredEntries);
  }

  function toggleMode() {
    isImageMode = !isImageMode; // Toggle mode
    displayPosts(allEntries); // Refresh posts to reflect the new mode
  }

  window.onload = fetchPosts;

