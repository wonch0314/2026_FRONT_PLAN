# dscore-ui-vue Guide

> Vue 3 UI Component Library - 18개 컴포넌트

## 설치

```bash
npm install dscore-ui-vue
```

## 플러그인 설정

```typescript
// main.ts
import { createApp } from 'vue'
import { DsCore } from 'dscore-ui-vue'
import App from './App.vue'

const app = createApp(App)

app.use(DsCore, {
  // 전역 스피너 컴포넌트
  spinner: MyCustomSpinner,

  // 전역 아이콘
  icons: {
    success: CheckIcon,
    error: XIcon,
    warning: AlertIcon,
    info: InfoIcon,
    close: CloseIcon,
    arrow: ChevronDownIcon
  },

  // 빈 상태 컴포넌트
  empty: MyEmptyComponent,

  // 컴포넌트별 기본값
  defaults: {
    button: {
      throttle: 300,
      showSuccess: false,
      successDuration: 1500
    },
    modal: {
      closeOnEscape: true,
      closeOnOverlay: true,
      lockScroll: true
    },
    toast: {
      duration: 3000,
      position: 'top-right'
    }
  }
})

app.mount('#app')
```

## 컴포넌트

### Phase 1: Core

#### DsSpinner

로딩 인디케이터

```vue
<template>
  <DsSpinner size="md" />
  <DsSpinner size="lg" class="text-blue-500" />
</template>
```

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| size | `'sm' \| 'md' \| 'lg'` | `'md'` | 스피너 크기 |

---

#### DsButton

비동기 클릭 감지, 로딩 상태, 성공 아이콘 지원

```vue
<template>
  <!-- 기본 버튼 -->
  <DsButton @click="handleClick">저장</DsButton>

  <!-- 비동기 클릭 (자동 로딩) -->
  <DsButton @click="handleAsyncClick">저장</DsButton>

  <!-- 성공 아이콘 표시 -->
  <DsButton :show-success="true" @click="handleAsyncClick">저장</DsButton>

  <!-- 쓰로틀 적용 -->
  <DsButton :throttle="1000" @click="handleClick">저장</DsButton>

  <!-- 수동 로딩 상태 -->
  <DsButton :loading="isLoading">저장</DsButton>
</template>

<script setup>
const handleAsyncClick = async () => {
  await api.save()  // Promise 반환 시 자동으로 로딩 상태 관리
}
</script>
```

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| type | `'button' \| 'submit' \| 'reset'` | `'button'` | 버튼 타입 |
| disabled | `boolean` | `false` | 비활성화 |
| loading | `boolean` | `false` | 로딩 상태 (수동) |
| throttle | `number` | `0` | 클릭 쓰로틀 (ms) |
| showSuccess | `boolean` | `false` | 비동기 완료 후 성공 아이콘 표시 |
| successDuration | `number` | `1500` | 성공 아이콘 표시 시간 (ms) |
| spinner | `Component` | - | 커스텀 스피너 |
| successIcon | `Component` | - | 커스텀 성공 아이콘 |

---

#### DsInput

텍스트 입력 필드

```vue
<template>
  <DsInput v-model="value" placeholder="이름 입력" />
  <DsInput v-model="value" type="password" />
  <DsInput v-model="value" :error="true" error-message="필수 입력입니다" />
</template>
```

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| modelValue | `string` | `''` | v-model 값 |
| type | `string` | `'text'` | input type |
| placeholder | `string` | `''` | placeholder |
| disabled | `boolean` | `false` | 비활성화 |
| readonly | `boolean` | `false` | 읽기 전용 |
| error | `boolean` | `false` | 에러 상태 |
| errorMessage | `string` | `''` | 에러 메시지 |

---

#### DsModal

모달 다이얼로그

```vue
<template>
  <DsModal v-model="isOpen" title="확인">
    <p>내용입니다</p>

    <template #footer>
      <DsButton @click="isOpen = false">취소</DsButton>
      <DsButton @click="handleConfirm">확인</DsButton>
    </template>
  </DsModal>
</template>
```

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| modelValue | `boolean` | `false` | v-model (열림 상태) |
| title | `string` | `''` | 모달 제목 |
| closeOnEscape | `boolean` | `true` | ESC 키로 닫기 |
| closeOnOverlay | `boolean` | `true` | 오버레이 클릭으로 닫기 |
| showClose | `boolean` | `true` | 닫기 버튼 표시 |
| lockScroll | `boolean` | `true` | 바디 스크롤 잠금 |
| confirmBeforeClose | `boolean` | `false` | 닫기 전 확인 |
| confirmMessage | `string` | `'변경사항이 있습니다...'` | 확인 메시지 |

**Slots:**
- `default` - 모달 본문
- `header` - 헤더 커스텀
- `footer` - 푸터 커스텀

---

### Phase 2: Form

#### DsTextarea

텍스트 영역

```vue
<template>
  <DsTextarea v-model="content" :rows="5" placeholder="내용 입력" />
  <DsTextarea v-model="content" :auto-resize="true" />
  <DsTextarea v-model="content" :max-length="500" :show-count="true" />
</template>
```

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| modelValue | `string` | `''` | v-model 값 |
| placeholder | `string` | `''` | placeholder |
| rows | `number` | `3` | 행 수 |
| disabled | `boolean` | `false` | 비활성화 |
| readonly | `boolean` | `false` | 읽기 전용 |
| autoResize | `boolean` | `false` | 자동 높이 조절 |
| maxLength | `number` | - | 최대 글자 수 |
| showCount | `boolean` | `false` | 글자 수 표시 |

---

#### DsSelect

드롭다운 선택

```vue
<template>
  <DsSelect v-model="selected" :options="options" />
  <DsSelect v-model="selected" :options="options" :searchable="true" />
  <DsSelect v-model="selected" :options="options" :clearable="true" />
</template>

<script setup>
const options = [
  { value: 'apple', label: '사과' },
  { value: 'banana', label: '바나나', description: '열대 과일' },
  { value: 'orange', label: '오렌지', disabled: true }
]
</script>

<style>
/* 개별 옵션 스타일링 */
.ds-select-option-apple { color: red; }
.ds-select-option-banana { color: yellow; }
.ds-select-option-orange { color: orange; }
</style>
```

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| modelValue | `string \| number \| null` | `null` | v-model 값 |
| options | `Option[]` | `[]` | 옵션 배열 |
| placeholder | `string` | `'선택하세요'` | placeholder |
| searchable | `boolean` | `false` | 검색 가능 |
| clearable | `boolean` | `false` | 초기화 가능 |
| disabled | `boolean` | `false` | 비활성화 |

**Option 타입:**
```typescript
interface Option {
  value: string | number
  label: string
  icon?: Component
  description?: string
  disabled?: boolean
}
```

---

#### DsCheckbox

체크박스

```vue
<template>
  <DsCheckbox v-model="checked">약관에 동의합니다</DsCheckbox>
  <DsCheckbox v-model="checked" :indeterminate="isIndeterminate">전체 선택</DsCheckbox>
</template>
```

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| modelValue | `boolean` | `false` | v-model 값 |
| disabled | `boolean` | `false` | 비활성화 |
| indeterminate | `boolean` | `false` | 불확정 상태 |

---

#### DsRadio / DsRadioGroup

라디오 버튼

```vue
<template>
  <!-- 개별 사용 -->
  <DsRadio v-model="selected" value="a">옵션 A</DsRadio>
  <DsRadio v-model="selected" value="b">옵션 B</DsRadio>

  <!-- 그룹 사용 -->
  <DsRadioGroup v-model="selected" :options="options" />

  <!-- 가로 배치 -->
  <DsRadioGroup v-model="selected" :options="options" direction="horizontal" />
</template>

<script setup>
const options = [
  { value: 'a', label: '옵션 A' },
  { value: 'b', label: '옵션 B' },
  { value: 'c', label: '옵션 C', disabled: true }
]
</script>
```

**DsRadio Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| modelValue | `string \| number \| boolean` | - | v-model 값 |
| value | `string \| number \| boolean` | - | 라디오 값 |
| disabled | `boolean` | `false` | 비활성화 |
| name | `string` | - | 라디오 그룹 이름 |

**DsRadioGroup Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| modelValue | `string \| number \| boolean` | - | v-model 값 |
| options | `Option[]` | `[]` | 옵션 배열 |
| direction | `'horizontal' \| 'vertical'` | `'vertical'` | 배치 방향 |
| disabled | `boolean` | `false` | 전체 비활성화 |

---

#### DsSwitch

토글 스위치

```vue
<template>
  <DsSwitch v-model="enabled" />
  <DsSwitch v-model="enabled">알림 받기</DsSwitch>
</template>
```

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| modelValue | `boolean` | `false` | v-model 값 |
| disabled | `boolean` | `false` | 비활성화 |

---

#### DsNumberInput

숫자 입력

```vue
<template>
  <DsNumberInput v-model="quantity" :min="1" :max="100" :step="1" />
  <DsNumberInput v-model="price" :precision="2" />
</template>
```

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| modelValue | `number \| null` | `null` | v-model 값 |
| min | `number` | - | 최소값 |
| max | `number` | - | 최대값 |
| step | `number` | `1` | 증감 단위 |
| precision | `number` | - | 소수점 자릿수 |
| disabled | `boolean` | `false` | 비활성화 |
| placeholder | `string` | `''` | placeholder |

---

#### DsFormItem / DsForm

폼 레이아웃

```vue
<template>
  <DsForm @submit="handleSubmit">
    <DsFormItem label="이름" :required="true" :error="errors.name">
      <DsInput v-model="form.name" />
    </DsFormItem>

    <DsFormItem label="이메일" :error="errors.email">
      <DsInput v-model="form.email" type="email" />
    </DsFormItem>

    <DsButton type="submit">제출</DsButton>
  </DsForm>
</template>
```

**DsFormItem Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| label | `string` | `''` | 라벨 |
| required | `boolean` | `false` | 필수 표시 |
| error | `string` | `''` | 에러 메시지 |

**DsForm Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| disabled | `boolean` | `false` | 전체 비활성화 |

---

### Phase 3: Feedback

#### DsToast

토스트 알림 (Composable)

```vue
<script setup>
import { useToast } from 'dscore-ui-vue'

const toast = useToast()

const handleSave = async () => {
  try {
    await api.save()
    toast.success('저장되었습니다')
  } catch (e) {
    toast.error('저장에 실패했습니다')
  }
}

// 다양한 타입
toast.success('성공!')
toast.error('에러!')
toast.warning('경고!')
toast.info('정보')

// 커스텀 옵션
toast.show('메시지', {
  type: 'success',
  duration: 5000,
  position: 'bottom-center'
})
</script>
```

---

#### DsConfirm

확인 다이얼로그 (Composable)

```vue
<script setup>
import { useConfirm } from 'dscore-ui-vue'

const confirm = useConfirm()

const handleDelete = async () => {
  const result = await confirm({
    title: '삭제 확인',
    message: '정말 삭제하시겠습니까?',
    confirmText: '삭제',
    cancelText: '취소',
    type: 'danger'
  })

  if (result) {
    await api.delete(id)
  }
}
</script>
```

---

#### DsAlert

인라인 알림

```vue
<template>
  <DsAlert type="success">저장되었습니다</DsAlert>
  <DsAlert type="error" :closable="true" @close="handleClose">에러 발생</DsAlert>
  <DsAlert type="warning">경고 메시지</DsAlert>
  <DsAlert type="info">안내 메시지</DsAlert>
</template>
```

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| type | `'success' \| 'error' \| 'warning' \| 'info'` | `'info'` | 알림 타입 |
| closable | `boolean` | `false` | 닫기 버튼 표시 |
| icon | `Component` | - | 커스텀 아이콘 |

---

#### DsProgress

진행률 표시

```vue
<template>
  <DsProgress :value="50" />
  <DsProgress :value="75" :show-text="true" />
  <DsProgress :value="100" status="success" />
</template>
```

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| value | `number` | `0` | 진행률 (0-100) |
| showText | `boolean` | `false` | 퍼센트 텍스트 표시 |
| status | `'normal' \| 'success' \| 'error'` | `'normal'` | 상태 |
| strokeWidth | `number` | `8` | 바 두께 |

---

#### DsSkeleton

로딩 플레이스홀더

```vue
<template>
  <DsSkeleton />
  <DsSkeleton type="circle" />
  <DsSkeleton type="rect" :width="200" :height="150" />
  <DsSkeleton :rows="3" />
</template>
```

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| type | `'text' \| 'circle' \| 'rect'` | `'text'` | 스켈레톤 타입 |
| width | `number \| string` | `'100%'` | 너비 |
| height | `number \| string` | - | 높이 |
| rows | `number` | `1` | 텍스트 행 수 |
| animated | `boolean` | `true` | 애니메이션 |

---

## CSS 커스터마이징

모든 컴포넌트는 고정된 CSS 클래스를 제공합니다:

```css
/* 버튼 커스터마이징 */
.ds-button {
  background: var(--primary-color);
  border-radius: 8px;
}

.ds-button--loading {
  opacity: 0.7;
}

/* 입력 필드 커스터마이징 */
.ds-input {
  border: 1px solid #e5e7eb;
  border-radius: 6px;
}

.ds-input--error {
  border-color: #ef4444;
}

/* 모달 커스터마이징 */
.ds-modal-overlay {
  background: rgba(0, 0, 0, 0.5);
}

.ds-modal-content {
  border-radius: 12px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}

/* 셀렉트 옵션별 스타일링 */
.ds-select-option-premium {
  background: linear-gradient(to right, gold, orange);
}
```

## 스타일 우선순위

1. **컴포넌트 prop** (가장 높음)
2. **전역 설정** (DsCore 플러그인)
3. **기본값** (가장 낮음)

```vue
<template>
  <!-- prop이 전역 설정보다 우선 -->
  <DsButton :spinner="MySpinner">저장</DsButton>
</template>
```

## TypeScript 지원

모든 Props 타입이 export됩니다:

```typescript
import type {
  DsCoreOptions,
  DsButtonProps,
  DsInputProps,
  DsModalProps,
  DsSelectProps,
  // ...
} from 'dscore-ui-vue'
```
