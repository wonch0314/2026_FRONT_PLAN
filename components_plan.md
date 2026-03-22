# DS Components 설계

> dscore-starter-vue composables 기반, 스타일 100% 자유로운 컴포넌트 라이브러리

## 설계 원칙

1. **스타일 자유** - `class`, `style` 그대로 전달, 기본 스타일 최소화
2. **커스터마이징** - 내부 요소(spinner, icon 등)는 prop 또는 전역 설정으로 교체
3. **우선순위** - prop > 전역 설정 > 기본값
4. **기능 집중** - 컴포넌트는 기능만 제공, 스타일은 사용자 몫

## 전역 설정

```js
// main.js
app.use(DsCore, {
  spinner: MySpinner,           // 전역 로딩 스피너
  icon: {
    check: MyCheckIcon,         // 체크 아이콘
    close: MyCloseIcon,         // 닫기 아이콘
    arrow: MyArrowIcon,         // 화살표 아이콘
  },
  // 추후 확장...
})
```

---

## 컴포넌트별 설계 목적

### Form 컴포넌트

| 컴포넌트 | 설계 목적 |
|----------|-----------|
| **DsButton** | 매번 `loading` 상태 관리, 중복 클릭 방지 로직을 반복 작성하지 않도록. 버튼 하나에 `useLoading` 붙이고 throttle 처리하는 보일러플레이트 제거 |
| **DsInput** | 검색창마다 `useDebounceRef` 붙이고, 검증 로직 따로 작성하는 반복 제거. 디바운스 + 검증을 prop 하나로 해결 |
| **DsTextarea** | 내용 길이에 따라 높이 자동 조절. 매번 `scrollHeight` 계산하는 코드 반복 제거 |
| **DsSelect** | 네이티브 select의 스타일 한계 극복하면서도, 커스텀 UI 라이브러리처럼 무겁지 않게 |
| **DsCheckbox** | 체크박스 커스텀 스타일링의 번거로움 해결. 기능은 그대로, 스타일만 자유롭게 |
| **DsRadio** | DsCheckbox와 동일. 라디오 그룹 관리까지 내장 |
| **DsSwitch** | on/off 토글 UI. `useToggle` 기반으로 상태 관리 단순화 |
| **DsForm** | 폼 전체의 검증 상태, 변경 감지, submit 처리를 한 곳에서 관리. 개별 input 검증을 폼 레벨로 통합 |

### Feedback 컴포넌트

| 컴포넌트 | 설계 목적 |
|----------|-----------|
| **DsSpinner** | 로딩 표시의 기본 단위. 다른 컴포넌트들이 이걸 내부적으로 사용. 프로젝트별로 교체 가능하도록 분리 |
| **DsToast** | 알림 메시지 표시. `useToast`의 UI 구현체. 프로젝트 디자인에 맞게 스타일링 |
| **DsModal** | 모달/다이얼로그의 공통 동작(열기/닫기, ESC, 오버레이 클릭) 캡슐화. 매번 같은 로직 반복 제거 |
| **DsConfirm** | "정말 삭제하시겠습니까?" 같은 확인 다이얼로그. `useConfirmDialog`의 UI 구현체. Promise 기반 응답 |

### Data Display 컴포넌트

| 컴포넌트 | 설계 목적 |
|----------|-----------|
| **DsTable** | 테이블마다 선택, 정렬 로직 반복 작성 제거. `useTableSelection`, `useSortable` 통합. 셀 커스텀은 slot으로 |
| **DsPagination** | 페이지네이션 UI + 로직 통합. `usePaginatedList`와 연동. 페이지 변경 이벤트만 받으면 됨 |
| **DsEmpty** | 데이터 없을 때 표시. "검색 결과가 없습니다" 같은 빈 상태 UI 통일 |

### Navigation 컴포넌트

| 컴포넌트 | 설계 목적 |
|----------|-----------|
| **DsTabs** | 탭 전환 UI + 상태 관리. 라우터 연동 또는 로컬 상태 모두 지원 |
| **DsBreadcrumb** | 현재 위치 표시. 라우터 기반 자동 생성 또는 수동 정의 |

### Layout 컴포넌트

| 컴포넌트 | 설계 목적 |
|----------|-----------|
| **DsCard** | 콘텐츠 그룹핑 컨테이너. header/body/footer 구조화. 스타일은 자유 |
| **DsCollapse** | 접기/펴기 UI. FAQ, 상세 정보 토글 등. 애니메이션 내장 |

### Overlay 컴포넌트

| 컴포넌트 | 설계 목적 |
|----------|-----------|
| **DsDropdown** | 버튼 클릭 → 액션 메뉴 표시. Select와 다름 (값 선택이 아닌 액션 실행) |
| **DsTooltip** | 마우스 hover 시 설명 표시. 방향/딜레이 설정 |
| **DsPopover** | 클릭 시 팝업. Tooltip보다 복잡한 내용 (폼, 상세 정보 등) |
| **DsDrawer** | 사이드 슬라이드 패널. 모바일 메뉴, 필터 패널, 상세 정보 |

### Utility 컴포넌트

| 컴포넌트 | 설계 목적 |
|----------|-----------|
| **DsAlert** | 인라인 알림 메시지. Toast와 다름 (페이지 내 고정 위치, 닫기 가능) |
| **DsSkeleton** | 로딩 중 placeholder. 실제 레이아웃과 유사한 형태로 UX 개선 |
| **DsProgress** | 진행률 바. 업로드, 단계 진행, 로딩 퍼센트 표시 |
| **DsBadge** | 숫자/상태 뱃지. 알림 개수, "NEW", "HOT" 등 |
| **DsAvatar** | 프로필 이미지 + fallback(이니셜). 크기/모양 설정 |
| **DsFileUpload** | 파일 업로드 UI. 드래그앤드롭, 미리보기, 다중 파일. `useFilePreview` 활용 |
| **DsTagInput** | 태그 입력 UI. 추가/삭제, 중복 방지. `useTagInput` 활용 |
| **DsDatePicker** | 날짜 선택. 캘린더 UI, 포맷 설정 |

### BO 특화 컴포넌트

| 컴포넌트 | 설계 목적 |
|----------|-----------|
| **DsSearchBar** | 검색 조건 폼 + 검색/초기화 버튼 통합. BO 목록 페이지 상단 필수 |
| **DsDateRangePicker** | 날짜 범위 선택. 시작일~종료일, 빠른 선택(오늘, 이번주, 이번달) |
| **DsFormItem** | 라벨 + 입력 + 에러 메시지 wrapper. 폼 레이아웃 통일, 필수 표시(*) |
| **DsStatusTag** | 상태 뱃지. 활성/비활성, 승인/대기/반려 등 상태별 색상 |
| **DsActionBar** | 목록 상단 액션 버튼 모음. 추가, 삭제, 엑셀 다운로드 등 |
| **DsDescription** | 상세 페이지 라벨:값 형식 표시. 2열/3열 레이아웃 |
| **DsSteps** | 단계 진행 표시. 가입 절차, 주문 상태, 결제 단계 |
| **DsTimeline** | 이력/로그 타임라인. 시간순 이벤트 표시 |
| **DsStatCard** | 대시보드 통계 카드. 숫자 + 라벨 + 증감 표시 |
| **DsTreeSelect** | 트리 구조 선택. 조직도, 카테고리, 메뉴 권한 |
| **DsTransfer** | 좌우 이동 선택. 권한 할당, 그룹 멤버 관리 |
| **DsNumberInput** | 숫자 입력. 증감 버튼, 천단위 콤마, min/max/step |

---

## 추가 Composables (dscore-starter-vue 확장)

| Composable | 설계 목적 | 상태 |
|------------|-----------|------|
| **useTableState** | 검색 + 페이지 + 정렬 + 선택 통합 관리. BO 목록 페이지 원스톱 | 신규 |
| **useImport** | 엑셀/CSV 파일 읽기 + 검증 + 파싱. 일괄 등록 기능 | 신규 |
| **useBatchAction** | 선택된 항목 일괄 처리. 상태 변경, 삭제 등 | 신규 |
| **useFilterTags** | 적용된 필터를 태그로 표시/제거. 검색 조건 시각화 | 신규 |
| **useDateRange** | 날짜 범위 관리. 빠른 선택, 유효성 검사 | 신규 |

---

## 컴포넌트 목록

### Form 컴포넌트

| 컴포넌트 | 설명 | 사용 Composable | 커스텀 가능 요소 |
|----------|------|-----------------|------------------|
| **DsButton** | 로딩/쓰로틀 버튼 | `useLoading` | spinner |
| **DsInput** | 디바운스/검증 인풋 | `useDebounceRef`, `useFormValidation` | - |
| **DsTextarea** | 자동 높이 조절 | - | - |
| **DsSelect** | 셀렉트 박스 | - | arrow icon |
| **DsCheckbox** | 체크박스 | - | check icon |
| **DsRadio** | 라디오 버튼 | - | check icon |
| **DsSwitch** | 토글 스위치 | `useToggle` | - |
| **DsForm** | 폼 전체 관리 | `useFormValidation`, `useFormChanged` | - |

### Feedback 컴포넌트

| 컴포넌트 | 설명 | 사용 Composable | 커스텀 가능 요소 |
|----------|------|-----------------|------------------|
| **DsSpinner** | 로딩 스피너 | - | (자체가 교체 대상) |
| **DsToast** | 토스트 알림 | `useToast` | icon (success/error/warning/info) |
| **DsModal** | 모달 다이얼로그 | `useToggle` | close icon |
| **DsConfirm** | 확인 다이얼로그 | `useConfirmDialog` | icon, button |

### Data Display 컴포넌트

| 컴포넌트 | 설명 | 사용 Composable | 커스텀 가능 요소 |
|----------|------|-----------------|------------------|
| **DsTable** | 테이블 | `useTableSelection`, `useSortable` | checkbox, sort icon |
| **DsPagination** | 페이지네이션 | `usePaginatedList` | arrow icon |
| **DsEmpty** | 빈 상태 표시 | - | icon, illustration |

### Navigation 컴포넌트

| 컴포넌트 | 설명 | 사용 Composable | 커스텀 가능 요소 |
|----------|------|-----------------|------------------|
| **DsTabs** | 탭 | - | - |
| **DsBreadcrumb** | 브레드크럼 | - | separator |

### Layout 컴포넌트

| 컴포넌트 | 설명 | 사용 Composable | 커스텀 가능 요소 |
|----------|------|-----------------|------------------|
| **DsCard** | 카드 컨테이너 | - | - |
| **DsCollapse** | 접기/펴기 | `useToggle` | arrow icon |

### Overlay 컴포넌트

| 컴포넌트 | 설명 | 사용 Composable | 커스텀 가능 요소 |
|----------|------|-----------------|------------------|
| **DsDropdown** | 액션 드롭다운 메뉴 | `useToggle` | - |
| **DsTooltip** | 툴팁 | - | - |
| **DsPopover** | 팝오버 | `useToggle` | close icon |
| **DsDrawer** | 사이드 드로어 | `useToggle` | close icon |

### Utility 컴포넌트

| 컴포넌트 | 설명 | 사용 Composable | 커스텀 가능 요소 |
|----------|------|-----------------|------------------|
| **DsAlert** | 인라인 알림 | - | icon, close icon |
| **DsSkeleton** | 로딩 스켈레톤 | - | - |
| **DsProgress** | 진행률 바 | - | - |
| **DsBadge** | 뱃지/태그 | - | - |
| **DsAvatar** | 프로필 이미지 | - | fallback icon |
| **DsFileUpload** | 파일 업로드 | `useFilePreview` | upload icon |
| **DsTagInput** | 태그 입력 | `useTagInput` | close icon |
| **DsDatePicker** | 날짜 선택 | - | calendar icon |

### BO 특화 컴포넌트

| 컴포넌트 | 설명 | 사용 Composable | 커스텀 가능 요소 |
|----------|------|-----------------|------------------|
| **DsSearchBar** | 검색 조건 폼 | `useSearchForm` | - |
| **DsDateRangePicker** | 날짜 범위 선택 | `useDateRange` | calendar icon |
| **DsFormItem** | 폼 아이템 wrapper | - | - |
| **DsStatusTag** | 상태 뱃지 | - | - |
| **DsActionBar** | 액션 버튼 모음 | - | - |
| **DsDescription** | 상세 정보 표시 | - | - |
| **DsSteps** | 단계 진행 | - | check icon |
| **DsTimeline** | 타임라인 | - | dot icon |
| **DsStatCard** | 통계 카드 | - | icon |
| **DsTreeSelect** | 트리 선택 | - | arrow icon, check icon |
| **DsTransfer** | 좌우 이동 선택 | `useSelection` | arrow icon |
| **DsNumberInput** | 숫자 입력 | - | arrow icon |

---

## 컴포넌트 상세

### DsButton

```vue
<DsButton
  class="my-btn"
  :loading="loading"
  :throttle="300"
  :spinner="MySpinner"
  :disabled="disabled"
  @click="handleClick"
>
  저장
</DsButton>
```

**Props:**
| Prop | Type | Default | 설명 |
|------|------|---------|------|
| `loading` | `boolean` | `false` | 로딩 상태 |
| `throttle` | `number` | `0` | 클릭 쓰로틀 (ms) |
| `spinner` | `Component` | 전역/기본 | 로딩 스피너 컴포넌트 |
| `disabled` | `boolean` | `false` | 비활성화 |

**내부 동작:**
- `loading=true` → spinner 표시, 클릭 비활성화
- `throttle > 0` → 연속 클릭 방지

---

### DsInput

```vue
<DsInput
  class="my-input"
  v-model="value"
  :debounce="300"
  :rules="[required, minLength(3)]"
  :error="errorMessage"
/>
```

**Props:**
| Prop | Type | Default | 설명 |
|------|------|---------|------|
| `modelValue` | `string` | - | v-model |
| `debounce` | `number` | `0` | 입력 디바운스 (ms) |
| `rules` | `Function[]` | `[]` | 검증 규칙 |
| `error` | `string` | - | 에러 메시지 (외부 제어) |

---

### DsModal

```vue
<DsModal
  v-model="isOpen"
  class="my-modal"
  :close-icon="MyCloseIcon"
  :close-on-overlay="true"
  :close-on-esc="true"
>
  <template #header>제목</template>
  <template #default>내용</template>
  <template #footer>
    <DsButton @click="close">닫기</DsButton>
  </template>
</DsModal>
```

**Props:**
| Prop | Type | Default | 설명 |
|------|------|---------|------|
| `modelValue` | `boolean` | - | 열림/닫힘 상태 |
| `closeIcon` | `Component` | 전역/기본 | 닫기 아이콘 |
| `closeOnOverlay` | `boolean` | `true` | 오버레이 클릭 시 닫기 |
| `closeOnEsc` | `boolean` | `true` | ESC 키 닫기 |

---

### DsTable

```vue
<DsTable
  class="my-table"
  :data="listData"
  :columns="columns"
  :selectable="true"
  :sortable="true"
  v-model:selected="selectedIds"
  v-model:sort-key="sortKey"
  v-model:sort-order="sortOrder"
>
  <template #cell-actions="{ row }">
    <DsButton @click="edit(row)">수정</DsButton>
  </template>
</DsTable>
```

---

## 사용 예시

```vue
<template>
  <!-- 프로젝트 스타일 적용 -->
  <DsButton class="btn-primary" :loading="saving" @click="save">
    저장
  </DsButton>

  <DsInput class="input-default" v-model="name" :debounce="300" />

  <DsModal v-model="showModal" class="modal-lg">
    ...
  </DsModal>
</template>

<style>
/* 프로젝트별 스타일 정의 */
.btn-primary {
  background: var(--primary-color);
  padding: 8px 16px;
  border-radius: 4px;
}

.input-default {
  border: 1px solid #ddd;
  padding: 8px 12px;
}

.modal-lg {
  max-width: 800px;
}
</style>
```

---

## 우선순위 (개발 순서)

### Phase 1: Core (기반)
1. DsSpinner
2. DsButton
3. DsInput
4. DsModal

### Phase 2: Form (폼 입력)
5. DsTextarea
6. DsSelect
7. DsCheckbox
8. DsRadio
9. DsSwitch
10. DsNumberInput
11. DsFormItem
12. DsForm

### Phase 3: Feedback (피드백)
13. DsToast
14. DsConfirm
15. DsAlert
16. DsProgress
17. DsSkeleton

### Phase 4: Data Display (데이터 표시)
18. DsTable
19. DsPagination
20. DsEmpty
21. DsStatusTag
22. DsBadge
23. DsAvatar
24. DsDescription
25. DsStatCard

### Phase 5: Navigation & Layout
26. DsTabs
27. DsBreadcrumb
28. DsCard
29. DsCollapse
30. DsSteps
31. DsTimeline

### Phase 6: Overlay (오버레이)
32. DsDropdown
33. DsTooltip
34. DsPopover
35. DsDrawer

### Phase 7: Advanced Input (고급 입력)
36. DsDatePicker
37. DsDateRangePicker
38. DsTagInput
39. DsFileUpload
40. DsTreeSelect
41. DsTransfer

### Phase 8: BO 통합 (BO 페이지 특화)
42. DsSearchBar
43. DsActionBar
44. useTableState
45. useImport
46. useBatchAction
47. useFilterTags
48. useDateRange

---

## TODO

- [ ] 각 컴포넌트 상세 Props/Events/Slots 정의
- [ ] 기본 스피너 컴포넌트 디자인 결정
- [ ] 전역 설정 구조 확정
- [ ] TypeScript 타입 정의
