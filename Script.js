/* ==========================
   Site interactive behavior
   ========================== */

/* ---- format WhatsApp link from provided number ----
   User number given: 08037722291
   WhatsApp expects international format without leading 0 or +.
   For Nigeria: replace leading 0 with 234 -> 2348037722291
*/
const WA_NUMBER = "2348037722291";
const waUrlBase = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent("Hello Hall Mark Royal School. I have a question about admission.")}`;

// Set WA links
document.addEventListener("DOMContentLoaded", () => {
  // floating WA button
  const waFloat = document.getElementById("whatsappFloat");
  if (waFloat) {
    waFloat.href = waUrlBase;
    waFloat.title = "Chat on WhatsApp";
    // Add an accessible icon inside (SVG)
    waFloat.innerHTML = `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M20.52 3.48A11.9 11.9 0 0 0 12.02 0C5.4 0 .13 4.76.13 11.07c0 1.95.51 3.86 1.47 5.56L0 24l7.8-2.05a11.92 11.92 0 0 0 4.2.76c6.62 0 11.89-4.76 11.89-11.07 0-2.99-1.16-5.79-3.37-7.16z" fill="#fff"/>
    </svg>`;
  }

  // Top-contact WA link
  const topWA = document.getElementById("openWhatsApp");
  if (topWA) topWA.href = waUrlBase;

  // Menu toggle for small screens
  const menuBtn = document.querySelector(".menu-toggle");
  const navRight = document.querySelector(".nav-right");
  if (menuBtn) {
    menuBtn.addEventListener("click", () => {
      if (navRight.style.display === "flex") navRight.style.display = "none";
      else navRight.style.display = "flex";
    });
  }

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener("click", function (e) {
      const href = this.getAttribute("href");
      if (!href || href === "#") return;
      e.preventDefault();
      const el = document.querySelector(href);
      if (!el) return;
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      // close mobile nav when link clicked
      if (window.innerWidth < 720) {
        document.querySelector(".nav-right").style.display = "none";
      }
    });
  });

  /* ===== Slideshow ===== */
  const slides = document.querySelector(".slides");
  const imgs = slides ? slides.querySelectorAll("img") : [];
  let idx = 0;
  const show = i => {
    idx = (i + imgs.length) % imgs.length;
    slides.style.transform = `translateX(-${idx * 100}%)`;
  };
  document.querySelector(".slide-prev").addEventListener("click", () => show(idx - 1));
  document.querySelector(".slide-next").addEventListener("click", () => show(idx + 1));
  // auto rotate
  setInterval(() => show(idx + 1), 5000);

  /* ===== Admission Form behavior ===== */
  const form = document.getElementById("admissionForm");
  const downloadBtn = document.getElementById("downloadJson");
  if (form) {
    form.addEventListener("submit", function (ev) {
      ev.preventDefault();
      const data = Object.fromEntries(new FormData(form).entries());
      // Save to localStorage (so they don't lose it)
      localStorage.setItem("hmr_admission_latest", JSON.stringify(data));
      // prepare mailto with summary
      const subject = encodeURIComponent("Admission Application - " + (data.student_name || "New Applicant"));
      let body = "Admission application details:\n\n";
      for (const [k, v] of Object.entries(data)) {
        body += `${k.replaceAll("_", " ")}: ${v}\n`;
      }
      body += "\nSent from Hall Mark Royal School website.";
      const mailTo = `mailto:hallmarkroyalschool@gmail.com?subject=${subject}&body=${encodeURIComponent(body)}`;
      // open mail client
      window.location.href = mailTo;
      alert("Application saved locally. Your email client will open to send the application to hallmarkroyalschool@gmail.com. If nothing opens, you can use the 'Save & Download' button.");
    });
  }

  if (downloadBtn) {
    downloadBtn.addEventListener("click", () => {
      const data = JSON.parse(localStorage.getItem("hmr_admission_latest") || "{}");
      // If form still has values, prefer them
      if (form) {
        const formData = Object.fromEntries(new FormData(form).entries());
        Object.assign(data, formData);
      }
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `hallmark-admission-${Date.now()}.json`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    });
  }
});
