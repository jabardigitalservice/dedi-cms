</<template>
  <div class="level-one">
    <SubHeader v-bind="header" />
  </div>
</template>

<script>
import { headerDesaDigital } from '@/constants/dataVillage'
export default {
  name: 'ComponentDesaDigitalLevelOne',
  data () {
    return {
      header: headerDesaDigital[0]
    }
  }
}
</script>

<style lang="postcss">

</style>
