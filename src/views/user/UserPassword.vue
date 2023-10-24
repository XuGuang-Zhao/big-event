<script setup>
import { ref } from 'vue'
import { useUserStore } from '@/stores'
import { userUpdatePasswordService } from '@/api/user'
import { useRouter } from 'vue-router'
import PageContainer from '@/components/PageContainer.vue'

const userStore = useUserStore()
const router = useRouter()
const formRef = ref()
const formValue = ref({
  old_pwd: '',
  new_pwd: '',
  re_pwd: ''
})

const checkDifferent = (rule, value, callback) => {
  // 校验新密码和原密码不能一样
  if (value === formValue.value.old_pwd) {
    callback(new Error('新密码不能与原密码一样'))
  } else {
    callback()
  }
}
const checkSameAsNewPwd = (rule, value, callback) => {
  // 校验确认密码必须和新密码一样
  if (value !== formValue.value.new_pwd) {
    callback(new Error('确认密码必须和新密码一样'))
  } else {
    callback()
  }
}

const rules = ref({
  old_pwd: [
    { required: true, message: '请输入原密码', trigger: 'blur' },
    { min: 6, max: 15, message: '原密码长度在6-15位之间', trigger: 'blur' }
  ],
  new_pwd: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 6, max: 15, message: '新密码长度在6-15位之间', trigger: 'blur' },
    { validator: checkDifferent, trigger: 'blur' }
  ],
  re_pwd: [
    { required: true, message: '请再次输入新密码', trigger: 'blur' },
    { min: 6, max: 15, message: '确认密码长度在6-15位之间', trigger: 'blur' },
    { validator: checkSameAsNewPwd, trigger: 'blur' }
  ]
})

const submitForm = async () => {
  await formRef.value.validate()
  await userUpdatePasswordService(formValue.value)
  ElMessage.success('密码修改成功')

  // 密码修改成功后，退出重新登录
  // 清空本地存储的 token 和 个人信息
  userStore.setToken('')
  userStore.setUser({})

  // 拦截登录
  router.push('/login')
}
</script>
<template>
  <page-container title="基本资料">
    <el-form ref="formRef" :model="formValue" :rules="rules" label-width="100">
      <el-form-item label="原密码" prop="old_pwd">
        <el-input v-model="formValue.old_pwd" show-password></el-input>
      </el-form-item>
      <el-form-item label="新密码" prop="new_pwd" required>
        <el-input v-model="formValue.new_pwd" show-password></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="re_pwd" required>
        <el-input v-model="formValue.re_pwd" show-password></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm">修改密码</el-button>
        <el-button @click="resetForm">重置</el-button>
      </el-form-item>
    </el-form>
  </page-container>
</template>

<style lang="scss" scoped></style>
