<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import {
  DsBreadcrumb, DsStatCard, DsSearchBar, DsFormItem, DsInput, DsSelect,
  DsDateRangePicker, DsDatePicker, DsActionBar, DsButton, DsTable, DsStatusTag,
  DsDropdown, DsPagination, DsModal, DsDrawer, DsDescription, DsCollapse,
  DsTimeline, DsSteps, DsTextarea, DsNumberInput, DsFileUpload, DsTagInput,
  DsSortableList, DsSkeleton, DsFilterChip, DsToast, DsConfirm, DsNotice,
  DsBadge, DsAvatar, DsTooltip,
} from 'dscore-ui-vue'
import { usePermission, setupPermission } from 'dscore-ui-vue'

// ─── Types ───
interface Movie {
  id: number
  title: string
  titleEn: string
  genre: string[]
  status: 'screening' | 'upcoming' | 'ended' | 'draft'
  releaseDate: string
  rating: number
  director: string
  description: string
  poster: string
  reviewCount: number
}

// ─── Permission ───
setupPermission({
  permissions: ['movie.read', 'movie.create', 'movie.edit'],
  roles: ['admin'],
})
const { hasPermission } = usePermission()
const canDelete = computed(() => hasPermission('movie.delete'))
const canExport = computed(() => hasPermission('movie.export'))

// ─── Status Map ───
const statusMap: Record<string, { label: string; status: string }> = {
  screening: { label: '상영 중', status: 'active' },
  upcoming: { label: '개봉 예정', status: 'pending' },
  ended: { label: '종료', status: 'inactive' },
  draft: { label: '임시저장', status: 'rejected' },
}

// ─── Genre Options ───
const genreOptions = [
  { value: '액션', label: '액션' },
  { value: '드라마', label: '드라마' },
  { value: '코미디', label: '코미디' },
  { value: 'SF', label: 'SF' },
  { value: '공포', label: '공포' },
  { value: '로맨스', label: '로맨스' },
  { value: '애니메이션', label: '애니메이션' },
  { value: '범죄', label: '범죄' },
  { value: '스릴러', label: '스릴러' },
  { value: '미스터리', label: '미스터리' },
  { value: '역사', label: '역사' },
  { value: '판타지', label: '판타지' },
  { value: '가족', label: '가족' },
]

const statusOptions = [
  { value: '', label: '전체' },
  { value: 'screening', label: '상영중' },
  { value: 'upcoming', label: '개봉예정' },
  { value: 'ended', label: '종료' },
  { value: 'draft', label: '임시저장' },
]

// ─── Sample Data ───
const rawMovies: Movie[] = [
  { id: 1, title: '서울의 봄', titleEn: 'Seoul Spring', genre: ['드라마', '역사'], status: 'ended', releaseDate: '2025-11-22', rating: 9.1, director: '김성수', description: '1979년 12월 12일, 대한민국 수도 서울에서 벌어진 군사 반란 사건을 다룬 작품.', poster: '서봄', reviewCount: 1247 },
  { id: 2, title: '파묘', titleEn: 'Exhuma', genre: ['공포', '미스터리'], status: 'screening', releaseDate: '2026-02-22', rating: 8.3, director: '장재현', description: '무덤 이장을 의뢰받은 풍수사와 장의사가 기이한 현상에 휘말리는 이야기.', poster: '파묘', reviewCount: 892 },
  { id: 3, title: '범죄도시 4', titleEn: 'The Roundup: Punishment', genre: ['액션', '범죄'], status: 'screening', releaseDate: '2026-03-10', rating: 7.8, director: '허명행', description: '괴물 형사 마석도가 온라인 도박 범죄 조직을 추적한다.', poster: '범도4', reviewCount: 2103 },
  { id: 4, title: '듄: 파트 3', titleEn: 'Dune: Part Three', genre: ['SF', '액션'], status: 'upcoming', releaseDate: '2026-06-15', rating: 0, director: '드니 빌뇌브', description: '아라키스의 운명을 건 최종 전쟁이 시작된다.', poster: '듄3', reviewCount: 0 },
  { id: 5, title: '소년시대', titleEn: 'Boyhood', genre: ['드라마'], status: 'ended', releaseDate: '2025-09-13', rating: 8.7, director: '석준서', description: '1980년대 소년들의 성장기를 그린 작품.', poster: '소년', reviewCount: 567 },
  { id: 6, title: '하이재킹', titleEn: 'Hijacking', genre: ['액션', '스릴러'], status: 'screening', releaseDate: '2026-03-01', rating: 7.5, director: '김성한', description: '비행기 납치 사건을 다룬 긴장감 넘치는 작품.', poster: '하재', reviewCount: 431 },
  { id: 7, title: '인사이드 아웃 3', titleEn: 'Inside Out 3', genre: ['애니메이션', '가족'], status: 'upcoming', releaseDate: '2026-07-20', rating: 0, director: '켈시 만', description: '라일리의 새로운 감정들이 등장한다.', poster: 'IO3', reviewCount: 0 },
  { id: 8, title: '밀수', titleEn: 'Smugglers', genre: ['드라마', '코미디'], status: 'ended', releaseDate: '2025-07-26', rating: 7.9, director: '류승완', description: '1970년대 밀수를 소재로 한 해녀들의 이야기.', poster: '밀수', reviewCount: 789 },
  { id: 9, title: '외계+인 2부', titleEn: 'Alienoid: Return', genre: ['SF', '액션'], status: 'draft', releaseDate: '', rating: 0, director: '최동훈', description: '과거와 현재를 넘나드는 SF 어드벤처의 완결편.', poster: '외계', reviewCount: 0 },
  { id: 10, title: '가디언즈 오브 코리아', titleEn: 'Guardians of Korea', genre: ['액션', '판타지'], status: 'draft', releaseDate: '', rating: 0, director: '박훈정', description: '한국 신화를 기반으로 한 슈퍼히어로 영화.', poster: '가코', reviewCount: 0 },
]

// ─── Breadcrumb ───
const breadcrumbItems = [
  { label: '홈', href: '/' },
  { label: '콘텐츠 관리', href: '#' },
  { label: '영화 관리' },
]

// ─── Loading ───
const movies = ref<Movie[]>([])
const isLoading = ref(true)

onMounted(() => {
  setTimeout(() => {
    movies.value = rawMovies
    isLoading.value = false
  }, 3000)
})

// ─── Stats ───
const totalCount = computed(() => movies.value.length)
const screeningCount = computed(() => movies.value.filter(m => m.status === 'screening').length)
const upcomingCount = computed(() => movies.value.filter(m => m.status === 'upcoming').length)
const endedCount = computed(() => movies.value.filter(m => m.status === 'ended').length)

// ─── Search ───
const searchTitle = ref('')
const searchGenre = ref<string | number | null>(null)
const searchStatus = ref<string | number | null>(null)
const searchDateRange = ref<{ start: string; end: string }>({ start: '', end: '' })
const isSearching = ref(false)

const handleSearch = () => {
  isSearching.value = true
  addFilterChips()
  setTimeout(() => { isSearching.value = false }, 600)
  currentPage.value = 1
}

const handleReset = () => {
  searchTitle.value = ''
  searchGenre.value = null
  searchStatus.value = null
  searchDateRange.value = { start: '', end: '' }
  activeFilters.value = []
  currentPage.value = 1
}

// ─── Filter Chips ───
const activeFilters = ref<{ key: string; label: string; value: string }[]>([])

const addFilterChips = () => {
  const newFilters: { key: string; label: string; value: string }[] = []
  if (searchTitle.value) {
    newFilters.push({ key: 'title', label: '영화명', value: searchTitle.value })
  }
  if (searchGenre.value) {
    newFilters.push({ key: 'genre', label: '장르', value: String(searchGenre.value) })
  }
  if (searchStatus.value) {
    const label = statusOptions.find(o => o.value === searchStatus.value)?.label ?? String(searchStatus.value)
    newFilters.push({ key: 'status', label: '상태', value: label })
  }
  if (searchDateRange.value.start && searchDateRange.value.end) {
    newFilters.push({ key: 'date', label: '개봉일', value: `${searchDateRange.value.start} ~ ${searchDateRange.value.end}` })
  }
  activeFilters.value = newFilters
}

const removeFilter = (key: string) => {
  activeFilters.value = activeFilters.value.filter(f => f.key !== key)
  if (key === 'title') searchTitle.value = ''
  if (key === 'genre') searchGenre.value = null
  if (key === 'status') searchStatus.value = null
  if (key === 'date') searchDateRange.value = { start: '', end: '' }
}

const clearAllFilters = () => {
  activeFilters.value = []
  handleReset()
}

// ─── Table ───
const tableColumns = [
  { key: 'title', label: '제목', sortable: true, fixed: 'left' as const, width: '280px' },
  { key: 'genre', label: '장르', width: '160px' },
  { key: 'status', label: '상태', width: '100px' },
  { key: 'releaseDate', label: '개봉일', sortable: true, width: '120px' },
  { key: 'rating', label: '평점', sortable: true, width: '80px' },
  { key: 'reviewCount', label: '리뷰', width: '80px' },
  { key: 'actions', label: '관리', width: '80px', fixed: 'right' as const },
]

const selectedRows = ref<number[]>([])
const sortKey = ref('')
const sortOrder = ref<'asc' | 'desc' | ''>('')

const sortedMovies = computed(() => {
  if (!sortKey.value || !sortOrder.value) return movies.value
  const key = sortKey.value as keyof Movie
  const order = sortOrder.value
  return [...movies.value].sort((a, b) => {
    const valA = a[key]
    const valB = b[key]
    if (valA == null || valA === '') return 1
    if (valB == null || valB === '') return -1
    if (typeof valA === 'number' && typeof valB === 'number') {
      return order === 'asc' ? valA - valB : valB - valA
    }
    const strA = String(valA).toLowerCase()
    const strB = String(valB).toLowerCase()
    if (strA < strB) return order === 'asc' ? -1 : 1
    if (strA > strB) return order === 'asc' ? 1 : -1
    return 0
  })
})

// ─── Pagination ───
const currentPage = ref(1)
const pageSize = 10

// ─── Detail Drawer ───
const detailDrawerOpen = ref(false)
const detailMovie = ref<Movie | null>(null)

const openDetail = (movie: Movie) => {
  detailMovie.value = movie
  detailDrawerOpen.value = true
}

const detailDescItems = computed(() => {
  if (!detailMovie.value) return []
  const m = detailMovie.value
  return [
    { label: '영문 제목', value: m.titleEn },
    { label: '감독', value: m.director },
    { label: '장르', value: m.genre.join(', ') },
    { label: '개봉일', value: m.releaseDate || '-' },
    { label: '평점', value: m.rating > 0 ? `★ ${m.rating}` : '-' },
    { label: '상태', value: statusMap[m.status]?.label ?? m.status },
  ]
})

const detailCollapseOpen = ref(true)

const detailTimeline = [
  { title: '영화 등록', description: '관리자에 의해 영화 정보가 등록되었습니다.', time: '2026-01-15 09:00', type: 'info' },
  { title: '심사 요청', description: '콘텐츠 심사가 요청되었습니다.', time: '2026-01-16 14:30', type: 'warning' },
  { title: '심사 승인', description: '콘텐츠 심사가 승인되었습니다.', time: '2026-01-18 10:00', type: 'success' },
  { title: '개봉', description: '극장 상영이 시작되었습니다.', time: '2026-02-22 00:00', type: 'success' },
]

// ─── Registration Modal (3-step) ───
const registerModalOpen = ref(false)
const registerStep = ref(0)
const stepsRef = ref<InstanceType<typeof DsSteps> | null>(null)

const registerSteps = [
  { title: '기본 정보', description: '영화 기본 정보 입력' },
  { title: '미디어', description: '포스터 및 태그' },
  { title: '확인', description: '입력 정보 확인' },
]

const formData = reactive({
  title: '',
  titleEn: '',
  director: '',
  genre: null as string | number | null,
  releaseDate: '',
  description: '',
  rating: null as number | null,
})

const posterFiles = ref<File[]>([])
const formTags = ref<string[]>([])
const sortableItems = computed(() =>
  posterFiles.value.map((f, i) => ({ id: i + 1, name: f.name }))
)

const openRegister = () => {
  formData.title = ''
  formData.titleEn = ''
  formData.director = ''
  formData.genre = null
  formData.releaseDate = ''
  formData.description = ''
  formData.rating = null
  posterFiles.value = []
  formTags.value = []
  registerStep.value = 0
  registerModalOpen.value = true
}

const handleStepPrev = () => {
  stepsRef.value?.prev()
}

const handleStepNext = () => {
  stepsRef.value?.next()
}

const confirmDescItems = computed(() => [
  { label: '영화 제목', value: formData.title || '-' },
  { label: '영문 제목', value: formData.titleEn || '-' },
  { label: '감독', value: formData.director || '-' },
  { label: '장르', value: formData.genre ? String(formData.genre) : '-' },
  { label: '개봉일', value: formData.releaseDate || '-' },
  { label: '평점', value: formData.rating != null ? String(formData.rating) : '-' },
])

const handleRegister = () => {
  const maxId = Math.max(...movies.value.map(m => m.id), 0)
  movies.value.push({
    id: maxId + 1,
    title: formData.title,
    titleEn: formData.titleEn,
    genre: formData.genre ? [String(formData.genre)] : [],
    status: 'draft',
    releaseDate: formData.releaseDate,
    rating: formData.rating ?? 0,
    director: formData.director,
    description: formData.description,
    poster: formData.title.slice(0, 2),
    reviewCount: 0,
  })
  registerModalOpen.value = false
  toastRef.value?.success('영화가 성공적으로 등록되었습니다.')
}

// ─── Delete ───
const confirmRef = ref<InstanceType<typeof DsConfirm> | null>(null)
const deletingMovie = ref<Movie | null>(null)

const openDelete = async (movie: Movie) => {
  deletingMovie.value = movie
  const result = await confirmRef.value?.open()
  if (result) {
    movies.value = movies.value.filter(m => m.id !== movie.id)
    selectedRows.value = selectedRows.value.filter(id => id !== movie.id)
    toastRef.value?.success(`"${movie.title}" 영화가 삭제되었습니다.`)
  }
  deletingMovie.value = null
}

const bulkDelete = async () => {
  if (selectedRows.value.length === 0) return
  deletingMovie.value = { id: 0, title: `${selectedRows.value.length}건`, titleEn: '', genre: [], status: 'draft', releaseDate: '', rating: 0, director: '', description: '', poster: '', reviewCount: 0 }
  const result = await confirmRef.value?.open()
  if (result) {
    movies.value = movies.value.filter(m => !selectedRows.value.includes(m.id))
    toastRef.value?.success(`${selectedRows.value.length}건의 영화가 삭제되었습니다.`)
    selectedRows.value = []
  }
  deletingMovie.value = null
}

// ─── Toast ───
const toastRef = ref<InstanceType<typeof DsToast> | null>(null)

// ─── Excel (mock) ───
const handleExcelDownload = () => {
  toastRef.value?.info('엑셀 다운로드 기능은 실제 구현이 필요합니다.')
}
</script>

<template>
  <div style="padding: 2rem; max-width: 1400px; margin: 0 auto;">

    <!-- Toast -->
    <DsToast ref="toastRef" position="top-right" :duration="3000" />

    <!-- Delete Confirm -->
    <DsConfirm
      ref="confirmRef"
      title="영화 삭제"
      :message="`'${deletingMovie?.title ?? ''}' 을(를) 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.`"
      type="danger"
      confirm-text="삭제"
      cancel-text="취소"
    />

    <!-- Breadcrumb -->
    <DsBreadcrumb :items="breadcrumbItems" style="margin-bottom: 1rem;" />

    <!-- Page Title -->
    <h1 style="font-size: 1.75rem; font-weight: 700; color: var(--ds-on-surface, #2a3439); margin: 0 0 1.5rem;">
      영화 관리
    </h1>

    <!-- Stat Cards -->
    <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; margin-bottom: 1.5rem;">
      <DsStatCard title="전체 영화" :value="totalCount" />
      <DsStatCard title="상영 중" :value="screeningCount" :change="12.5" />
      <DsStatCard title="개봉 예정" :value="upcomingCount" :change="8.0" />
      <DsStatCard title="종료" :value="endedCount" :change="-5.2" />
    </div>

    <!-- Search Bar -->
    <div style="margin-bottom: 1rem;">
      <DsSearchBar :loading="isSearching" @search="handleSearch" @reset="handleReset">
        <DsFormItem label="영화명">
          <DsInput v-model="searchTitle" placeholder="영화명 검색" style="width: 180px;" />
        </DsFormItem>
        <DsFormItem label="장르">
          <DsSelect
            v-model="searchGenre"
            :options="genreOptions"
            placeholder="전체"
            style="width: 140px;"
          />
        </DsFormItem>
        <DsFormItem label="상태">
          <DsSelect
            v-model="searchStatus"
            :options="statusOptions"
            placeholder="전체"
            style="width: 140px;"
          />
        </DsFormItem>
        <DsFormItem label="개봉일">
          <DsDateRangePicker v-model="searchDateRange" />
        </DsFormItem>
      </DsSearchBar>
    </div>

    <!-- Filter Chips -->
    <div v-if="activeFilters.length > 0" style="display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 1rem;">
      <span style="font-size: 0.75rem; color: var(--ds-on-surface-variant, #5a6970);">활성 필터:</span>
      <DsFilterChip
        v-for="filter in activeFilters"
        :key="filter.key"
        :label="filter.label"
        @close="removeFilter(filter.key)"
      >
        {{ filter.value }}
      </DsFilterChip>
      <button
        style="font-size: 0.75rem; color: var(--ds-on-surface-variant, #5a6970); background: none; border: none; cursor: pointer; text-decoration: underline;"
        @click="clearAllFilters"
      >
        전체 해제
      </button>
    </div>

    <!-- Action Bar -->
    <DsActionBar :selected-count="selectedRows.length">
      <template #default>
        <DsTooltip content="새 영화 정보를 등록합니다" position="top">
          <DsButton @click="openRegister">영화 등록</DsButton>
        </DsTooltip>
        <DsTooltip :content="!canDelete ? '삭제 권한이 없습니다 (movie.delete)' : '선택한 영화를 삭제합니다'" position="top">
          <DsButton
            class="ds-button--secondary"
            :disabled="selectedRows.length === 0 || !canDelete"
            @click="bulkDelete"
            :style="!canDelete ? 'opacity: 0.5' : ''"
          >
            선택 삭제{{ selectedRows.length > 0 ? ` (${selectedRows.length})` : '' }}
            <span v-if="!canDelete" style="font-size: 0.625rem; margin-left: 0.25rem;">(권한 없음)</span>
          </DsButton>
        </DsTooltip>
        <DsTooltip :content="!canExport ? '내보내기 권한이 없습니다 (movie.export)' : '목록을 엑셀로 다운로드합니다'" position="top">
          <DsButton
            class="ds-button--secondary"
            :disabled="!canExport"
            @click="handleExcelDownload"
            :style="!canExport ? 'opacity: 0.5' : ''"
          >
            엑셀 다운로드
            <span v-if="!canExport" style="font-size: 0.625rem; margin-left: 0.25rem;">(권한 없음)</span>
          </DsButton>
        </DsTooltip>
      </template>
    </DsActionBar>

    <!-- Table (Skeleton → Real data) -->
    <div v-if="isLoading" style="margin-bottom: 1rem;">
      <DsSkeleton preset="table" :rows="6" />
    </div>

    <div v-else>
      <DsTable
        :data="sortedMovies"
        :columns="tableColumns"
        selectable
        sortable
        row-key="id"
        v-model:selected="selectedRows"
        v-model:sort-key="sortKey"
        v-model:sort-order="sortOrder"
        style="margin-bottom: 1rem;"
      >
        <!-- 제목 -->
        <template #cell-title="{ row }">
          <div v-if="row" style="display: flex; align-items: center; gap: 0.75rem;">
            <DsAvatar :name="row.poster" size="2.25rem" />
            <div style="min-width: 0;">
              <div style="font-size: 0.875rem; font-weight: 500; color: var(--ds-on-surface, #2a3439); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                {{ row.title }}
              </div>
              <div style="font-size: 0.75rem; color: var(--ds-on-surface-variant, #5a6970);">
                {{ row.titleEn }}
              </div>
            </div>
          </div>
        </template>

        <!-- 장르 -->
        <template #cell-genre="{ row }">
          <span v-if="row" style="font-size: 0.813rem;">{{ row.genre.join(', ') }}</span>
        </template>

        <!-- 상태 -->
        <template #cell-status="{ row }">
          <DsStatusTag v-if="row" :status="statusMap[row.status]?.status ?? row.status">
            {{ statusMap[row.status]?.label ?? row.status }}
          </DsStatusTag>
        </template>

        <!-- 개봉일 -->
        <template #cell-releaseDate="{ row }">
          <span v-if="row" style="font-size: 0.813rem;">{{ row.releaseDate || '-' }}</span>
        </template>

        <!-- 평점 -->
        <template #cell-rating="{ row }">
          <span v-if="row" style="font-size: 0.813rem; color: var(--ds-warning, #f59e0b);">
            {{ row.rating > 0 ? `★ ${row.rating}` : '-' }}
          </span>
        </template>

        <!-- 리뷰 -->
        <template #cell-reviewCount="{ row }">
          <DsBadge v-if="row && row.reviewCount > 0" :value="row.reviewCount" :max="9999">
            <div style="width: 28px; height: 20px;" />
          </DsBadge>
          <span v-else-if="row" style="font-size: 0.75rem; color: var(--ds-on-surface-variant, #5a6970);">-</span>
        </template>

        <!-- 관리 -->
        <template #cell-actions="{ row }">
          <DsDropdown v-if="row">
            <template #trigger>
              <button
                style="background: none; border: 1px solid var(--ds-outline-variant, rgba(169,180,185,0.4)); cursor: pointer; padding: 0.25rem 0.6rem; font-size: 0.813rem; color: var(--ds-on-surface, #2a3439); border-radius: 0;"
              >
                ···
              </button>
            </template>
            <div class="ds-dropdown__item" @click="openDetail(row)">상세보기</div>
            <div class="ds-dropdown__item" @click="openDetail(row)">수정</div>
            <div
              class="ds-dropdown__item"
              style="color: var(--ds-error, #d93025);"
              @click="openDelete(row)"
            >삭제</div>
          </DsDropdown>
        </template>
      </DsTable>

      <!-- Pagination -->
      <div style="display: flex; justify-content: flex-end;">
        <DsPagination
          v-model="currentPage"
          :total="movies.length"
          :page-size="pageSize"
        />
      </div>
    </div>

    <!-- Detail Drawer -->
    <DsDrawer v-model="detailDrawerOpen" position="right" width="420px">
      <template #header>
        <div style="display: flex; align-items: center; gap: 0.75rem;">
          <div>
            <h3 style="font-size: 1rem; font-weight: 600; margin: 0;">{{ detailMovie?.title }}</h3>
            <p style="font-size: 0.75rem; color: var(--ds-on-surface-variant, #5a6970); margin: 0.25rem 0 0;">
              {{ detailMovie?.titleEn }}
            </p>
          </div>
          <DsStatusTag
            v-if="detailMovie"
            :status="statusMap[detailMovie.status]?.status ?? detailMovie.status"
          >
            {{ statusMap[detailMovie.status]?.label ?? detailMovie.status }}
          </DsStatusTag>
        </div>
      </template>

      <div style="display: flex; flex-direction: column; gap: 1.5rem;">
        <!-- Description -->
        <DsDescription :items="detailDescItems" :columns="2" layout="vertical" />

        <!-- Collapse: Synopsis -->
        <DsCollapse v-model="detailCollapseOpen">
          <template #header>
            <span style="font-size: 0.9rem; font-weight: 500;">줄거리</span>
          </template>
          <p style="font-size: 0.875rem; color: var(--ds-on-surface-variant, #5a6970); margin: 0; line-height: 1.6;">
            {{ detailMovie?.description }}
          </p>
        </DsCollapse>

        <!-- Timeline: Status History -->
        <div>
          <p style="font-size: 0.875rem; font-weight: 600; margin-bottom: 0.75rem; color: var(--ds-on-surface, #2a3439);">상태 변경 이력</p>
          <DsTimeline :items="detailTimeline" />
        </div>
      </div>

      <template #footer>
        <div style="display: flex; gap: 0.5rem; justify-content: flex-end;">
          <DsButton class="ds-button--secondary" @click="detailDrawerOpen = false">닫기</DsButton>
        </div>
      </template>
    </DsDrawer>

    <!-- Registration Modal (3-step) -->
    <DsModal v-model="registerModalOpen">
      <template #header>
        <span style="font-size: 1rem; font-weight: 600;">영화 등록</span>
      </template>

      <div style="width: 600px; min-height: 360px;">
        <!-- Steps Header -->
        <DsSteps
          ref="stepsRef"
          :steps="registerSteps"
          :current="registerStep"
          direction="horizontal"
          @update:current="(val: number) => registerStep = val"
          style="margin-bottom: 1.5rem;"
        />

        <!-- Step 1: 기본 정보 -->
        <div v-show="registerStep === 0" style="display: flex; flex-direction: column; gap: 1rem;">
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
            <DsFormItem label="영화 제목" required>
              <DsInput v-model="formData.title" placeholder="영화 제목 입력" />
            </DsFormItem>
            <DsFormItem label="영문 제목">
              <DsInput v-model="formData.titleEn" placeholder="English Title" />
            </DsFormItem>
            <DsFormItem label="감독" required>
              <DsInput v-model="formData.director" placeholder="감독명 입력" />
            </DsFormItem>
            <DsFormItem label="장르">
              <DsSelect
                v-model="formData.genre"
                :options="genreOptions"
                placeholder="장르 선택"
              />
            </DsFormItem>
            <DsFormItem label="개봉일">
              <DsDatePicker v-model="formData.releaseDate" placeholder="날짜 선택" />
            </DsFormItem>
            <DsFormItem label="평점">
              <DsNumberInput v-model="formData.rating" :min="0" :max="10" :step="0.1" />
            </DsFormItem>
          </div>
          <DsFormItem label="줄거리">
            <DsTextarea v-model="formData.description" placeholder="영화 줄거리를 입력하세요" :min-rows="3" :auto-resize="true" />
          </DsFormItem>
        </div>

        <!-- Step 2: 미디어 -->
        <div v-show="registerStep === 1" style="display: flex; flex-direction: column; gap: 1.25rem;">
          <DsFormItem label="포스터 이미지">
            <DsFileUpload
              v-model="posterFiles"
              accept="image/*"
              multiple
              :max-files="3"
            />
          </DsFormItem>

          <DsFormItem label="태그">
            <DsTagInput v-model="formTags" placeholder="태그 입력 후 Enter" layout="below" />
          </DsFormItem>

          <div v-if="sortableItems.length > 0">
            <p style="font-size: 0.813rem; font-weight: 500; margin-bottom: 0.5rem; color: var(--ds-on-surface, #2a3439);">이미지 순서 변경</p>
            <DsSortableList v-model="sortableItems" item-key="id" handle>
              <template #item="{ item }">
                <span style="font-size: 0.813rem;">{{ item.name }}</span>
              </template>
            </DsSortableList>
          </div>
        </div>

        <!-- Step 3: 확인 -->
        <div v-show="registerStep === 2" style="display: flex; flex-direction: column; gap: 1.25rem;">
          <DsDescription :items="confirmDescItems" :columns="2" layout="vertical" />

          <div v-if="formTags.length > 0">
            <p style="font-size: 0.813rem; font-weight: 500; margin-bottom: 0.25rem; color: var(--ds-on-surface, #2a3439);">태그</p>
            <p style="font-size: 0.875rem; color: var(--ds-on-surface-variant, #5a6970); margin: 0;">{{ formTags.join(', ') }}</p>
          </div>

          <div v-if="posterFiles.length > 0">
            <p style="font-size: 0.813rem; font-weight: 500; margin-bottom: 0.25rem; color: var(--ds-on-surface, #2a3439);">첨부 이미지</p>
            <p style="font-size: 0.875rem; color: var(--ds-on-surface-variant, #5a6970); margin: 0;">{{ posterFiles.length }}개 파일</p>
          </div>

          <DsNotice type="info">
            등록 후 심사 상태로 전환됩니다. 심사 완료까지 1~2 영업일이 소요될 수 있습니다.
          </DsNotice>
        </div>
      </div>

      <template #footer>
        <DsButton
          v-if="registerStep > 0"
          class="ds-button--secondary"
          @click="handleStepPrev"
        >이전</DsButton>
        <DsButton
          v-if="registerStep < 2"
          @click="handleStepNext"
        >다음</DsButton>
        <DsButton
          v-if="registerStep === 2"
          :disabled="!formData.title || !formData.director"
          @click="handleRegister"
        >등록</DsButton>
      </template>
    </DsModal>

  </div>
</template>

<style scoped>
/* No custom component styles — layout only */
</style>
