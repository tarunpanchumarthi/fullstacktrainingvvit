(function(){
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------------- Nav: scroll shadow + active link + mobile toggle ---------------- */
  var nav = document.getElementById("nav");
  var navLinks = document.querySelectorAll(".nav__links a");
  var navToggle = document.getElementById("navToggle");
  var navLinksEl = document.querySelector(".nav__links");

  window.addEventListener("scroll", function(){
    nav.classList.toggle("is-scrolled", window.scrollY > 8);
  }, { passive: true });

  if (navToggle){
    navToggle.addEventListener("click", function(){
      navLinksEl.classList.toggle("is-open");
    });
    navLinks.forEach(function(link){
      link.addEventListener("click", function(){ navLinksEl.classList.remove("is-open"); });
    });
  }

  var sections = document.querySelectorAll(".section, .hero");
  if ("IntersectionObserver" in window){
    var navObserver = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if (entry.isIntersecting){
          var id = entry.target.id;
          navLinks.forEach(function(link){
            link.classList.toggle("is-active", link.getAttribute("href") === "#" + id);
          });
        }
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    sections.forEach(function(s){ if (s.id) navObserver.observe(s); });
  }

  /* ---------------- Scroll reveal for section headers ---------------- */
  document.querySelectorAll(".section__head, .about__grid, .skills, .timeline, .certs, .contact").forEach(function(el){
    el.classList.add("reveal");
  });
  if ("IntersectionObserver" in window && !reduceMotion){
    var revealObserver = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if (entry.isIntersecting){
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    document.querySelectorAll(".reveal").forEach(function(el){ revealObserver.observe(el); });
  } else {
    document.querySelectorAll(".reveal").forEach(function(el){ el.classList.add("is-visible"); });
  }

  /* ---------------- Project log accordion ---------------- */
  document.querySelectorAll("[data-entry]").forEach(function(entry){
    var head = entry.querySelector(".entry__head");
    var body = entry.querySelector(".entry__body");
    head.addEventListener("click", function(){
      var isOpen = head.getAttribute("aria-expanded") === "true";
      // close any other open entry for a tidy single-open log
      document.querySelectorAll("[data-entry] .entry__head[aria-expanded='true']").forEach(function(openHead){
        if (openHead !== head){
          openHead.setAttribute("aria-expanded", "false");
          openHead.nextElementSibling.style.maxHeight = null;
        }
      });
      head.setAttribute("aria-expanded", String(!isOpen));
      body.style.maxHeight = isOpen ? null : body.scrollHeight + "px";
    });
  });

  /* ---------------- Terminal typing sequence ---------------- */
  var terminalBody = document.getElementById("terminalBody");
  var lines = [
    { prompt: "$ ", text: "whoami", type: "cmd" },
    { text: "Panchumarthi Tarun", type: "out" },
    { prompt: "$ ", text: "role --current", type: "cmd" },
    { text: "AIML undergraduate, VVIT", type: "out" },
    { prompt: "$ ", text: "stack --list", type: "cmd" },
    { text: "Python · Java · Flutter · Flask · SQL", type: "out" },
    { prompt: "$ ", text: "status", type: "cmd" },
    { text: "open to internships & entry-level roles", type: "out", highlight: true }
  ];

  function typeLines(){
    if (!terminalBody) return;
    if (reduceMotion){
      lines.forEach(function(l){ terminalBody.appendChild(renderStaticLine(l)); });
      return;
    }
    var i = 0;
    var speedTyping = 26;
    var pauseAfterLine = 260;

    function renderStaticLine(l){
      var div = document.createElement("div");
      div.className = "terminal__line";
      if (l.type === "cmd"){
        div.innerHTML = '<span class="terminal__prompt">' + l.prompt + '</span><span class="terminal__val"></span>';
      } else {
        div.innerHTML = '<span class="terminal__val" style="' + (l.highlight ? 'color:#E7A339' : '') + '"></span>';
      }
      return div;
    }

    function next(){
      if (i >= lines.length){
        var cursor = document.createElement("span");
        cursor.className = "terminal__cursor";
        terminalBody.appendChild(cursor);
        return;
      }
      var l = lines[i];
      var lineEl = document.createElement("div");
      lineEl.className = "terminal__line";
      var promptSpan = "";
      if (l.type === "cmd"){
        promptSpan = '<span class="terminal__prompt">' + l.prompt + '</span>';
      }
      lineEl.innerHTML = promptSpan + '<span class="terminal__val"></span>';
      terminalBody.appendChild(lineEl);
      var valSpan = lineEl.querySelector(".terminal__val");
      if (l.highlight) valSpan.style.color = "#E7A339";

      var text = l.text;
      var c = 0;
      var typeSpeed = l.type === "cmd" ? speedTyping : 12;

      (function typeChar(){
        if (c < text.length){
          valSpan.textContent += text.charAt(c);
          c++;
          setTimeout(typeChar, typeSpeed);
        } else {
          i++;
          setTimeout(next, pauseAfterLine);
        }
      })();
    }
    next();
  }

  setTimeout(typeLines, 50);

})();
