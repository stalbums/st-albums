/* ============================================================
   S&T CUSTOM ALBUMS - WEBSITE TEXT AND PRICES
   Open with Notepad. Change the words between the "quotes" and
   the numbers, save, then upload the whole folder to Netlify.

   RULES
   - Keep every "quote", comma, and bracket [ ] { }.
   - Prices are plain numbers: 650 or 1200 (no $ sign, no comma).
   - Don't change any slug.
   - Use 0 for "no extra charge". Use null for "not offered".
   ============================================================ */
window.SITE = {

  // ---- Contact ----
  phone: "848-356-8546",
  email: "esty8546@gmail.com",

  // ---- Page text ----
  homeTagline: "Beautifully crafted albums that preserve your most cherished moments",
  albumsIntro: "Click an album to choose your size, cover and extras, and see your price.",
  boxesTitle: "Choose your box",
  boxesIntro: "A beautiful box to keep your album safe.",
  boxesFooter: "The perfect combination of quality, style and lasting memories.",
  galleryIntro: "A look inside albums we designed, spread by spread.",
  processIntro: "From your pictures to a finished album in six simple steps.",
  contactIntro: "Reach out with your occasion and we'll help you choose the right album.",
  closing: "Let's turn your memories into something beautiful.",
  spreadNote: "One spread is two facing pages. Design is included in every album.",

  // ---- Covers and colors ----
  // Each cover has a photo: [ "", "images/covers/name.jpg" ].
  // Photos go in the images/covers folder.
  // To offer colors, list one line per color with its name, for example:
  //   "Linen": [ ["Beige", "images/covers/linen-beige.jpg"],
  //              ["Grey",  "images/covers/linen-grey.jpg"] ],
  covers: {
    "Linen":          [ ["", "images/covers/linen.jpg"] ],
    "Suede & Velvet": [ ["", "images/covers/suede-velvet.jpg"] ],
    "Leatherette":    [ ["", "images/covers/leatherette.jpg"] ],
    "Photo":          [ ["", "images/covers/photo.jpg"] ],
    "Duotone":        [ ["", "images/covers/duotone.jpg"] ],
    "Silk":           [ ["", "images/covers/silk.jpg"] ],
    "Acrylic":        [ ["", "images/covers/acrylic.jpg"] ],
    "Acrylic Cameo":  [ ]
  },

  // ---- Albums ----
  // Each album has one or more options (Wedding has 2).
  //   sizes:   [ "size name", extra price, "photo" ]  - photo is optional:
  //            leave "" and a to-scale drawing shows instead.
  //            Size photos go in the images/sizes folder.
  //   covers:         included covers - the customer picks one, no charge.
  //   upgradeCovers:  show only when the customer ticks "Upgrade cover"
  //                   and add the upgradedCover price.
  //   box:     price to add a box, or null if not offered
  albums: [
    {
      slug: "wedding",  // don't change
      name: "Wedding Albums",
      short: "Choose the Master Album on its own, or the full package with albums for both sets of parents.",
      photo: "images/wedding.jpg",
      options: [
        {
          name: "Master Album",
          price: 650,
          includes: [
            { name: "Master Album", items: ["23 Spreads (46 Pages)", "10 × 10 inch", "Full design layout"] }
          ],
          sizes: [ ["10 × 10 inch", 0, ""], ["12 × 12 inch", 75, ""] ],
          covers: ["Linen", "Suede & Velvet", "Leatherette"],
          upgradeCovers: ["Duotone", "Acrylic"],
          upgradedCover: 30,
          addedSpread: 15,
          box: null,
          boxLabel: ""
        },
        {
          name: "Wedding Album Package",
          price: 1200,
          includes: [
            { name: "Master Album", items: ["23 Spreads (46 Pages)", "10 × 10 inch", "Full design layout"] },
            { name: "2 Parent Albums", items: ["16 Spreads (32 Pages) each", "8 × 8 inch", "Full design layout"] }
          ],
          sizes: [ ["10 × 10 inch", 0, ""], ["12 × 12 inch", 75, ""] ],
          covers: ["Linen", "Suede & Velvet", "Leatherette"],
          upgradeCovers: ["Duotone", "Acrylic"],
          upgradedCover: 30,
          addedSpread: 15,
          box: null,
          boxLabel: ""
        }
      ]
    },
    {
      slug: "engagement",  // don't change
      name: "Engagement Album",
      short: "Celebrate the vort with a classic, compact album.",
      photo: "images/engagement.jpg",
      options: [
        {
          name: "Engagement Album",
          price: 300,
          includes: [ { name: "Engagement Album", items: ["10 Spreads (20 Pages)", "Full design layout"] } ],
          sizes: [ ["8 × 8 inch", 0, ""] ],
          covers: ["Linen", "Suede & Velvet", "Leatherette"],
          upgradeCovers: ["Silk", "Duotone"],
          upgradedCover: 30,
          addedSpread: 15,
          box: null,
          boxLabel: ""
        }
      ]
    },
    {
      slug: "chussen-baby",  // don't change
      name: "Chussen / Baby Album",
      short: "A keepsake for the newest member of the family.",
      photo: "images/chussen-baby.jpg",
      options: [
        {
          name: "Chussen / Baby Album",
          price: 450,
          includes: [ { name: "Chussen / Baby Album", items: ["12 Spreads (24 Pages)", "Full design layout"] } ],
          sizes: [ ["8 × 8 inch", 0, ""], ["10 × 10 inch", 0, ""] ],
          covers: ["Linen", "Suede & Velvet", "Photo", "Leatherette"],
          upgradeCovers: ["Duotone", "Silk", "Acrylic Cameo"],
          upgradedCover: 30,
          addedSpread: 15,
          box: null,
          boxLabel: ""
        }
      ]
    },
    {
      slug: "bar-mitzvah",  // don't change
      name: "Bar Mitzvah Album",
      short: "Every moment of the simcha, beautifully kept.",
      photo: "images/bar-mitzvah.jpg",
      options: [
        {
          name: "Bar Mitzvah Album",
          price: 385,
          includes: [ { name: "Bar Mitzvah Album", items: ["13 Spreads (26 Pages)", "Full design layout"] } ],
          sizes: [ ["10 × 10 inch", 0, ""], ["8 × 8 inch", 0, ""] ],
          covers: ["Linen", "Suede & Velvet", "Photo", "Leatherette"],
          upgradeCovers: ["Duotone", "Silk", "Acrylic Cameo"],
          upgradedCover: 30,
          addedSpread: 15,
          box: 50,
          boxLabel: "Upgrade with a box"
        }
      ]
    },
    {
      slug: "upsherin",  // don't change
      name: "Upsherin Album",
      short: "A sweet keepsake of your little one's first haircut.",
      photo: "images/upsherin.jpg",
      options: [
        {
          name: "Upsherin Album",
          price: 350,
          includes: [ { name: "Upsherin Album", items: ["10 Spreads (20 Pages)", "Full design layout"] } ],
          sizes: [ ["8 × 8 inch", 0, ""] ],
          covers: ["Linen", "Photo"],
          upgradeCovers: ["Suede & Velvet", "Leatherette", "Silk"],
          upgradedCover: 30,
          addedSpread: 15,
          box: 50,
          boxLabel: "Add a box"
        }
      ]
    }
  ],

  // ---- Boxes ----
  boxes: [
    { name: "Presentation Box", text: "", photo: "images/boxes/5.jpg" },
    { name: "Gift Box", text: "", photo: "images/boxes/4.jpg" },
    { name: "Essence Box", text: "", photo: "images/boxes/3.jpg" },
    { name: "Design Box", text: "", photo: "images/boxes/2.jpg" },
    { name: "Acrylic Cover Box", text: "", photo: "images/boxes/1.jpg" }
  ],

  // ---- Our Work (the album clients flip through) ----
  // Pages show in this order. Put the pictures in images/album.
  albumPages: [
    "images/album/1.jpg",
    "images/album/2.jpg",
    "images/album/3.jpg",
    "images/album/4.jpg",
    "images/album/5.jpg",
    "images/album/6.jpg",
    "images/album/7.jpg"
  ],

  // ---- The Process ----
  steps: [
    ["Choose your album", "Pick your album size, cover style, fabric and color. The color can be changed until the album is done."],
    ["Send your photos", "Send us your photos by email, SD card, USB, or printed photos."],
    ["We design it", "We design your album and send you a preview for your approval."],
    ["Review and adjust", "You'll have 4 days to request any corrections and adjustments."],
    ["Off to print", "Once all spreads are ready and approved, we send it to print. This takes 2 weeks."],
    ["Your album is ready", "Your beautiful album will be ready!"]
  ]
};
