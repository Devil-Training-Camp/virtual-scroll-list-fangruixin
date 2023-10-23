<template>
  <div>
    Example
    <VirtualScrollList :items="logs" height="500px">
      <template #default="{ item }">
        <div class="log-card" :class="{
          'is-info': item.level === 'info',
          'is-warning': item.level === 'warning',
          'is-error': item.level === 'error',
        }">
          <span>
            <span style="color: #888;">
              {{ item.createTime }}
            </span>
            <span>
              {{ ' ' + item.content }}
            </span>
            <span v-if="!item.isExpanded" class="expand-button" @click="item.isExpanded = true">{{ ' Expand' }}</span>
          </span>
          <br />
          <span v-if="item.isExpanded">{{ item.detail }}</span>
        </div>
      </template>
    </VirtualScrollList>
  </div>
</template>

<script lang="ts" setup>
import { VirtualScrollList } from 'virtual-scroll-list-vue'
import { ref } from 'vue'

let uid = 0

function generateLog () {
  const logContent = Math.random()
  const content = logContent.toFixed(2)
  const detail = logContent
  uid++
  return {
    id: uid,
    level: ['info', 'warning', 'error'][
      Math.round(Math.random() * 3)
    ] || 'info',
    createTime: (new Date()).toString().substring(16, 24),
    content,
    detail,
    isExpanded: false,
  }
}

const logs = ref(
  Array(10000).fill(true).map(() => generateLog())
)
</script>

<style scoped>
.log-card {
  width: 300px;
  border: 1px solid;
  border-radius: 6px;
  padding: 16px;
}
.log-card + .log-card {
  margin-top: 12px;
}
.log-card.is-info {
  border-color: #0070f3;
  background-color: #d3e5ff;
  padding-top: 24px;
  padding-bottom: 24px;
}
.log-card.is-warning {
  border-color: #f5a623;
  background-color: #ffefcf;
}
.log-card.is-error {
  border-color: #e00;
  background-color: #f7d4d6;
  padding-top: 12px;
  padding-bottom: 12px;
}
.expand-button {
  display: none;
  cursor: pointer;
}
.log-card:hover .expand-button {
  display: inline;
}
</style>
