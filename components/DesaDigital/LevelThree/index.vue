<template>
  <div class="level-three">
    <SubHeader v-bind="header" />
  </div>
</template>

<script>
import { headerDesaDigital } from '@/constants/dataVillage'
export default {
  name: 'ComponentDesaDigitalLevelThree',
  data () {
    return {
      header: headerDesaDigital[2]
    }
  }
}
</script>

<style lang="postcss">

</style>
