<template>
    <div class="task">
        <Button type="success" @click="taskModal = true">Create Task</Button>
        <br>
        <br>
        <Row type="flex" justify="space-around" class="code-row-bg" style="height: 100%;">
            <Col span="5">
                <span style="font-size: 15px;">Task Pool</span>
                <draggable v-model="taskList" :options="{group: 'task'}" class="item-group" :move="beforeMove" @end="afterMove" id="1">
                    <div v-for="element in taskList" :key="element.id" class="item">
                        <span class="taskId" @click="openTaskModel({ taskId: element.id, taskDescription: element.taskDescription })">{{element.taskTag}}</span>
                        <span class="taskName">{{element.taskName}}</span>
                        <Icon type="close" @click="deleteTask(element.id)"></Icon>
                    </div>
                </draggable>
            </Col>
            <Col span="5">
                <span style="font-size: 15px;">To Do</span>
                <draggable v-model="todoList" :options="{group: 'task'}" class="item-group" :move="beforeMove" @end="afterMove" id="2">
                    <div v-for="element in todoList" :key="element.id" class="item">
                        <span class="colorFlag" :style="{ backgroundColor: element.color }"></span>
                        <span class="taskId" @click="openTaskModel({ taskId: element.id, taskDescription: element.taskDescription })">{{element.taskTag}}</span>
                        <span class="taskName">{{element.taskName}}</span>
                        <span class="owner">{{element.ownerName}}</span>
                    </div>
                </draggable>
            </Col>
            <Col span="5">
                <span style="font-size: 15px;">Doing</span>
                <draggable v-model="doingList" :options="{group: 'task'}" class="item-group" :move="beforeMove" @end="afterMove" id="3">
                    <div v-for="element in doingList" :key="element.id" class="item">
                        <span class="colorFlag" :style="{ backgroundColor: element.color }"></span>
                        <span class="taskId" @click="openTaskModel({ taskId: element.id, taskDescription: element.taskDescription })">{{element.taskTag}}</span>
                        <span class="taskName">{{element.taskName}}</span>
                        <span class="owner">{{element.ownerName}}</span>
                    </div>
                </draggable>
            </Col>
            <Col span="5">
                <span style="font-size: 15px;">Done</span>
                <draggable v-model="doneList" :options="{group: 'task'}" class="item-group" :move="beforeMove" @end="afterMove" id="4">
                    <div v-for="element in doneList" :key="element.id" class="item" style="backgroundColor: #d8d8d8;">
                        <span class="colorFlag" :style="{ backgroundColor: element.color }"></span>
                        <span class="taskId" @click="openTaskModel({ taskId: element.id, taskDescription: element.taskDescription })">{{element.taskTag}}</span>
                        <span class="taskName">{{element.taskName}}</span>
                        <span style="position: absolute; right: 10px;">TS:{{element.timeSpend}}h</span>
                        <span class="owner">{{element.ownerName}}</span>
                    </div>
                </draggable>
            </Col>
        </Row>
        <Modal
            v-model="taskModal"
            title="New Task"
        >
            <Form ref="newTaskForm" :model="formTop" label-position="top" :rules="rule">
                <FormItem prop="taskTag" label="Task Tag">
                    <Input v-model="formTop.taskTag"></Input>
                </FormItem>
                <FormItem prop="taskName" label="Task Name">
                    <Input v-model="formTop.taskName"></Input>
                </FormItem>
                <FormItem label="Task Description">
                    <Input v-model="formTop.taskDescription" type="textarea" :autosize="{minRows: 2,maxRows: 10}"></Input>
                </FormItem>
            </Form>
            <div slot="footer">
                <Button @click="createTask()" type="success">提交</Button>
            </div>
        </Modal>
        <Modal
            v-model="resolveModal"
            width="20"
            @on-cancel="cancelResolve"
        >
            <Form ref="resolveForm" :model="formResolve" label-position="top" :rules="resolveRule">
                <FormItem prop="timeSpend" label="Time Spend">
                    <Input v-model="formResolve.timeSpend" style="width: 50px;"></Input>h
                </FormItem>
            </Form>
            <div slot="footer">
                <Button @click="updateTask()" type="success">确定</Button>
            </div>
        </Modal>
        <Modal
            v-model="taskDetailModal"
            width="50"
            title="Task Description"
        >
            <Form :model="taskDetail" label-position="top">
                <FormItem label="Description">
                    <span>{{taskDetail.taskDescription}}</span>
                </FormItem>
                <FormItem label="Comment">
                    <ul style="height: 300px; overflow-y: auto;">
                        <li v-for="comment in taskDetail.commentList" v-bind:key="comment.id">
                            <span>[{{comment.createdAt}}]</span>
                            <span>[{{comment.user.userName}}]</span>
                            <span>{{comment.comment}}</span>
                        </li>
                    </ul>
                </FormItem>
            </Form>
            <div slot="footer">
                <Form :model="taskDetail" label-position="top">
                    <FormItem>
                        <Input v-model="taskDetail.comment" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="Comment..."></Input>
                    </FormItem>
                    <FormItem>
                        <Button type="primary" @click="onAddComment">Add Comment</Button>
                    </FormItem>
                </Form>
            </div>
        </Modal>
    </div>
</template>

<script>
import swal from "sweetalert2";
import draggable from "vuedraggable";
import Cookies from "js-cookie";
import _ from "lodash";

import {
    createTaskApi,
    getTaskListApi,
    updateTaskApi,
    getCommentListApi,
    deleteCommentApi,
    addCommentApi
} from "../../util/api";

export default {
    props: ["users"],
    components: {
        draggable
    },
    beforeCreate() {
        try {
            this.$Spin.show();

            getTaskListApi()
                .then(result => {
                    this.$Spin.hide();

                    this.dataSource = result;

                    this.splitTask();
                })
                .catch(error => {
                    this.$Spin.hide();

                    swal("Error", `${error}`, "error");
                });
        } catch (error) {
            this.$Spin.hide();

            swal("Error", `${error}`, "error");
        }
    },
    data() {
        return {
            taskDetail: {
                taskId: 0,
                comment: "",
                taskDescription: "",
                commentList: []
            },
            taskDetailModal: false,
            formTop: {
                taskTag: "",
                taskName: "",
                taskDescription: ""
            },
            rule: {
                taskTag: [
                    {
                        required: true,
                        message: "Task tag is required.",
                        trigger: "blur"
                    }
                ],
                taskName: [
                    {
                        required: true,
                        message: "Task name is required.",
                        trigger: "blur"
                    }
                ]
            },
            movingObject: {},
            taskModal: false,
            resolveModal: false,
            formResolve: {
                timeSpend: 0
            },
            resolveRule: {
                timeSpend: [
                    {
                        validator: (rule, value, callback) => {
                            if (!value) {
                                callback(
                                    new Error("Time spend cannot be empty")
                                );
                            }

                            callback();
                        },
                        trigger: "blur"
                    }
                ]
            },
            dataSource: [],
            taskList: [],
            todoList: [],
            doingList: [],
            doneList: []
        };
    },
    methods: {
        openTaskModel({ taskId, taskDescription }) {
            this.taskDetailModal = true;

            try {
                getCommentListApi({ taskId })
                    .then(commentList => {
                        this.taskDetail.taskId = taskId;
                        this.taskDetail.taskDescription = taskDescription;
                        this.taskDetail.commentList = commentList;
                    })
                    .catch(error => {
                        this.taskDetailModal = false;

                        swal("", `Get comment failed: ${error}`, "error");
                    });
            } catch (error) {
                this.taskDetailModal = false;

                swal("", `Get comment failed: ${error}`, "error");
            }
        },
        onAddComment() {
            try {
                if (this.taskDetail.comment) {
                    addCommentApi({
                        userId: Cookies.getJSON("user").id,
                        taskId: this.taskDetail.taskId,
                        comment: this.taskDetail.comment
                    })
                        .then(() =>
                            getCommentListApi({
                                taskId: this.taskDetail.taskId
                            })
                        )
                        .then(commentList => {
                            this.taskDetail.comment = "";
                            this.taskDetail.commentList = commentList;
                        })
                        .catch(error => {
                            swal("", `Add comment failed: ${error}`, "error");
                        });
                }
            } catch (error) {
                swal("", `Add comment failed: ${error}`, "error");
            }
        },
        updateTask() {
            try {
                this.$refs.resolveForm.validate().then(valid => {
                    if (valid) {
                        this.resolveModal = false;
                        this.$Spin.show();

                        updateTaskApi({
                            taskId: this.movingObject.id,
                            userId: Cookies.getJSON("user").id,
                            status: 4,
                            ownerId: Cookies.getJSON("user").id,
                            timeSpend: this.formResolve.timeSpend
                        })
                            .then(result => {
                                this.$Spin.hide();

                                if (result.result === 1) {
                                    let targetItem = this.dataSource.find(
                                        v => v.id === this.movingObject.id
                                    );

                                    if (targetItem) {
                                        targetItem.owner = Cookies.getJSON(
                                            "user"
                                        ).id;
                                        targetItem.status = 4;
                                        targetItem.timeSpend = this.formResolve.timeSpend;
                                    }
                                }

                                this.splitTask();
                            })
                            .catch(error => {
                                this.$Spin.hide();

                                swal("Error", `${error}`, "error");
                            });
                    }
                });
            } catch (error) {
                this.$Spin.hide();

                swal("Error", `${error}`, "error");
            }
        },
        cancelResolve() {
            this.splitTask();
        },
        afterMove(evt) {
            if (evt.from.id !== evt.to.id) {
                if (evt.from.id === "1" && evt.to.id !== "4") {
                    try {
                        this.$Spin.show();

                        updateTaskApi({
                            taskId: this.movingObject.id,
                            userId: Cookies.getJSON("user").id,
                            status: parseInt(evt.to.id),
                            ownerId: Cookies.getJSON("user").id
                        })
                            .then(result => {
                                this.$Spin.hide();

                                if (result.result === 1) {
                                    let targetItem = this.dataSource.find(
                                        v => v.id === this.movingObject.id
                                    );

                                    if (targetItem) {
                                        targetItem.owner = Cookies.getJSON(
                                            "user"
                                        ).id;
                                        targetItem.status = parseInt(evt.to.id);

                                        this.splitTask();
                                    }
                                }
                            })
                            .catch(error => {
                                this.$Spin.hide();

                                swal("Error", `${error}`, "error");
                            });
                    } catch (error) {
                        this.$Spin.hide();

                        swal("Error", `${error}`, "error");
                    }
                } else if (evt.to.id === "1") {
                    try {
                        this.$Spin.show();

                        updateTaskApi({
                            taskId: this.movingObject.id,
                            userId: Cookies.getJSON("user").id,
                            status: parseInt(evt.to.id),
                            ownerId: null
                        })
                            .then(result => {
                                this.$Spin.hide();

                                if (result.result === 1) {
                                    let targetItem = this.dataSource.find(
                                        v => v.id === this.movingObject.id
                                    );

                                    if (targetItem) {
                                        targetItem.owner = null;
                                        targetItem.status = parseInt(evt.to.id);

                                        this.splitTask();
                                    }
                                }
                            })
                            .catch(error => {
                                this.$Spin.hide();

                                swal("Error", `${error}`, "error");
                            });
                    } catch (error) {
                        this.$Spin.hide();

                        swal("Error", `${error}`, "error");
                    }
                } else if (evt.to.id === "4") {
                    this.formResolve.timeSpend =
                        this.movingObject.timeSpend || 0;
                    this.resolveModal = true;
                } else {
                    try {
                        this.$Spin.show();

                        updateTaskApi({
                            taskId: this.movingObject.id,
                            userId: Cookies.getJSON("user").id,
                            status: parseInt(evt.to.id)
                        })
                            .then(result => {
                                this.$Spin.hide();

                                if (result.result === 1) {
                                    let targetItem = this.dataSource.find(
                                        v => v.id === this.movingObject.id
                                    );

                                    if (targetItem) {
                                        targetItem.status = parseInt(evt.to.id);

                                        this.splitTask();
                                    }
                                }
                            })
                            .catch(error => {
                                this.$Spin.hide();

                                swal("Error", `${error}`, "error");
                            });
                    } catch (error) {
                        this.$Spin.hide();

                        swal("Error", `${error}`, "error");
                    }
                }
            }
        },
        splitTask() {
            this.taskList = [];
            this.todoList = [];
            this.doingList = [];
            this.doneList = [];

            this.dataSource.forEach(v => {
                if (v.owner) {
                    let targetUser = this.users.find(u => u.id === v.owner);

                    if (targetUser) {
                        _.merge(v, {
                            color: targetUser.color,
                            ownerName: targetUser.userName.slice(0, 3)
                        });
                    }
                }

                switch (v.status) {
                    case 1:
                        this.taskList.push(v);
                        break;
                    case 2:
                        this.todoList.push(v);
                        break;
                    case 3:
                        this.doingList.push(v);
                        break;
                    case 4:
                        this.doneList.push(v);
                        break;
                    default:
                        break;
                }
            });
        },
        beforeMove(evt) {
            this.movingObject = evt.draggedContext.element;

            if (
                evt.draggedContext.element.owner &&
                evt.draggedContext.element.owner !== Cookies.getJSON("user").id
            ) {
                return false;
            }

            return true;
        },
        createTask() {
            try {
                this.$refs.newTaskForm.validate().then(valid => {
                    if (valid) {
                        this.$Spin.show();

                        return createTaskApi({
                            userId: Cookies.getJSON("user").id,
                            taskTag: this.formTop.taskTag,
                            taskName: this.formTop.taskName,
                            taskDescription: this.formTop.taskDescription
                        })
                            .then(result => {
                                this.$Spin.hide();

                                this.formTop.taskName = "";
                                this.formTop.taskDescription = "";
                                this.taskModal = false;

                                this.dataSource.push(result);

                                this.splitTask();
                            })
                            .catch(error => {
                                this.$Spin.hide();

                                swal("Error", `${error}`, "error");
                            });
                    }
                });
            } catch (error) {
                this.$Spin.hide();

                swal("Error", `${error}`, "error");
            }
        },
        deleteTask(id) {
            try {
                this.$Spin.show();

                updateTaskApi({
                    taskId: id,
                    userId: Cookies.getJSON("user").id,
                    status: 0
                })
                    .then(result => {
                        this.$Spin.hide();

                        if (result.result === 1) {
                            this.dataSource = this.dataSource.filter(
                                v => v.id !== id
                            );

                            this.splitTask();
                        }
                    })
                    .catch(error => {
                        this.$Spin.hide();

                        swal("Error", `${error}`, "error");
                    });
            } catch (error) {
                this.$Spin.hide();

                swal("Error", `${error}`, "error");
            }
        },
        cancel() {}
    }
};
</script>


<style lang="less">
@import "./index.less";
</style>

