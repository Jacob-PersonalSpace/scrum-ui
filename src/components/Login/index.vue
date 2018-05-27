<template>
    <Form ref="loginForm" :model="form" :rules="rules" class="login">
        <strong style="font-size: 50px;">SCRUM</strong>
        <span>0.11 Beta</span>
        <br>
        <br>
        <FormItem prop="userName">
            <Input v-model="form.userName" placeholder="请输入用户名">
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
            this.$refs.loginForm.validate(valid => {
                if (valid) {
                    this.$Spin.show();

                    loginApi({ userName: this.form.userName })
                        .then(data => {
                            this.$Spin.hide();

                            if (data) {
                                Cookies.set("user", data);

                                this.$router.push({
                                    name: "home"
                                });
                            }
                        })
                        .catch(error => {
                            this.$Spin.hide();

                            swal({ text: `${error}`, type: "error" });
                        });
                }
            });
        }
    }
};
</script>

<style lang="less" scoped>
@import "./index.less";
</style>
