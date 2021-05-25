<template>
  <div class="item-block">
    <div class="item">
      <div class="label">姓名：</div>
      <div class="content">{{data.name||'-'}}</div>
    </div>
    <div class="item">
      <div class="label">证件类型：</div>
      <div class="content">{{data.certificate_type_str||'-'}}</div>
    </div>
    <div class="item">
      <div class="label">证件号码：</div>
      <div class="content">{{data.certificate_number || '-'}}</div>
    </div>
    <div class="item">
      <div class="label">性别：</div>
      <div class="content">{{data.sex_str||'-'}}</div>
    </div>
    <div class="item">
      <div class="label">出生日期：</div>
      <div class="content">{{data.birthday ? formatBirthday(data.birthday) : '-'}}</div>
    </div>
    <div class="item">
      <div class="label">证件有效期类型：</div>
      <div
        class="content"
      >{{data.certificate_long_term === '' ? '-' : data.certificate_long_term === 0 ? '非长期' : '长期'}}</div>
    </div>
    <div class="item">
      <div class="label">证件有效起期：</div>
      <div
        class="content"
      >{{data.certificate_start_at ? formatDate(data.certificate_start_at * 1000, 'yyyy-MM-dd') : '-'}}</div>
    </div>
    <div class="item">
      <div class="label">证件有效止期：</div>
      <div
        class="content"
      >{{data.certificate_end_at ? formatDate(data.certificate_end_at * 1000, 'yyyy-MM-dd') : '-'}}</div>
    </div>

    <!--投保人,被保人显示-->
    <template v-if="type!=='3'">
      <div class="item">
        <div class="label">身高：</div>
        <div class="content">{{data.height||'-'}}</div>
      </div>
      <div class="item">
        <div class="label">体重(KG)：</div>
        <div class="content">{{(data.weight && data.weight !== '0.00') ? data.weight : '-'}}</div>
      </div>
      <div class="item">
        <div class="label">年收入(元)：</div>
        <div class="content">{{data.incomes||'-'}}</div>
      </div>
      <div class="item">
        <div class="label">职业：</div>
        <div class="content">{{data.occupation_name||'-'}}</div>
      </div>
      <div class="item">
        <div class="label">邮编：</div>
        <div class="content">{{data.zip_code||'-'}}</div>
      </div>
      <div class="item">
        <div class="label">邮箱：</div>
        <div class="content">{{data.email || '-'}}</div>
      </div>
      <div class="item">
        <div class="label">手机号码：</div>
        <div class="content">{{data.mobile || '-'}}</div>
      </div>
      <div class="item" v-if="type==='2'">
        <div class="label">是投保人的：</div>
        <div class="content">{{data.relation_str || '-'}}</div>
      </div>
      <div class="item one-line">
        <div class="label">联系地址：</div>
        <div class="content">{{data.addr||'-'}}</div>
      </div>
      <!--投保人显示部分-->
      <template v-if="type==='1'">
        <div class="item">
          <div class="label">开户银行：</div>
          <div
            class="content"
          >{{data.policy_renewal && data.policy_renewal.payment_bank_name || '-'}}</div>
        </div>
        <div class="item">
          <div class="label">银行卡号：</div>
          <div class="content">{{data.policy_renewal && data.policy_renewal.payment_account || '-'}}</div>
        </div>
        <div class="item">
          <div class="label">开户行地址：</div>
          <div
            class="content"
          >{{(data.policy_renewal && data.policy_renewal.payment_bank_province_name) ? (data.policy_renewal.payment_bank_province_name + data.policy_renewal.payment_bank_city_name) : '-'}}</div>
        </div>
        <div class="item">
          <div class="label">支行名称：</div>
          <div class="content">-</div>
        </div>
      </template>
    </template>
    <!--受益人显示-->
    <template v-else>
      <div class="item">
        <div class="label">是被保人的：</div>
        <div class="content">{{data.relation_str || '-'}}</div>
      </div>
      <div class="item">
        <div class="label">受益顺位：</div>
        <div class="content">{{data.sequence || '-'}}</div>
      </div>
      <div class="item">
        <div class="label">受益比例：</div>
        <div class="content">{{data.proportion ? data.proportion + '%' : '-'}}</div>
      </div>
    </template>
  </div>
</template>

<script>
import { formatDate } from '@/utils/formatTime'
export default {
  name: 'customer-info',
  props: {
    data: {
      type: Object,
      default: () => {},
    },
    type: {
      type: String,
      default: '1', // 1.投保人 2.被保人 3.受益人
    },
  },
  methods: {
    formatDate,
    formatBirthday(d) {
      return ('' + d).replace(/^(\d{4})(\d{2})(\d{2})$/, '$1-$2-$3')
    },
  },
}
</script>

<style scoped lang="scss">
.item-block {
  display: flex;
  align-items: center;
}
.item-block .item {
  width: 25%;
  display: flex;
  align-items: center;
}
.label {
  width: 120px;
  text-align: right;
  box-sizing: border-box;
  padding-right: 5px;
}
.content {
  flex: 1;
  overflow: hidden;
  word-break: break-all;
  padding: 15px;
  font-weight: 700;
}
</style>