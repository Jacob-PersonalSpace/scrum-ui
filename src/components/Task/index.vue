<template>
    <div class="task">
        <Spin size="large" fix v-if="loading.taskLoadingCount > 0"></Spin>
        <Button icon="plus-round" type="success" @click="modalState.newTask = true" style="margin-right: 20px;">Create Task</Button>
        <Button type="text" v-for="user in selectedUsers" :style="{ border: user.selected ? '2px solid ' + user.color : null, marginLeft: '10px' }" @click="onClickUserButton({userId: user.userId})">{{user.userName}}</Button>
        <br>
        <br>
        <Row type="flex" justify="space-around" class="code-row-bg" style="height: 100%;">
            <Col span="5">
                <span style="font-size: 15px;">Task Pool</span>
                <draggable v-model="taskList" :options="{group: 'task'}" class="item-group" :move="beforeMove" @end="afterMove" id="1">
                    <div v-for="element in taskList" :key="element.id" class="item">
                        <span class="taskId" @click="onOpenTaskDetailModal({ taskId: element.id, taskDescription: element.taskDescription })">{{element.taskTag}}</span>
                        <span class="taskName">{{element.taskName}}</span>
                        <Icon type="close" @click="deleteTask(element.id)"></Icon>
                    </div>
                </draggable>
            </Col>
            <Col span="5">
                <span style="font-size: 15px;">To Do</span>
                <draggable v-model="todoList" :options="{group: 'task'}" class="item-group" :move="beforeMove" @end="afterMove" id="2">
                    <div v-for="element in todoList" :key="element.id" class="item">
                        <span class="colorFlag" :style="{ backgroundColor: element.user.color }"></span>
                        <span class="taskId" @click="onOpenTaskDetailModal({ taskId: element.id, taskDescription: element.taskDescription })">{{element.taskTag}}</span>
                        <span class="taskName">{{element.taskName}}</span>
                        <span class="owner">{{element.user.userName}}</span>
                    </div>
                </draggable>
            </Col>
            <Col span="5">
                <span style="font-size: 15px;">Doing</span>
                <draggable v-model="doingList" :options="{group: 'task'}" class="item-group" :move="beforeMove" @end="afterMove" id="3">
                    <div v-for="element in doingList" :key="element.id" class="item">
                        <span class="colorFlag" :style="{ backgroundColor: element.user.color }"></span>
                        <span class="taskId" @click="onOpenTaskDetailModal({ taskId: element.id, taskDescription: element.taskDescription })">{{element.taskTag}}</span>
                        <span class="taskName">{{element.taskName}}</span>
                        <span class="owner">{{element.user.userName}}</span>
                    </div>
                </draggable>
            </Col>
            <Col span="5">
                <span style="font-size: 15px;">Done</span>
                <draggable v-model="doneList" :options="{group: 'task'}" class="item-group" :move="beforeMove" @end="afterMove" id="4">
                    <div v-for="element in doneList" :key="element.id" class="item" style="backgroundColor: #d8d8d8;">
                        <span class="colorFlag" :style="{ backgroundColor: element.user.color }"></span>
                        <span class="taskId" @click="onOpenTaskDetailModal({ taskId: element.id, taskDescription: element.taskDescription })">{{element.taskTag}}</span>
                        <span class="taskName">{{element.taskName}}</span>
                        <span style="position: absolute; right: 10px;">TS:{{element.timeSpend}}h</span>
                        <span class="owner">{{element.user.userName}}</span>
                    </div>
                </draggable>
            </Col>
        </Row>
        <Modal
            v-model="modalState.newTask"
            title="New Task"
        >
            <Form ref="newTaskForm" :model="modalData.newTask" label-position="top" :rules="modalRule.newTask">
                <FormItem prop="taskTag" label="Task Tag">
                    <Input v-model="modalData.newTask.taskTag"></Input>
                </FormItem>
                <FormItem prop="taskName" label="Task Name">
                    <Input v-model="modalData.newTask.taskName"></Input>
                </FormItem>
                <FormItem label="Task Description">
                    <Input v-model="modalData.newTask.taskDescription" type="textarea" :autosize="{minRows: 2,maxRows: 10}"></Input>
                </FormItem>
            </Form>
            <div slot="footer">
                <Button type="success" :loading="loading.creatingTask" @click="createTask">
                    <span v-if="!loading.creatingTask">Create</span>
                    <span v-else>Creating...</span>
                </Button>
            </div>
        </Modal>

        <Modal
            v-model="modalState.resolveTask"
            width="20"
            @on-cancel="cancelResolve"
        >
            <Form ref="resolveForm" :model="modalData.resolveTask" label-position="top" :rules="modalRule.resolveTask">
                <FormItem prop="timeSpend" label="Time Spend">
                    <InputNumber v-model="modalData.resolveTask.timeSpend" :min="0.001" :step="0.001" style="width: 100px;"></InputNumber>h
                </FormItem>
            </Form>
            <div slot="footer">
                <Button @click="resolveTask" type="success">Resolve</Button>
            </div>
        </Modal>

        <Modal
            v-model="modalState.taskDetail"
            width="50"
            title="Task Description"
        >
            <Form :model="modalData.taskDetail" label-position="top">
                <FormItem label="Description">
                    <span>{{modalData.taskDetail.taskDescription}}</span>
                </FormItem>
                <FormItem label="Comment">
                    <ul style="height: 300px; overflow-y: auto;">
                        <li v-for="comment in modalData.taskDetail.commentList" v-bind:key="comment.id">
                            <span>[{{comment.createdAt}}]</span>
                            <span>[{{comment.user.userName}}]</span>
                            <br>
                            <span>{{comment.comment}}</span>
                        </li>
                        <Spin size="large" fix v-if="loading.gettingCommentList"></Spin>
                    </ul>
                </FormItem>
            </Form>
            <div slot="footer">
                <Form :model="modalData.taskDetail" label-position="top">
                    <FormItem>
                        <Input v-model="modalData.taskDetail.comment" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="Comment..."></Input>
                    </FormItem>
                    <FormItem>
                        <Button type="success" :loading="loading.addingComment" @click="onAddComment">
                            <span v-if="!loading.addingComment">Add Comment</span>
                            <span v-else>Adding...</span>
                        </Button>
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
    created() {
        this.getTaskList();

        this.selectedUserIds.push(Cookies.getJSON("user").id);
    },
    data() {
        return {
            modalRule: {
                newTask: {
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
                resolveTask: {
                    timeSpend: [
                        {
                            validator: (rule, value, callback) => {
                                if (value === null || value === 0) {
                                    callback(
                                        new Error("Time spend cannot be empty")
                                    );
                                }

                                callback();
                            },
                            trigger: "blur"
                        }
                    ]
                }
            },
            modalData: {
                taskDetail: {
                    taskId: 0,
                    comment: "",
                    taskDescription: "",
                    commentList: []
                },
                newTask: {
                    taskTag: "",
                    taskName: "",
                    taskDescription: ""
                },
                resolveTask: {
                    timeSpend: 0
                }
            },
            modalState: {
                taskDetail: false,
                newTask: false,
                resolveTask: false
            },
            loading: {
                creatingTask: false,
                taskLoadingCount: 0,
                gettingCommentList: false,
                addingComment: false
            },
            dataSource: [],
            selectedUserIds: [],
            movingObject: {}
        };
    },
    computed: {
        taskList: function() {
            return this.dataSource.filter(v => v.status === 1);
        },
        todoList: function() {
            return this.dataSource.filter(
                v =>
                    v.status === 2 &&
                    this.selectedUserIds.find(userId => userId === v.owner)
            );
        },
        doingList: function() {
            return this.dataSource.filter(
                v =>
                    v.status === 3 &&
                    this.selectedUserIds.find(userId => userId === v.owner)
            );
        },
        doneList: function() {
            return this.dataSource.filter(
                v =>
                    v.status === 4 &&
                    this.selectedUserIds.find(userId => userId === v.owner)
            );
        },
        selectedUsers: function() {
            return this.users.map(user => ({
                userId: user.id,
                userName: user.userName,
                color: user.color,
                selected: this.selectedUserIds.find(
                    userId => userId === user.id
                )
                    ? true
                    : false
            }));
        }
    },
    methods: {
        onClickUserButton({ userId }) {
            const index = this.selectedUserIds.findIndex(u => u === userId);

            if (index > -1) {
                this.selectedUserIds.splice(index, 1);

                if (this.selectedUserIds.length === 0) {
                    this.selectedUserIds = this.users.map(user => user.id);
                }
            } else {
                this.selectedUserIds.push(userId);
            }
        },
        initNewTaskModalData() {
            this.modalData.newTask.taskTag = "";
            this.modalData.newTask.taskName = "";
            this.modalData.newTask.taskDescription = "";
        },
        initResolveTaskModalData() {
            this.modalData.resolveTask.timeSpend = 0;
        },
        initTaskDetailModalData() {
            this.modalData.taskDetail.taskId = 0;
            this.modalData.taskDetail.comment = "";
            this.modalData.taskDetail.taskDescription = "";
            this.modalData.taskDetail.commentList = [];
        },
        initTaskList() {
            this.dataSource = [];
        },
        async getTaskList() {
            try {
                this.addTaskLoadingCount();

                this.initTaskList();

                this.dataSource = await getTaskListApi();

                this.removeTaskLoadingCount();
            } catch (error) {
                this.removeTaskLoadingCount();

                swal({
                    type: "error",
                    title: "Error",
                    text: `Get tasks failed: ${error}`
                });
            }
        },
        async onOpenTaskDetailModal({ taskId, taskDescription }) {
            try {
                this.initTaskDetailModalData();

                this.modalState.taskDetail = true;
                this.loading.gettingCommentList = true;

                const commentList = await getCommentListApi({ taskId });

                this.loading.gettingCommentList = false;
                this.modalData.taskDetail.taskId = taskId;
                this.modalData.taskDetail.taskDescription = taskDescription;
                this.modalData.taskDetail.commentList = commentList;
            } catch (error) {
                this.loading.gettingCommentList = false;

                swal({
                    type: "error",
                    title: "Error",
                    text: `Get comment failed: ${error}`
                });
            }
        },
        async onAddComment() {
            try {
                if (this.modalData.taskDetail.comment) {
                    this.loading.addingComment = true;

                    await addCommentApi({
                        userId: Cookies.getJSON("user").id,
                        taskId: this.modalData.taskDetail.taskId,
                        comment: this.modalData.taskDetail.comment
                    });

                    this.loading.addingComment = false;
                    this.modalData.taskDetail.comment = "";
                    this.loading.gettingCommentList = true;

                    this.modalData.taskDetail.commentList = await getCommentListApi(
                        { taskId: this.modalData.taskDetail.taskId }
                    );

                    this.loading.gettingCommentList = false;
                }
            } catch (error) {
                this.loading.addingComment = false;
                this.loading.gettingCommentList = false;

                swal({
                    type: "error",
                    title: "Error",
                    text: `Add comment failed: ${error.message || error}`
                });
            }
        },
        async updateTask(paramters) {
            try {
                this.addTaskLoadingCount();

                await updateTaskApi(paramters);
                await this.getTaskList();

                this.removeTaskLoadingCount();
            } catch (error) {
                this.removeTaskLoadingCount();

                swal({
                    type: "error",
                    title: "Error",
                    text: `Update task failed: ${error}`
                });
            }
        },
        resolveTask() {
            this.$refs.resolveForm.validate().then(valid => {
                if (valid) {
                    this.modalState.resolveTask = false;

                    this.updateTask({
                        taskId: this.movingObject.id,
                        userId: Cookies.getJSON("user").id,
                        status: 4,
                        ownerId: Cookies.getJSON("user").id,
                        timeSpend: this.modalData.resolveTask.timeSpend
                    });
                }
            });
        },
        cancelResolve() {
            this.getTaskList();
        },
        afterMove(evt) {
            if (evt.from.id !== evt.to.id) {
                if (evt.from.id === "1" && evt.to.id !== "4") {
                    this.updateTask({
                        taskId: this.movingObject.id,
                        userId: Cookies.getJSON("user").id,
                        status: parseInt(evt.to.id),
                        ownerId: Cookies.getJSON("user").id
                    });
                } else if (evt.to.id === "1") {
                    this.updateTask({
                        taskId: this.movingObject.id,
                        userId: Cookies.getJSON("user").id,
                        status: parseInt(evt.to.id),
                        ownerId: null
                    });
                } else if (evt.to.id === "4") {
                    this.modalData.resolveTask.timeSpend =
                        this.movingObject.timeSpend || 0;
                    this.modalState.resolveTask = true;
                } else {
                    this.updateTask({
                        taskId: this.movingObject.id,
                        userId: Cookies.getJSON("user").id,
                        status: parseInt(evt.to.id)
                    });
                }
            }
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
            this.$refs.newTaskForm.validate().then(async valid => {
                if (valid) {
                    try {
                        this.loading.creatingTask = true;

                        await createTaskApi({
                            userId: Cookies.getJSON("user").id,
                            taskTag: this.modalData.newTask.taskTag,
                            taskName: this.modalData.newTask.taskName,
                            taskDescription: this.modalData.newTask
                                .taskDescription
                        });

                        this.loading.creatingTask = false;

                        this.modalState.newTask = false;

                        this.addTaskLoadingCount();

                        await this.getTaskList();

                        this.removeTaskLoadingCount();
                    } catch (error) {
                        this.removeTaskLoadingCount();

                        swal({
                            type: "error",
                            title: "Error",
                            text: `Update task failed: ${error}`
                        });
                    }
                }
            });
        },
        addTaskLoadingCount() {
            this.loading.taskLoadingCount = this.loading.taskLoadingCount + 1;
        },
        removeTaskLoadingCount() {
            this.loading.taskLoadingCount =
                this.loading.taskLoadingCount < 1
                    ? 0
                    : this.loading.taskLoadingCount - 1;
        },
        deleteTask(id) {
            this.updateTask({
                taskId: id,
                userId: Cookies.getJSON("user").id,
                status: 0
            });
        }
    }
};
</script>

<style lang="less">
@import "./index.less";
</style>
