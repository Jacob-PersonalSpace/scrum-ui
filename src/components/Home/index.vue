<template>
    <div class="layout">
        <Layout>
            <Sider ref="side1" hide-trigger collapsible :collapsed-width="78" v-model="isCollapsed">
                <Menu active-name="1-2" theme="dark" width="auto" :class="menuitemClasses">
                    <MenuItem name="1-1" @click.native="goToTask">
                        <Icon type="ios-list-outline"></Icon>
                        <span>Task</span>
                    </MenuItem>
                </Menu>
            </Sider>
            <Layout>
                <Header :style="{padding: 0}" class="layout-header-bar">
                    <Icon @click.native="collapsedSider" :class="rotateIcon" :style="{margin: '20px 20px 0'}" type="navicon-round" size="24"></Icon>
                    <span>Hi, {{userName}}</span>
                </Header>
                <Content :style="{margin: '20px', background: '#fff', minHeight: '260px'}">
                    <router-view
                        :users="users"
                    ></router-view>
                </Content>
            </Layout>
        </Layout>
    </div>
</template>

<script>
import swal from "sweetalert2";
import Cookies from "js-cookie";

import { getUserListApi } from "../../util/api";

export default {
    created() {
        this.userName = Cookies.getJSON("user").userName;
    },
    beforeCreate() {
        try {
            getUserListApi()
                .then(users => {
                    this.users = users;
                })
                .catch(error => {
                    swal("Error", `${error}`, "error");
                });
        } catch (error) {
            swal("Error", `${error}`, "error");
        }
    },
    data() {
        return {
            isCollapsed: false,
            users: [],
            userName: ""
        };
    },
    computed: {
        rotateIcon() {
            return ["menu-icon", this.isCollapsed ? "rotate-icon" : ""];
        },
        menuitemClasses() {
            return ["menu-item", this.isCollapsed ? "collapsed-menu" : ""];
        }
    },
    methods: {
        collapsedSider() {
            this.$refs.side1.toggleCollapse();
        },
        goToTask() {
            this.$router.push({
                name: "task"
            });
        }
    }
};
</script>

<style lang="less" scoped>
@import "./index.less";
</style>
