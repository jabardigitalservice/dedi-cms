<template>
  <div class="testimonial-detail">
    <div class="testimonial-detail__action">
      <BaseButton variant="primary" @click="$router.go(-1)">
        <template #icon>
          <div class="testimonial-detail__action-button">
            <div class="testimonial-detail__action-icon">
              <!-- eslint-disable-next-line vue/no-v-html -->
              <div v-html="require('~/assets/icons/arrow-left.svg?raw')" />
            </div>
            Kembali
          </div>
        </template>
      </BaseButton>
      <BaseButton variant="secondary" @click="showEditTestimonials = true">
        <template #icon>
          <div class="testimonial-detail__action-button">
            <div class="testimonial-detail__action-icon">
              <jds-icon size="14px" name="pencil" />
            </div>
            Ubah Data
          </div>
        </template>
      </BaseButton>
    </div>
    <div class="testimonial-detail__content">
      <h1 class="testimonial-detail__content-header">
        Detail Testimonial <span class="capitalize">{{ item.type }}</span>
      </h1>
      <jds-simple-table class="testimonial-detail__content-table">
        <thead>
          <tr>
            <th>Info Detail</th>
            <th />
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Foto Profil</strong></td>
            <td>
              <img width="90" height="90" class="rounded-full object-cover w-[90px] h-[90px]" :src="item.avatar.path" :alt="item.name">
            </td>
          </tr>
          <tr>
            <td><strong>Nama Pengguna</strong></td>
            <td>{{ item.name }}</td>
          </tr>
          <tr>
            <td><strong>Role</strong></td>
            <td class="capitalize">
              {{ item.type }}
            </td>
          </tr>
          <tr v-if="item.village.name">
            <td><strong>Desa</strong></td>
            <td>{{ item.village.name }}</td>
          </tr>
          <tr v-else>
            <td><strong>Mitra</strong></td>
            <td>{{ item.partner.name }}</td>
          </tr>
          <tr>
            <td><strong>Testimonial</strong></td>
            <td>{{ item.description }}</td>
          </tr>
          <tr>
            <td><strong>Status</strong></td>
            <td>{{ item.is_active ? 'Aktif' : 'Non-Aktif' }}</td>
          </tr>
        </tbody>
      </jds-simple-table>
    </div>
    <TestimonialsEdit :show="showEditTestimonials" :item="mItem" @stored="refreshData" @close="showEditTestimonials = false" />
  </div>
</template>

<script>
export default {
  name: 'ComponentTestimonialDetail',
  props: {
    item: {
      type: Object,
      default: () => ({})
    }
  },
  data () {
    return {
      showEditTestimonials: false,
      mItem: {}
    }
  },
  watch: {
    item: {
      handler (val) {
        this.mItem = {
          ...val,
          testimonial: val.description
        }
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    refreshData () {
      this.$emit('updated')
    }
  }
}
</script>

<style lang="postcss">
@import './TestimonialsDetail.pcss';
</style>
