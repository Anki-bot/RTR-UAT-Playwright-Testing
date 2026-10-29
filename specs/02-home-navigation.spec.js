import { test, expect } from "@playwright/test";
import { HomePage } from "../pages/HomePage";
import homeMocks from "../mocks/home.mock.json";

test.describe("Home Page & Navigation Flows", () => {
  let homePage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    await homePage.goto();
  });

  test.describe("1. Navbar Mega-Menus", () => {
    test("Hovering Mutual Fund reveals correct sub-links", async ({ page }) => {
      // Hover over the top-level nav item
      await homePage.navMutualFund.hover();

      // Assert the mega-menu links appear
      await expect(homePage.exploreLink).toBeVisible();
      await expect(homePage.watchlistLink).toBeVisible();
      await expect(homePage.sipsLink).toBeVisible();
    });
  });

  test.describe("2. Global Search Modal", () => {
    test("Search opens, displays trending, and respects 500ms debounce", async ({
      page,
    }) => {
      await test.step("Open search modal and verify default state", async () => {
        await homePage.searchTriggerBtn.click();
        await expect(homePage.searchInput).toBeFocused();
        await expect(homePage.trendingSearchesHeading).toBeVisible();
      });

      await test.step("Type query and verify API debounce", async () => {
        let apiCallCount = 0;
        await page.route("**/api/search*", async (route) => {
          apiCallCount++;
          await route.fulfill({ json: homeMocks.searchSuccess });
        });

        // Type rapidly (faster than the 500ms debounce threshold)
        await homePage.searchInput.pressSequentially("Nifty", { delay: 50 });

        // Wait for the debounce timer to settle (500ms + buffer)
        await page.waitForTimeout(600);

        // Because of the 500ms debounce, the API should only be called ONCE,
        // not 5 times (once for every letter typed).
        expect(apiCallCount).toBe(1);
      });
    });
  });

  test.describe("3. Hero Section & Insurance Leads", () => {
    test("Submitting Health Insurance interest opens modal and captures lead", async ({
      page,
    }) => {
      await test.step("Open Health Insurance modal", async () => {
        await homePage.healthInsuranceCard.click();
        await expect(homePage.insuranceModal).toBeVisible();
      });

      await test.step("Mock lead API and submit form", async () => {
        await page.route("**/api/mf/create_insurance_lead", async (route) => {
          await route.fulfill({ json: homeMocks.insuranceLeadSuccess });
        });

        await homePage.crossSellCheckbox.click();
        await expect(homePage.submitInterestBtn).toBeEnabled();
        await homePage.submitInterestBtn.click();
      });

      await test.step("Verify success state", async () => {
        await expect(homePage.thankYouMessage).toBeVisible();
      });
    });
  });
});
 