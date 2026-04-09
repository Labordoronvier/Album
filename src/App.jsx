import { useState, useCallback, useRef } from "react";
import "./App.css";

/* ── Image glob ──────────────────────────────────────────── */
const allImages = import.meta.glob("./assets/*.{jpg,jpeg,png}", { eager: true });
const images = Object.fromEntries(
  Object.entries(allImages).map(([path, file]) => [path.split("/").pop(), file.default])
);

/* ── Image error handler ─────────────────────────────────── */
const handleImageError = (e) => {
  e.target.style.opacity = "0.15";
  e.target.removeAttribute("src");
};

/* ── Page data ───────────────────────────────────────────── */
const PAGE_DATA = [
  { title: "Chapter I",  images: ["coffee date1.jpg","coffee date2.jpg","coffee date3.jpg","1.jpg"] },
  { title: "Chapter II",   images: ["2.jpg","3.jpg","4.jpg","5.jpg"] },
  { title: "Chapter III",  images: ["6.jpg","7.jpg","8.jpg","9.jpg"] },
  { title: "Chapter IV",   images: ["10.jpg","11.jpg","12.jpg","13.jpg"] },
  { title: "Chapter V",    images: ["14.jpg","15.jpg","16.jpg","17.jpg"] },
  { title: "Chapter VI",   images: ["18.jpg","pic19.jpeg","pic20.jpeg","pic21.jpeg"] },
  { title: "Chapter VII",  images: ["pic22.jpeg","pic23.jpeg","pic24.jpeg","pic25.jpeg"] },
  { title: "Chapter VIII", images: ["pic26.jpeg","pic27.jpeg","pic28.jpeg","pic29.jpeg"] },
  { title: "Chapter IX",   images: ["pic30.jpeg","pic31.jpeg","pic32.jpeg","pic33.jpeg"] },
  { title: "Chapter X",    images: ["pic34.jpeg","pic35.jpeg","pic36.jpg","pic37.jpg"] },
  { title: "Chapter XI",    images: ["pic38.jpg","","",""] },
];

const TOTAL = PAGE_DATA.length;

/* ── Cover ───────────────────────────────────────────────── */
function AlbumCover({ zIndex, totalPages, isOpen }) {
  return (
    <div
      className={`album__paper${isOpen ? " open" : ""}`}
      style={{ zIndex, pointerEvents: "none" }}
    >
      <div
        className="album__page front"
        style={{ transform: `translateZ(${0.1 * (totalPages + 1)}em)` }}
      >
        <div className="cover-content">
          <div className="cover-open-cue" aria-hidden="true">
            <svg viewBox="0 0 24 24">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
            <span>Open</span>
          </div>
          <div className="cover-line" />
          <div className="album__top-title">Album</div>
          <p className="txt-text">Journey of Us</p>
          <p className="cover-year">Est. 2024</p>
        </div>
      </div>
      <div className="album__page back" />
    </div>
  );
}

/* ── Page ────────────────────────────────────────────────── */
function AlbumPage({ page, index, isOpen, zIndex, totalPages }) {
  return (
    <div
      className={`album__paper${isOpen ? " open" : ""}`}
      style={{ zIndex, pointerEvents: "none" }}
    >
      <div
        className="album__page front"
        style={{ transform: `translateZ(${0.1 * (totalPages - (index + 1))}em)` }}
      >
        <div className="content">
          <header className="content__title">{page.title}</header>
          <div
            className="content__gallery"
            role="list"
            aria-label={`${page.title} photos`}
          >
            {page.images.map((imgKey, i) => (
              <div className="content__image" key={i} role="listitem">
                <img
                  src={images[imgKey]}
                  alt={`${page.title} — photo ${i + 1}`}
                  onError={handleImageError}
                  loading="lazy"
                  decoding="async"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="album__page back" />
    </div>
  );
}

/* ── Nav arrow button ────────────────────────────────────── */
function NavArrow({ direction, onClick, label, visible }) {
  return (
    <button
      className={`nav-arrow nav-arrow--${direction}${visible ? " nav-arrow--visible" : ""}`}
      onClick={onClick}
      aria-label={label}
      title={label}
      tabIndex={visible ? 0 : -1}
      aria-hidden={!visible}
    >
      <svg viewBox="0 0 24 24" aria-hidden="true">
        {direction === "left"
          ? <path d="M19 12H5M12 19l-7-7 7-7" />
          : <path d="M5 12h14M12 5l7 7-7 7" />}
      </svg>
    </button>
  );
}

/* ── App ─────────────────────────────────────────────────── */
function App() {
  const [bookState, setBookState]     = useState("closed");
  // currentPage = how many pages have been flipped forward (0 = cover on top)
  const [currentPage, setCurrentPage] = useState(0);
  const animTimerRef = useRef(null);

  const clearTimer = () => {
    if (animTimerRef.current) {
      clearTimeout(animTimerRef.current);
      animTimerRef.current = null;
    }
  };

  const openBook = useCallback(() => {
    clearTimer();
    setBookState("opening");
    animTimerRef.current = setTimeout(() => setBookState("open"), 1500);
  }, []);

  const closeBook = useCallback(() => {
    clearTimer();
    setCurrentPage(0);
    setBookState("closing");
    animTimerRef.current = setTimeout(() => setBookState("closed"), 1200);
  }, []);

  /* Go forward one page; close when past the last page */
  const goForward = useCallback(() => {
    if (currentPage >= TOTAL) {
      closeBook();
      return;
    }
    setCurrentPage((p) => p + 1);
  }, [currentPage, closeBook]);

  /* Go back one page */
  const goBack = useCallback(() => {
    if (currentPage <= 0) return;
    setCurrentPage((p) => p - 1);
  }, [currentPage]);

  /* Derived state */
  const isOpen      = bookState === "open";
  const isClosed    = bookState === "closed";
  const isAnimating = bookState === "opening" || bookState === "closing";

  // Page i is flipped if its index < currentPage (cover flip = page 0 opening)
  const coverOpen = currentPage > 0;
  const openPages = PAGE_DATA.map((_, idx) => idx < currentPage);
  const isLastPage = currentPage >= TOTAL;

  const canGoBack    = isOpen && !isAnimating && currentPage > 0;
  const canGoForward = isOpen && !isAnimating;

  const forwardLabel = isLastPage
    ? "Close album"
    : currentPage === 0
      ? "Open first page"
      : `Next: ${PAGE_DATA[currentPage]?.title ?? "next page"}`;

  const backLabel = currentPage <= 1
    ? "Back to cover"
    : `Back to ${PAGE_DATA[currentPage - 2]?.title ?? "previous page"}`;

  const sceneClass = [
    "book-scene",
    bookState === "opening" ? "is-opening" : "",
    bookState === "open"    ? "is-open"    : "",
    bookState === "closing" ? "is-closing" : "",
  ].filter(Boolean).join(" ");

  return (
    <div className="container">

      {/* Hint */}
      <p
        className={`hint${!isClosed ? " hidden" : ""}`}
        aria-live="polite"
      >
        Click the album to open
      </p>

      {/* ── 3-D book visual ── */}
      <div className={sceneClass} style={{ pointerEvents: "none" }}>
        <div className="album" style={{ pointerEvents: "none" }}>

          <AlbumCover
            zIndex={coverOpen ? 1 : TOTAL + 1}
            totalPages={TOTAL}
            isOpen={coverOpen}
          />

          {PAGE_DATA.map((page, idx) => (
            <AlbumPage
              key={idx}
              page={page}
              index={idx}
              isOpen={openPages[idx]}
              zIndex={openPages[idx] ? idx + 1 : TOTAL - idx}
              totalPages={TOTAL}
            />
          ))}

          <div className="album__back"   style={{ pointerEvents: "none" }} />
          <div className="album__bottom" style={{ pointerEvents: "none" }} />
          <div className="album__shadow" style={{ pointerEvents: "none" }} />
        </div>
      </div>

      {/* ── Full-screen click target while closed ── */}
      {isClosed && (
        <div
          onClick={openBook}
          role="button"
          aria-label="Open album"
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && openBook()}
          style={{ position: "absolute", inset: 0, zIndex: 100, cursor: "pointer" }}
        />
      )}

      {/* ── Left / Right half tap zones while open ── */}
      {isOpen && !isAnimating && (
        <>
          {/* Left half — go back */}
          <div
            onClick={canGoBack ? goBack : undefined}
            role="button"
            aria-label={backLabel}
            tabIndex={canGoBack ? 0 : -1}
            onKeyDown={(e) => e.key === "Enter" && canGoBack && goBack()}
            className={`tap-zone tap-zone--left${!canGoBack ? " tap-zone--disabled" : ""}`}
          />
          {/* Right half — go forward */}
          <div
            onClick={goForward}
            role="button"
            aria-label={forwardLabel}
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && goForward()}
            className="tap-zone tap-zone--right"
          />
        </>
      )}

      {/* ── Visual nav arrows ── */}
      <NavArrow
        direction="left"
        onClick={goBack}
        label={backLabel}
        visible={canGoBack}
      />
      <NavArrow
        direction="right"
        onClick={goForward}
        label={forwardLabel}
        visible={canGoForward}
      />

      {/* Page counter */}
      <p
        className={`page-counter${!isOpen ? " hidden" : ""}`}
        aria-live="polite"
      >
        {isLastPage
          ? "← Click left or the button to close"
          : currentPage === 0
            ? "Click right to begin"
            : `Page ${currentPage} of ${TOTAL - 1}`}
      </p>
    </div>
  );
}

export default App;