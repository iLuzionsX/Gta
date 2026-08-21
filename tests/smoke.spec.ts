import { expect, test } from '@playwright/test'

test('renders the world without horizontal overflow', async ({ page }, testInfo) => {
  await page.goto('/')
  await expect(page.locator('canvas')).toBeVisible()
  await expect(page.getByTestId('hud')).toBeVisible()

  const metrics = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    innerWidth: window.innerWidth,
    scrollHeight: document.documentElement.scrollHeight,
    innerHeight: window.innerHeight,
  }))

  expect(metrics.scrollWidth).toBeLessThanOrEqual(metrics.innerWidth)
  expect(metrics.scrollHeight).toBeLessThanOrEqual(metrics.innerHeight)

  await page.screenshot({
    path: testInfo.outputPath('world.png'),
    animations: 'disabled',
    fullPage: true,
  })
})

test('mobile controls remain inside the safe viewport', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'mobile-chromium', 'Mobile-only geometry assertion')
  await page.goto('/')

  for (const id of ['joystick', 'action-cluster']) {
    const box = await page.getByTestId(id).boundingBox()
    expect(box).not.toBeNull()
    expect(box!.x).toBeGreaterThanOrEqual(0)
    expect(box!.y).toBeGreaterThanOrEqual(0)
    expect(box!.x + box!.width).toBeLessThanOrEqual(412)
    expect(box!.y + box!.height).toBeLessThanOrEqual(915)
  }
})
