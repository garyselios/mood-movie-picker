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

// Get URL parameter
export function getParam(param) {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    return urlParams.get(param);
}

// Initialize search functionality on any page
export function initSearch() {
    console.log('initSearch called');
    
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');
    
    console.log('Search input found:', searchInput);
    console.log('Search button found:', searchBtn);
    
    if (searchBtn && searchInput) {
        const performSearch = () => {
            const query = searchInput.value.trim();
            console.log('Searching for:', query);
            if (query) {
                window.location.href = `search.html?q=${encodeURIComponent(query)}`;
            }
        };
        
        // Remove old listeners to avoid duplicates
        searchBtn.removeEventListener('click', performSearch);
        searchInput.removeEventListener('keypress', performSearch);
        
        // Add new listeners
        searchBtn.addEventListener('click', performSearch);
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
        console.log('Search listeners added');
    } else {
        console.log('Search elements not found, retrying in 500ms...');
        setTimeout(() => initSearch(), 500);
    }
}