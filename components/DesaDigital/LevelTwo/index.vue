<template>
  <div class="level-two">
    <SubHeader v-bind="header" />
  </div>
</template>

<script>
import { headerDesaDigital } from '@/constants/dataVillage'
export default {
  name: 'ComponentDesaDigitalLevelTwo',
  data () {
    return {
      header: headerDesaDigital[1]
    }
  }
}
</script>

<style lang="postcss">

</style>
