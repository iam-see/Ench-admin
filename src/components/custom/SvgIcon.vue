<template>
  <svg aria-hidden="true" :width="`${props.size}px`">
    <use :xlink:href="symbolId" fill="currentColor" />
  </svg>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
const props = defineProps({
  prefix: {
    type: String,
    default: 'icon',
  },
  name: {
    type: String,
    required: true,
  },
  size: {
    type: Number,
    default: 18,
  },
});
const symbolId = computed(() => `#${props.prefix}-${props.name}`);
</script>
