<template>
    <Form ref="loginForm" :model="form" :rules="rules" class="login">
        <strong style="font-size: 50px;">SCRUM</strong>
        <span>V 0.2</span>
        <br>
        <br>
        <FormItem prop="userName">
            <Input v-model="form.userName" placeholder="请输入用户名" :autofocus="true" @on-keyup.enter="login">
                <span slot="prepend">
                    <Icon :size="16" type="person"></Icon>
                </span>
            </Input>
        </FormItem>
        <FormItem>
            <Button @click="login" type="primary" long>登录</Button>
        </FormItem>
    </Form>
</template>

<script>
import swal from "sweetalert2";
import { loginApi } from "../../util/api";
import Cookies from "js-cookie";

export default {
    data() {
        return {
            form: {
                userName: ""
            },
            rules: {
                userName: [
                    {
                        required: true,
                        message: "用户名不能为空",
                        trigger: "blur"
                    }
                ]
            }
        };
    },
    methods: {
        login() {
            this.$refs.loginForm.validate(async valid => {
                if (valid) {
                    try {
                        this.$Spin.show();

                        const user = await loginApi({
                            userName: this.form.userName
                        });

                        this.$Spin.hide();

                        if (user) {
                            Cookies.set("user", user);

                            this.$router.push({
                                path: "home/task"
                            });
                        } else {
                            swal({
                                title: "Error",
                                text: `The user does not exist.`,
                                type: "error"
                            });
                        }
                    } catch (error) {
                        this.$Spin.hide();

                        swal({
                            title: "Error",
                            text: `Login failed: ${error.message || error}`,
                            type: "error"
                        });
                    }
                }
            });
        }
    }
};
</script>

<style lang="less" scoped>
@import "./index.less";
</style>
