## ✅ Express Route Tester – Pro Features TODO

This checklist outlines advanced features to implement, organized by skill level and impact.

---

### 🟢 Beginner to Intermediate

#### 🔹 High Impact

- [x] 🔐 **Security/auth checks** — Warn if sensitive routes (e.g., `/admin`, `/delete`) lack authentication middleware.
- [x] 🧪 **CI/CD mode** — Add `--ci` flag to output JSON and fail gracefully when issues are detected.

#### 🔹 Medium Impact

- [ ] 🔍 **Tag-based filtering** — Allow filtering by method or path: `--only GET`, `--except /auth`, etc.
- [ ] 🧭 **Interactive CLI** — Use `inquirer` to guide users through route selection, export options, and previews.

---

### 🟡 Intermediate to Advanced

#### 🔹 High Impact

- [x] 📊 **Route coverage detection** — Detect unused middleware or routes without middleware coverage.
- [x] 📄 **OpenAPI export** — Generate `.yaml` or `.json` docs for Swagger compatibility.

#### 🔹 Medium–High Impact

- [ ] 💡 **HTTP client preview** — Display sample requests (headers, body, etc.) like a mock Postman preview.
- [ ] 🔗 **Route handler source mapping** — Show handler file and line numbers for better traceability.

---

### 🔴 Advanced

#### 🔹 Very High Impact

- [ ] 🧩 **Plugin system** — Support custom rules, output styles, or extensions via plugin architecture.

#### 🔹 Medium Impact

- [ ] 📦 **Express version compatibility** — Warn when deprecated Express features are in use, based on `package.json`.

---

> Tip: Tackle these features incrementally and update this checklist to track your progress.
