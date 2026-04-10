
```
bansos-tracker-next
├─ .env
├─ .eslintrc.json
├─ .prettierignore
├─ .prettierrc
├─ ATTRIBUTIONS.md
├─ CONVERSION_GUIDE.md
├─ IMPLEMENTATION_PROGRESS.md
├─ QUICK_START_SEO.md
├─ README.md
├─ SEO_FIXES_FINAL.md
├─ SEO_IMPLEMENTATION_CHECKLIST.md
├─ SEO_OPTIMIZATION.md
├─ SIBANSOS-QR_API.postman_collection.json
├─ actions
│  └─ auth.ts
├─ app
│  ├─ (auth)
│  │  ├─ login
│  │  │  └─ page.tsx
│  │  └─ register
│  │     └─ page.tsx
│  ├─ (user)
│  │  ├─ _components
│  │  │  └─ data-table.tsx
│  │  ├─ _constants
│  │  │  └─ data.ts
│  │  ├─ _layouts
│  │  │  └─ home-layout.tsx
│  │  ├─ _stores
│  │  │  └─ use-user-store.ts
│  │  ├─ page.tsx
│  │  └─ types.ts
│  ├─ _components
│  │  ├─ auth-provider.tsx
│  │  └─ theme-provider.tsx
│  ├─ _stores
│  │  └─ useAuthStore.ts
│  ├─ admin
│  │  ├─ dashboard
│  │  │  └─ page.tsx
│  │  ├─ layout.tsx
│  │  ├─ notifikasi
│  │  │  └─ page.tsx
│  │  ├─ pengajuan
│  │  │  ├─ [id]
│  │  │  │  ├─ _components
│  │  │  │  │  └─ DetailPengajuanContent.tsx
│  │  │  │  └─ page.tsx
│  │  │  └─ page.tsx
│  │  ├─ pengguna
│  │  │  └─ page.tsx
│  │  ├─ penugasan
│  │  │  └─ page.tsx
│  │  ├─ periode
│  │  │  └─ page.tsx
│  │  └─ peta
│  │     └─ page.tsx
│  ├─ api
│  │  └─ image-to-base64
│  │     └─ route.ts
│  ├─ apple-icon.png
│  ├─ favicon.ico
│  ├─ fonts
│  │  ├─ GeistMonoVF.woff
│  │  └─ GeistVF.woff
│  ├─ globals.css
│  ├─ icon0.svg
│  ├─ icon1.png
│  ├─ layout.tsx
│  ├─ manifest.json
│  ├─ masyarakat
│  │  ├─ dashboard
│  │  │  └─ page.tsx
│  │  ├─ layout.tsx
│  │  ├─ notifikasi
│  │  │  └─ page.tsx
│  │  ├─ pengajuan
│  │  │  └─ page.tsx
│  │  ├─ profil
│  │  │  ├─ [step]
│  │  │  │  └─ page.tsx
│  │  │  ├─ _components
│  │  │  │  ├─ ProfilStep1Form.tsx
│  │  │  │  ├─ ProfilStep2Form.tsx
│  │  │  │  ├─ ProfilStep3Form.tsx
│  │  │  │  └─ StepIndicator.tsx
│  │  │  └─ page.tsx
│  │  └─ qrcode
│  │     └─ page.tsx
│  ├─ opengraph-image.alt.txt
│  ├─ opengraph-image.png
│  ├─ petugas
│  │  ├─ dashboard
│  │  │  └─ page.tsx
│  │  ├─ layout.tsx
│  │  ├─ riwayat
│  │  │  └─ page.tsx
│  │  └─ scan
│  │     └─ page.tsx
│  ├─ robots.txt
│  ├─ sitemap.ts
│  ├─ twitter-image.alt.txt
│  └─ twitter-image.png
├─ commitlint.config.js
├─ components
│  ├─ core
│  │  ├─ AppHeader.tsx
│  │  ├─ LogoutButton.tsx
│  │  ├─ ProtectedRoute.tsx
│  │  ├─ StatCard.tsx
│  │  ├─ StatusBadge.tsx
│  │  ├─ combobox-v2.tsx
│  │  ├─ date-range-picker.tsx
│  │  ├─ image-viewer.tsx
│  │  ├─ location-picker.tsx
│  │  └─ location-viewer.tsx
│  ├─ dialogs
│  │  ├─ create-assignment-dialog.tsx
│  │  ├─ create-user-dialog.tsx
│  │  └─ user-detail-dialog.tsx
│  ├─ shared
│  │  └─ pagination.tsx
│  └─ ui
│     ├─ accordion.tsx
│     ├─ alert-dialog.tsx
│     ├─ alert.tsx
│     ├─ avatar.tsx
│     ├─ badge.tsx
│     ├─ breadcrumb.tsx
│     ├─ button.tsx
│     ├─ calendar.tsx
│     ├─ card.tsx
│     ├─ carousel.tsx
│     ├─ chart.tsx
│     ├─ checkbox.tsx
│     ├─ command.tsx
│     ├─ dialog.tsx
│     ├─ dropdown-menu.tsx
│     ├─ form.tsx
│     ├─ hover-card.tsx
│     ├─ input-group.tsx
│     ├─ input-otp.tsx
│     ├─ input.tsx
│     ├─ label.tsx
│     ├─ navigation-menu.tsx
│     ├─ pagination.tsx
│     ├─ popover.tsx
│     ├─ progress.tsx
│     ├─ radio-group.tsx
│     ├─ resizable.tsx
│     ├─ scroll-area.tsx
│     ├─ select.tsx
│     ├─ separator.tsx
│     ├─ sheet.tsx
│     ├─ sidebar.tsx
│     ├─ skeleton.tsx
│     ├─ sonner.tsx
│     ├─ switch.tsx
│     ├─ table.tsx
│     ├─ textarea.tsx
│     ├─ toggle-group.tsx
│     ├─ toggle.tsx
│     └─ tooltip.tsx
├─ components.json
├─ guidelines
│  └─ Guidelines.md
├─ hooks
│  ├─ use-mobile.tsx
│  └─ useRouteProtection.ts
├─ json
│  └─ data.json
├─ lib
│  ├─ api-interceptor.ts
│  ├─ config.ts
│  ├─ date-utils.ts
│  ├─ qr-scanner-types.ts
│  └─ utils.ts
├─ next.config.mjs
├─ package-lock.json
├─ package.json
├─ postcss.config.mjs
├─ proxy.ts
├─ public
│  ├─ icons
│  └─ images
│     ├─ logo-final.png
│     ├─ logo-optimized.png
│     └─ logo.png
├─ schemas
│  ├─ auth.ts
│  ├─ cashflow.ts
│  └─ user.ts
├─ services
│  ├─ admin.ts
│  ├─ auth.ts
│  ├─ fetcher.ts
│  ├─ index.ts
│  ├─ masyarakat.ts
│  └─ petugas.ts
├─ tailwind.config.ts
└─ tsconfig.json

```