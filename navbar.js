// Initialize navbar functionality when the document is ready
document.addEventListener('DOMContentLoaded', function() {
    const navbarHTML = `
        <aside class="sidebar">
            <div class="logo-section">
                <img  style="margin-top: 25px;" src="Farm Cove Logo with text White & hero colour.png" alt="Farm Cove Logo" class="logo-image">
                <div class="divider3" style="margin-top: 25px;"></div>
                <a href="film-details.html" class="movie-title" style="color: #32B8CD; text-align: center; margin: 15px 0; font-size: 16px; font-weight: 600; letter-spacing: 0.5px; text-decoration: none; display: block; transition: color 0.3s ease;" onmouseover="this.style.color='#FFFFFF'" onmouseout="this.style.color='#32B8CD'">${localStorage.getItem('selectedMovie') || 'Monsoon Melody'}</a>
                <div class="divider3"></div>
            </div>
            <nav>
                <ul class="sidebar-menu">
                    <li class="menu-item">
                        <button class="nav-button">
                            <a href="index.html" class="nav-button"><span class="circle-larger"></span> Home</a>
                        </button>
                    </li>
                    <li class="menu-item dropdown">
                        <button class="nav-button dropdown-toggle">
                            <span class="circle-larger"></span> Setup
                            <span class="arrow">&#9660;</span>
                        </button>
                        <ul class="submenu">
                            <li><a href="bfi.html" class="nav-button"><span class="circle"></span> BFI Hub</a></li>
                            <li><a href="compliance-documents.html" class="nav-button"><span class="circle"></span> Compliance Documents</a></li>
                        </ul>
                    </li>
                    <li class="menu-item dropdown">
                        <button class="nav-button dropdown-toggle">
                            <span class="circle-larger"></span> Management
                            <span class="arrow">&#9660;</span>
                        </button>
                        <ul class="submenu">
                            <li><a href="approvals.html" class="nav-button"><span class="circle"></span> Approvals</a></li>
                            <li><a href="crew-management.html" class="nav-button"><span class="circle"></span> Crew Management</a></li>
                            <li><a href="supplier-management.html" class="nav-button"><span class="circle"></span> Supplier Management</a></li>
                            <li><a href="schedule-payments.html" class="nav-button"><span class="circle"></span> Schedule Payments</a></li>
                            <li><a href="logging.html" class="nav-button"><span class="circle"></span> Logging</a></li>
                            <li><a href="reconciliations.html" class="nav-button"><span class="circle"></span> Reconciliations</a></li>
                        </ul>
                    </li>
                    <li class="menu-item dropdown">
                        <button class="nav-button dropdown-toggle">
                            <span class="circle-larger"></span> Reporting
                            <span class="arrow">&#9660;</span>
                        </button>
                        <ul class="submenu">
                            <li><a href="reports.html" class="nav-button"><span class="circle"></span> Reports</a></li>
                            <li><a href="transactions.html" class="nav-button"><span class="circle"></span> Transactions</a></li>
                        </ul>
                    </li>
                </ul>
            </nav>
        </aside>
    `;

    const navbarPlaceholder = document.getElementById("navbar-placeholder");

    if (!navbarPlaceholder) {
        console.error("Navbar placeholder not found!");
        return;
    }

    // Insert navbar HTML
    navbarPlaceholder.innerHTML = navbarHTML;

    // Highlight the active button based on the current page
    highlightActiveButton();
});

/**
 * Highlights the active navigation button and expands dropdowns if needed.
 */
function highlightActiveButton() {
    // Get the current page name from the URL
    const currentPage = window.location.pathname.split("/").pop();

    // Map dropdowns to their respective pages
    const dropdownPages = {
        "Management": ["approvals.html", "approvals-review.html", "crew-management.html", "crew-management-review.html", "supplier-management-review.html", "john-invoices.html", "invoice-page.html", "crew-management-review-starter.html", "crew-management-review-proof.html", "schedule-payments.html", "pay.html", "logging.html", "logging-review.html", "logging-details-driver.html", "logging-details.html", "reconciliations.html", "reconciliations-overlay.html", "reconciliations-pending.html", "reconciliations-overlay-requested.html", "reconciliations-requested.html", "reconciliations-overlay-pending.html"],
        "Setup": ["bfi.html", "compliance-documents.html", "bfi-films-set-in-the-uk.html", "bfi-films-set-in-the-uk2.html", "bfi-pdf.html", "bfi-draft-manage.html", "bfi-synopsis.html", "compliance-documents-details.html", "compliance-documents-details-gen.html", "compliance-documents-details-sent.html", "compliance-documents-details-requested.html", "compliance-documents-details-draft.html", "compliance-documents-details-queried.html"],
        "Reporting": ["reports.html", "transactions.html", "transactions-review.html"]
    };

    // Add pages from the screenshot to Crew Management group
    const crewManagementPages = ["john-cable.html", "john-boom.html", "john-fuel.html", "john-headphones.html"];

    // Add pages from the screenshot to Supplier Management group
    const supplierManagementPages = ["kit.html", "meal.html", "micro.html", "recorder.html", "travel-expenses.html", "accessories.html"];

    // Find all nav links
    const navLinks = document.querySelectorAll(".sidebar-menu a");

    let foundActive = false;

    // Highlight the matching link
    navLinks.forEach(link => {
        const href = link.getAttribute("href");
        if (
            href === currentPage ||
            (currentPage === "approvals-review.html" && href === "approvals.html") ||
            (currentPage === "pay.html" && href === "schedule-payments.html") ||
            (["crew-management-review.html", "john-invoices.html", "invoice-page.html", "crew-management-review-starter.html", "crew-management-review-proof.html", ...crewManagementPages].includes(currentPage) && href === "crew-management.html") ||
            (["logging-review.html", "logging-details-driver.html", "logging-details.html"].includes(currentPage) && href === "logging.html") ||
            (["reconciliations-overlay.html", "reconciliations-pending.html", "reconciliations-overlay-requested.html", "reconciliations-requested.html", "reconciliations-overlay-pending.html"].includes(currentPage) && href === "reconciliations.html") ||
            (["supplier-management-review.html", "supplier-invoice-page.html", "supplier-invoices.html", ...supplierManagementPages].includes(currentPage) && href === "supplier-management.html") ||
            (["bfi-films-set-in-the-uk.html", "bfi-films-set-in-the-uk2.html", "bfi-pdf.html", "bfi-draft-manage.html", "bfi-synopsis.html"].includes(currentPage) && href === "bfi.html") ||
            (["compliance-documents-details.html", "compliance-documents-details-gen.html", "compliance-documents-details-sent.html", "compliance-documents-details-requested.html", "compliance-documents-details-draft.html", "compliance-documents-details-queried.html"].includes(currentPage) && href === "compliance-documents.html") ||
            (currentPage === "transactions-review.html" && href === "transactions.html")
        ) {
            link.classList.add("active");
            const circle = link.querySelector(".circle");
            if (circle) circle.classList.add("active");
            foundActive = true;

            // Check if this link is inside a dropdown
            const submenu = link.closest(".submenu");
            if (submenu) {
                submenu.classList.add("active"); // Show the dropdown menu
                submenu.style.display = "block"; // Ensure the dropdown is displayed

                const dropdownToggle = submenu.previousElementSibling;
                if (dropdownToggle) {
                    dropdownToggle.classList.add("active");

                    // Activate the circle-larger for the parent dropdown
                    const circleLarger = dropdownToggle.querySelector(".circle-larger");
                    if (circleLarger) circleLarger.classList.add("active");

                    dropdownToggle.querySelector(".arrow").innerHTML = "&#9650;"; // Set arrow up
                }
            }
        }
    });

    // Highlight the parent dropdown if the current page belongs to it
    Object.keys(dropdownPages).forEach(dropdown => {
        if (dropdownPages[dropdown].includes(currentPage)) {
            const dropdownButton = Array.from(document.querySelectorAll(".dropdown-toggle"))
                .find(button => button.textContent.trim().includes(dropdown));

            if (dropdownButton) {
                dropdownButton.classList.add("active");

                // Activate the circle-larger for the dropdown
                const circleLarger = dropdownButton.querySelector(".circle-larger");
                if (circleLarger) {
                    circleLarger.classList.add("active");
                }

                const dropdownMenu = dropdownButton.nextElementSibling;
                if (dropdownMenu) {
                    dropdownMenu.style.display = "block"; // Ensure dropdown is expanded
                    dropdownButton.querySelector(".arrow").innerHTML = "&#9650;"; // Set arrow up
                }
            }
        }
    });

    if (!foundActive) {
        console.warn("No matching link found for current page:", currentPage);
    }

    // Add dropdown toggle functionality
    initializeDropdowns();
}

/**
 * Initializes dropdown toggle functionality.
 */
function initializeDropdowns() {
    document.querySelectorAll('.dropdown-toggle').forEach(button => {
        button.addEventListener('click', () => {
            const currentDropdown = button.nextElementSibling; // Find the dropdown menu
            const arrow = button.querySelector('.arrow'); // Find the arrow icon

            // Close all other dropdowns
            document.querySelectorAll('.submenu.active').forEach(submenu => {
                if (submenu !== currentDropdown) {
                    submenu.classList.remove('active');
                    submenu.style.display = 'none';
                    const otherButton = submenu.previousElementSibling;
                    if (otherButton) {
                        otherButton.classList.remove('active');
                        const otherArrow = otherButton.querySelector('.arrow');
                        if (otherArrow) {
                            otherArrow.innerHTML = '&#9660;'; // Arrow down
                        }
                    }
                }
            });

            // Toggle the current dropdown
            if (currentDropdown.classList.contains("active")) {
                currentDropdown.classList.remove("active");
                currentDropdown.style.display = "none";
                arrow.innerHTML = "&#9660;"; // Arrow down
            } else {
                currentDropdown.classList.add("active");
                currentDropdown.style.display = "block";
                arrow.innerHTML = "&#9650;"; // Arrow up
            }
        });
    });
}
