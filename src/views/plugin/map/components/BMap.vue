<template>
  <div ref="domRef" class="w-full h-full"></div>
</template>

<script setup lang="ts">
import { useScriptTag } from '@vueuse/core';
import { onMounted, ref } from 'vue';
import { BAIDU_MAP_SDK_URL } from '@/config';

const { load } = useScriptTag(BAIDU_MAP_SDK_URL);
/* https://lbsyun.baidu.com/index.php?title=jspopular3.0 百度地图开发者文档 */

onMounted(() => {
  initMap();
});

const domRef = ref<HTMLDivElement>();
let map = null;

async function initMap() {
  await load();
  if (!domRef.value) return;
  map = new BMap.Map(domRef.value);
  const point = new BMap.Point(117.19, 31.84);
  map.centerAndZoom(point, 15);
  map.enableScrollWheelZoom();
}
</script>

<style scoped></style>
