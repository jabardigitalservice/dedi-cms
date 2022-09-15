</<template>
  <div class="level-four">
    <SubHeader v-bind="header" />
  </div>
</template>

<script>
import { headerDesaDigital } from '@/constants/dataVillage'
export default {
  name: 'ComponentDesaDigitalLevelFour',
  data () {
    return {
      header: headerDesaDigital[3]
    }
  }
}
</script>

<style lang="postcss">

</style>
