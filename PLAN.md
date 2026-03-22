## button
- 여러 기능이 있지만 그걸 default로 제공할지 고민
- 비동기 method 넣으면 처리할 동안 disabled 처리가 되거나 loading 이 보여야 하잖아. 그런것도 되는거야?
-- rules를 어떻게 하면될지도 가이드 해야겠네
-- 아하, loading 상태 관리 등은 그냥 프로젝트에서 관리하도록 하자는 거지? 그냥 이걸 vue component로서 제공하는건 안돼?

[대답]
두 가지 방식 모두 지원 가능:

**방식 1: 외부 제어 (현재 설계)**
```vue
<DsButton :loading="saving" @click="save">저장</DsButton>

<script setup>
const saving = ref(false)
const save = async () => {
  saving.value = true
  await api.save()
  saving.value = false
}
</script>
```

**방식 2: 내부 자동 처리 (추가 가능)**
```vue
<DsButton :async-click="save">저장</DsButton>

<script setup>
// async 함수 넘기면 자동으로 loading 처리
const save = async () => {
  await api.save()
}
</script>
```

`async-click` prop에 async 함수 넘기면:
- 실행 중 자동 loading=true, disabled=true
- 완료되면 자동 복구
- 에러 발생해도 loading 해제

rules는 Button보다는 Form/Input 레벨에서 처리하는 게 맞음. Button은 submit 역할만. 

## input
- 검증 로직이 무슨 말이야?

[대답]
입력값이 유효한지 체크하는 로직:

```vue
<DsInput
  v-model="email"
  :rules="[required, isEmail, maxLength(100)]"
/>
```

rules 예시:

```javascript
const required = (v) => !!v || '필수 입력입니다'
const isEmail = (v) => /^[^\s@]+@[^\s@]+$/.test(v) || '이메일 형식이 아닙니다'
const maxLength = (max) => (v) => v.length <= max || `${max}자 이내로 입력하세요`
const minValue = (min) => (v) => Number(v) >= min || `${min} 이상 입력하세요`
```

- 입력할 때마다 검증 → 에러 메시지 표시
- 검증 실패 시 폼 submit 차단
- dscore-starter-vue의 `useFormValidation` 내부 활용 

## textarea
- 아 그래? 그럼 그 스크롤로 넘어가는 시점의 height를 몇으로 설정할지?

[대답]
prop으로 설정 가능하게:

```vue
<DsTextarea
  v-model="content"
  :min-rows="3"
  :max-rows="10"
  auto-resize
/>
```

- `min-rows`: 최소 높이 (기본 3줄)
- `max-rows`: 최대 높이 (이 이상은 스크롤)
- `auto-resize`: 내용에 따라 자동 높이 조절 on/off

max-rows 도달하면 → 그 높이에서 고정 + 스크롤 활성화 

## select
- 뭘 어떻게 무슨 기능을 제공하려는거야?

[대답]
네이티브 `<select>`의 한계 극복:

**네이티브 문제점:**
- 드롭다운 스타일링 거의 불가능 (OS마다 다름)
- 옵션에 아이콘, 설명 텍스트 못 넣음
- 검색/필터링 불가

**DsSelect 제공 기능:**
```vue
<DsSelect
  v-model="status"
  :options="[
    { value: 'active', label: '활성', icon: CheckIcon },
    { value: 'inactive', label: '비활성', description: '로그인 불가' }
  ]"
  searchable
  clearable
  placeholder="상태 선택"
/>
```

- 드롭다운 UI 완전 커스텀 (class로 스타일링)
- 옵션 검색 (searchable)
- 선택 해제 (clearable)
- 옵션에 아이콘, 설명 추가 가능
- 키보드 네비게이션 (↑↓ Enter Esc) 
## checkobx
- 따로 만드는 이유가 뭐야?

[대답]
네이티브 `<input type="checkbox">`는 스타일링이 매우 제한적:

**네이티브 문제점:**
- 체크박스 모양/색상 CSS로 못 바꿈
- 브라우저/OS마다 다르게 보임
- 커스텀하려면 `appearance: none` + 가상요소로 처음부터 만들어야 함

**DsCheckbox 제공:**
```vue
<DsCheckbox v-model="agree" class="my-checkbox">
  이용약관에 동의합니다
</DsCheckbox>
```

```css
.my-checkbox {
  /* 체크박스 박스 스타일 */
  --ds-checkbox-size: 20px;
  --ds-checkbox-border: 2px solid #ddd;
  --ds-checkbox-checked-bg: #3b82f6;
}
```

- 기능은 그대로 (v-model, disabled, indeterminate)
- 스타일만 자유롭게 (class, CSS 변수, 또는 check icon 교체) 
## radio
- 정확히 어떻게?

[대답]
DsCheckbox와 동일한 이유 + 그룹 관리 편의성:

```vue
<!-- 개별 사용 -->
<DsRadio v-model="gender" value="male">남성</DsRadio>
<DsRadio v-model="gender" value="female">여성</DsRadio>

<!-- 또는 그룹으로 -->
<DsRadioGroup v-model="gender" :options="genderOptions" />
```

```js
const genderOptions = [
  { value: 'male', label: '남성' },
  { value: 'female', label: '여성' }
]
```

**그룹 관리 내장:**
- 같은 v-model 공유하는 라디오들 자동 그룹핑
- options 배열로 한번에 생성 가능
- 가로/세로 배치 설정 (direction="horizontal")
- 스타일은 동일하게 class로 자유롭게 
## form
- 어디까지 기능 준비해줄건지

[대답]
폼 전체를 감싸서 통합 관리:

```vue
<DsForm ref="formRef" :model="formData" @submit="handleSubmit">
  <DsFormItem label="이름" required>
    <DsInput v-model="formData.name" :rules="[required]" />
  </DsFormItem>
  <DsFormItem label="이메일">
    <DsInput v-model="formData.email" :rules="[required, isEmail]" />
  </DsFormItem>
  <DsButton type="submit" :loading="saving">저장</DsButton>
</DsForm>
```

**제공 기능:**
1. **통합 검증** - 모든 필드 검증 상태 수집
2. **submit 차단** - 검증 실패 시 submit 막기
3. **변경 감지** - `isDirty` (수정됨 여부)
4. **초기화** - `reset()` 원래 값으로
5. **프로그래매틱 검증** - `formRef.validate()` 수동 호출

**제공 안 하는 것:**
- 레이아웃 (그리드, 간격) → class로 직접
- 에러 메시지 스타일 → class로 직접 
## spinner
- 프로젝트별로 교체 가능하도록 분리한다는게 무슨 말이야?

[대답]
프로젝트마다 로딩 스피너 디자인이 다름:
- A 프로젝트: 원형 회전
- B 프로젝트: 로고 애니메이션
- C 프로젝트: 점 3개 깜빡임

**교체 방법:**

```js
// main.js - 전역 설정
import MyProjectSpinner from './components/MyProjectSpinner.vue'

app.use(DsCore, {
  spinner: MyProjectSpinner  // 모든 컴포넌트가 이 스피너 사용
})
```

이렇게 하면 DsButton, DsTable 등 내부에서 로딩 표시할 때 전부 MyProjectSpinner 사용.

**개별 오버라이드도 가능:**
```vue
<DsButton :loading="true" :spinner="SpecialSpinner">
  저장
</DsButton>
```

prop > 전역 설정 > 기본 스피너 우선순위 
## toast
- 이거 사용하면 이제 유저가 dscore-starter-vue에서 ToastComponent import 하는게 아니라, dscore-ui 라이브러리를 만들면 거기서 import 해서 사용하면 되겠네.

[대답]
맞아. 구조를 정리하면:

**dscore-starter-vue** (기존)
- `useToast` composable만 제공 (로직)
- `ToastContainer` 기본 UI 제공

**dscore-ui** (새로 만들 라이브러리)
- `DsToast` 컴포넌트 (스타일 자유로운 UI)
- 내부적으로 `useToast` 사용

**사용자 입장:**
```js
// dscore-ui에서 import
import { DsToast, useToast } from 'dscore-ui'

// App.vue에 ToastContainer 배치
<DsToast class="my-toast-style" />

// 어디서든 사용
const { success, error } = useToast()
success('저장되었습니다!')
```

dscore-starter-vue는 로직 담당, dscore-ui는 UI 담당으로 분리 
## modal
- 어디까지 어떤 기능을 만들고, 그 안에 스타일링이나 그런건 어찌할지 고민이라서 조금 더상세하게 만들어야할거 같아.
-- 아하 slot으로 modal에 보여질 컴포넌트를 넣자?

[대답]
맞아, slot 기반으로 내용은 완전 자유:

```vue
<DsModal v-model="isOpen" class="my-modal">
  <!-- 헤더 (선택) -->
  <template #header>
    <h2>사용자 등록</h2>
  </template>

  <!-- 본문 (필수) -->
  <template #default>
    <UserForm :data="formData" />
  </template>

  <!-- 푸터 (선택) -->
  <template #footer>
    <DsButton @click="close">취소</DsButton>
    <DsButton @click="save" class="btn-primary">저장</DsButton>
  </template>
</DsModal>
```

**DsModal이 제공하는 것 (기능만):**
- 열기/닫기 상태 (v-model)
- 오버레이 (배경 어둡게)
- ESC 키로 닫기
- 오버레이 클릭 시 닫기
- 포커스 트랩 (모달 안에서만 Tab 이동)
- 스크롤 잠금 (body 스크롤 방지)

**DsModal이 안 하는 것 (스타일):**
- 모달 크기, 위치, 둥글기, 그림자 → class로 직접
- 헤더/푸터 디자인 → slot 내용물로 직접
- 닫기 버튼 위치/모양 → 직접 배치하거나 close-icon prop 
## table
- 들어가는 컨텐츠를 어떻게 보일지 UI도 정해야하고. 데이터의 어떤 칼럼을 눌렀을 떄 어떤 상호작용을 할지 등 세세하게 기능이 들어가야 할거같은데. header에 따라 sorting다르게 하는거도 있고. paginating하면서도 선택한 값이 뭐였는지 기억해야하는 기능도 있고 꽤 많잖아?
-- Table로 감싸서 버튼을 넣도록 하는 이유는 뭐야? 그냥 따로 배치하면 되잖아.

[대답]
**기능 정리:**

```vue
<DsTable
  :data="users"
  :columns="columns"
  v-model:selected="selectedIds"
  v-model:sort-key="sortKey"
  v-model:sort-order="sortOrder"
  :row-key="row => row.id"
  selectable
>
  <!-- 셀 커스텀 (slot) -->
  <template #cell-status="{ row }">
    <DsStatusTag :status="row.status" />
  </template>

  <template #cell-actions="{ row }">
    <DsButton @click="edit(row)">수정</DsButton>
  </template>
</DsTable>
```

```js
const columns = [
  { key: 'name', label: '이름', sortable: true },
  { key: 'email', label: '이메일', sortable: true },
  { key: 'status', label: '상태' },  // slot으로 커스텀
  { key: 'actions', label: '관리', width: '120px' }  // 버튼 영역
]
```

**Table 안에 버튼 넣는 이유:**
- 각 행(row)마다 버튼이 필요하니까
- `#cell-actions` slot으로 해당 행의 row 데이터 접근 가능
- 테이블 밖에 배치하면 "어떤 행의 버튼인지" 연결이 안 됨

**페이지 이동해도 선택 유지:**
- `row-key` prop으로 고유 ID 지정
- 내부적으로 ID 기반으로 선택 상태 관리
- 페이지 바뀌어도 selectedIds 배열 유지 
## dsempty
- 비어있을 때 보여줄 컴포넌트를 커스텀하려면 어떻게 해야할지 설계방안

[대답]
세 가지 방법 모두 지원:

**1. 기본 사용 (텍스트만 바꾸기)**
```vue
<DsEmpty description="검색 결과가 없습니다" />
```

**2. 아이콘/이미지 교체**
```vue
<DsEmpty
  :icon="SearchIcon"
  description="검색 결과가 없습니다"
/>

<!-- 또는 이미지 -->
<DsEmpty
  image="/images/empty-box.png"
  description="등록된 데이터가 없습니다"
/>
```

**3. 완전 커스텀 (slot)**
```vue
<DsEmpty>
  <template #default>
    <MyCustomEmptyIllustration />
    <p>아직 등록된 상품이 없어요</p>
    <DsButton @click="goToAdd">상품 등록하기</DsButton>
  </template>
</DsEmpty>
```

**전역 설정도 가능:**
```js
app.use(DsCore, {
  empty: {
    icon: DefaultEmptyIcon,
    description: '데이터가 없습니다'
  }
})
``` 
## tabs
- 탭 이동 시, 마지막 데이터/렌더링 화면 유지해줘야 하고, 탭을 포함한 페이지에서 벗어났을 때 state가 초기화되어야 할거고.

[대답]
두 가지 모드 제공:

**1. 기본 모드 (탭 전환 시 유지)**
```vue
<DsTabs v-model="activeTab" keep-alive>
  <DsTabPane name="users" label="사용자">
    <UserList />  <!-- 다른 탭 갔다 와도 상태 유지 -->
  </DsTabPane>
  <DsTabPane name="orders" label="주문">
    <OrderList />
  </DsTabPane>
</DsTabs>
```

- `keep-alive` prop → Vue의 `<KeepAlive>` 사용
- 탭 전환해도 컴포넌트 상태(스크롤 위치, 입력값 등) 유지
- 페이지 이탈하면 → 자동으로 언마운트되어 초기화

**2. 라우터 연동 모드**
```vue
<DsTabs v-model="activeTab" :router="true">
  <DsTabPane name="users" label="사용자" to="/admin/users" />
  <DsTabPane name="orders" label="주문" to="/admin/orders" />
</DsTabs>
```

- URL이 바뀌면서 탭 전환
- 뒤로가기/앞으로가기 지원
- 상태는 라우터 레벨에서 관리 
## breadcrumb
- uri만으로 보여주는건 어렵지 않아? 예를들어 om이라고 한다면, 이걸 어떤 화면으로 보여줄지 정해져있지 않잖아. (이거도 전역으로 해야하나?)

[대답]
맞아, URI만으로는 안 되고 매핑 필요. 두 가지 방법:

**1. 전역 설정 (권장)**
```js
// main.js 또는 router 설정
app.use(DsCore, {
  breadcrumb: {
    // path → label 매핑
    '/admin': '관리자',
    '/admin/users': '사용자 관리',
    '/admin/users/:id': '사용자 상세',
    '/om': '운영 관리',
    '/om/orders': '주문 관리'
  }
})
```

```vue
<!-- 자동으로 현재 경로 기반 생성 -->
<DsBreadcrumb />
<!-- /admin/users → 관리자 > 사용자 관리 -->
```

**2. 라우터 meta 활용**
```js
// router.js
{
  path: '/admin/users',
  component: UserList,
  meta: { breadcrumb: '사용자 관리' }
}
```

**3. 수동 지정**
```vue
<DsBreadcrumb :items="[
  { label: '홈', to: '/' },
  { label: '사용자 관리', to: '/admin/users' },
  { label: '홍길동' }  // 현재 페이지 (링크 없음)
]" />
```

실무에서는 라우터 meta + 전역 설정 조합이 편함 
## card
- 이건 뭐야> 궁금해

[대답]
콘텐츠를 시각적으로 그룹핑하는 컨테이너:

```vue
<DsCard class="my-card">
  <template #header>
    <h3>사용자 정보</h3>
    <DsButton size="sm">수정</DsButton>
  </template>

  <template #default>
    <p>이름: 홍길동</p>
    <p>이메일: hong@example.com</p>
  </template>

  <template #footer>
    <span class="text-gray">최근 수정: 2024-03-20</span>
  </template>
</DsCard>
```

**용도:**
- 대시보드 위젯
- 상세 정보 섹션
- 목록 아이템 (카드형 목록)
- 설정 그룹

**제공하는 것:**
- header / default(body) / footer 구조
- 접기/펴기 가능 (collapsible prop)

**제공 안 하는 것 (스타일):**
- 테두리, 그림자, 둥글기 → class로
- 패딩, 마진 → class로
- 배경색 → class로

```css
.my-card {
  border: 1px solid #eee;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}
``` 
## 공통
- 하나의 컴포넌트 안에 여러 컴포넌트를 쓰는게 있을 수 있잖아. 예를 들면 Form, button으로 막 복잡하게 구성되어 있는데 <Form />으로만 있으면 그 안에 서브 컴포넌트들 스타일 지정은 어렵잖아

[대답]
좋은 지적. 해결 방법 세 가지:

**1. 서브 컴포넌트도 slot으로 노출**
```vue
<DsForm class="my-form">
  <DsFormItem label="이름" class="my-form-item">
    <DsInput class="my-input" />
  </DsFormItem>
  <DsButton class="my-submit-btn">저장</DsButton>
</DsForm>
```
→ 각 컴포넌트에 개별 class 지정 가능

**2. CSS 중첩 선택자**
```css
.my-form {
  /* Form 전체 */
}
.my-form .ds-form-item {
  /* FormItem */
}
.my-form .ds-input {
  /* Input */
}
.my-form .ds-button {
  /* Button */
}
```
→ 부모 class 기준으로 하위 선택

**3. CSS 변수 상속**
```vue
<DsForm class="my-form">
  ...
</DsForm>
```
```css
.my-form {
  --ds-input-border: 1px solid blue;
  --ds-button-bg: blue;
  --ds-form-item-gap: 16px;
}
```
→ 부모에 CSS 변수 정의하면 자식들이 상속받아 사용

**설계 원칙:**
- 복합 컴포넌트는 가급적 slot으로 구성을 노출
- 내부 컴포넌트에 고정 class 부여 (`.ds-input`, `.ds-button` 등)
- CSS 변수로 테마 커스텀 지원

---

# 후속 질문

## button - 두 방식 통일
- 두 방식으로 가이딩을 주면 혼란스러울거같아. 하나로 해야할거 같은데.

[대답]
`async-click` 방식 하나로 통일하는 게 좋겠다:

```vue
<DsButton @click="save">저장</DsButton>
```

내부적으로:
1. click 핸들러가 async 함수인지 체크
2. async면 자동으로 loading 처리
3. sync면 그냥 실행

```js
// DsButton 내부 로직
const handleClick = async (e) => {
  if (props.onClick?.constructor.name === 'AsyncFunction') {
    loading.value = true
    try {
      await props.onClick(e)
    } finally {
      loading.value = false
    }
  } else {
    props.onClick?.(e)
  }
}
```

사용자는 그냥 `@click`에 async/sync 함수 넘기면 됨. 별도 학습 불필요.

## select - item 스타일 커스텀
- select item들의 css 커스텀은 어떤 식으로?

[대답]
세 가지 방법:

**1. 고정 class로 선택자 사용**
```css
.my-select .ds-select-option {
  padding: 8px 12px;
}
.my-select .ds-select-option--selected {
  background: #3b82f6;
}
.my-select .ds-select-option--highlighted {
  background: #e5e7eb;
}
```

**2. slot으로 완전 커스텀**
```vue
<DsSelect v-model="status" :options="options">
  <template #option="{ option, selected, highlighted }">
    <div :class="['my-option', { selected, highlighted }]">
      <Icon :name="option.icon" />
      <span>{{ option.label }}</span>
    </div>
  </template>
</DsSelect>
```

**3. CSS 변수**
```css
.my-select {
  --ds-select-option-padding: 8px 12px;
  --ds-select-option-hover-bg: #f3f4f6;
}
```

## checkbox - v-model 동작
- v-model을 지정하면 어떻게 되는거지?

[대답]
Vue의 v-model은 양방향 바인딩:

```vue
<DsCheckbox v-model="agree">동의</DsCheckbox>

<script setup>
const agree = ref(false)  // 체크 상태가 여기에 연결됨
</script>
```

- 체크하면 → `agree.value = true`
- 체크 해제하면 → `agree.value = false`
- `agree.value`를 코드로 바꾸면 → 체크박스 UI도 변경

React의 `checked` + `onChange` 조합과 동일한 개념인데, Vue는 이걸 `v-model` 하나로 처리.

## radio - single과 group
- single과 group 두 가지 옵션으로 제공되는거네

[대답]
맞아. 상황에 따라 선택:

```vue
<!-- Single: 레이아웃 자유롭게 배치할 때 -->
<div class="flex gap-4">
  <DsRadio v-model="type" value="A">타입 A</DsRadio>
  <span class="separator">|</span>
  <DsRadio v-model="type" value="B">타입 B</DsRadio>
</div>

<!-- Group: 간단하게 쓸 때 -->
<DsRadioGroup v-model="type" :options="typeOptions" />
```

Group은 편의 wrapper일 뿐, 내부적으로 Single을 여러 개 렌더링.

## form - v-model과 reset
- v-model로만 연결하면 value 변경이 바로 반영되는거야? reset, resetValue는 어떻게?

[대답]
맞아, Vue의 v-model은 즉시 반영:

```vue
<DsInput v-model="formData.name" />
<!-- 타이핑하면 formData.name이 바로 바뀜 -->
```

**reset 구현:**
```vue
<DsForm ref="formRef" :model="formData" :initial-data="initialData">
  ...
</DsForm>

<script setup>
const initialData = { name: '', email: '' }
const formData = reactive({ ...initialData })

// reset 호출하면 initialData로 복원
formRef.value.reset()
</script>
```

또는 dscore-starter-vue의 `useFormChanged` 사용:
```js
const { formData, reset, isDirty } = useFormChanged({
  name: '',
  email: ''
})
// reset() 호출하면 초기값으로 복원
```

## spinner - 전역 설정 가능한 것들
- 전역 설정으로 해줄 수 있는 것들이 더 있나?

[대답]
전역 설정 가능한 것들 정리:

```js
app.use(DsCore, {
  // 컴포넌트 교체
  spinner: MySpinner,

  // 아이콘 교체
  icons: {
    check: MyCheckIcon,
    close: MyCloseIcon,
    arrow: MyArrowIcon,
    calendar: MyCalendarIcon,
    search: MySearchIcon,
  },

  // Empty 상태
  empty: {
    icon: MyEmptyIcon,
    description: '데이터가 없습니다'
  },

  // Breadcrumb 매핑
  breadcrumb: {
    '/admin': '관리자',
    // ...
  },

  // 기본값 설정
  defaults: {
    button: { throttle: 300 },
    input: { debounce: 300 },
    modal: { closeOnOverlay: true, closeOnEsc: true },
    pagination: { pageSize: 20 }
  },

  // 언어/로케일
  locale: 'ko',
  messages: {
    confirm: { ok: '확인', cancel: '취소' },
    pagination: { prev: '이전', next: '다음' }
  }
})
```

## modal - 기본 close 버튼
- default close 버튼은 줘도 되지 않을까

[대답]
좋은 생각. 기본 제공하되 끌 수 있게:

```vue
<!-- 기본: 닫기 버튼 있음 -->
<DsModal v-model="isOpen">
  ...
</DsModal>

<!-- 끄기 -->
<DsModal v-model="isOpen" :show-close="false">
  ...
</DsModal>

<!-- 커스텀 닫기 버튼 -->
<DsModal v-model="isOpen" :close-icon="MyCloseIcon">
  ...
</DsModal>
```

기본 닫기 버튼 위치: 우측 상단 (header 영역)

## table - 가이드 필요
- 어떻게 커스텀해야할지 가이드도 있어야하네

[대답]
맞아. 문서에 포함되어야 할 내용:

**1. 기본 사용법**
```vue
<DsTable :data="users" :columns="columns" />
```

**2. 셀 커스텀 (slot 이름 규칙)**
- `#cell-{columnKey}` → 해당 컬럼 셀 커스텀
- `#header-{columnKey}` → 해당 컬럼 헤더 커스텀

**3. slot에서 받는 데이터**
```vue
<template #cell-status="{ row, column, rowIndex }">
  {{ row }}       <!-- 현재 행 데이터 -->
  {{ column }}    <!-- 컬럼 정의 -->
  {{ rowIndex }}  <!-- 행 인덱스 -->
</template>
```

**4. 스타일링 class 목록**
- `.ds-table` - 테이블 전체
- `.ds-table-header` - 헤더 영역
- `.ds-table-body` - 바디 영역
- `.ds-table-row` - 행
- `.ds-table-row--selected` - 선택된 행
- `.ds-table-cell` - 셀

→ 별도 가이드 문서 + Storybook 샘플 필요

## breadcrumb - 수동 지정과 링크
- 수동 지정으로 안하면 링크 이동되게 해야하는데, 링크가 없을 수도 있는데

[대답]
이해했어. 정리하면:

```vue
<DsBreadcrumb :items="[
  { label: '홈', to: '/' },           // 클릭 가능 (링크 있음)
  { label: '사용자 관리', to: '/users' },  // 클릭 가능
  { label: '홍길동' }                  // 클릭 불가 (현재 페이지, to 없음)
]" />
```

**규칙:**
- `to` 있으면 → `<router-link>`로 렌더링, 클릭 가능
- `to` 없으면 → `<span>`으로 렌더링, 클릭 불가 (보통 마지막 항목)

**전역 설정 사용 시:**
- 매핑에 있는 경로는 자동으로 링크 생성
- 현재 경로(마지막)는 자동으로 링크 없이 렌더링

## modal도 header/content/footer 구조
- modal도 header, content, bottom으로 구성?

[대답]
맞아, 이미 그렇게 설계됨:

```vue
<DsModal v-model="isOpen">
  <template #header>헤더</template>
  <template #default>본문 (content)</template>
  <template #footer>푸터 (bottom)</template>
</DsModal>
```

Card와 Modal 둘 다 동일한 slot 구조:
- `#header` - 상단
- `#default` - 본문
- `#footer` - 하단

일관성 있게 설계.

## Form 같은 complex component 구현 고민
- 구현에 고민이 생기는 포인트가 있나?

[대답]
있어. 주요 고민 포인트:

**1. 자식 컴포넌트 수집**
- DsForm이 내부 DsFormItem, DsInput들의 검증 상태를 어떻게 수집?
- Vue의 `provide/inject`로 해결

**2. 검증 타이밍**
- 각 Input이 blur 시 개별 검증
- Form submit 시 전체 검증
- 둘 다 지원해야 함

**3. 에러 상태 전파**
- Form → FormItem → Input으로 에러 상태 전달
- Input 자체 rules 검증 결과를 FormItem이 표시

**해결 방향:**
```
DsForm (provide: formContext)
  └─ DsFormItem (inject: formContext, provide: itemContext)
       └─ DsInput (inject: itemContext)
```

복잡해지지만 사용자 입장에선 그냥 slot으로 조합하면 됨.

## 공통 - dscore-ui가 dscore-starter-vue 의존
- dscore-ui 만들면 dscore-starter-vue를 필수 라이브러리로 지정해야겠네

[대답]
맞아. package.json에:

```json
// dscore-ui/package.json
{
  "name": "dscore-ui",
  "peerDependencies": {
    "vue": "^3.0.0",
    "dscore-starter-vue": "^1.4.0"
  }
}
```

**구조:**
```
dscore-starter-vue (composables)
       ↑
dscore-ui (components) - peerDependency로 지정
       ↑
프로젝트
```

프로젝트에서는 둘 다 설치:
```bash
npm install dscore-starter-vue dscore-ui
```

## 공통2 - 페이지 이탈 시 경고
- form 작성 중 페이지 이탈/모달 종료 시 경고 메시지

[대답]
가능해. 두 가지 레벨:

**1. 브라우저 레벨 (페이지 이탈)**
```js
// useFormChanged 또는 DsForm에 내장
const { isDirty } = useFormChanged(formData)

// 브라우저 beforeunload
onBeforeUnmount(() => {
  if (isDirty.value) {
    window.removeEventListener('beforeunload', warnBeforeLeave)
  }
})
```

**2. 라우터 레벨 (SPA 내 이동)**
```js
// vue-router navigation guard
onBeforeRouteLeave((to, from, next) => {
  if (isDirty.value) {
    const confirmed = await confirm('변경사항을 저장하지 않고 나가시겠습니까?')
    if (confirmed) next()
    else next(false)
  } else {
    next()
  }
})
```

**3. 모달 레벨**
```vue
<DsModal
  v-model="isOpen"
  :confirm-before-close="isDirty"
  confirm-message="변경사항이 있습니다. 닫으시겠습니까?"
>
```

DsForm에 `warn-on-leave` prop 추가하면 1, 2번 자동 처리 가능.