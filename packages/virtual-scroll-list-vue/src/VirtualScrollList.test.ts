import { expect, test } from 'vitest'

// CR: 啊这，无效 test
test('adds 1 + 2 to equal 3', () => {
  expect(1 + 2).toBe(3)
})