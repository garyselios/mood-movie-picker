// Load template from file
export async function loadTemplate(path) {
  const res = await fetch(path);
  if (res.ok) {
    return await res.text();
  }
  throw new Error(`Failed to load template: ${path}`);
}

// Render template into element
export function renderWithTemplate(template, parentElement) {
  parentElement.innerHTML = template;
}

// Load header and footer
export async function loadHeaderFooter() {
  try {
    const headerTemplate = await loadTemplate("/partials/header.html");
    const footerTemplate = await loadTemplate("/partials/footer.html");

    const headerElement = document.querySelector("#main-header");
    const footerElement = document.querySelector("#main-footer");

    if (headerElement) {
      renderWithTemplate(headerTemplate, headerElement);
    }
    if (footerElement) {
      renderWithTemplate(footerTemplate, footerElement);
    }
    console.log("Header and footer loaded");
  } catch (error) {
    console.error("Error loading header/footer:", error);
  }
}