// ---------- Datos de ejemplo (no hay backend: todo vive en memoria) ----------

const posts = [
  {
    id: "p1",
    username: "Male Fernández",
    avatar: "https://i.pravatar.cc/80?img=47",
    timeAgo: "hace 2 h",
    category: "☕ Café",
    image: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&q=80",
    title: "Café con vista en Palermo",
    location: "Café Nube · Sáb 20, 17:00 hs",
    points: 20,
    attendees: [
      "https://i.pravatar.cc/60?img=12",
      "https://i.pravatar.cc/60?img=32",
      "https://i.pravatar.cc/60?img=5",
    ],
    attendeesExtra: 6,
    likes: 34,
    liked: false,
    following: false,
    going: false,
    commentsOpen: false,
    comments: [
      { name: "Nico Ríos", avatar: "https://i.pravatar.cc/60?img=15", text: "¡Me anoto! ¿Llevo algo?" },
      { name: "Juli Torres", avatar: "https://i.pravatar.cc/60?img=25", text: "Se ve buenísimo el lugar 😍" },
    ],
  },
  {
    id: "p2",
    username: "Juli Torres",
    avatar: "https://i.pravatar.cc/80?img=25",
    timeAgo: "hace 5 h",
    category: "🌊 Viaje a la costa",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80",
    title: "Finde en Mar del Plata",
    location: "Salida en combi · Vie 26, 07:00 hs",
    points: 50,
    attendees: [
      "https://i.pravatar.cc/60?img=8",
      "https://i.pravatar.cc/60?img=9",
      "https://i.pravatar.cc/60?img=41",
    ],
    attendeesExtra: 11,
    likes: 82,
    liked: true,
    following: true,
    going: false,
    commentsOpen: false,
    comments: [
      { name: "Fede Suárez", avatar: "https://i.pravatar.cc/60?img=33", text: "¿Cuánto sale por persona?" },
    ],
  },
  {
    id: "p3",
    username: "Nico Ríos",
    avatar: "https://i.pravatar.cc/80?img=15",
    timeAgo: "hace 1 d",
    category: "🎵 Concierto",
    image: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&q=80",
    title: "Indie night en El Sótano",
    location: "El Sótano Bar · Vie 26, 21:30 hs",
    points: 35,
    attendees: [
      "https://i.pravatar.cc/60?img=21",
      "https://i.pravatar.cc/60?img=48",
    ],
    attendeesExtra: 4,
    likes: 56,
    liked: false,
    following: false,
    going: true,
    commentsOpen: false,
    comments: [
      { name: "Male Fernández", avatar: "https://i.pravatar.cc/80?img=47", text: "La banda que abre está increíble" },
      { name: "Juli Torres", avatar: "https://i.pravatar.cc/60?img=25", text: "Nos vemos ahí 🙌" },
    ],
  },
];

// ---------- Render ----------

const feedEl = document.getElementById("feed");
const template = document.getElementById("post-template");

function renderFeed() {
  feedEl.innerHTML = "";
  posts.forEach((post) => feedEl.appendChild(renderPost(post)));
}

function renderPost(post) {
  const node = template.content.cloneNode(true);
  const article = node.querySelector(".post");
  article.dataset.id = post.id;

  node.querySelector(".post__avatar").src = post.avatar;
  node.querySelector(".post__avatar").alt = post.username;
  node.querySelector(".post__username").textContent = post.username;
  node.querySelector(".post__meta").textContent = post.timeAgo;

  const followBtn = node.querySelector(".follow-btn");
  updateFollowButton(followBtn, post.following);

  node.querySelector(".post__image").src = post.image;
  node.querySelector(".post__image").alt = post.title;
  node.querySelector(".chip").textContent = post.category;
  node.querySelector(".points-badge").textContent = `+${post.points} pts`;

  node.querySelector(".post__title").textContent = post.title;
  node.querySelector(".post__location").textContent = post.location;

  const avatarsWrap = node.querySelector(".attendees__avatars");
  post.attendees.forEach((src) => {
    const img = document.createElement("img");
    img.src = src;
    img.alt = "";
    avatarsWrap.appendChild(img);
  });
  node.querySelector(".attendees__label").textContent =
    post.attendeesExtra > 0
      ? `+${post.attendeesExtra} personas más van`
      : `${post.attendees.length} personas van`;

  const likeBtn = node.querySelector(".like-btn");
  updateLikeButton(likeBtn, post);

  const attendBtn = node.querySelector(".attend-btn");
  updateAttendButton(attendBtn, post.going);

  node.querySelector(".comment-count").textContent = post.comments.length;

  node.querySelector(".points-info").textContent = post.going
    ? `Sumaste ${post.points} puntos por asistir a este evento`
    : `Asistí y sumá ${post.points} puntos para tus próximos eventos`;

  const commentsSection = node.querySelector(".comments");
  const commentsList = node.querySelector(".comments__list");
  renderComments(commentsList, post.comments);
  if (post.commentsOpen) commentsSection.classList.add("is-open");

  // ----- Eventos -----

  followBtn.addEventListener("click", () => {
    post.following = !post.following;
    updateFollowButton(followBtn, post.following);
  });

  likeBtn.addEventListener("click", () => {
    post.liked = !post.liked;
    post.likes += post.liked ? 1 : -1;
    updateLikeButton(likeBtn, post);
  });

  attendBtn.addEventListener("click", () => {
    post.going = !post.going;
    updateAttendButton(attendBtn, post.going);
    node.querySelector
      ? (article.querySelector(".points-info").textContent = post.going
          ? `Sumaste ${post.points} puntos por asistir a este evento`
          : `Asistí y sumá ${post.points} puntos para tus próximos eventos`)
      : null;
    if (post.going) {
      showToast(`¡Sumaste ${post.points} puntos! 🎉`);
    }
  });

  node.querySelector(".comment-toggle").addEventListener("click", () => {
    commentsSection.classList.toggle("is-open");
  });

  const form = node.querySelector(".comments__form");
  const input = node.querySelector(".comments__input");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const text = input.value.trim();
    if (!text) return;
    const newComment = {
      name: "Vos",
      avatar: "https://i.pravatar.cc/60?img=68",
      text,
    };
    post.comments.push(newComment);
    renderComments(commentsList, post.comments);
    article.querySelector(".comment-count").textContent = post.comments.length;
    input.value = "";
    commentsSection.classList.add("is-open");
  });

  return node;
}

function renderComments(listEl, comments) {
  listEl.innerHTML = "";
  comments.forEach((c) => {
    const li = document.createElement("li");
    li.className = "comment";
    li.innerHTML = `<img src="${c.avatar}" alt=""><p><strong>${c.name}</strong>${escapeHtml(c.text)}</p>`;
    listEl.appendChild(li);
  });
}

function updateFollowButton(btn, following) {
  btn.textContent = following ? "Siguiendo" : "Seguir";
  btn.classList.toggle("is-following", following);
}

function updateLikeButton(btn, post) {
  btn.classList.toggle("is-liked", post.liked);
  btn.querySelector(".like-count").textContent = post.likes;
}

function updateAttendButton(btn, going) {
  btn.textContent = going ? "¡Voy!" : "Asistiré";
  btn.classList.toggle("is-going", going);
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

// ---------- Toast ----------

let toastTimer = null;
function showToast(message) {
  const toastEl = document.getElementById("toast");
  toastEl.textContent = message;
  toastEl.classList.add("is-visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toastEl.classList.remove("is-visible"), 2200);
}

// ---------- Navegación inferior ----------

document.querySelectorAll(".navbar__item").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".navbar__item").forEach((b) => b.classList.remove("is-active"));
    btn.classList.add("is-active");
  });
});

// ---------- Init ----------

renderFeed();
