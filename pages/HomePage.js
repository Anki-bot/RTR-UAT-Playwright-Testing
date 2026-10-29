export class HomePage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;

    // 1. Navbar Locators
    this.navMutualFund = page.getByText("Mutual Fund", { exact: true });
    this.navNps = page.getByText("NPS", { exact: true });

    // Sub-menu links that appear on hover
    this.exploreLink = page.getByRole("link", { name: "Explore" });
    this.watchlistLink = page.getByRole("link", { name: "Watchlist" });
    this.sipsLink = page.getByRole("link", { name: "SIPs" });

    // 2. Search Modal Locators
    this.searchTriggerBtn = page
      .locator("button")
      .filter({ hasText: "Search" })
      .first();
    this.searchInput = page.getByPlaceholder(/Search for/i);
    this.trendingSearchesHeading = page.getByText("Trending Searches");
    this.filterPillAll = page.getByRole("button", { name: "All" });
    this.filterPillNps = page.getByRole("button", { name: "NPS" });
    this.searchResults = page.locator(
      "button.search-result-item, div.search-result-item",
    );

    // 3. Hero & Insurance Locators
    this.healthInsuranceCard = page
      .locator("div")
      .filter({ hasText: /^Health Insurance$/ })
      .first();
    this.insuranceModal = page.getByRole("dialog");
    this.crossSellCheckbox = page.getByRole("checkbox");
    this.submitInterestBtn = page.getByRole("button", { name: "Submit" });
    this.thankYouMessage = page.getByText("Thank you for your interest");
  }

  async goto() {
    await this.page.goto("/");
  }
}
