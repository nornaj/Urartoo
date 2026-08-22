
class Component extends DCLogic {
  state = { active: "s1", tocHover: null, shareHover: null, shareStatus: "", faqOpen: 0, relHover: null };

  body = [
    { k: "h", id: "s1", text: "The slope decides, not you" },
    { k: "p", text: "Gutanasar is a lava dome an hour north of Yerevan, and the whole north face of it is covered in black glass. From the road it looks like a field of it — the kind of place where you imagine filling a bag in twenty minutes and driving home. That is not how it goes. Almost all of the material lying on the surface has been through thirty winters of freeze and thaw, and it is full of hairline fractures you cannot see until the stone is on the wheel." },
    { k: "p", text: "So the first day is not collecting. It is walking, picking things up, and putting almost all of them back down. I look for pieces that came out of the scree recently, where the fracture faces are still sharp rather than rounded, and I listen — a sound piece rings faintly when you tap two together, and a fractured one gives a dull knock. That test is the whole trip in a sentence." },
    { k: "f", text: "photograph · loose scree field, north face, morning shadow", caption: "The surface material is the least useful. Anything that has spent decades exposed is usually crazed through." },
    { k: "h", id: "s2", text: "What a usable piece looks like" },
    { k: "p", text: "The best obsidian on this dome is a deep neutral black with no brown cast, translucent at the thin edge when you hold it against the sky. If the edge glows warm, there is too much iron and it will take a muddy polish. If it glows at all evenly, the piece is sound through its body — a fracture shows up as a bright internal line the moment light passes through it." },
    { k: "q", text: "A sound piece rings when you tap it. A cracked one knocks. After a day on the slope your hands know before your eyes do." },
    { k: "p", text: "Size matters less than people expect. A pendant needs a finished stone about the width of a thumbnail, which means starting with something the size of a fist, because two thirds of the mass leaves in the first grinding and any hidden flaw means starting again." },
    { k: "h", id: "s3", text: "Carrying it down" },
    { k: "p", text: "Everything gets wrapped separately in cloth and carried in a canvas bag, not a rucksack pressed against the back. Obsidian will chip against obsidian on a two-hour walk down, and a chip in the wrong place turns a pendant blank into an offcut. By the end of three days I had eleven pieces worth taking home out of several hundred picked up." },
    { k: "f", text: "photograph · eleven wrapped pieces laid out on the workbench", caption: "Three days of walking, eleven blanks. Four of those survived cutting." },
    { k: "h", id: "s4", text: "At the wheel" },
    { k: "p", text: "Cutting happens wet and slowly, because obsidian carries heat badly and a fast cut will crack a stone that was perfect on the slope. Of the eleven, four made it to a finished cabochon. One of those four became the pendant in the sidebar of this note — a slightly asymmetric drop, because the flaw ran along one side and cutting it symmetrical would have cut into the good glass." },
    { k: "h", id: "s5", text: "Why the piece costs what it costs" },
    { k: "p", text: "Three days of walking, a tank of fuel, eleven blanks, four survivors, one finished piece worth selling. That arithmetic is the reason a single Urartoo pendant is not a production item and never will be. It also means the stone you receive has an address: this slope, this September, this bag." }
  ];

  relatedList = [
    { meta: "July 2025 · Vayots Dzor", title: "Why river garnet cuts differently than mine garnet", shot: "shallow river, hands sifting gravel" },
    { meta: "June 2025 · Syunik", title: "Turquoise from the old copper workings", shot: "veined turquoise in a palm, harsh light" },
    { meta: "May 2025 · Yerevan", title: "Setting a stone that refuses to be symmetrical", shot: "bench, files and half-finished settings" }
  ];

  faqList = [
    { q: "Can I ask for a stone from a specific place?", a: "Yes, and it is the most common request after a field note goes out. Tell me the region and the form you want and I will look on the next trip. The wait depends on the place — Gutanasar obsidian I can usually find within a month, Syunik turquoise sometimes takes a season." },
    { q: "How do I know the stone came from where you say?", a: "Every piece ships with a certificate naming the valley, the month it was found and the mineral. The field notes are the long version of the same record: if a piece came off a trip I wrote about, the certificate references the note." },
    { q: "Is obsidian durable enough for daily wear?", a: "For pendants and earrings, yes. For rings worn every day it is the wrong stone — it is glass, and glass chips against a doorframe. If you want an everyday ring I will steer you towards garnet, jasper or agate." },
    { q: "Do the pieces in a note stay available?", a: "Rarely for long. Each one is a single edition, and a note usually sells the piece it describes within a week or two. If it is gone, a commission from the same region is the closest thing." },
    { q: "Can I visit the workshop?", a: "The bench is in Yerevan and visits happen by arrangement. Write ahead — I am on the road for material a good part of the year." }
  ];

  shareDefs = [
    { key: "x", aria: "Share on X", d: "M4 4l16 16M20 4L4 20" },
    { key: "fb", aria: "Share on Facebook", d: "M15 3h-3a4 4 0 00-4 4v3H5v4h3v7h4v-7h3l1-4h-4V7a1 1 0 011-1h2z" },
    { key: "pin", aria: "Share on Pinterest", d: "M12 3a9 9 0 00-3.3 17.4M12 3a9 9 0 013.6 17.2M11 21l2.6-9M12 3a9 9 0 00-.9 18" },
    { key: "link", aria: "Copy link", d: "M10 13a4 4 0 005.7 0l3-3a4 4 0 00-5.7-5.7l-1.5 1.5M14 11a4 4 0 00-5.7 0l-3 3a4 4 0 005.7 5.7l1.5-1.5" }
  ];

  componentDidMount() {
    const ids = this.body.filter(b => b.k === "h").map(b => b.id);
    this._obs = new IntersectionObserver(entries => {
      const vis = entries.filter(e => e.isIntersecting)
        .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
      if (vis.length && vis[0].target.id !== this.state.active) {
        this.setState({ active: vis[0].target.id });
      }
    }, { rootMargin: "-96px 0px -60% 0px" });
    setTimeout(() => {
      ids.forEach(id => {
        const el = document.getElementById(id);
        if (el) this._obs.observe(el);
      });
    }, 100);
  }
  componentWillUnmount() { if (this._obs) this._obs.disconnect(); }

  share(key, aria) {
    if (key === "link" && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href).catch(() => {});
      this.setState({ shareStatus: "Link copied." });
    } else {
      this.setState({ shareStatus: aria.replace("Share on ", "Shared to ") + "." });
    }
    clearTimeout(this._st);
    this._st = setTimeout(() => this.setState({ shareStatus: "" }), 2600);
  }

  maskIcon(d, color) {
    const uri = "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23000' stroke-width='1.6' stroke-linecap='round'%3E%3Cpath d='" + encodeURIComponent(d) + "'/%3E%3C/svg%3E\")";
    return {
      width: "16px", height: "16px", display: "block", backgroundColor: color,
      maskImage: uri, WebkitMaskImage: uri,
      maskSize: "contain", WebkitMaskSize: "contain",
      maskRepeat: "no-repeat", WebkitMaskRepeat: "no-repeat",
      transition: "background-color 0.3s ease"
    };
  }

  renderVals() {
    const st = this.state;

    return {
      blocks: this.body.map(b => ({
        isHeading: b.k === "h", isPara: b.k === "p", isPull: b.k === "q", isFigure: b.k === "f",
        id: b.id || "", text: b.text, caption: b.caption || "",
        wrap: { marginBottom: b.k === "h" ? "18px" : b.k === "q" ? "34px" : b.k === "f" ? "36px" : "22px", marginTop: b.k === "h" ? "44px" : b.k === "q" ? "34px" : "0" }
      })),

      toc: this.body.filter(b => b.k === "h").map(b => {
        const on = st.active === b.id;
        const hov = st.tocHover === b.id;
        return {
          label: b.text, href: "#" + b.id,
          style: {
            display: "flex", alignItems: "center", gap: "12px", padding: "9px 0",
            fontSize: "14px", lineHeight: 1.45,
            fontWeight: on ? 500 : 400,
            color: on ? "#0C0E0D" : hov ? "#0C0E0D" : "#6E6A5F",
            transition: "color 0.3s ease"
          },
          markStyle: {
            width: on ? "18px" : "10px", height: "1px", flex: "0 0 auto",
            background: on ? "#B8860B" : "#C9C3B8",
            transition: "width 0.35s cubic-bezier(0.16,1,0.3,1), background 0.3s ease"
          },
          enter: () => this.setState({ tocHover: b.id }),
          leave: () => this.setState(s => (s.tocHover === b.id ? { tocHover: null } : null))
        };
      }),

      asideStyle: { position: "sticky", top: "96px", minWidth: 0 },

      shares: this.shareDefs.map(s => {
        const on = st.shareHover === s.key;
        return {
          aria: s.aria,
          style: {
            width: "38px", height: "38px", border: "1px solid " + (on ? "#0C0E0D" : "#D8D2C8"),
            background: on ? "#0C0E0D" : "transparent", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center", padding: 0,
            transition: "background 0.3s ease, border-color 0.3s ease"
          },
          iconStyle: this.maskIcon(s.d, on ? "#FAF8F5" : "#2C2F2E"),
          enter: () => this.setState({ shareHover: s.key }),
          leave: () => this.setState(x => (x.shareHover === s.key ? { shareHover: null } : null)),
          click: () => this.share(s.key, s.aria)
        };
      }),
      shareStatus: st.shareStatus,

      related: this.relatedList.map((r, k) => {
        const on = st.relHover === k;
        return {
          meta: r.meta, title: r.title, shot: r.shot,
          imgStyle: {
            position: "absolute", inset: 0, background: "#EDE7DE",
            display: "flex", alignItems: "center", justifyContent: "center", padding: "18px",
            transform: on ? "scale(1.04)" : "scale(1)",
            transition: "transform 0.9s cubic-bezier(0.16,1,0.3,1)"
          },
          enter: () => this.setState({ relHover: k }),
          leave: () => this.setState(s => (s.relHover === k ? { relHover: null } : null))
        };
      }),

      faqs: this.faqList.map((f, k) => {
        const open = st.faqOpen === k;
        return {
          q: f.q, a: f.a,
          rowStyle: {
            width: "100%", display: "flex", alignItems: "flex-start", justifyContent: "space-between",
            gap: "24px", background: "none", border: "none", cursor: "pointer",
            fontFamily: "'Instrument Sans', sans-serif", color: "#0C0E0D",
            padding: "22px 0", textAlign: "left"
          },
          iconStyle: {
            width: "26px", height: "26px", flex: "0 0 auto", display: "flex",
            alignItems: "center", justifyContent: "center", marginTop: "-1px",
            transform: open ? "rotate(45deg)" : "rotate(0deg)",
            transition: "transform 0.4s cubic-bezier(0.16,1,0.3,1)"
          },
          panelStyle: {
            display: "grid", gridTemplateRows: open ? "1fr" : "0fr", overflow: "hidden",
            opacity: open ? 1 : 0, visibility: open ? "visible" : "hidden",
            transition: "grid-template-rows 0.45s cubic-bezier(0.16,1,0.3,1), opacity 0.35s ease, visibility 0.35s ease"
          },
          toggle: () => this.setState(s => ({ faqOpen: s.faqOpen === k ? -1 : k }))
        };
      })
    };
  }
}
