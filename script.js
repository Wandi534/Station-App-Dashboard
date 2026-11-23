const body = document.body;
const sidebar = document.querySelector("#sidebar");
const sidebarToggle = document.querySelector(".sidebar-toggle");
const themeButton = document.querySelector(".theme-button");
const globalSearch = document.querySelector("#globalSearch");
const tableSearch = document.querySelector("#tableSearch");
const statusFilter = document.querySelector("#statusFilter");
const categoryFilter = document.querySelector("#categoryFilter");
const reportRows = [...document.querySelectorAll(".report-row")];
const resultsCount = document.querySelector("#resultsCount");
const emptyState = document.querySelector("#emptyState");
const reportDialog = document.querySelector("#reportDialog");
const toast = document.querySelector("#toast");
let toastTimeout;

const statusSteps = ["New", "Under review", "Assigned", "In progress", "Resolved"];
const statusClasses = {
    "New": "new",
    "Under review": "review",
    "Assigned": "assigned",
    "In progress": "in-progress",
    "Resolved": "resolved"
};

function applyFilters() {
    const query = tableSearch.value.trim().toLowerCase();
    const status = statusFilter.value;
    const category = categoryFilter.value;
    let visibleCount = 0;

    reportRows.forEach((row) => {
        const matchesQuery = row.textContent.toLowerCase().includes(query);
        const matchesStatus = !status || row.dataset.status === status;
        const matchesCategory = !category || row.dataset.category === category;
        const isVisible = matchesQuery && matchesStatus && matchesCategory;
        row.hidden = !isVisible;
        if (isVisible) visibleCount += 1;
    });

    emptyState.hidden = visibleCount !== 0;
    resultsCount.textContent = `Showing ${visibleCount} ${visibleCount === 1 ? "report" : "reports"}`;
}

function setSearch(value, source) {
    if (source !== tableSearch) tableSearch.value = value;
    if (source !== globalSearch) globalSearch.value = value;
    applyFilters();
    if (source === globalSearch) document.querySelector("#reports").scrollIntoView({ behavior: "smooth" });
}

globalSearch.addEventListener("input", () => setSearch(globalSearch.value, globalSearch));
tableSearch.addEventListener("input", () => setSearch(tableSearch.value, tableSearch));
statusFilter.addEventListener("change", applyFilters);
categoryFilter.addEventListener("change", applyFilters);

sidebarToggle.addEventListener("click", () => {
    const isMobile = window.matchMedia("(max-width: 850px)").matches;
    if (isMobile) {
        const isOpen = sidebar.classList.toggle("open");
        sidebarToggle.setAttribute("aria-expanded", String(isOpen));
    } else {
        const isCollapsed = sidebar.classList.toggle("collapsed");
        body.classList.toggle("sidebar-collapsed", isCollapsed);
        sidebarToggle.setAttribute("aria-expanded", String(!isCollapsed));
    }
});

window.addEventListener("resize", () => {
    const isMobile = window.matchMedia("(max-width: 850px)").matches;
    sidebar.classList.remove("open");
    if (isMobile) body.classList.remove("sidebar-collapsed");
    sidebarToggle.setAttribute("aria-expanded", String(!isMobile && !body.classList.contains("sidebar-collapsed")));
});

document.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", () => {
        document.querySelector(".nav-link.active")?.classList.remove("active");
        link.classList.add("active");
        if (window.matchMedia("(max-width: 850px)").matches) {
            sidebar.classList.remove("open");
            sidebarToggle.setAttribute("aria-expanded", "false");
        }
    });
});

themeButton.addEventListener("click", () => {
    const isDark = body.classList.toggle("dark");
    themeButton.setAttribute("aria-pressed", String(isDark));
});

function renderTimeline(status) {
    const currentStep = statusSteps.indexOf(status);
    const timeline = document.querySelector("#reportTimeline");
    timeline.replaceChildren();

    statusSteps.slice(0, Math.max(currentStep + 1, 1)).forEach((step, index) => {
        const item = document.createElement("li");
        if (index < currentStep) item.classList.add("complete");
        if (index === currentStep) item.classList.add("current");
        const marker = document.createElement("span");
        marker.className = "timeline-marker";
        marker.setAttribute("aria-hidden", "true");
        const label = document.createElement("span");
        label.textContent = step;
        item.append(marker, label);
        timeline.append(item);
    });
}

function openReport(row) {
    const status = row.dataset.status;
    const photos = Number(row.dataset.photos);
    document.querySelector("#dialogId").textContent = row.dataset.id;
    document.querySelector("#dialogTitle").textContent = row.dataset.title;
    document.querySelector("#dialogCategory").textContent = row.dataset.category;
    document.querySelector("#dialogReported").textContent = row.dataset.reported;
    document.querySelector("#dialogDescription").textContent = row.dataset.description;
    document.querySelector("#dialogLocation").textContent = row.dataset.location;
    document.querySelector("#dialogDepartment").textContent = row.dataset.department;
    document.querySelector("#dialogPhotos").textContent = `${photos} ${photos === 1 ? "photo" : "photos"} attached`;

    const statusBadge = document.querySelector("#dialogStatus");
    statusBadge.className = `status-pill ${statusClasses[status]}`;
    statusBadge.replaceChildren();
    const statusDot = document.createElement("span");
    statusDot.setAttribute("aria-hidden", "true");
    statusBadge.append(statusDot, document.createTextNode(status));

    const evidence = document.querySelector("#evidencePreviews");
    evidence.replaceChildren();
    for (let index = 0; index < photos; index += 1) {
        const card = document.createElement("span");
        card.className = "evidence-card";
        const icon = document.createElement("i");
        icon.className = "uil uil-image";
        icon.setAttribute("aria-hidden", "true");
        const label = document.createElement("span");
        label.textContent = `Photo ${index + 1}`;
        card.append(icon, label);
        evidence.append(card);
    }

    renderTimeline(status);
    reportDialog.showModal();
}

reportRows.forEach((row) => {
    row.addEventListener("click", () => openReport(row));
    row.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            openReport(row);
        }
    });
});

document.querySelector(".dialog-close").addEventListener("click", () => reportDialog.close());
document.querySelector(".dialog-done").addEventListener("click", () => reportDialog.close());
reportDialog.addEventListener("click", (event) => {
    if (event.target === reportDialog) reportDialog.close();
});

document.querySelector("#exportButton").addEventListener("click", () => {
    const visibleRows = reportRows.filter((row) => !row.hidden);
    const fields = ["id", "title", "category", "location", "reported", "status", "department"];
    const escapeCsv = (value) => `"${String(value).replace(/"/g, '""')}"`;
    const csv = [
        fields.join(","),
        ...visibleRows.map((row) => fields.map((field) => escapeCsv(row.dataset[field])).join(","))
    ].join("\r\n");
    const downloadUrl = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const download = document.createElement("a");
    download.href = downloadUrl;
    download.download = "community-reports.csv";
    download.click();
    window.setTimeout(() => URL.revokeObjectURL(downloadUrl), 1000);
    showToast(`Exported ${visibleRows.length} ${visibleRows.length === 1 ? "report" : "reports"}.`);
});

document.querySelector(".notification-button").addEventListener("click", () => {
    showToast("Notifications will appear here when live reporting is connected.");
});

document.addEventListener("keydown", (event) => {
    if (event.key === "/" && !["INPUT", "TEXTAREA", "SELECT"].includes(document.activeElement.tagName)) {
        event.preventDefault();
        globalSearch.focus();
    }
});

function showToast(message) {
    toast.textContent = message;
    toast.classList.add("visible");
    window.clearTimeout(toastTimeout);
    toastTimeout = window.setTimeout(() => toast.classList.remove("visible"), 2600);
}