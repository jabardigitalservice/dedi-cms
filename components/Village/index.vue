<template>
  <div class="data-village">
    <SubHeader v-bind="headerDataVillage" />
    <div class="data-village__datatable">
      <div class="data-village__datatable-header">
        <div class="data-village__datatable-header-box-right">
          <BaseButton variant="secondary">
            <template #icon>
              <div class="data-village__datatable-header-add">
                <div class="data-village__datatable-header-plus-icon">
                  <jds-icon size="14px" name="plus-bold" />
                </div>
                Tambah Desa
              </div>
            </template>
          </BaseButton>
        </div>
        <jds-search
          v-model="search"
          small
          icon
          :button="false"
          class="data-village__datatable-header-search"
          placeholder="Cari Data"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { headerDataVillage } from '@/constants/dataVillage'
export default {
  name: 'ComponentVillage',
  layout: 'Dashboard',
  data () {
    return {
      search: '',
      headerDataVillage
    }
  }
}
</script>

<style lang="postcss">
@import './Village.pcss';
</style>
