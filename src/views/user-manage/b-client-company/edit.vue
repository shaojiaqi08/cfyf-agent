<template>
    <el-scrollbar class="company-container">
        <div class="content" v-loading="loading">
            <el-form ref="companyForm" label-width="110px" class="edit-form" :model="formModel" :rules="rules">
                <template v-if="!isNextStep">
                    <div class="title" v-if="isAdd">新增B端公司<span>第一步：填写公司资料</span></div>
                    <div class="title" v-else>修改信息</div>
                    <div class="card">
                        <div class="header">企业信息</div>
                        <el-form-item class="item" label="主体类型" prop="subject">
                            <el-select v-model="formModel.subject" placeholder="请选择主体类型">
                                <el-option v-for="(label, key) in subject" :key="key" :value="key" :label="label"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item class="item" label="渠道" prop="sale_channel">
                            <el-select v-model="formModel.sale_channel" placeholder="请选择渠道">
                                <el-option v-for="(label, key) in sale_channel" :key="key" :value="key" :label="label"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item class="item" label="企业名称" prop="name">
                            <el-input v-model="formModel.name" placeholder="请输入企业名称"></el-input>
                        </el-form-item>
                        <el-form-item class="item" label="企业营业执照" prop="business_license_file_id">
                            <el-upload
                                    class="upload-demo"
                                    :action="fileUrl"
                                    multiple
                                    :limit="1"
                                    :on-exceed="handleExceed"
                                    :on-success="uploadFileSuccess"
                                    :on-remove="handleFileRemove"
                                    :file-list="fileList">
                                <el-button type="primary" v-on:[uploadEvent].stop="()=>{}" :class="{'disabled-upload': uploadEvent==='click'}"><i class="iconfont iconxiao16_shangchuan"></i> 上传</el-button>
                            </el-upload>
                        </el-form-item>
                        <el-form-item class="item" label="服务费发票类型" prop="invoice_type">
                            <el-select v-model="formModel.invoice_type" placeholder="请选择服务发票类型">
                                <el-option v-for="(label, key) in invoice_type" :key="key" :value="key" :label="label"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item class="item" label="发票税点" prop="invoice_tax_point">
                            <el-input v-model="formModel.invoice_tax_point" placeholder="请输入发票税点"></el-input>
                        </el-form-item>
                        <el-form-item class="item" label="所属城市" prop="province_id">
                            <el-cascader v-if="isAdd || formModel.province_id" v-model="cascaderVal" placeholder="请选择省市区" :props="cascaderProps" @change="handleSelRegion"></el-cascader>
                        </el-form-item>
                        <el-form-item class="item" label="详细地址" prop="address">
                            <el-input v-model="formModel.address" placeholder="请输入详细地址"></el-input>
                        </el-form-item>
                        <el-form-item class="item phone-form-item" label="固定电话" prop="telephone">
                            <el-input placeholder="区号" v-model="formModel.area_code"></el-input>
                            <span>-</span>
                            <el-input placeholder="座机号" v-model="formModel.telephone"></el-input>
                        </el-form-item>
                    </div>
                    <div class="card">
                        <div class="header">财务信息</div>
                        <el-form-item class="item" label="账户类型" :prop="'company_finance.account_type'">
                            <el-select v-model="formModel.company_finance.account_type" placeholder="请选择账户类型">
                                <el-option v-for="(label, key) in account_type" :key="key" :value="key" :label="label"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item class="item" label="户名" :prop="'company_finance.account_name'">
                            <el-input v-model="formModel.company_finance.account_name" placeholder="请输入账户名称"></el-input>
                        </el-form-item>
                        <el-form-item class="item" label="开户地址" :prop="'company_finance.account_addr'">
                            <el-input v-model="formModel.company_finance.account_addr"  placeholder="请输入开户地址"></el-input>
                        </el-form-item>
                        <el-form-item class="item" label="开户银行" :prop="'company_finance.account_bank'">
                            <el-select v-model="formModel.company_finance.account_bank" placeholder="请选择开户银行">
                                <el-option v-for="(item, index) in bankData" :key="index" :value="item.key" :label="item.value"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item class="item" label="银行卡号" :prop="'company_finance.account_number'">
                            <el-input v-model="formModel.company_finance.account_number" placeholder="请输入银行卡号"></el-input>
                        </el-form-item>
                    </div>
                    <el-button v-if="isAdd" type="primary" style="width:100%;margin-top: 16px" @click="nextStep">下一步</el-button>
                    <el-button v-else @click="submit" type="primary" style="width:100%;margin-top: 16px" :loading="submitting" :disabled="submitting">确认</el-button>
                </template>
                <template v-else>
                    <div class="title">新增B端公司
                        <span>
                            第二步：设置超管账号
                            <el-button @click="isNextStep = false">返回上一步</el-button>
                        </span>
                    </div>
                    <div class="card">
                        <div class="header">超管账号设置</div>
                        <el-form-item class="item" label="账号" prop="username">
                            <el-input v-model="formModel.username" placeholder="请输入超管账号"></el-input>
                        </el-form-item>
                        <el-form-item class="item" label="密码" prop="password">
                            <el-input v-model="formModel.password" placeholder="请输入超管密码"></el-input>
                        </el-form-item>
                        <el-form-item class="item" label="确认密码" prop="confirm_password">
                            <el-input v-model="formModel.confirm_password"  placeholder="请再次输入超管密码"></el-input>
                        </el-form-item>
                        <el-form-item class="item" label="电子邮箱" prop="email">
                            <el-input v-model="formModel.email"  placeholder="请输入电子邮箱"></el-input>
                        </el-form-item>
                        <el-form-item class="item" label="手机号" prop="mobile">
                            <el-input v-model="formModel.mobile"  placeholder="请输入手机号"></el-input>
                        </el-form-item>
                    </div>
                    <el-button type="primary" style="width:100%;margin-top: 16px" @click="submit" :loading="submitting" :disabled="submitting">完成</el-button>
                </template>
            </el-form>
        </div>
    </el-scrollbar>
</template>
<script>
    import {getRegion, getBankList} from '@/apis/modules/index'
    import {createCompany, editCompany, getCompanyDetail} from '@/apis/modules/user-manage'
    import {subject, sale_channel, invoice_type, account_type} from '@/enums/user-manage'
    export default {
        name: "company-edit",
        data() {
            const baseValiObj = {required: true, message: '此项不可为空', trigger: 'blur'}
            return {
                submitting: false,
                loading: false,
                data: {},
                uploadEvent: null,
                formModel: {
                    subject: '',
                    sale_channel: '',
                    business_license_file_id: '',
                    invoice_type: '',
                    invoice_tax_point: '',
                    province_id: '',
                    city_id: '',
                    district_id: '',
                    address: '',
                    area_code: '',
                    telephone: '',
                    username: '',
                    password: '',
                    confirm_password: '',
                    email: '',
                    mobile: '',
                    name: '',
                    company_finance: {
                        account_addr: '',
                        account_bank: '',
                        account_name: '',
                        account_number: '',
                        account_type: ''
                    }
                },
                rules: {
                    name: baseValiObj,
                    subject: baseValiObj,
                    business_license_file_id: baseValiObj,
                    sale_channel: baseValiObj,
                    invoice_type: baseValiObj,
                    invoice_tax_point: baseValiObj,
                    province_id: baseValiObj,
                    address: baseValiObj,
                    account_type: baseValiObj,
                    account_name: baseValiObj,
                    account_addr: baseValiObj,
                    account_bank: baseValiObj,
                    account_number: baseValiObj,
                    username: baseValiObj,
                    telephone: {validator: this.telephoneValidator},
                    password: [baseValiObj, {validatetor: this.pwdValidator}, {validatetor: this.comparePwdValitator}],
                    confirm_password: [baseValiObj, {validatetor: this.pwdValidator}, {validatetor: this.comparePwdValitator}],
                    email: [baseValiObj, {validatetor: this.emailValidator}],
                    mobile: [baseValiObj, {validatetor: this.moblieValidator}]
                },
                isNextStep: false,
                fileList: [],
                isAdd: true,
                cascaderVal: [],
                cascaderProps:  {
                    lazy: true,
                    lazyLoad (node, resolve) {
                        const { level } = node;
                        const pid = level ? node.value : 1
                        getRegion({pid}).then(res => {
                            const node = res.map(item => ({
                                value: item.id,
                                label: item.name,
                                leaf: item.type === 'district'
                            }))
                            resolve(node)
                        })
                    }
                },
                provinceData: [],
                bankData: [],
                imageUrl: process.env.VUE_APP_IMG_URL + '/api/images/upload',
                fileUrl: process.env.VUE_APP_FILE_URL + '/api/files/upload',
                // 以下枚举对象
                subject,
                sale_channel,
                invoice_type,
                account_type
            }
        },
        methods: {
            uploadFileSuccess(res) {
                // 上传失败,清空文件
                const {formModel} = this
                if (res.code !== 0) {
                    this.$message.error(res.message)
                    this.$refs.file_upload.clearFiles()
                    formModel.business_license_file_id = null
                    this.fileList = []
                    this.uploadEvent = null
                } else {
                    formModel.business_license_file_id = res.data.file_id
                    this.uploadEvent = 'click'
                }
            },
            handleFileRemove() {
                this.formModel.business_license_file_id = null
                this.uploadEvent = null
            },
            ajaxDetail(id) {
                this.loading = true
                getCompanyDetail({id}).then(res => {
                    const {province_id, city_id, district_id} = res
                    this.cascaderVal = [province_id, city_id, district_id]
                    this.formModel = res
                }).finally(() => {
                    this.loading = false
                })
            },
            ajaxBankData() {
                getBankList().then(res => {
                    this.bankData = res
                }).catch(() => {})
            },
            nextStep() {
                this.$refs.companyForm.validate(flag => {
                    if (flag) {
                        this.isNextStep = true
                    } else {
                        this.$message.error('有必填项为空，请检查')
                    }
                })
            },
            submit() {
                this.$refs.companyForm.validate(flag => {
                    if (flag) {
                        const {isAdd, formModel: data} = this
                        this.submitting = true
                        ;(isAdd ? createCompany : editCompany)({...data}).then(res => {
                            this.$message.success(`${isAdd ? '新增' : '修改'}成功!`)
                            window.localStorage.setItem('refreshPage', JSON.stringify(res))
                            window.close()
                        }).catch(() => {}).finally(() => {
                            this.submitting = false
                        })
                    }
                })
            },
            handleSelRegion(arr) {
                const [province_id, city_id, district_id = ''] = arr
                const model = this.formModel
                model.province_id = province_id
                model.city_id = city_id
                model.district_id = district_id
            },
            comparePwdValitator(rule, value, callback) { // eslint-disable-line
                const {password, confirm_password} = this.formModel
                if (!password || !confirm_password) {
                    callback()
                } else if(password !== confirm_password) {
                    callback(new Error('确认新密码必须跟新密码一致'))
                }
            },
            telephoneValidator(rule, value, callback) { // eslint-disable-line
                const {area_code, telephone} = this.formModel
                if (!area_code || !telephone) {
                    callback(new Error('区号跟固话不能为空'))
                }
                callback()
            },
            pwdValidator(rule, value, callback) {
                if (value.length < 6) {
                    return callback(new Error('密码至少是6位任意字符'))
                }
                callback()
            },
            emailValidator(rule, value, callback) { // eslint-disable-line
                if(!/^(\w)+(\.\w+)*@(\w)+((\.\w{2,3}){1,3})$/.test(value)) {
                    return callback(new Error('请输入正确的email格式'))
                }
                callback()
            },
            moblieValidator(rule, value, callback) { // eslint-disable-line
                if (!/^1[3456789]\d{9}$/.test(value)) {
                    return callback(new Error('请输入正确的手机格式'))
                }
                callback()
            },
            handleExceed() {
                this.$message.error('附件只能上传一个,请删除了再上传')
            }
        },
        created() {
            const {id} = this.$route.params
            this.isAdd = id === undefined
            this.ajaxBankData()
            !this.isAdd && this.ajaxDetail(id)
        }
    }
</script>

<style scoped lang="scss">
    .company-container{
        width: 100%;
        height: 100%;
        .content{
            width: 480px;
            margin: 16px auto;
            .title{
                padding: 0 16px;
                display: flex;
                height:60px;
                justify-content: space-between;
                align-items: center;
                background:rgba(245,245,245,1);
                border-radius:4px;
                border:1px solid rgba(230,230,230,1);
                font-size: 18px;
                &>span{
                    color:#4d4d4d;
                    font-size: 12px;
                    .el-button{
                        margin-left: 12px;
                    }
                }
            }
            .card{
                overflow: hidden;
                border: 1px solid #e6e6e6;
                border-radius: 4px;
                margin: 16px auto 0 auto;
                background: #fff;
                .header{
                    background-color: #f5f5f5;
                    padding: 0 16px;
                    height: 48px;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    margin-bottom: 20px;
                    border-bottom: 1px solid #e6e6e6;
                }
                .el-form-item{
                    margin-bottom: 20px;
                    font-size: 14px;
                    color:#4d4d4d;
                    padding: 0 16px;
                    white-space: nowrap;
                    &>span{
                        color:#1A1A1A;
                        font-weight: bold;
                        flex: 1;
                        display: inline-block;
                        text-align: right;
                        padding-left: 16px;
                    }
                    &.phone-form-item {
                        & > ::v-deep .el-form-item__content{
                            display: flex;
                            &>span{
                                margin: 0 10px 0 8px;
                                font-weight: bold;
                            }
                            .el-input:first-of-type{
                                width: 87px;
                            }
                        }
                    }
                    ::v-deep .el-form-item__label::before{
                        display: none;
                    }
                }
            }
        }
        .edit-form{
            .el-select, .el-cascader{
                width: 100%;
            }
            .disabled-upload{
                opacity: .5;
            }
        }
    }
</style>