<script lang="ts" setup generic="T extends object">
import { computed, nextTick, onMounted, ref, watch } from 'vue'

const props = withDefaults(defineProps<{
  items: T[]
  height?: string
  itemHeight?: number
  getId?: (item: T) => string | number | symbol
}>(), {
  height: '100%',
  getId: (item: T) => (item as any).id,
})

const viewportEl = ref<HTMLDivElement | null>(null)

const contentEl = ref<HTMLDivElement | null>(null)

const start = ref(0)

const end = ref(0)

const heightMap: number[] = []

let rows: HTMLCollectionOf<HTMLElement> | undefined

const viewportHeight = computed(() => viewportEl.value?.offsetHeight || 0)

const visibleItems = computed(
  () => props.items.slice(start.value, end.value),
)

watch([
  () => props.items,
  viewportHeight,
  () => props.itemHeight,
], () => {
  refresh(props.items, viewportHeight.value, props.itemHeight)
})

const top = ref(0)

const bottom = ref(0)

let averageHeight: number

onMounted(() => {
  rows = contentEl.value?.getElementsByClassName('virtual-list-row') as HTMLCollectionOf<HTMLElement>
})

async function refresh(items: T[], viewportHeight: number, itemHeight?: number) {
  const viewport = viewportEl.value
  if (!viewport)
    return

  if (!rows)
    return

  const { scrollTop } = viewport

  await nextTick() // wait until the DOM is up to date

  let contentHeight = top.value - scrollTop
  let i = start.value

  while (contentHeight < viewportHeight && i < items.length) {
    let row = rows[i - start.value]

    if (!row) {
      end.value = i + 1
      await nextTick() // render the newly visible row
      row = rows[i - start.value]
    }

    const rowHeight = heightMap[i] = itemHeight || row.offsetHeight
    contentHeight += rowHeight
    i += 1
  }

  end.value = i

  const remaining = items.length - end.value
  averageHeight = (top.value + contentHeight) / end.value

  bottom.value = remaining * averageHeight
  heightMap.length = items.length
}

async function handleScroll() {
  const viewport = viewportEl.value
  if (!viewport)
    return

  if (!rows)
    return

  const { scrollTop } = viewport

  const oldStart = start.value

  for (let v = 0; v < rows.length; v += 1)
    heightMap[start.value + v] = props.itemHeight || rows[v].offsetHeight

  let i = 0
  let y = 0

  while (i < props.items.length) {
    const rowHeight = heightMap[i] || averageHeight
    if (y + rowHeight > scrollTop) {
      start.value = i
      top.value = y

      break
    }

    y += rowHeight
    i += 1
  }

  while (i < props.items.length) {
    y += heightMap[i] || averageHeight
    i += 1

    if (y > scrollTop + viewportHeight.value)
      break
  }

  end.value = i

  const remaining = props.items.length - end.value
  averageHeight = y / end.value

  while (i < props.items.length) heightMap[i++] = averageHeight
  bottom.value = remaining * averageHeight

  // prevent jumping if we scrolled up into unknown territory
  if (start.value < oldStart) {
    await nextTick()

    let expected_height = 0
    let actual_height = 0

    for (let i = start.value; i < oldStart; i += 1) {
      if (rows[i - start.value]) {
        expected_height += heightMap[i]
        actual_height += props.itemHeight || rows[i - start.value].offsetHeight
      }
    }

    const d = actual_height - expected_height
    viewport.scrollTo(0, scrollTop + d)
  }
}
</script>

<template>
  <div
    ref="viewportEl"
    class="virtual-list-viewport"
    style="position: relative; overflow-y: auto; -webkit-overflow-scrolling: touch;"
    :style="{ height }"
    @scroll="handleScroll"
  >
    <div
      ref="contentEl"
      class="virtual-list-content"
      :style="{ paddingTop: `${top}px`, paddingBottom: `${bottom}px` }"
    >
      <div
        v-for="item in visibleItems"
        :key="getId(item)"
        class="virtual-list-row"
        style="overflow: hidden;"
      >
        <slot :item="item" />
      </div>
    </div>
  </div>
</template>
