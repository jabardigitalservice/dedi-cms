<template>
  <div class="hero-banner-detail">
    <div class="hero-banner-detail__action">
      <BaseButton variant="primary" @click="$router.go(-1)">
        <template #icon>
          <div class="hero-banner-detail__action-button">
            <div class="hero-banner-detail__action-icon">
              <!-- eslint-disable-next-line vue/no-v-html -->
              <div v-html="require('~/assets/icons/arrow-left.svg?raw')" />
            </div>
            Kembali
          </div>
        </template>
      </BaseButton>
      <BaseButton variant="secondary" @click="editHeroBanner(item)">
        <template #icon>
          <div class="hero-banner-detail__action-button">
            <div class="hero-banner-detail__action-icon">
              <jds-icon size="14px" name="pencil" />
            </div>
            Ubah Data
          </div>
        </template>
      </BaseButton>
    </div>
    <div class="hero-banner-detail__content">
      <h1 class="hero-banner-detail__content-header">
        Detail Hero Banner
      </h1>
      <img class="hero-banner-detail__content-image" :src="item.image.path" :alt="item.title">
      <jds-simple-table class="hero-banner-detail__content-table">
        <thead>
          <tr>
            <th>Info Detail</th>
            <th />
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Judul</strong></td>
            <td>{{ item.title }}</td>
          </tr>
          <tr>
            <td>Link</td>
            <td>{{ item.link }}</td>
          </tr>
          <tr>
            <td>Status</td>
            <td>{{ item.is_active ? 'Aktif' : 'Non-Aktif' }}</td>
          </tr>
        </tbody>
      </jds-simple-table>
    </div>
    <HeroBannerEdit :show="showEditHeroBanner" :item="itemHeroBanner" @stored="refreshData" @close="showEditHeroBanner = false" />
  </div>
</template>

<script>
export default {
  name: 'ComponentHeroBannerDetail',
  props: {
    item: {
      type: Object,
      default: () => ({})
    }
  },
  data () {
    return {
      showEditHeroBanner: false,
      itemHeroBanner: {}
    }
  },
  methods: {
    editHeroBanner (item) {
      this.showEditHeroBanner = true
      this.itemHeroBanner = item
    },
    refreshData () {
      this.$emit('updated')
    }
  }
}
</script>

<style lang="postcss">
@import './HeroBannerDetail.pcss';
</style>
