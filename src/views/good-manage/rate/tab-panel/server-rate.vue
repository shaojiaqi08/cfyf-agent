<template>
    <div class="server-rate-container">
        <side-filter-list
            :list-data="list"
            label-key="name"
            placeholder="搜索B端公司"
        >
<!--            <template v-slot:list="{row}">-->
<!--                <span style="background-color: red">{{row.name}}</span>-->
<!--            </template>-->
        </side-filter-list>
    </div>
</template>
<script>
    import SideFilterList from "../component/side-filter-list"

    export default {
        name: 'server-rate',
        components: {SideFilterList},
        data() {
           return {
               list: [
                   {name: 1},
                   {name: 2},
                   {name: 3},
               ]
           }
        },
        created() {
        }
    }
</script>

<style scoped lang="scss">
    .server-rate-container{
        height: 100%;
        overflow: hidden;
    }
</style>