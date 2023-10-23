<script setup>
import { ref } from 'vue'
import { Edit, Delete } from '@element-plus/icons-vue'
import ChannelSelect from './components/ChannelSelect.vue'
import ArticleEdit from './components/ArticleEdit.vue'
import { artGetListService, artDelService } from '@/api/article'
import { formatTime } from '@/utils/format.js'

const articleList = ref([])
const total = ref(0)
const loading = ref(false)
const param = ref({
  pagenum: 1,
  pagesize: 5,
  cate_id: '',
  state: ''
})

const getArticleList = async () => {
  loading.value = true
  const res = await artGetListService(param.value)
  articleList.value = res.data.data
  total.value = res.data.total
  loading.value = false
}
getArticleList()

// 分页逻辑
const onSizeChange = (size) => {
  param.value.pagenum = 1
  param.value.pagesize = size
  getArticleList()
}
const onCurrentChange = (page) => {
  page.value.pagenum = page
  getArticleList()
}
const onSearch = () => {
  param.value.pagenum = 1
  getArticleList()
}
const onReset = () => {
  param.value.cate_id = ''
  param.value.state = ''
  param.value.pagenum = 1
  getArticleList()
}

const articleEdit = ref()
// 添加文章
const addArticle = () => {
  articleEdit.value.open({})
}

// 编辑文章
const editArticle = (row) => {
  articleEdit.value.open(row)
}

// 删除文章
const deleteArticle = async (row) => {
  // 提示用户是否要删除
  await ElMessageBox.confirm('此操作将永久删除该文件, 是否继续?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
  await artDelService(row.id)
  ElMessage.success('删除成功')
  // 重新渲染列表
  getArticleList()
}

// 成功回调
const onSuccess = (type) => {
  if (type === 'add') {
    // 如果是添加，最好渲染最后一页
    const lastPage = Math.ceil((total.value + 1) / param.value.pagesize)
    // 更新成最大页码数，再渲染
    param.value.pagenum = lastPage
  }
  getArticleList()
}
</script>
<template>
  <page-container title="文章管理">
    <template #extra>
      <el-button type="primary" @click="addArticle">发布文章</el-button>
    </template>
    <!-- 表单区域 -->
    <el-form inline>
      <el-form-item label="文章分类:">
        <channel-select v-model="param.cate_id"></channel-select>
      </el-form-item>
      <el-form-item label="发布状态">
        <el-select v-model="param.state">
          <el-option label="已发布" value="已发布"></el-option>
          <el-option label="草稿" value="草稿"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSearch">搜索</el-button>
        <el-button @click="onReset">重置</el-button>
      </el-form-item>
    </el-form>
    <el-table v-loading="loading" :data="articleList">
      <el-table-column label="文章标题" prop="title">
        <template #default="{ row }">
          <el-link type="primary" :underline="false">
            {{ row.title }}
          </el-link>
        </template>
      </el-table-column>
      <el-table-column label="分类" prop="cate_name"></el-table-column>
      <el-table-column label="发表时间" prop="pub_date">
        <template #default="{ row }">
          {{ formatTime(row.pub_date) }}
        </template>
      </el-table-column>
      <el-table-column label="状态" prop="state"></el-table-column>
      <el-table-column label="操作">
        <template #default="{ row }">
          <el-button cirle plain type="primary" :icon="Edit" @click="editArticle(row)"></el-button>
          <el-button
            cirle
            plain
            type="danager"
            :icon="Delete"
            @click="deleteArticle(row)"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      v-model:current-page="param.pagenum"
      v-model:page-size="param.pagesize"
      :page-sizes="[5, 10, 50, 100]"
      :small="small"
      :disabled="disabled"
      :background="background"
      layout="jumper, total, sizes, prev, pager, next"
      :total="total"
      @size-change="onSizeChange"
      @current-change="onCurrentChange"
    />
    <article-edit ref="articleEdit" @success="onSuccess"></article-edit>
  </page-container>
</template>

<style lang="scss" scoped></style>
