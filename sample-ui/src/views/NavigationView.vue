<script setup lang="ts">
import { ref } from 'vue'
import {
  DsTabs,
  DsMenuTab,
  DsBreadcrumb,
  DsCard,
  DsCollapse,
  DsSteps,
  DsTimeline,
  DsButton,
  DsInput,
  DsSelect,
  DsCheckbox,
  DsTable,
  DsStatusTag,
} from 'dscore-ui-vue'

// --- DsTabs (데이터 유지 데모) ---
const activeTab = ref('form')
const tabs = [
  { key: 'form', label: '입력 폼' },
  { key: 'table', label: '데이터 목록' },
  { key: 'settings', label: '설정' },
]

// 탭 간 유지되는 데이터
const formName = ref('')
const formEmail = ref('')
const formDept = ref('')
const tabTableData = [
  { id: 1, name: '김철수', dept: '개발팀', status: 'active' },
  { id: 2, name: '이영희', dept: '디자인팀', status: 'pending' },
  { id: 3, name: '박민수', dept: '기획팀', status: 'inactive' },
]
const tabTableColumns = [
  { key: 'id', label: 'ID', width: '60px' },
  { key: 'name', label: '이름' },
  { key: 'dept', label: '부서' },
  { key: 'status', label: '상태' },
]
const settingNotify = ref(true)
const settingTheme = ref('light')

const showTabsCode = ref(false)

// --- DsMenuTab ---
const activeMenuTab = ref('tab-1')
const menuTabs = ref([
  { key: 'tab-1', label: '홈', closable: false },
  { key: 'tab-2', label: '대시보드', closable: true },
  { key: 'tab-3', label: '보고서', closable: true },
])
let menuTabCounter = menuTabs.value.length

function addMenuTab() {
  menuTabCounter++
  const key = `tab-${menuTabCounter}`
  menuTabs.value.push({ key, label: `새 탭 ${menuTabCounter}`, closable: true })
  activeMenuTab.value = key
}

function closeMenuTab(key: string | number) {
  const idx = menuTabs.value.findIndex(t => t.key === key)
  menuTabs.value.splice(idx, 1)
  if (activeMenuTab.value === key && menuTabs.value.length > 0) {
    activeMenuTab.value = menuTabs.value[Math.max(0, idx - 1)].key as string
  }
}

// --- DsBreadcrumb ---
const breadcrumbItems = [
  { label: '홈', href: '#' },
  { label: '관리', href: '#' },
  { label: '사용자 관리', href: '#' },
  { label: '상세' },
]

// --- DsCollapse ---
const faq1Open = ref(true)
const faq2Open = ref(false)
const faq3Open = ref(false)

// --- DsSteps ---
const currentStep = ref(1)
const steps = [
  { title: '정보 입력', description: '기본 정보를 입력하세요' },
  { title: '인증', description: '본인 인증을 완료하세요' },
  { title: '결제', description: '결제 정보를 입력하세요' },
  { title: '완료', description: '모든 절차가 완료되었습니다' },
]

function prevStep() {
  if (currentStep.value > 0) currentStep.value--
}
function nextStep() {
  if (currentStep.value < steps.length - 1) currentStep.value++
}

// --- DsTimeline ---
const timelineItems = [
  {
    title: '주문 접수',
    description: '주문이 정상적으로 접수되었습니다.',
    time: '2026-03-20 09:00',
    type: 'success',
  },
  {
    title: '결제 완료',
    description: '카드 결제가 승인되었습니다.',
    time: '2026-03-20 09:05',
    type: 'success',
  },
  {
    title: '배송 준비',
    description: '물류 센터에서 발송 준비 중입니다.',
    time: '2026-03-21 14:30',
    type: 'warning',
  },
  {
    title: '배송 중',
    description: '택배사에서 배송 중입니다. (운송장: 1234-5678)',
    time: '2026-03-22 10:15',
    type: 'info',
  },
  {
    title: '배송 완료',
    description: '배송 예정일: 2026-03-24',
    time: '',
    type: '',
  },
]

const timelineItems2 = [
  {
    title: '서버 점검 시작',
    description: 'v2.5.0 배포를 위한 서버 점검이 시작되었습니다.',
    time: '2026-03-22 02:00',
    type: 'info',
  },
  {
    title: 'DB 마이그레이션 실패',
    description: 'users 테이블 스키마 변경 중 오류가 발생했습니다. 롤백 진행.',
    time: '2026-03-22 02:15',
    type: 'error',
  },
  {
    title: '롤백 완료',
    description: '이전 버전으로 정상 복구되었습니다.',
    time: '2026-03-22 02:30',
    type: 'warning',
  },
  {
    title: '재배포 진행 중',
    description: '수정된 마이그레이션 스크립트로 재배포 중입니다.',
    time: '2026-03-22 03:00',
    type: 'info',
  },
  {
    title: '배포 완료',
    description: 'v2.5.0 배포가 정상적으로 완료되었습니다.',
    time: '2026-03-22 03:20',
    type: 'success',
  },
]

const showTimelineCode = ref(false)
const showCollapseCode = ref(false)
</script>

<template>
  <div style="padding: 2rem; max-width: 1200px; margin: 0 auto;">
    <h1 style="font-size: 1.5rem; font-weight: 700; margin-bottom: 2rem;">Navigation & Layout</h1>

    <!-- DsBreadcrumb -->
    <section class="demo-section">
      <h2 class="demo-section__title">DsBreadcrumb</h2>
      <p class="demo-section__subtitle">현재 페이지 위치를 계층 구조로 표시합니다.</p>
      <DsBreadcrumb :items="breadcrumbItems" separator=">" />
    </section>

    <!-- DsTabs -->
    <section class="demo-section">
      <h2 class="demo-section__title">DsTabs</h2>
      <p class="demo-section__subtitle">탭을 전환해도 각 탭의 입력 데이터가 유지됩니다. 폼에 값을 입력하고 다른 탭으로 이동한 뒤 돌아와 보세요.</p>
      <DsTabs v-model="activeTab" :tabs="tabs">
        <template #panel-form>
          <div class="demo-column" style="gap: 1rem; padding: 1rem 0;">
            <p style="font-size: 0.875rem; color: #2a3439; font-weight: 500;">사용자 정보 입력</p>
            <div class="demo-row" style="gap: 1rem; flex-wrap: wrap; align-items: flex-start;">
              <div class="demo-column" style="gap: 0.25rem; flex: 1; min-width: 200px;">
                <label style="font-size: 0.75rem; color: #5a6970;">이름</label>
                <DsInput v-model="formName" placeholder="이름을 입력하세요" />
              </div>
              <div class="demo-column" style="gap: 0.25rem; flex: 1; min-width: 200px;">
                <label style="font-size: 0.75rem; color: #5a6970;">이메일</label>
                <DsInput v-model="formEmail" placeholder="이메일을 입력하세요" />
              </div>
              <div class="demo-column" style="gap: 0.25rem; flex: 1; min-width: 200px;">
                <label style="font-size: 0.75rem; color: #5a6970;">부서</label>
                <DsSelect
                  v-model="formDept"
                  :options="[
                    { label: '개발팀', value: 'dev' },
                    { label: '디자인팀', value: 'design' },
                    { label: '기획팀', value: 'plan' },
                  ]"
                  placeholder="부서 선택"
                />
              </div>
            </div>
            <p style="font-size: 0.75rem; color: #5a6970;">
              입력값 — 이름: {{ formName || '(없음)' }}, 이메일: {{ formEmail || '(없음)' }}, 부서: {{ formDept || '(없음)' }}
            </p>
          </div>
        </template>
        <template #panel-table>
          <div style="padding: 1rem 0;">
            <p style="font-size: 0.875rem; color: #2a3439; font-weight: 500; margin-bottom: 0.75rem;">사용자 목록</p>
            <DsTable :data="tabTableData" :columns="tabTableColumns">
              <template #cell-status="{ row }">
                <DsStatusTag :status="row.status">
                  {{ row.status === 'active' ? '활성' : row.status === 'pending' ? '대기' : '비활성' }}
                </DsStatusTag>
              </template>
            </DsTable>
          </div>
        </template>
        <template #panel-settings>
          <div class="demo-column" style="gap: 1rem; padding: 1rem 0;">
            <p style="font-size: 0.875rem; color: #2a3439; font-weight: 500;">알림 설정</p>
            <DsCheckbox v-model="settingNotify" label="이메일 알림 수신" />
            <div class="demo-column" style="gap: 0.25rem; max-width: 200px;">
              <label style="font-size: 0.75rem; color: #5a6970;">테마</label>
              <DsSelect
                v-model="settingTheme"
                :options="[
                  { label: '라이트', value: 'light' },
                  { label: '다크', value: 'dark' },
                  { label: '시스템', value: 'system' },
                ]"
              />
            </div>
            <p style="font-size: 0.75rem; color: #5a6970;">
              설정값 — 알림: {{ settingNotify ? 'ON' : 'OFF' }}, 테마: {{ settingTheme }}
            </p>
          </div>
        </template>
      </DsTabs>

      <!-- 코드 예시 -->
      <button class="demo-code-toggle" @click="showTabsCode = !showTabsCode">
        {{ showTabsCode ? '코드 숨기기' : '코드 보기' }}
      </button>
      <div v-show="showTabsCode" class="demo-code">
        <pre v-pre><code>&lt;!-- 탭 전환 시 데이터 유지: v-model로 바인딩된 데이터는 탭 간 공유됩니다 --&gt;
&lt;script setup&gt;
const activeTab = ref('form')
const tabs = [
  { key: 'form', label: '입력 폼' },
  { key: 'table', label: '데이터 목록' },
  { key: 'settings', label: '설정' },
]
const formName = ref('')
const formEmail = ref('')
&lt;/script&gt;

&lt;DsTabs v-model="activeTab" :tabs="tabs"&gt;
  &lt;template #panel-form&gt;
    &lt;DsInput v-model="formName" placeholder="이름" /&gt;
    &lt;DsInput v-model="formEmail" placeholder="이메일" /&gt;
  &lt;/template&gt;
  &lt;template #panel-table&gt;
    &lt;DsTable :data="tableData" :columns="columns" /&gt;
  &lt;/template&gt;
  &lt;template #panel-settings&gt;
    &lt;DsCheckbox v-model="notify" label="알림 수신" /&gt;
  &lt;/template&gt;
&lt;/DsTabs&gt;</code></pre>
      </div>
    </section>

    <!-- DsMenuTab -->
    <section class="demo-section">
      <h2 class="demo-section__title">DsMenuTab</h2>
      <p class="demo-section__subtitle">동적으로 탭을 추가하고 닫을 수 있는 메뉴 탭입니다.</p>
      <div class="demo-column" style="gap: 0.75rem;">
        <div style="display: flex; align-items: center; gap: 0.5rem;">
          <DsMenuTab
            v-model="activeMenuTab"
            :tabs="menuTabs"
            @close="closeMenuTab"
            style="flex: 1;"
          />
          <DsButton @click="addMenuTab" style="white-space: nowrap; font-size: 0.75rem; padding: 0.4rem 0.75rem;">
            + 탭 추가
          </DsButton>
        </div>
        <div style="padding: 0.75rem 1rem; background: #f0f4f7; font-size: 0.875rem; color: #2a3439;">
          현재 활성 탭: <strong>{{ menuTabs.find(t => t.key === activeMenuTab)?.label }}</strong>
        </div>
      </div>
    </section>

    <!-- DsCard -->
    <section class="demo-section">
      <h2 class="demo-section__title">DsCard</h2>
      <p class="demo-section__subtitle">다양한 형태의 카드 컴포넌트입니다.</p>
      <div class="demo-grid" style="grid-template-columns: repeat(3, 1fr);">
        <!-- Basic card -->
        <DsCard>
          <p style="font-size: 0.875rem; font-weight: 500; margin-bottom: 0.5rem;">기본 카드</p>
          <p style="font-size: 0.875rem; color: #5a6970;">
            헤더와 푸터 없이 본문만 있는 기본 카드입니다.
            콘텐츠를 자유롭게 배치할 수 있습니다.
          </p>
        </DsCard>

        <!-- Card with header and footer -->
        <DsCard>
          <template #header>
            <p style="font-size: 1rem; font-weight: 600; margin: 0;">카드 제목</p>
          </template>
          <p style="font-size: 0.875rem; color: #5a6970; margin: 0;">
            헤더와 푸터가 있는 카드입니다. 제목과 액션 영역을 분리하여 구성할 수 있습니다.
          </p>
          <template #footer>
            <div style="display: flex; justify-content: flex-end; gap: 0.5rem;">
              <DsButton style="font-size: 0.75rem; padding: 0.25rem 0.75rem;">취소</DsButton>
              <DsButton style="font-size: 0.75rem; padding: 0.25rem 0.75rem;">확인</DsButton>
            </div>
          </template>
        </DsCard>

        <!-- Elevated card -->
        <DsCard>
          <div class="demo-column" style="gap: 0.5rem;">
            <p style="font-size: 0.875rem; font-weight: 500; margin: 0;">엘리베이티드 카드</p>
            <p style="font-size: 0.875rem; color: #5a6970; margin: 0;">
              그림자 효과로 카드에 입체감을 부여합니다. 주요 콘텐츠를 강조할 때 사용합니다.
            </p>
          </div>
        </DsCard>
      </div>
    </section>

    <!-- DsCollapse -->
    <section class="demo-section">
      <h2 class="demo-section__title">DsCollapse</h2>
      <p class="demo-section__subtitle">FAQ 형식으로 내용을 접고 펼칠 수 있습니다. ▼/▲ 아이콘으로 열림/닫힘 상태를 표시합니다.</p>
      <div class="demo-column" style="gap: 0.5rem;">
        <DsCollapse v-model="faq1Open">
          <template #header>
            <span style="font-size: 0.9rem; font-weight: 500;">배송은 얼마나 걸리나요?</span>
          </template>
          <p style="font-size: 0.875rem; color: #5a6970; margin: 0;">
            일반 배송은 주문 확인 후 영업일 기준 2~3일이 소요됩니다.
            도서 산간 지역의 경우 추가 1~2일이 더 소요될 수 있습니다.
            빠른 배송 옵션 선택 시 당일 또는 익일 배송이 가능합니다.
          </p>
        </DsCollapse>

        <DsCollapse v-model="faq2Open">
          <template #header>
            <span style="font-size: 0.9rem; font-weight: 500;">환불 정책은 어떻게 되나요?</span>
          </template>
          <p style="font-size: 0.875rem; color: #5a6970; margin: 0;">
            상품 수령 후 7일 이내에 반품 신청이 가능합니다.
            단순 변심의 경우 왕복 배송비는 고객 부담이며,
            상품 하자 또는 오배송의 경우 무료 반품이 가능합니다.
          </p>
        </DsCollapse>

        <DsCollapse v-model="faq3Open">
          <template #header>
            <span style="font-size: 0.9rem; font-weight: 500;">회원 등급 혜택은 무엇인가요?</span>
          </template>
          <p style="font-size: 0.875rem; color: #5a6970; margin: 0;">
            회원 등급은 브론즈, 실버, 골드, 플래티넘 4단계로 나뉩니다.
            등급에 따라 할인율, 포인트 적립률, 무료 배송 혜택이 달라집니다.
            전월 구매 금액 기준으로 매월 1일 등급이 갱신됩니다.
          </p>
        </DsCollapse>
      </div>

      <!-- 코드 예시 -->
      <button class="demo-code-toggle" @click="showCollapseCode = !showCollapseCode">
        {{ showCollapseCode ? '코드 숨기기' : '코드 보기' }}
      </button>
      <div v-show="showCollapseCode" class="demo-code">
        <pre v-pre><code>&lt;DsCollapse v-model="isOpen"&gt;
  &lt;template #header&gt;
    &lt;span&gt;질문 제목&lt;/span&gt;
  &lt;/template&gt;
  &lt;p&gt;답변 내용&lt;/p&gt;
&lt;/DsCollapse&gt;</code></pre>
      </div>
    </section>

    <!-- DsSteps -->
    <section class="demo-section">
      <h2 class="demo-section__title">DsSteps</h2>
      <p class="demo-section__subtitle">4단계 마법사 형식의 진행 상태 표시입니다.</p>
      <div class="demo-column" style="gap: 1.5rem;">
        <DsSteps :steps="steps" :current="currentStep" direction="horizontal" />
        <div class="demo-row" style="gap: 0.75rem;">
          <DsButton :disabled="currentStep === 0" @click="prevStep">이전 단계</DsButton>
          <DsButton :disabled="currentStep === steps.length - 1" @click="nextStep">다음 단계</DsButton>
          <span class="demo-value">단계: {{ currentStep + 1 }} / {{ steps.length }} — {{ steps[currentStep].title }}</span>
        </div>
      </div>
    </section>

    <!-- DsTimeline -->
    <section class="demo-section">
      <h2 class="demo-section__title">DsTimeline</h2>
      <p class="demo-section__subtitle">다양한 상태(success, warning, error, info, 기본)를 타임라인으로 표현합니다.</p>
      <div class="demo-row" style="gap: 3rem; flex-wrap: wrap; align-items: flex-start;">
        <div style="flex: 1; min-width: 300px;">
          <p style="font-size: 0.875rem; font-weight: 600; margin-bottom: 0.75rem; color: #2a3439;">주문 배송 추적</p>
          <DsTimeline :items="timelineItems" />
        </div>
        <div style="flex: 1; min-width: 300px;">
          <p style="font-size: 0.875rem; font-weight: 600; margin-bottom: 0.75rem; color: #2a3439;">서버 배포 이력</p>
          <DsTimeline :items="timelineItems2" />
        </div>
      </div>

      <!-- 코드 예시 -->
      <button class="demo-code-toggle" @click="showTimelineCode = !showTimelineCode">
        {{ showTimelineCode ? '코드 숨기기' : '코드 보기' }}
      </button>
      <div v-show="showTimelineCode" class="demo-code">
        <pre v-pre><code>&lt;script setup&gt;
const items = [
  { title: '주문 접수', description: '정상 접수', time: '09:00', type: 'success' },
  { title: '배송 준비', description: '준비 중', time: '14:30', type: 'warning' },
  { title: 'DB 마이그레이션 실패', description: '오류 발생', time: '02:15', type: 'error' },
  { title: '배송 중', description: '진행 중', time: '10:15', type: 'info' },
  { title: '배송 완료', description: '예정', time: '', type: '' },
]
&lt;/script&gt;

&lt;DsTimeline :items="items" /&gt;

&lt;!-- type 옵션: 'success' | 'warning' | 'error' | 'info' | '' (기본) --&gt;</code></pre>
      </div>
    </section>
  </div>
</template>

<style scoped>
.demo-section {
  margin-bottom: 3rem;
}

.demo-section__title {
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
  color: #2a3439;
}

.demo-section__subtitle {
  font-size: 0.875rem;
  color: #5a6970;
  margin-bottom: 1rem;
}

.demo-row {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.demo-column {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.demo-value {
  font-size: 0.875rem;
  color: #2a3439;
}

.demo-grid {
  display: grid;
  gap: 1rem;
}

.demo-code-toggle {
  margin-top: 1rem;
  padding: 0.375rem 0.75rem;
  font-size: 0.75rem;
  color: #5a6970;
  background: #f0f4f7;
  border: 1px solid rgba(0,0,0,0.1);
  border-radius: 0.25rem;
  cursor: pointer;
  transition: background 150ms;
}
.demo-code-toggle:hover {
  background: #e4eaef;
}

.demo-code {
  margin-top: 0.75rem;
  border: 1px solid rgba(0,0,0,0.1);
  border-radius: 0.375rem;
  overflow: hidden;
}
.demo-code pre {
  margin: 0;
  padding: 1rem;
  background: #1e1e2e;
  overflow-x: auto;
}
.demo-code code {
  font-family: 'SF Mono', 'Fira Code', monospace;
  font-size: 0.8rem;
  line-height: 1.6;
  color: #cdd6f4;
  white-space: pre;
}
</style>
