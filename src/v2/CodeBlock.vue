<script setup lang="ts">
import {ref} from 'vue';
const props=defineProps<{code:string;label:string}>();
const message=ref('');
async function copy(){
 try{await navigator.clipboard.writeText(props.code);message.value='已複製。';}
 catch{message.value='瀏覽器未允許複製，請選取下方程式碼手動複製。';}
}
</script>
<template><div class="v2-code-block"><div class="v2-code-heading"><span>{{label}}</span><button type="button" :aria-label="'複製'+label" @click="copy">複製</button></div><pre><code>{{code}}</code></pre><p role="status">{{message}}</p></div></template>
