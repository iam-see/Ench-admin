<template>
  <n-card>
    <md-editor v-model="text" :preview-only="false" />
  </n-card>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import MdEditor from 'md-editor-v3';
import 'md-editor-v3/lib/style.css';
// https://github.com/imzbf/md-editor-v3/blob/dev/README-CN.md

const text = ref('# Hello Editor');
</script>

<style scoped></style>
