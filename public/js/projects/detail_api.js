"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
function changeTaskCloseStateApi(taskId, stateClosed) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            fetch(`/api/tasks/change_close_state`, {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    taskId: taskId,
                    stateClosed: stateClosed
                })
            })
                .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
                .then(data => {
                resolve(data.data);
            })
                .catch(error => {
                console.error('Error fetching tasks:', error);
                reject(error);
            });
        });
    });
}
function getAllTasksWithParentProjectIdApi(taskId) {
    return new Promise((resolve, reject) => {
        fetch(`/api/get_all_results_with_parent_task_id?parent_task_id=${taskId}`)
            .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
            .then(data => {
            resolve(data.tasks); // Resolve with the tasks data
        })
            .catch(error => {
            console.error('Error fetching tasks:', error);
            reject(error); // Reject with the error
        });
    });
}
