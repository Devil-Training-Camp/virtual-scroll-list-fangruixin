# virtual-scroll-list-fangruixin
A list component with high performance under large amount of data

## Install

```shell
npm install virtual-scroll-list-vue
# or
yarn add virtual-scroll-list-vue
# or
pnpm install virtual-scroll-list-vue
```

## Usage

```html
<template>
  <VirtualScrollList :items="items" height="500px">
    <template #default="{ item }">
      <!-- your component -->
    </template>
  </VirtualScrollList>
</template>

<script lang="ts" setup>
import { VirtualScrollList } from 'virtual-scroll-list-vue'

const items = ref([])
</script>
```

## Contributing

See CONTRIBUTING.md

## License

MIT