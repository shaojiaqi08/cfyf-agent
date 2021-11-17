<template>
  <el-dialog
    custom-class="edit-sales-dialog"
    :title="`批量导入销售`"
    :visible="visible"
    :close-on-click-modal="false"
    @close="closeDialog"
    width="780px"
  >
    <div v-if="!isSuccess">
      <div class="import-dia">
        <el-upload
          drag
          :action="uploadPath"
          :show-file-list="false"
          :before-upload="beforeUpload"
          :on-success="uploadSuccess"
          :on-error="uploadError"
          v-loading="uploading"
        >
          <template v-if="!formData.file_id">
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">
              将文件拖到此处，或
              <em>点击上传</em>
            </div>
          </template>
          <template v-else>
            <i class="el-icon-document" style="color: #1F78FF"></i>
            <div class="el-upload__text">{{ formData.file_name }}</div>
          </template>
        </el-upload>
      </div>
      <div class="tips-content">
        <div>导入说明：</div>
        <div>
          1. 请按照<el-tooltip
            class="item"
            effect="dark"
            content="点击下载"
            placement="top"
          >
            <a
              style="color:#1F78FF;padding:0 4px;"
              :href="templateLink"
              download
              >导入模板.xlsx</a
            > </el-tooltip
          >格式整理数据后，上传表格导入
        </div>
        <div>
          2. 建议每次导入人员名单数在<span
            style="color:#222;padding:0 0px;font-weight:800;"
            >100</span
          >个以内
        </div>
        <div>
          3.
          若导入的销售名单中，已在系统中存在，则以系统中的数据为准，不再重复导入
        </div>
        <div>
          4. 若导入的销售名单中，无法通过基础校验时，系统将忽略这部分数据的导入
        </div>
        <div>5. 请先到系统中创建销售的“职位”</div>
      </div>
    </div>
    <div v-else>
      <el-table height="380" :data="successList" v-loading="tableLoading" border stripe style="width: 100%">
        <el-table-column prop="real_name" align="center" label="姓名" width="180">
        </el-table-column>
        <el-table-column prop="position_name" label="职位" align="center" width="180">
        </el-table-column>
        <el-table-column
          label="导入状态"
          prop="is_success"
          align="center"
          width="100"
        >
          <template v-slot="{ row }">
            <el-tag :type="statusColorMap[row.is_success]">{{
              row.is_success == 1 ? '成功' : "失败"
            }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          label="备注"
          prop="failed_reason"
          align="center"
        >
          <template slot-scope="{ row }">
            <div v-for="(item, index) in row.failed_reason" :key="index" style="text-align:left;">
              {{ index + 1 }}.{{ item }}
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <span slot="footer" v-if="!isSuccess">
      <el-button @click="closeDialog">取消</el-button>
      <el-button
        type="primary"
        :loading="submitting"
        :disabled="submitting"
        @click="submit"
        >确认</el-button
      >
    </span>
    <span slot="footer" v-else>
      <el-button type="primary" @click="closeDialog1">确认</el-button>
    </span>
  </el-dialog>
</template>

<script>
/**
 *  导入销售 Dialog
 * */
import {
  importSalesList,
  getImportSalesList,
} from "@/apis/modules/user-manage";
export default {
  name: "edit-sales-dialog",
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    id: {
      default: "",
    },
    positionData: {
      type: Array,
      default: () => [],
    },
    teamData: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      loading: false,
      submitting: false,
      teamSelLoading: false,
      uploadPath: process.env.VUE_APP_FILE_URL + "/api/files/upload",
      // http://file.service.beta.2239.com/api/files/upload
      uploading: false,
      templateLink: "files/销售导入模板.xlsx",
      formData: {
        file_id: "",
      },
      isSuccess: false,
      tableLoading: false,
      successList: [],
      statusColorMap: Object.freeze({
        0: "danger",
        1: "success",
      }),
    };
  },
  methods: {
    beforeUpload(file) {
      if (/.*\.(xlsx|xls)$/.test(file.name)) {
        this.uploading = true;
        return true;
      } else {
        this.$message.error("上传文件格式错误，请上传 xslx 或 xls 文件格式");
        return false;
      }
    },
    submit() {
      if (this.formData && this.formData.file_id) {
        this.submitting = true;
        importSalesList({ file_id: this.formData.file_id })
          .then((res) => {
            console.log(JSON.stringify(res));
            if (res.id) {
              this.isSuccess = true;
              this.tableLoading = true;
              this.getSalesList(res.id);
            }
          })
          .catch(() => {})
          .finally(() => {
            this.submitting = false;
          });
      } else {
        this.$message.error("请先上传文件");
      }
    },
    getSalesList(id) {
      getImportSalesList({ import_log_id: id })
        .then((res) => {
          this.successList = res;
          this.tableLoading = false;
        })
        .catch(() => {})
        .finally(() => {
          this.submitting = false;
        });
    },
    uploadError() {
      this.uploading = false;
    },
    uploadSuccess(res) {
      let file = res.data;
      this.formData = { file_id: file.file_id, file_name: file.file_name };
      this.uploading = false;
    },
    closeDialog1() {
      this.$nextTick(() => {
        this.$emit("update:visible", false);
        this.$emit('success')
      });
    },
    closeDialog() {
      this.$nextTick(() => {
        this.$emit("update:visible", false);
      });
    },
    comparePwdValidator(rule, value, callback) {
      // eslint-disable-line
      const { password, confirm_password } = this.formModel;
      if (!password || !confirm_password) {
        return callback();
      } else if (password !== confirm_password) {
        return callback(new Error("确认密码必须跟密码一致"));
      }
      return callback();
    },
  },
  watch: {
    visible(v) {
      if (v) {
        this.formData = {};
        this.isSuccess = false;
      }
    },
  },
};
</script>

<style scoped lang="scss">
::v-deep .edit-sales-dialog .el-dialog__body {
  overflow: visible;
}
/deep/ .el-upload-dragger {
  width: 680px;
}
.import-dia {
  text-align: center;
}
.tips-content {
  padding: 10px 20px;
  background: #f7f9fb;
  margin: 20px 27px;
  border-radius: 10px;
  font-size: 14px;
}
.tips-content div {
  font-size: 14px;
}
.el-icon-document {
  font-size: 67px;
  margin: 40px 0 16px;
}
</style>
